'use client'

import React, { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { yCollab } from 'y-codemirror.next'
import * as Y from 'yjs'
import { EditorState } from '@codemirror/state'
import { getCookie } from '@/lib/extract-cookie'
import { useRouter } from 'next/navigation'

const customStyles = EditorView.theme({
  ".cm-line": {
    padding: "0 0.5rem",
  },
  ".cm-line.cm-activeLine": {
    backgroundColor: "transparent !important",
  },
  ".cm-selectionMatch": {
    backgroundColor: "transparent",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#4B5563",
  },
})

const lineNumberStyles = EditorView.theme({
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "1px solid #374151",
    color: "#9CA3AF",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    fontSize: "0.75rem",
    fontFamily: "monospace",
  },
})

export default function CodeEditor({ roomId }: { roomId: number }) {
  const token = getCookie("token")
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const ydoc = useRef(new Y.Doc()).current
  const wsRef = useRef<WebSocket|null>(null)
  const router = useRouter()
  useEffect(() => {
    if(!token){
      router.push('/safety')
    }
    const raf = requestAnimationFrame(() => {
      console.log("roomId:", roomId)
      const ws = new WebSocket(`ws://localhost:3002?token=${token}`)
      wsRef.current = ws
  
      console.log("WebSocket created:", ws)
  
      const ytext = ydoc.getText('codemirror')
      const binding = yCollab(ytext, null)
  
      // console.log(editorRef.current)
      // console.log(viewRef.current)
      // console.log(ws)
  
      if (!editorRef.current || viewRef.current || !ws) {
        console.log("could not find something")
        return
      }
  
      console.log("ws.readyState:", ws.readyState)
  
      ws.onopen = () => {
        const createRoomMessage = {
          type: "create-room",
          roomId: roomId
        }
        console.log("Sending create-room:", createRoomMessage)
        ws.send(JSON.stringify(createRoomMessage))
  
        ydoc.on("update", (update) => {
          console.log("i am updating")
          console.log(roomId)
          ws.send(JSON.stringify({
            type: "send-code",
            changeCode: JSON.stringify(Array.from(update)),
            roomId: roomId
          }))
        })
  
        ws.onclose = () => {
          console.log("closing")
        }
      }
  
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("Received message:", data)
          if(!data?.success && data?.type === "connection") {
            router.push('/safety');
            return;
          }
          if (!data?.success && data?.type === "create-room") {
            const joinRoomMessage = {
              type: "join-room",
              roomId: roomId
            }
            console.log("Sending join-room:", joinRoomMessage)
            ws.send(JSON.stringify(joinRoomMessage))
          }
  
          if (data.type === 'initial-sync' && data.update) {
            const update = Uint8Array.from(data.update)
            console.log("Applying initial sync")
            Y.applyUpdate(ydoc, update)
          } else if (data.type === 'code-update' && data.update) {
            const update = Uint8Array.from(data.update)
            console.log("Applying code update")
            Y.applyUpdate(ydoc, update)
          }
        } catch (error) {
          console.error("Error parsing message", error)
        }
      }
  
      const state = EditorState.create({
        doc: ytext.toString(),
        extensions: [
          basicSetup,
          javascript(),
          customStyles,
          lineNumberStyles,
          EditorView.lineWrapping,
          binding,
        ],
      })
  
      const view = new EditorView({
        state,
        parent: editorRef.current!,
      })
  
      viewRef.current = view
    })
  
    return () => {
      wsRef.current?.close()
      viewRef.current?.destroy()
      raf && cancelAnimationFrame(raf)
    
    }
  }, [roomId])
  

  return (
    <div className="max-h-full h-full w-full">
      <div
        ref={editorRef}
        className="rounded-2xl max-h-full bg-muted text-white p-4 border overflow-auto"
      />
    </div>
  )
}
