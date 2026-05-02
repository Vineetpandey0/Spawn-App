'use client'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'


interface Message {
  id: string
  role: 'user' | 'bot'
  messages: string
  time: string
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const APP_ID = usePathname().split('/').pop()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/app/${APP_ID}/chat`)
        setMessages(res.data.chats)
        console.log(res.data.chats);
      } catch (err) {
        console.log(err)
      }
    }
    fetchMessages()
  }, [])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  async function sendMessage(messages: string) {
    if (!messages.trim() || isLoading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      messages,
      time: getTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const res = await axios.post(`/api/apps/${APP_ID}/chat`, {
        message: messages
      }, {
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.data
      const reply: string =
        data.message ?? data.reply ?? data.content ?? 'Sorry, no response.'

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'bot', messages: reply, time: getTime() },
      ])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          messages: 'Something went wrong. Please try again.',
          time: getTime(),
        },
      ])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }


  return (
    <div className="flex flex-col h-screen bg-stone-50">

      {/* ── Messages ── */}
      <main className="flex-1 overflow-y-auto py-7 pb-36 pt-14 scroll-smooth">
        <div className="max-w-2xl mx-auto px-6 flex flex-col gap-5">
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 animate-[fadeUp_0.25s_ease_forwards] opacity-0 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-[30px] h-[30px] rounded-[9px] shrink-0 flex items-center justify-center text-[13px] font-semibold mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? 'U' : '✦'}
                  </div>

                  {/* Bubble + time */}
                  <div
                    className={`flex flex-col gap-1 max-w-[75%] ${
                      msg.role === 'user' ? 'items-end' : ''
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed tracking-[-0.005em] break-words ${
                        msg.role === 'user'
                          ? 'bg-stone-900 text-white rounded-2xl rounded-br-[4px]'
                          : 'bg-white text-stone-800 border border-stone-200 rounded-2xl rounded-tl-[4px] shadow-sm'
                      }`}
                    >
                      {msg.messages?.split('\n').map((line, i, arr) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-400 font-mono px-0.5">{msg.time}</p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2.5 animate-[fadeUp_0.25s_ease_forwards] opacity-0">
                  <div className="w-[30px] h-[30px] rounded-[9px] shrink-0 flex items-center justify-center text-[13px] font-semibold mt-0.5 bg-stone-900 text-white">
                    ✦
                  </div>
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-[4px] shadow-sm px-4 py-3.5 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </>

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Input area ── */}
      <div className="bg-white border-t border-stone-200 px-6 pt-4 pb-5 shrink-0 fixed bottom-0 w-full">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2.5 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-500/10 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                autoResize()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-stone-800 placeholder:text-stone-400 leading-relaxed max-h-[120px] py-0.5"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1={22} y1={2} x2={11} y2={13} />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-stone-400 font-mono mt-2 tracking-wide">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}