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
import React from "react"
import { useRouter } from "next/navigation"

export default function RoomLayout({ params }: { params: Promise<{ roomID: string }> }) {
  const router = useRouter()
  let { roomID } = React.use(params)
  const roomId = parseInt(roomID)

  const handleLeave = () => {
    router.push('/home')
  }

  return (
    <div className="h-screen w-screen p-4 bg-background text-foreground">
      <div className="h-full w-full border-none rounded-2xl flex p-3 gap-3">
        <Card className="flex-1 flex flex-col rounded-2xl h-full pt-0">
          <CardContent className="flex-1 bg-muted rounded-t-2xl">
            <CodeEditor roomId={roomId} />
          </CardContent>
          <div className="border-t p-3 text-center text-sm font-medium text-muted-foreground">
            inside room
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
            <Button variant="destructive" className="w-full rounded-2xl" onClick={handleLeave}>
              Leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
