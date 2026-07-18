import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const TOOLS = [
  { id: 'flashcards', icon: '🃏', title: 'Flashcards', desc: 'Active recall sessions', color: 'from-violet-500 to-purple-600' },
  { id: 'notes',      icon: '📝', title: 'My Notes',   desc: 'Annotate & organise',   color: 'from-blue-500 to-cyan-500' },
  { id: 'practice',   icon: '🎯', title: 'Practice',   desc: 'Topic drills & quizzes', color: 'from-green-500 to-emerald-500' },
  { id: 'ai',         icon: '🤖', title: 'Ask AI',     desc: 'Instant explanations',   color: 'from-amber-500 to-orange-500' },
]

const RECENT = [
  { title: 'React Hooks Deep Dive',        subject: 'Web Development',    pct: 72, icon: '⚛️' },
  { title: 'SQL Joins & Subqueries',        subject: 'Data Science',        pct: 55, icon: '🗄️' },
  { title: 'Linear Regression from Scratch',subject: 'Machine Learning',    pct: 40, icon: '📊' },
]

const STREAKS = [
  { day: 'M', done: true },
  { day: 'T', done: true },
  { day: 'W', done: true },
  { day: 'T', done: false },
  { day: 'F', done: false },
  { day: 'S', done: false },
  { day: 'S', done: false },
]

const NOTE_PLACEHOLDER = `# My Notes\n\nStart writing here... Supports **markdown**.\n\n- Key concept 1\n- Key concept 2\n\n> Important quote or definition\n`

function FlashcardDeck() {
  const cards = [
    { q: 'What is a closure in JavaScript?',   a: 'A function that retains access to variables from its outer scope even after the outer function has returned.' },
    { q: 'What does O(n log n) mean?',          a: 'An algorithm whose time complexity scales as n × log(n). Common in efficient sorting algorithms like merge sort.' },
    { q: 'Explain the CAP theorem.',            a: 'A distributed system can only guarantee two of: Consistency, Availability, Partition tolerance.' },
  ]
  const [idx,     setIdx]     = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known,   setKnown]   = useState([])
  const [unsure,  setUnsure]  = useState([])

  const card = cards[idx]
  const next = (arr, setArr) => {
    setArr(a => [...a, idx])
    setFlipped(false)
    setIdx(i => Math.min(i + 1, cards.length - 1))
  }

  if (idx >= cards.length) return (
    <div className="text-center py-10">
      <p className="text-4xl mb-3">🎉</p>
      <p className="font-display font-bold text-gray-900 text-lg mb-1">Deck complete!</p>
      <p className="text-sm text-gray-500 mb-4">{known.length} known · {unsure.length} to review</p>
      <button onClick={() => { setIdx(0); setFlipped(false); setKnown([]); setUnsure([]) }}
        className="btn-primary text-sm">Restart deck</button>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-xs text-gray-400 font-semibold">{idx + 1} / {cards.length}</p>
      <div className="w-full max-w-md cursor-pointer" onClick={() => setFlipped(f => !f)}>
        <div className={`card p-8 min-h-[180px] flex flex-col items-center justify-center text-center transition-all duration-300 ${flipped ? 'bg-primary-50 border-primary-200' : 'hover:shadow-card-hover'}`}>
          {!flipped ? (
            <>
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">Question</p>
              <p className="font-display font-semibold text-gray-900">{card.q}</p>
              <p className="text-xs text-gray-400 mt-4">Tap to reveal →</p>
            </>
          ) : (
            <>
              <p className="text-xs text-primary-500 mb-3 uppercase tracking-widest font-bold">Answer</p>
              <p className="text-sm text-gray-700 leading-relaxed">{card.a}</p>
            </>
          )}
        </div>
      </div>
      {flipped && (
        <div className="flex gap-3">
          <button onClick={() => next(unsure, setUnsure)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
            😕 Still unsure
          </button>
          <button onClick={() => next(known, setKnown)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-green-200 text-green-600 hover:bg-green-50 font-medium transition-colors">
            ✓ Got it!
          </button>
        </div>
      )}
    </div>
  )
}

function NotesEditor() {
  const [content, setContent] = useState(NOTE_PLACEHOLDER)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="badge bg-gray-100 text-gray-500">Markdown supported</span>
        <span>Auto-saved locally</span>
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={14}
        className="w-full p-4 text-sm font-mono bg-surface-50 border border-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all leading-relaxed text-gray-800"
      />
    </div>
  )
}

