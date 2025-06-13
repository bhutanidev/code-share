'use client'

import React, { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { yCollab } from 'y-codemirror.next'
import * as Y from 'yjs'
import { EditorState } from '@codemirror/state'
import { getCookie } from '@/lib/extract-cookie'
import { useRouter } from 'next/navigation'
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness'
import useUserStore from '@/store/store'
import useYDocStore from '@/store/ydocstore'

const getUserColor = (userId: string) => {
  const colors = ['#ff6b6b', '#6bc2ff', '#81c784', '#ffd54f', '#ba68c8', '#f06292']
  let hash = 0
  for (let i = 0; i < userId.length; i++) hash += userId.charCodeAt(i)
  return colors[hash % colors.length]
}
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
  ".cm-content": {
    color: "#E5E7EB", 
  },
  ".cm-keyword": {
    color: "#C084FC", 
    fontWeight: "500",
  },
  ".cm-string": {
    color: "#34D399", 
  },
  ".cm-number": {
    color: "#FBBF24", 
  },
  ".cm-comment": {
    color: "#6B7280", 
    fontStyle: "italic",
  },
  ".cm-operator": {
    color: "#F472B6", 
  },
  ".cm-punctuation": {
    color: "#E5E7EB", // Light gray for punctuation
  },
  ".cm-bracket": {
    color: "#60A5FA", 
  },
  ".cm-variableName": {
    color: "#FDE047", 
  },
  ".cm-property": {
    color: "#A78BFA", 
  },
  ".cm-function": {
    color: "#38BDF8", 
  },
  ".cm-type": {
    color: "#FB7185", 
  },
  ".cm-definition": {
    color: "#FDE047", 
  },
  ".cm-atom": {
    color: "#FBBF24", 
  },
  ".cm-meta": {
    color: "#9CA3AF", 
  },
  ".cm-tag": {
    color: "#F472B6", 
  },
  ".cm-attribute": {
    color: "#34D399", 
  },
  ".cm-link": {
    color: "#60A5FA", 
    textDecoration: "underline",
  },
  // Awareness cursor styles
  ".cm-ySelectionInfo": {
    position: "absolute",
    top: "-1.05em",
    left: "-1px",
    fontSize: "0.75em",
    fontFamily: "sans-serif",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "normal",
    userSelect: "none",
    color: "white",
    paddingLeft: "2px",
    paddingRight: "2px",
    zIndex: 101,
    transition: "opacity .3s ease-in-out",
    backgroundColor: "var(--user-color)",
    borderRadius: "2px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },
  ".cm-ySelectionCaret": {
    position: "relative",
    borderLeft: "2px solid var(--user-color)",
    borderRight: "2px solid var(--user-color)",
    marginLeft: "-2px",
    marginRight: "-2px",
    pointerEvents: "none",
    animation: "cm-blink 1s infinite",
  },
  ".cm-ySelection": {
    backgroundColor: "var(--user-color-light)",
    borderRadius: "2px",
  },
  "@keyframes cm-blink": {
    "0%, 50%": { opacity: "1" },
    "51%, 100%": { opacity: "0" },
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
    color: "#6B7280", 
  },
  ".cm-activeLineGutter": {
    color: "#E5E7EB", 
  },
})

