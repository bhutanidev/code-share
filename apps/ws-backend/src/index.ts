import dotenv from 'dotenv'
dotenv.config()
import WebSocket, { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import * as Y from 'yjs';
const JWT_SECRET = process.env.JWT_SECRET as string

type messageData = {
  type: string,
  roomId?: number,
  changeCode?: string,
  cursorPosition?: { line: number, column: number }
};

type roomInfo = {
  doc: Y.Doc,
  sockets: Set<WebSocket>
};

const rooms: Map<number, roomInfo> = new Map();

const wss = new WebSocketServer({ port: 3002 });

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded || !decoded.id) {
      return null;
    }
    return decoded.id;
  } catch (err) {
    return null;
  }
}

wss.on('connection', function connection(ws: WebSocket, request) {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token');

  if (!token) {
    ws.close();
    return;
  }

  const userId = checkUser(token);
  if (!userId) {
    ws.send(JSON.stringify({
      success: false,
      type: "connection",
      message: "Not authenticated"
    }))
    ws.close();
    return;
  }

  ws.send(JSON.stringify({
    success: true,
    type: "connection",
    message: "Connected to WebSocket server"
  }));

  ws.on('message', (message: string) => {
    const data: messageData = JSON.parse(message);
    const { type, changeCode, roomId } = data;

    if (!roomId && type !== "create-room") {
      ws.send(JSON.stringify({ success: false, type, message: "Missing roomId" }));
      return;
    }

    if (type === "create-room") {
      if (!roomId) {
        ws.send(JSON.stringify({ success: false, type, message: "No roomId provided" }));
        return;
      }
      if (rooms.has(roomId)) {
        ws.send(JSON.stringify({ success: false, type, message: "Room already exists" }));
        return;
      }

      const doc = new Y.Doc();
      const sockets = new Set<WebSocket>();
      sockets.add(ws);
      rooms.set(roomId, { doc, sockets });

      ws.send(JSON.stringify({ success: true, type, message: `Room ${roomId} created` }));

    } else if (type === "join-room") {
      const roominfo = rooms.get(roomId!);
      if (!roominfo) {
        ws.send(JSON.stringify({ success: false, type, message: "Room does not exist" }));
        return;
      }

      roominfo.sockets.add(ws);

      const state = Y.encodeStateAsUpdate(roominfo.doc);

      ws.send(JSON.stringify({
        success: true,
        type: "initial-sync",
        message: "Synced room state",
        update: Array.from(state)
      }));
      console.log("sending");

    } else if (type === "leave-room") {
      const roominfo = rooms.get(roomId!);
      if (!roominfo) return;

      roominfo.sockets.delete(ws);

      if (roominfo.sockets.size === 0) {
        rooms.delete(roomId!);
      }

      ws.send(JSON.stringify({ success: true, type, message: `Left room ${roomId}` }));

    } else if (type === "send-code") {
      if (!changeCode) {
        ws.send(JSON.stringify({ success: false, type, message: "No code changes provided" }));
        return;
      }

      const roominfo = rooms.get(roomId!);
      if (!roominfo) {
        ws.send(JSON.stringify({ success: false, type, message: "Room not found" }));
        return;
      }

      try {
        const update = Uint8Array.from(JSON.parse(changeCode));
        Y.applyUpdate(roominfo.doc, update);

        roominfo.sockets.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log(1);
            console.log(client);
            client.send(JSON.stringify({
              success: true,
              type: "code-update",
              message: "Code updated",
              update: Array.from(update)
            }));
          }
        });

        ws.send(JSON.stringify({ success: true, type, message: "Code applied successfully" }));
      } catch (error) {
        console.error(error);
        ws.send(JSON.stringify({ success: false, type, message: "Invalid update format" }));
      }

    } else {
      ws.send(JSON.stringify({ success: false, type, message: "Unknown message type" }));
    }
  });

  ws.on('close', () => {
    for (const [roomId, roominfo] of rooms.entries()) {
      if (roominfo.sockets.has(ws)) {
        roominfo.sockets.delete(ws);
        if (roominfo.sockets.size === 0) {
          rooms.delete(roomId);
        }
        break;
      }
    }
    console.log("WebSocket disconnected");
  });
});