function PracticeDrill() {
  const questions = [
    { q: 'What hook do you use to run code after render in React?', options: ['useState', 'useEffect', 'useContext', 'useRef'], correct: 1 },
    { q: 'Which SQL clause filters rows after aggregation?',         options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],       correct: 1 },
  ]
  const [qi,       setQi]       = useState(0)
  const [selected, setSelected] = useState(null)
  const [score,    setScore]    = useState(0)
  const q = questions[qi]

  const pick = i => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setScore(s => s + 1)
  }

  return (
    <div>
      {qi < questions.length ? (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 font-semibold">{qi + 1} / {questions.length}</p>
          <p className="font-display font-semibold text-gray-900">{q.q}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => pick(i)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all font-medium ${
                  selected === null ? 'border-gray-200 hover:border-primary-200 hover:bg-primary-50 text-gray-700'
                  : i === q.correct ? 'border-green-300 bg-green-50 text-green-700'
                  : selected === i  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-100 text-gray-400'}`}>
                {opt}
              </button>
            ))}
          </div>
          {selected !== null && (
            <button onClick={() => { setQi(i => i + 1); setSelected(null) }}
              className="btn-primary text-sm">Next →</button>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-4xl mb-3">{score === questions.length ? '🏆' : '📈'}</p>
          <p className="font-display font-bold text-xl text-gray-900 mb-1">{score}/{questions.length} correct</p>
          <button onClick={() => { setQi(0); setSelected(null); setScore(0) }} className="btn-primary text-sm mt-4">Retry</button>
        </div>
      )}
    </div>
  )
}

function AskAI() {
  const [q,        setQ]        = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! Ask me anything about your courses — I can explain concepts, give examples, or quiz you on a topic.' }
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!q.trim()) return
    const userQ = q.trim()
    setMessages(m => [...m, { role: 'user', text: userQ }])
    setQ('')
    setLoading(true)
    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a helpful tutor for a learning platform called Learnly. Answer questions clearly and concisely. Use examples when helpful. Keep responses under 200 words.',
          messages: [{ role: 'user', content: userQ }]
        })
      })
      const data = await res.json()
      const text = data.content?.map(b => b.text || '').join('') || 'Sorry, I could not answer that.'
      setMessages(m => [...m, { role: 'ai', text }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Something went wrong. Please try again.' }])
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-tr-sm'
                : 'bg-surface-100 text-gray-700 rounded-tl-sm border border-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-100 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
        />
        <button onClick={send} disabled={loading || !q.trim()}
          className="btn-primary text-sm disabled:opacity-50">Send</button>
      </div>
    </div>
  )
}

const TOOL_CONTENT = { flashcards: <FlashcardDeck />, notes: <NotesEditor />, practice: <PracticeDrill />, ai: <AskAI /> }

export default function LearnSpace() {
  const { user }   = useAuth()
  const [tool, setTool] = useState('flashcards')

  return (
    <div>
      <div className="bg-gradient-to-br from-primary-800 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-200 mb-3">🧠 Learn Space</span>
          <h1 className="font-display text-4xl font-bold mb-2">Your Study Hub</h1>
          <p className="text-primary-100 text-sm max-w-md">Flashcards, notes, practice drills, and AI tutoring — everything you need to go deeper.</p>
        </div>
      </div>

      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Streak */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🔥</span>
                <span className="font-display font-bold text-gray-900">3-day streak</span>
              </div>
              <div className="flex gap-2">
                {STREAKS.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${s.done ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {s.done ? '✓' : s.day}
                    </div>
                    <span className="text-xs text-gray-400">{s.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent sessions */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-gray-900 mb-4 text-sm">Recent sessions</h3>
              <div className="space-y-3">
                {RECENT.map(r => (
                  <div key={r.title} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-lg shrink-0">{r.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{r.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="text-xs text-primary-600 font-bold shrink-0">{r.pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-gray-900 mb-3 text-sm">Quick links</h3>
              <div className="space-y-1.5">
                <Link to="/courses" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors">📚 Browse courses</Link>
                <Link to="/roadmap" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors">🗺️ My roadmap</Link>
                <Link to="/videos"  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors">🎥 Video library</Link>
              </div>
            </div>
          </div>

          {/* Right column — tool panel */}
          <div className="lg:col-span-2">
            {/* Tool switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {TOOLS.map(t => (
                <button key={t.id} onClick={() => setTool(t.id)}
                  className={`card p-4 text-left transition-all hover:-translate-y-0.5 ${tool === t.id ? 'ring-2 ring-primary-400 shadow-purple' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-lg mb-2`}>{t.icon}</div>
                  <p className="font-semibold text-gray-900 text-xs">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Tool content */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-gray-900 mb-5">
                {TOOLS.find(t => t.id === tool)?.icon} {TOOLS.find(t => t.id === tool)?.title}
              </h2>
              {TOOL_CONTENT[tool]}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
