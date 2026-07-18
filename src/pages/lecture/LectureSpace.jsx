import { useState } from 'react'
import { Link } from 'react-router-dom'

const LECTURES = [
  {
    id: 1,
    courseTitle: 'Machine Learning Fundamentals',
    lectureTitle: 'Gradient Descent & Optimisation',
    number: 7,
    total: 24,
    instructor: 'Dr. Marcus Lee',
    category: 'Data Science',
    duration: '42 min',
    objectives: [
      'Understand the intuition behind gradient descent',
      'Implement batch, mini-batch and stochastic variants',
      'Tune learning rate and spot common pitfalls',
    ],
    sections: [
      { title: 'What is optimisation?',          duration: '5:00',  type: 'video',  done: true  },
      { title: 'The cost landscape',              duration: '8:30',  type: 'video',  done: true  },
      { title: 'Gradient descent algorithm',      duration: '12:10', type: 'video',  done: true  },
      { title: 'Code walkthrough (Python)',        duration: '9:45',  type: 'code',   done: false },
      { title: 'Mini-quiz — optimisation basics', duration: '~5 min',type: 'quiz',   done: false },
      { title: 'Discussion: Learning rate tips',  duration: '3 min', type: 'discuss',done: false },
      { title: 'Assignment: Implement GD',        duration: null,    type: 'assign', done: false },
    ],
    notes: `## Lecture 7 — Gradient Descent\n\n**Key idea**: Find the minimum of a function by always stepping in the direction of the steepest downhill slope.\n\n### The update rule\n\nθ = θ - α · ∇J(θ)\n\n- **α** = learning rate (how big each step is)\n- **∇J(θ)** = gradient of the cost function\n\n### Variants\n\n| Type | Batch size | Speed | Stability |\n|------|-----------|-------|----------|\n| Batch GD | Full dataset | Slow | High |\n| SGD | 1 sample | Fast | Low |\n| Mini-batch | 32–256 | Balanced | Medium |\n\n> Tip: Start with learning rate 0.01 and halve it if loss diverges.`,
  },
  {
    id: 2,
    courseTitle: 'React Complete Course',
    lectureTitle: 'Custom Hooks in Depth',
    number: 12,
    total: 30,
    instructor: 'Sarah Chen',
    category: 'Web Development',
    duration: '35 min',
    objectives: [
      'Extract stateful logic into reusable custom hooks',
      'Understand the rules of hooks and why they exist',
      'Build useFetch, useLocalStorage, and useDebounce',
    ],
    sections: [
      { title: 'Motivation for custom hooks',  duration: '4:20',  type: 'video',  done: true  },
      { title: 'Rules of hooks',               duration: '6:15',  type: 'video',  done: true  },
      { title: 'Building useFetch',            duration: '12:00', type: 'code',   done: false },
      { title: 'useLocalStorage hook',         duration: '8:30',  type: 'code',   done: false },
      { title: 'Quiz — custom hooks',          duration: '~4 min',type: 'quiz',   done: false },
      { title: 'Challenge: useDebounce',       duration: null,    type: 'assign', done: false },
    ],
    notes: `## Lecture 12 — Custom Hooks\n\n**Rule #1**: Only call hooks at the top level. Never inside loops, conditions, or nested functions.\n\n**Rule #2**: Only call hooks from React functions (components or custom hooks).\n\n### Pattern\n\n\`\`\`js\nfunction useFetch(url) {\n  const [data, setData]   = useState(null)\n  const [loading, setLoading] = useState(true)\n\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false))\n  }, [url])\n\n  return { data, loading }\n}\n\`\`\``,
  },
]

const SECTION_ICONS = { video: '▶', code: '💻', quiz: '❓', discuss: '💬', assign: '📋' }
const SECTION_COLORS = {
  video:   'bg-primary-50 text-primary-600 border-primary-100',
  code:    'bg-gray-50 text-gray-700 border-gray-200',
  quiz:    'bg-amber-50 text-amber-700 border-amber-100',
  discuss: 'bg-green-50 text-green-700 border-green-100',
  assign:  'bg-rose-50 text-rose-700 border-rose-100',
}

function LectureSidebar({ lecture, activeSection, setActiveSection }) {
  const done = lecture.sections.filter(s => s.done).length
  const pct  = Math.round((done / lecture.sections.length) * 100)

  return (
    <aside className="card p-5 sticky top-20">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Course</p>
      <p className="font-display font-semibold text-gray-900 text-sm mb-4 leading-snug">{lecture.courseTitle}</p>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{done}/{lecture.sections.length} complete</span>
          <span className="font-bold text-primary-600">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-1">
        {lecture.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveSection(i)}
            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
              activeSection === i ? 'bg-primary-50 border border-primary-100' : 'hover:bg-surface-50'
            }`}>
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-xs ${s.done ? 'bg-green-500 text-white border-green-400' : SECTION_COLORS[s.type]}`}>
              {s.done ? '✓' : SECTION_ICONS[s.type]}
            </span>
            <span className={`flex-1 truncate font-medium ${activeSection === i ? 'text-primary-700' : 'text-gray-700'}`}>{s.title}</span>
            {s.duration && <span className="text-gray-400 shrink-0">{s.duration}</span>}
          </button>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <Link to="/courses" className="text-xs text-primary-600 hover:text-primary-700 font-medium">← Back to course</Link>
      </div>
    </aside>
  )
}

