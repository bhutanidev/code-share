"use client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@workspace/ui/components/card"
  import { Button } from "@workspace/ui/components/button"
import CodeEditor from "@/components/codeEditor"
import { getCookie } from "@/lib/extract-cookie"
import React, { useEffect, useRef } from "react"
import messageData from "@/lib/message"
import { useRouter } from "next/navigation"
  
  export default function RoomLayout({params}:{
    params:Promise<{ roomID: string }>

  }) {

    const wsRef = useRef<WebSocket|null>(null)
    const router = useRouter()
    let {roomID} = React.use(params)
    const roomId = parseInt(roomID)
    const handleLeave=(wsRef:React.RefObject<WebSocket | null>)=>{
        if(!wsRef.current){
            return
        }
        wsRef.current?.close()
        wsRef.current=null
        router.push('/home')
        return
    }
    useEffect(()=>{
        if(isNaN(roomId)){
            console.log("invalid room id");
            return
        }
        const token = getCookie("token")
        console.log(token)
        const ws = new WebSocket(`ws://localhost:3002?token=${token}`)
        wsRef.current = ws
        const createRoomMessage : messageData ={
            type:"create-room",
            roomId:roomId
        }
        const joinRoomMessage = {...createRoomMessage,type:"join-room"}
        ws.onopen=()=>{
            const data = ws.send(JSON.stringify(createRoomMessage))
        }
        ws.onmessage=(event)=>{
            try {
                const data = JSON.parse(event.data)
                if(!data?.success){
                    ws.send(JSON.stringify(joinRoomMessage))
                }
            } catch (error) {
            }
        }
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'leave-room', roomId }))
            }
            ws.close()
        }
    },[])
    return (
      <div className="h-screen w-screen p-4 bg-background text-foreground">
        <div className="h-full w-full border-none rounded-2xl flex p-3 gap-3">
          {/* Left Side - Inside Room */}
          <Card className="flex-1 flex flex-col rounded-2xl h-full pt-0">
            <CardContent className="flex-1 bg-muted rounded-t-2xl">
                <CodeEditor/>
            </CardContent>
            <div className="border-t p-3 text-center text-sm font-medium text-muted-foreground">
              inside room
            </div>
          </Card>
  
          {/* Right Side - Bot/Output + Actions */}
          <div className="w-1/3 flex flex-col gap-3">
            {/* Output or Bot */}
            <Card className="flex-1 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">
                  output or bot
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add content/output here */}
              </CardContent>
            </Card>
  
            {/* Bottom Buttons / Inputs */}
            <div className="flex flex-col gap-2">
              <Button variant="destructive" className="w-full rounded-2xl" onClick={()=>{handleLeave(wsRef)}}>
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  