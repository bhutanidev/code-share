import WebSocket,{ WebSocketServer } from 'ws';
import jwt, { decode, verify } from "jsonwebtoken"
import { JWT_SECRET } from '@workspace/backend-common/config';
import * as Y from 'yjs'
//websocket should be a state full backend ton store which user info ( belongs to which room )
//this architecturre store roomId mapped to the code
//whenever some one wants to join a roomn they send its id and that id is added to a thier websocket allowing only to join one room at a time\
// type : join-room , leave-room ,
type messageData = {
  type:string,//what we want to do
  roomId?:number,//roomid
  changeCode?:string,//changes in the code
  cursorPosition?:{line:number,column:number}
}

interface extendedWebSocket extends WebSocket{
  roomId?:number
}

type roomInfo = {
  doc:Y.Doc,
  sockets:Set<extendedWebSocket>
}

const rooms:Map<number,roomInfo> = new Map()

function BroadcastInRoom(
  wss:WebSocketServer,
  roomId:number,
  message:object,
  sender:extendedWebSocket
){
  const msgstr = JSON.stringify(message)
  wss.clients.forEach((client)=>{
    const ws = client as extendedWebSocket

    if(ws.OPEN && ws.roomId===roomId && ws!== sender){
      ws.send(msgstr)
    }
  })
}

const wss = new WebSocketServer({ port: 3002 });
function checkUser(token:string):string|null{
  const decoded = jwt.verify(token,JWT_SECRET)

  if(typeof decoded == "string"){
    return null
  }

  if(!decoded || !decoded.id){
    return null
  }

  return decoded.id
}
wss.on('connection', function connection(ws:extendedWebSocket,request) {
  ws.send(JSON.stringify({
    success: true,
    type: "connection",
    message: "Connected to WebSocket server"
  }))
  const url = request.url
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1])
  const token = queryParams.get('token')
    console.log(token);
    
    //decode the token 
    if(!token){
      ws.close()
      console.log("token not found")
      return
    }
    const userId = checkUser(token)
    
    if(!userId){
      ws.close()
      return
    }
    console.log("user Connected with id : " , userId)
    
  ws.on('message',(message:string)=>{
    const data:messageData = JSON.parse(message)
    let {type,changeCode,roomId,cursorPosition} = data
// migration done
    if(type == "create-room"){
      if(!roomId){
        ws.send(JSON.stringify({
          success: false,
          type,
          message: "No room id sent"
        }));

        return
      }
      if(!ws.roomId){
        const roominfo = rooms.get(roomId)
        if(roominfo){
          console.log("room already exists with this id")
          ws.send(JSON.stringify({
            success: false,
            type,
            message: "Room already exists"
          }));
          return;
        }
        const doc = new Y.Doc()
        const sockets = new Set<extendedWebSocket>()
        sockets.add(ws)

        rooms.set(roomId,{doc,sockets})
        ws.roomId=roomId
        console.log("creaed room with id: ",roomId);
        ws.send(JSON.stringify({
          success: true,
          type,
          message: `Room ${roomId} created`
        }));
      }else{
        console.log("already in a room with room id: ",roomId)
        ws.send(JSON.stringify({
          success: false,
          type,
          message: "Already in a room. Leave the current room first."
        }));
      }
    }
//migration done
    if(type=="join-room"){
      if (!roomId) {
        ws.send(JSON.stringify({
          success: false,
          type,
          message: "No room id sent"
        }));
        return;
      }
      if(!ws.roomId){
        if(rooms.has(roomId)){
          ws.roomId = roomId
          const roominfo = rooms.get(roomId)
          if(!roominfo){
            ws.send(JSON.stringify({
              success: false,
              type,
              message: "Room does not exist"
            }));
            return;
          }
          roominfo?.sockets.add(ws)
          rooms.set(roomId,{...roominfo})
          const state = Y.encodeStateAsUpdate(roominfo.doc)
          ws.send(JSON.stringify({
            success: true,
            type: "initial-sync",
            message: "Synced room state",
            update: Array.from(state)
          }));
        }else{
          ws.send(JSON.stringify({
            success: false,
            type,
            message: "Already in a room. Leave current room first."
          }));
        }
      }else{
        ws.send(JSON.stringify({
          success: false,
          type,
          message: "Already in a room. Leave current room first."
        }));
      }
      console.log(rooms)
      
    }
    //migration done
    if(type == "leave-room"){
      if(ws.roomId){
        const room = ws.roomId
        ws.roomId =undefined
        const roominfo = rooms.get(room);
        if(!roominfo)return
        roominfo?.sockets.delete(ws)
        if(roominfo.sockets.size>0)rooms.set(room,{...roominfo})
        else rooms.delete(room)
        console.log("left room with id: ", room);
        ws.send(JSON.stringify({
          success: true,
          type,
          message: `Left room ${room}`
        }));
      }
    }
    //to be updated
    if(type=="send-code"){
      ws.send("inside send-code")
      if(!changeCode){
        ws.send("no applied changes")
        return
      }
      if(ws.roomId){
        const roominfo = rooms.get(ws.roomId)
        if(!roominfo){
          console.log("Room does not exist")
          ws.send(JSON.stringify({
            success: false,
            type,
            message: "No code provided"
          }));
          return;
        }

        if (!ws.roomId) {
          ws.send(JSON.stringify({
            success: false,
            type,
            message: "Not connected to any room"
          }));
          return;
        }
        if (!roominfo) {
          ws.send(JSON.stringify({
            success: false,
            type,
            message: "Room not found"
          }));
          return;
        }
        try {
          const update = Uint8Array.from(JSON.parse(changeCode))
          Y.applyUpdate(roominfo.doc,update)
          roominfo.sockets.forEach((client)=>{
            if(client!==ws && client.readyState===WebSocket.OPEN){
              client.send(JSON.stringify({
                success: true,
                type: "code-update",
                message: "Code updated",
                update: Array.from(update)
              }));
            }
          })
          ws.send(JSON.stringify({
            success: true,
            type,
            message: "Code applied successfully"
          }));  
        } catch (error) {
          console.log(error)
          ws.send("invalid input ")
          return
        }
      }
    }
  });
  ws.on('close',()=>{
    if(ws.roomId){
      const room = ws.roomId
      ws.roomId =undefined
      const roominfo = rooms.get(room);
      if(!roominfo)return
      roominfo?.sockets.delete(ws)
      if(roominfo.sockets.size>0)rooms.set(room,{...roominfo})
      else rooms.delete(room)
    }
    console.log("disconnected from wss");
  })
});