export default function LectureSpace() {
  const [selected,      setSelected]      = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [tab,           setTab]           = useState('content') // content | notes | resources

  const lecture = LECTURES[selected]
  const section = lecture.sections[activeSection]

  const markDone = () => {
    // In real app would call API
    const next = activeSection + 1
    if (next < lecture.sections.length) setActiveSection(next)
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-gray-950 text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">← Dashboard</Link>
            <span className="text-gray-700 hidden sm:block">|</span>
            <span className="hidden sm:block text-sm font-semibold text-white truncate">{lecture.lectureTitle}</span>
          </div>
          {/* Lecture switcher */}
          <div className="flex items-center gap-2">
            {LECTURES.map((l, i) => (
              <button key={l.id} onClick={() => { setSelected(i); setActiveSection(0) }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${selected === i ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {i + 1}. {l.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LectureSidebar lecture={lecture} activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-5">
            {/* Video / content area */}
            <div className="card overflow-hidden">
              <div className="relative h-56 sm:h-72 bg-gradient-to-br from-gray-950 to-gray-800 flex items-center justify-center">
                <span className="text-7xl opacity-20">🎓</span>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  {section.type === 'video' || section.type === 'code' ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5l11 7-11 7V5z" fill="white"/></svg>
                      </div>
                      <p className="text-white/60 text-sm">{section.title}</p>
                      <p className="text-white/40 text-xs">{section.duration}</p>
                    </>
                  ) : section.type === 'quiz' ? (
                    <div className="text-center">
                      <p className="text-4xl mb-2">❓</p>
                      <p className="text-white font-semibold">Mini Quiz</p>
                      <p className="text-white/60 text-sm mt-1">{section.title}</p>
                    </div>
                  ) : section.type === 'assign' ? (
                    <div className="text-center">
                      <p className="text-4xl mb-2">📋</p>
                      <p className="text-white font-semibold">Assignment</p>
                      <p className="text-white/60 text-sm mt-1">{section.title}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-4xl mb-2">💬</p>
                      <p className="text-white font-semibold">Discussion</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lecture header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="badge bg-primary-50 text-primary-600 text-xs">{lecture.category}</span>
                  <span className="text-xs text-gray-400">Lecture {lecture.number} of {lecture.total}</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-gray-900">{lecture.lectureTitle}</h1>
                <p className="text-sm text-gray-500 mt-1">{lecture.instructor} · {lecture.duration}</p>
              </div>
              <button onClick={markDone}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  section.done ? 'bg-green-100 text-green-700 border border-green-200' : 'btn-primary'
                }`}>
                {section.done ? '✓ Complete' : 'Mark complete'}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100 flex gap-0">
              {[['content','📖 Content'], ['notes','📝 Notes'], ['resources','📎 Resources']].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === id ? 'border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === 'content' && (
              <div className="space-y-5">
                {/* Learning objectives */}
                <div className="card p-5">
                  <h3 className="font-display font-bold text-gray-900 mb-3">Learning objectives</h3>
                  <ul className="space-y-2">
                    {lecture.objectives.map((obj, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* All sections */}
                <div className="card p-5">
                  <h3 className="font-display font-bold text-gray-900 mb-4">Lecture content</h3>
                  <div className="space-y-2">
                    {lecture.sections.map((s, i) => (
                      <button key={i} onClick={() => setActiveSection(i)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          activeSection === i ? 'bg-primary-50 border-primary-200' : 'border-gray-100 hover:border-primary-100 hover:bg-surface-50'
                        }`}>
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center border text-sm shrink-0 ${s.done ? 'bg-green-500 text-white border-green-400' : SECTION_COLORS[s.type]}`}>
                          {s.done ? '✓' : SECTION_ICONS[s.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                          <p className="text-xs text-gray-400 capitalize">{s.type}{s.duration ? ` · ${s.duration}` : ''}</p>
                        </div>
                        {s.done && <span className="badge bg-green-50 text-green-600 text-xs shrink-0">Done</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'notes' && (
              <div className="card p-5">
                <h3 className="font-display font-bold text-gray-900 mb-4">Lecture Notes</h3>
                <div className="bg-surface-50 rounded-xl p-5 border border-gray-100">
                  <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">{lecture.notes}</pre>
                </div>
                <p className="text-xs text-gray-400 mt-3">💡 These are provided notes. Use the Learn Space to write your own.</p>
              </div>
            )}

            {tab === 'resources' && (
              <div className="card p-5">
                <h3 className="font-display font-bold text-gray-900 mb-4">Resources & Downloads</h3>
                <div className="space-y-2">
                  {[
                    { icon: '📄', label: 'Lecture slides (PDF)',      size: '2.4 MB' },
                    { icon: '💾', label: 'Starter code (zip)',         size: '18 KB' },
                    { icon: '🔗', label: 'Supplemental reading list', size: null     },
                    { icon: '📊', label: 'Cheat sheet',                size: '410 KB' },
                  ].map(r => (
                    <button key={r.label} className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                      <span className="text-lg">{r.icon}</span>
                      <span className="flex-1 text-sm font-medium text-gray-800">{r.label}</span>
                      {r.size && <span className="text-xs text-gray-400">{r.size}</span>}
                      <span className="text-xs text-primary-600 font-semibold">↓</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between pt-2">
              <button disabled={activeSection === 0}
                onClick={() => setActiveSection(i => i - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all">
                ← Previous
              </button>
              <button disabled={activeSection >= lecture.sections.length - 1}
                onClick={markDone}
                className="flex items-center gap-2 btn-primary text-sm disabled:opacity-40">
                Next section →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
