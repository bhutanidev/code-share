// import dotenv from 'dotenv'
// dotenv.config()
// import WebSocket, { WebSocketServer } from 'ws';
// import jwt from "jsonwebtoken";
// import * as Y from 'yjs';
// const JWT_SECRET = process.env.JWT_SECRET as string

// type messageData = {
//   type: string,
//   roomId?: number,
//   changeCode?: string,
//   cursorPosition?: { line: number, column: number }
// };

// type roomInfo = {
//   doc: Y.Doc,
//   sockets: Set<WebSocket>
// };

// const rooms: Map<number, roomInfo> = new Map();

// const wss = new WebSocketServer({ port: 3002 });

// function checkUser(token: string): string | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     if (typeof decoded === "string" || !decoded || !decoded.id) {
//       return null;
//     }
//     return decoded.id;
//   } catch (err) {
//     return null;
//   }
// }

// wss.on('connection', function connection(ws: WebSocket, request) {
//   const url = request.url;
//   if (!url) return;

//   const queryParams = new URLSearchParams(url.split('?')[1]);
//   const token = queryParams.get('token');

//   if (!token) {
//     ws.close();
//     return;
//   }

//   const userId = checkUser(token);
//   if (!userId) {
//     ws.send(JSON.stringify({
//       success: false,
//       type: "connection",
//       message: "Not authenticated"
//     }))
//     ws.close();
//     return;
//   }

//   ws.send(JSON.stringify({
//     success: true,
//     type: "connection",
//     message: "Connected to WebSocket server"
//   }));

//   ws.on('message', (message: string) => {
//     const data: messageData = JSON.parse(message);
//     const { type, changeCode, roomId } = data;

//     if (!roomId && type !== "create-room") {
//       ws.send(JSON.stringify({ success: false, type, message: "Missing roomId" }));
//       return;
//     }

//     if (type === "create-room") {
//       if (!roomId) {
//         ws.send(JSON.stringify({ success: false, type, message: "No roomId provided" }));
//         return;
//       }
//       if (rooms.has(roomId)) {
//         ws.send(JSON.stringify({ success: false, type, message: "Room already exists" }));
//         return;
//       }

//       const doc = new Y.Doc();
//       const sockets = new Set<WebSocket>();
//       sockets.add(ws);
//       rooms.set(roomId, { doc, sockets });

//       ws.send(JSON.stringify({ success: true, type, message: `Room ${roomId} created` }));

//     } else if (type === "join-room") {
//       const roominfo = rooms.get(roomId!);
//       if (!roominfo) {
//         ws.send(JSON.stringify({ success: false, type, message: "Room does not exist" }));
//         return;
//       }

//       roominfo.sockets.add(ws);

//       const state = Y.encodeStateAsUpdate(roominfo.doc);

//       ws.send(JSON.stringify({
//         success: true,
//         type: "initial-sync",
//         message: "Synced room state",
//         update: Array.from(state)
//       }));
//       console.log("sending");

//     } else if (type === "leave-room") {
//       const roominfo = rooms.get(roomId!);
//       if (!roominfo) return;

//       roominfo.sockets.delete(ws);

//       if (roominfo.sockets.size === 0) {
//         rooms.delete(roomId!);
//       }

//       ws.send(JSON.stringify({ success: true, type, message: `Left room ${roomId}` }));

//     } else if (type === "send-code") {
//       if (!changeCode) {
//         ws.send(JSON.stringify({ success: false, type, message: "No code changes provided" }));
//         return;
//       }

//       const roominfo = rooms.get(roomId!);
//       if (!roominfo) {
//         ws.send(JSON.stringify({ success: false, type, message: "Room not found" }));
//         return;
//       }

//       try {
//         const update = Uint8Array.from(JSON.parse(changeCode));
//         Y.applyUpdate(roominfo.doc, update);

//         roominfo.sockets.forEach((client) => {
//           if (client !== ws && client.readyState === WebSocket.OPEN) {
//             console.log(1);
//             console.log(client);
//             client.send(JSON.stringify({
//               success: true,
//               type: "code-update",
//               message: "Code updated",
//               update: Array.from(update)
//             }));
//           }
//         });

//         ws.send(JSON.stringify({ success: true, type, message: "Code applied successfully" }));
//       } catch (error) {
//         console.error(error);
//         ws.send(JSON.stringify({ success: false, type, message: "Invalid update format" }));
//       }

//     } else {
//       ws.send(JSON.stringify({ success: false, type, message: "Unknown message type" }));
//     }
//   });

