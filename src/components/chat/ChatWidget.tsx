'use client'

import { useMemo, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hi! I’m the Enactus Remote assistant. What do you want to do—find opportunities, explore courses, or learn about donations?" },
  ])

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  const send = async () => {
  const text = input.trim()
  if (!text || loading) return

  setInput('')
  setLoading(true)

  const next: Msg[] = [...messages, { role: 'user', content: text }]
  setMessages(next)

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: next.map((m) => ({ role: m.role, content: m.content })),
      }),
    })

    const data = await res.json()
    const replyText: string = data?.text || "Sorry — I couldn’t respond right now."

    setMessages([...next, { role: 'assistant', content: replyText }])
  } catch {
    setMessages([...next, { role: 'assistant', content: "Network issue — please try again." }])
  } finally {
    setLoading(false)
  }
}


  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] rounded-full bg-slate-900 text-yellow-500 p-4 shadow-2xl hover:bg-slate-800 transition"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[60] w-[92vw] max-w-md rounded-[2rem] border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500">AI Assistant</p>
            <p className="font-black tracking-tight">Enactus Remote Help</p>
          </div>

          <div className="p-4 max-h-[52vh] overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl bg-yellow-500 px-4 py-3 text-slate-900 font-bold'
                    : 'mr-auto max-w-[85%] rounded-2xl bg-white border border-slate-200 px-4 py-3 text-slate-800 font-bold'
                }
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-yellow-500"
                placeholder={loading ? 'Thinking…' : 'Ask something…'}
              />
              <button
                onClick={send}
                disabled={!canSend}
                className="rounded-2xl bg-slate-900 text-white px-4 py-3 font-black hover:bg-slate-800 disabled:opacity-40 transition inline-flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-400">
              Tip: Ask “How do I apply for a job?” or “How are donations used?”
            </p>
          </div>
        </div>
      )}
    </>
  )
}
