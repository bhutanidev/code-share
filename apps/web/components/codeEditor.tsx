'use client'

import React, { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { yCollab, YSyncConfig } from 'y-codemirror.next';
import * as Y from 'yjs'
import { EditorState } from '@codemirror/state';
import { getCookie } from '@/lib/extract-cookie';

const customStyles = EditorView.theme({
    ".cm-line": {
      padding: "0 0.5rem",
    },
    ".cm-line.cm-activeLine": {
      backgroundColor: "transparent !important", // 🔥 disables line highlight
    },
    ".cm-selectionMatch": {
      backgroundColor: "transparent",
    },
    ".cm-selectionBackground": {
      backgroundColor: "#4B5563", // Tailwind's gray-600 for selected text
    }
});
const lineNumberStyles = EditorView.theme({
    ".cm-gutters": {
      backgroundColor: "transparent",
      borderRight: "1px solid #374151", // Tailwind gray-700
      color: "#9CA3AF", // Tailwind gray-400
    },
    ".cm-lineNumbers .cm-gutterElement": {
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      fontSize: "0.75rem", // text-xs
      fontFamily: "monospace",
    }
});

  

export default function CodeEditor() {
  const token = getCookie("token")

  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const wsRef = useRef<WebSocket|null>(null)
  //EditorView is a class we need to initalise it. it not a jsx element'
  //editorRef is where the code editor will be kept
  //viewRef is ref to the new object
  //useEffect initialises an editorview object
  //now this editorref displays view
  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const ydoc=new Y.Doc()
      const ytext = ydoc.getText('codemirror')
      const binding  = yCollab(ytext,null);
      const state = EditorState.create({
        doc:ytext.toString(),
        extensions: [
            basicSetup,
            javascript(),
            customStyles,
            lineNumberStyles,
            EditorView.lineWrapping,
            binding
          ]
      })
      const view = new EditorView({
        state,
        parent: editorRef.current,
      })

      viewRef.current = view
    }

    return () => {
      viewRef.current?.destroy()
    }
  }, [])

  return (
    <div className=" max-h-full h-full w-full">
        <div
        ref={editorRef}
        className="rounded-2xl max-h-full bg-muted  text-white p-4 border  overflow-auto"
        ></div>
    </div>
  )
}
