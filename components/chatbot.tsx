"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { sendChatMessage } from "@/app/actions/chat-action"
import { analytics } from "@/lib/analytics"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "¡Hola! 👋 Soy el asistente virtual de RevDev Solutions. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre nuestros servicios de desarrollo web, tecnologías, precios y más.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    analytics.customEvent("chat_message", {
      message_length: input.length,
      timestamp: new Date().toISOString(),
    })

    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendChatMessage(currentInput)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error. Por favor intenta nuevamente o contáctanos directamente.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "¿Qué servicios de desarrollo web ofrecen?",
    "¿Cuánto tiempo toma desarrollar una página web?",
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  const renderMessageContent = (content: string) => {
    if (content.includes("[WHATSAPP_BUTTON]")) {
      const parts = content.split("[WHATSAPP_BUTTON]")
      const whatsappNumber = "523334758263"
      const whatsappMessage = encodeURIComponent(
        "Hola! Me gustaría obtener más información sobre sus servicios de desarrollo web.",
      )
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

      return (
        <div className="space-y-3">
          {parts[0] && <p className="whitespace-pre-wrap leading-relaxed">{parts[0]}</p>}
          <Button
            onClick={() => window.open(whatsappUrl, "_blank")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Contactar por WhatsApp
          </Button>
          {parts[1] && <p className="whitespace-pre-wrap leading-relaxed">{parts[1]}</p>}
        </div>
      )
    }

    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm ${
          isOpen
            ? "bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600/90 hover:to-red-600/90 border-white/20 text-white shadow-orange-500/25"
            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-white/20 text-white animate-pulse hover:animate-none shadow-orange-500/25 hover:scale-105"
        }`}
        size="icon"
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </Button>

      {isOpen && (
        <Card
          ref={chatRef}
          className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[520px] shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10"
        >
          <CardHeader className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-md text-white rounded-t-lg relative p-4 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Bot className="h-5 w-5" />
              </div>
              RevBot
            </CardTitle>
            <p className="text-sm text-orange-100 font-medium">Desarrollo Web en Guadalajara</p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 h-8 w-8 p-0 text-white hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 border border-white/10"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(520px-120px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm border border-white/20">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-md backdrop-blur-md border ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white rounded-br-md border-white/20"
                        : "bg-white/20 dark:bg-gray-800/20 text-foreground border-white/30 dark:border-gray-700/30 rounded-bl-md"
                    }`}
                  >
                    {renderMessageContent(message.content)}
                    <p
                      className={`text-xs mt-2 opacity-70 ${
                        message.role === "user" ? "text-orange-100" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600/90 to-gray-700/90 flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm border border-white/20">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm border border-white/20">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-2xl rounded-bl-md border border-white/30 dark:border-gray-700/30 shadow-md backdrop-blur-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="p-4 border-t border-white/20 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Preguntas frecuentes:</p>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-9 justify-start bg-white/20 dark:bg-gray-900/20 hover:bg-orange-50/30 hover:border-orange-300/50 hover:text-orange-700 dark:hover:bg-orange-900/20 transition-all duration-200 border-white/30 dark:border-gray-600/30 backdrop-blur-sm"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-white/20 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  disabled={isLoading}
                  className="flex-1 border-white/30 dark:border-gray-600/30 focus:border-orange-500/50 focus:ring-orange-500/50 rounded-xl bg-white/20 backdrop-blur-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