// Generate a random user name
const generateUserName = () => {
  const adjectives = ['Swift', 'Clever', 'Bright', 'Quick', 'Smart', 'Sharp', 'Bold', 'Cool', 'Fast', 'Keen']
  const nouns = ['Coder', 'Dev', 'Hacker', 'Builder', 'Maker', 'Creator', 'Writer', 'Thinker', 'Solver', 'Master']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj}-${noun}`
}

export default function CodeEditor({ roomId , setConnectedUsers }: { roomId: Number ,setConnectedUsers: React.Dispatch<React.SetStateAction<{
    clientId: number;
    name: string;
    color: string;
    id: string;
}[]>> }) {
  const token = getCookie("token")
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const ydoc = useRef(new Y.Doc()).current
  const wsRef = useRef<WebSocket | null>(null)
  const awarenessRef = useRef<Awareness | null>(null)
  const router = useRouter()
  const {name} = useUserStore()
  // const setCode = useYDocStore((state) => state.setCode)
  // State to track connected users

  // Function to get all connected users
  const getConnectedUsers = () => {
    if (!awarenessRef.current) return []
    
    const users: Array<{
      clientId: number,
      name: string,
      color: string,
      id: string
    }> = []
    
    awarenessRef.current.getStates().forEach((state, clientId) => {
      if (state.user) {
        users.push({
          clientId,
          name: state.user.name,
          color: state.user.color,
          id: state.user.id
        })
      }
    })
    
    return users
  }

  // Function to update connected users state
  const updateConnectedUsers = () => {
    const users = getConnectedUsers()
    setConnectedUsers(users)
    console.log('Connected users:', users.map(u => u.name))
  }

  useEffect(() => {
    if (!token) {
      router.push('/safety')
    }

    const raf = requestAnimationFrame(() => {
      console.log("roomId:", roomId)
      const ws = new WebSocket(`ws://localhost:3002?token=${token}`)
      wsRef.current = ws
      console.log("WebSocket created:", ws)

      const ytext = ydoc.getText('codemirror')
      useYDocStore.getState().setYText(ytext)

      const awareness = new Awareness(ydoc)
      awarenessRef.current = awareness

      // Generate a unique user ID and create user info
      const userId = Math.floor(Math.random() * 100000).toString()
      const userColor = getUserColor(userId)
      const userName = `${name}-${generateUserName()}`
      // ytext.observe(()=>setCode(ytext.toString()))

      // Set local user info for awareness
      awareness.setLocalStateField('user', {
        name: userName,
        color: userColor,
        id: userId,
      })

      // Listen for awareness changes to update connected users
      // @ts-ignore
      awareness.on('change', ({ added, updated, removed }) => {
        console.log('Awareness changed:', { added, updated, removed })
        updateConnectedUsers()
      })

      // Sync awareness state through WebSocket
      awareness.on('update', (changes: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          const awarenessUpdate = Array.from(encodeAwarenessUpdate(awareness, changes.added.concat(changes.updated).concat(changes.removed)))
          ws.send(JSON.stringify({
            type: "awareness-update",
            update: awarenessUpdate,
            roomId: roomId
          }))
        }
      })

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
          console.log("Document updating")
          console.log(roomId)
          ws.send(JSON.stringify({
            type: "send-code",
            changeCode: JSON.stringify(Array.from(update)),
            roomId: roomId
          }))
        })

        ws.onclose = () => {
          console.log("WebSocket closing")
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("Received message:", data)
          
          if (!data?.success && data?.type === "connection") {
            router.push('/safety')
            return
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
          } else if (data.type === 'awareness-update' && data.update) {
            // Handle incoming awareness updates
            const awarenessUpdate = Uint8Array.from(data.update)
            console.log("Applying awareness update")
            applyAwarenessUpdate(awareness, awarenessUpdate, null)
            // Update connected users after applying awareness update
            updateConnectedUsers()
          } else if (data.type === 'initial-awareness' && data.update) {
            // Handle initial awareness state
            const awarenessUpdate = Uint8Array.from(data.update)
            console.log("Applying initial awareness")
            applyAwarenessUpdate(awareness, awarenessUpdate, null)
            // Update connected users after applying initial awareness
            updateConnectedUsers()
          }
        } catch (error) {
          console.error("Error parsing message", error)
        }
      }

      // Create the collaboration binding with awareness
      const binding = yCollab(ytext, awareness)

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
      
      // Initial update of connected users
      setTimeout(() => updateConnectedUsers(), 100)
    })

    return () => {
      // Clean up awareness when component unmounts
      if (awarenessRef.current) {
        awarenessRef.current.destroy()
      }
      wsRef.current?.close()
      viewRef.current?.destroy()
      raf && cancelAnimationFrame(raf)
    }
  }, [roomId, token, router])

  return (
    <div className="max-h-[650px] h-full w-full">
      <div
        ref={editorRef}
        className="rounded-2xl max-h-full bg-muted text-white p-4 border overflow-auto"
      />
    </div>
  )
}