//   ws.on('close', () => {
//     for (const [roomId, roominfo] of rooms.entries()) {
//       if (roominfo.sockets.has(ws)) {
//         roominfo.sockets.delete(ws);
//         if (roominfo.sockets.size === 0) {
//           rooms.delete(roomId);
//         }
//         break;
//       }
//     }
//     console.log("WebSocket disconnected");
//   });
// });

import dotenv from 'dotenv'
dotenv.config()
import WebSocket, { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import * as Y from 'yjs';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';

const JWT_SECRET = process.env.JWT_SECRET as string

type messageData = {
  type: string,
  roomId?: number,
  changeCode?: string,
  update?: number[],
  cursorPosition?: { line: number, column: number }
};

type roomInfo = {
  doc: Y.Doc,
  awareness: Awareness,
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

function broadcastToRoom(roomId: number, message: any, excludeSocket?: WebSocket) {
  const roominfo = rooms.get(roomId);
  if (!roominfo) return;

  roominfo.sockets.forEach((client) => {
    if (client !== excludeSocket && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
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
    const { type, changeCode, roomId, update } = data;

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
      const awareness = new Awareness(doc);
      const sockets = new Set<WebSocket>();
      sockets.add(ws);
      rooms.set(roomId, { doc, awareness, sockets });

      ws.send(JSON.stringify({ success: true, type, message: `Room ${roomId} created` }));

    } else if (type === "join-room") {
      const roominfo = rooms.get(roomId!);
      if (!roominfo) {
        ws.send(JSON.stringify({ success: false, type, message: "Room does not exist" }));
        return;
      }

      roominfo.sockets.add(ws);

      // Send initial document state
      const state = Y.encodeStateAsUpdate(roominfo.doc);
      ws.send(JSON.stringify({
        success: true,
        type: "initial-sync",
        message: "Synced room state",
        update: Array.from(state)
      }));

      // Send initial awareness state
      const awarenessStates = roominfo.awareness.getStates();
      if (awarenessStates.size > 0) {
        const awarenessUpdate = encodeAwarenessUpdate(roominfo.awareness, Array.from(awarenessStates.keys()));
        ws.send(JSON.stringify({
          success: true,
          type: "initial-awareness",
          message: "Initial awareness state",
          update: Array.from(awarenessUpdate)
        }));
      }

      console.log(`User joined room ${roomId}`);

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
        const updateArray = Uint8Array.from(JSON.parse(changeCode));
        Y.applyUpdate(roominfo.doc, updateArray);

        // Broadcast code update to all other clients in the room
        broadcastToRoom(roomId!, {
          success: true,
          type: "code-update",
          message: "Code updated",
          update: Array.from(updateArray)
        }, ws);

        ws.send(JSON.stringify({ success: true, type, message: "Code applied successfully" }));
      } catch (error) {
        console.error("Error applying code update:", error);
        ws.send(JSON.stringify({ success: false, type, message: "Invalid update format" }));
      }

    } else if (type === "awareness-update") {
      if (!update) {
        ws.send(JSON.stringify({ success: false, type, message: "No awareness update provided" }));
        return;
      }

      const roominfo = rooms.get(roomId!);
      if (!roominfo) {
        ws.send(JSON.stringify({ success: false, type, message: "Room not found" }));
        return;
      }

      try {
        const awarenessUpdate = Uint8Array.from(update);
        
        // Apply awareness update to room's awareness instance
        applyAwarenessUpdate(roominfo.awareness, awarenessUpdate, null);

        // Broadcast awareness update to all other clients in the room
        broadcastToRoom(roomId!, {
          success: true,
          type: "awareness-update",
          message: "Awareness updated",
          update: Array.from(awarenessUpdate)
        }, ws);

        console.log(`Awareness updated in room ${roomId}`);
      } catch (error) {
        console.error("Error applying awareness update:", error);
        ws.send(JSON.stringify({ success: false, type, message: "Invalid awareness update format" }));
      }

    } else {
      ws.send(JSON.stringify({ success: false, type, message: "Unknown message type" }));
    }
  });

  ws.on('close', () => {
    // Clean up user from all rooms and update awareness
    for (const [roomId, roominfo] of rooms.entries()) {
      if (roominfo.sockets.has(ws)) {
        roominfo.sockets.delete(ws);
        
        // Remove user from awareness when they disconnect
        // Note: The awareness library will automatically clean up disconnected users
        // after a timeout, but we can also manually clean up if needed
        
        if (roominfo.sockets.size === 0) {
          // Clean up empty rooms
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted - no users remaining`);
        } else {
          console.log(`User left room ${roomId}, ${roominfo.sockets.size} users remaining`);
        }
        break;
      }
    }
    console.log("WebSocket disconnected");
  });

  ws.on('error', (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log('WebSocket server running on port 3002');