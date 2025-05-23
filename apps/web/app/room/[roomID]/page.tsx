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
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { httpAxios } from "@/lib/axios-config"
import { toast } from "sonner"
import useUserStore from "@/store/store"
import SafetyPage from "@/app/safety/page"


export default function RoomLayout({ params }: { params: Promise<{ roomID: string }> }) {
  const router = useRouter()
  let { roomID } = React.use(params)
  const roomId = parseInt(roomID)
  console.log("inside room/",roomID);
  const {isAuthenticated} = useUserStore((state) => state)
  const [connectedUsers, setConnectedUsers] = useState<Array<{
      clientId: number,
      name: string,
      color: string,
      id: string
    }>>([])
  const handleLeave = async()=>{
    console.log("called handle leave");
    
    const token = getCookie("token")
    try {
      const response = await httpAxios.post('/api/leaveroom',{roomId})
      toast("Room left!!!")
      router.push('/home')
    } catch (error:any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        alert(errorMessage);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  return (
    isAuthenticated ? <div className="h-screen w-screen p-4 bg-background text-foreground">
      <div className="h-full w-full border-none rounded-2xl flex p-3 gap-3">
        <Card className="flex-1 flex flex-col rounded-2xl h-full pt-0">
          <CardContent className="flex-1 bg-muted rounded-t-2xl">
            <CodeEditor roomId={roomId} setConnectedUsers={setConnectedUsers} />
          </CardContent>
          <div className="border-t p-3 text-center text-sm font-medium text-muted-foreground">
            <div className="mb-4 p-2 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Connected Users ({connectedUsers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {connectedUsers.map((user) => (
                  <div
                    key={user.clientId}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: user.color + '20', borderColor: user.color }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-white">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="w-1/3 flex flex-col gap-3">
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

          <div className="flex flex-col gap-2">
            <Button variant="destructive" className=" hover:cursor-pointer w-full rounded-2xl" onClick={handleLeave}>
              Leave
            </Button>
          </div>
        </div>
      </div>
    </div>:<SafetyPage/>
  )
}
