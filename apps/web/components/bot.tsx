"use client"

import React, { useRef, useState, useEffect } from "react"
import ReactMarkdown from 'react-markdown'
import useYDocStore from "@/store/ydocstore"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { httpAxios } from "@/lib/axios-config"
import { Bot as BotIcon, User, Send, Sparkles, Copy, Check } from "lucide-react"

type Message = {
  role: "user" | "bot"
  text: string
  timestamp: number
}

const Bot = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendPrompt = async () => {
    const prompt = inputRef.current?.value?.trim()
    if (!prompt || isLoading) return

    // Add user message to the top
    const userMessage: Message = {
      role: "user",
      text: prompt,
      timestamp: Date.now()
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Clear input
    if (inputRef.current) inputRef.current.value = ""
    setIsLoading(true)

    try {
      const code = useYDocStore.getState().getCurrentCode()
      const response = await httpAxios.post('/api/analyze-code', { code, prompt })
      
      const botMessage: Message = {
        role: "bot",
        text: response.data?.data || "No response received",
        timestamp: Date.now()
      }
      setMessages([...updatedMessages, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: "bot",
        text: "Sorry, I encountered an error while processing your request.",
        timestamp: Date.now()
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendPrompt()
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderMessage = (msg: Message, index: number) => {
    const isUser = msg.role === "user"
    
    return (
      <div className={`group flex ${isUser ? "justify-end" : "justify-start"} mb-4`} key={index}>
        <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start space-x-3 max-w-[85%]`}>
          {/* Avatar */}
          <Avatar className="w-8 h-8 mt-1">
            <AvatarFallback className={`${isUser ? 'bg-blue-500 text-white' : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'}`}>
              {isUser ? <User className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            {/* Message Bubble */}
            <div
              className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md break-words ${
                isUser
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
              }`}
            >
              {isUser ? (
                <div className="text-sm leading-relaxed overflow-wrap-anywhere">{msg.text}</div>
              ) : (
                <div className="text-sm overflow-wrap-anywhere">
                  <ReactMarkdown
                    components={{
                      code: ({ node, inline, ...props }: any) => (
                        <code 
                          className={
                            inline 
                              ? "bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded-md text-xs font-mono text-purple-600 dark:text-purple-400 break-all" 
                              : "block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg my-3 overflow-x-auto text-xs font-mono border border-gray-700 whitespace-pre-wrap"
                          }
                          {...props}
                        />
                      ),
                      h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                      em: ({ node, ...props }) => <em className="italic text-gray-600 dark:text-gray-400" {...props} />,
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-2" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Message Footer */}
            <div className={`flex items-center mt-1 space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(msg.timestamp)}
              </span>
              
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                  onClick={() => copyToClipboard(msg.text, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg bg-zinc-300 dark:bg-zinc-800">
      <CardHeader className="border-b bg-gray-200 dark:bg-zinc-800">
        <div className="flex items-center space-x-3 ">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Code Assistant
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ask me anything about your code
            </p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Online
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 h-5/6 p-0">
        <ScrollArea className="flex-1 px-4 h-[595px] overflow-y-auto" ref={scrollAreaRef}>
          <div className="py-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-4">
                  <BotIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to AI Code Assistant
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  I'm here to help you understand, debug, and improve your code. Ask me anything!
                </p>
              </div>
            )}
            
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                      <BotIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 border border-gray-300 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-4 pb-4 bg-zinc-800">
          <div className="flex space-x-3 pt-4">
            <Input
              ref={inputRef}
              placeholder="Ask about your code..."
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
            <Button 
              onClick={handleSendPrompt} 
              disabled={isLoading}
              className="px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Bot