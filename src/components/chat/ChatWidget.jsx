import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { chatService } from '../../services/chatService'

const GREETING = "Hi! I'm the Learnly Assistant. Ask me about a topic, how to use the platform, or for a study tip."

export default function ChatWidget() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    setError('')

    try {
      const { reply } = await chatService.sendMessage(text, nextMessages.slice(-6))
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch {
      setError("Couldn't reach the assistant. Try again in a moment.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="mb-3 w-80 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-card-hover border border-gray-100 flex flex-col overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
                <p className="text-sm font-semibold">Learnly Assistant</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm shadow-sm'
                    }`}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {sending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2 shadow-sm">
                    <Loader2 size={16} className="animate-spin text-primary-400" />
                  </div>
                </motion.div>
              )}
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={send} className="border-t border-gray-100 p-2.5 flex items-center gap-2 shrink-0 bg-white">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={sending || !input.trim()}
                className="w-9 h-9 shrink-0 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:hover:bg-primary-500 text-white flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-purple flex items-center justify-center"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
