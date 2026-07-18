import { useState } from 'react'
import { Link } from 'react-router-dom'

const ROADMAPS = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: '🌐',
    color: 'from-cyan-500 to-blue-500',
    duration: '6 months',
    level: 'Beginner → Advanced',
    steps: [
      { phase: 1, title: 'HTML & CSS Fundamentals', weeks: '1–2', status: 'done',   icon: '📄', desc: 'Semantic HTML, Flexbox, Grid, responsive design', courses: ['HTML Basics', 'CSS Mastery'] },
      { phase: 2, title: 'JavaScript Essentials',   weeks: '3–6', status: 'done',   icon: '⚡', desc: 'Variables, functions, DOM manipulation, async/await', courses: ['JS for Beginners', 'Async JavaScript'] },
      { phase: 3, title: 'React & State Management',weeks: '7–12',status: 'active', icon: '⚛️', desc: 'Components, hooks, Context, Redux basics', courses: ['React Fundamentals', 'Redux Essentials'] },
      { phase: 4, title: 'Build Tools & Workflow',   weeks: '13–14',status: 'locked',icon: '🔧', desc: 'Vite, webpack, npm, ESLint, Prettier', courses: ['Modern JS Tooling'] },
      { phase: 5, title: 'Testing & Quality',        weeks: '15–18',status: 'locked',icon: '🧪', desc: 'Jest, React Testing Library, Cypress', courses: ['Testing React Apps'] },
      { phase: 6, title: 'Deployment & DevOps',      weeks: '19–24',status: 'locked',icon: '🚀', desc: 'CI/CD, Vercel, Docker basics, performance', courses: ['Deploy Like a Pro'] },
    ],
  },
  {
    id: 'datascience',
    title: 'Data Scientist',
    icon: '📊',
    color: 'from-blue-500 to-violet-500',
    duration: '8 months',
    level: 'Beginner → Advanced',
    steps: [
      { phase: 1, title: 'Python for Data',          weeks: '1–3', status: 'done',   icon: '🐍', desc: 'Python basics, pandas, NumPy, Matplotlib', courses: ['Python Basics', 'Data with Pandas'] },
      { phase: 2, title: 'Statistics & Probability', weeks: '4–7', status: 'active', icon: '📐', desc: 'Descriptive stats, distributions, hypothesis testing', courses: ['Statistics for DS'] },
      { phase: 3, title: 'Machine Learning',          weeks: '8–16',status: 'locked', icon: '🤖', desc: 'Supervised, unsupervised, model evaluation', courses: ['ML Fundamentals', 'scikit-learn Deep Dive'] },
      { phase: 4, title: 'Deep Learning',             weeks: '17–22',status: 'locked',icon: '🧠', desc: 'Neural networks, CNNs, RNNs, transformers', courses: ['Deep Learning with PyTorch'] },
      { phase: 5, title: 'MLOps & Deployment',        weeks: '23–28',status: 'locked',icon: '⚙️', desc: 'Model serving, MLflow, monitoring, pipelines', courses: ['MLOps Fundamentals'] },
      { phase: 6, title: 'Capstone Projects',         weeks: '29–32',status: 'locked',icon: '🏆', desc: 'Real-world projects, portfolio building', courses: ['DS Portfolio Bootcamp'] },
    ],
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Engineer',
    icon: '⚙️',
    color: 'from-violet-500 to-pink-500',
    duration: '10 months',
    level: 'Intermediate',
    steps: [
      { phase: 1, title: 'Frontend Foundations',  weeks: '1–4',  status: 'done',   icon: '🌐', desc: 'HTML, CSS, JS, React basics', courses: ['React Crash Course'] },
      { phase: 2, title: 'Backend with Node.js',  weeks: '5–10', status: 'done',   icon: '🟩', desc: 'Express, REST APIs, authentication', courses: ['Node.js & Express'] },
      { phase: 3, title: 'Databases',             weeks: '11–16',status: 'active', icon: '🗄️', desc: 'SQL, MongoDB, data modeling, ORMs', courses: ['SQL Mastery', 'MongoDB Essentials'] },
      { phase: 4, title: 'Advanced React',        weeks: '17–22',status: 'locked', icon: '⚛️', desc: 'Performance, SSR, Next.js, TypeScript', courses: ['Next.js Full Course'] },
      { phase: 5, title: 'System Design',         weeks: '23–28',status: 'locked', icon: '🏗️', desc: 'Scalability, caching, microservices, queues', courses: ['System Design Primer'] },
      { phase: 6, title: 'Interview Prep',        weeks: '29–40',status: 'locked', icon: '🎯', desc: 'DSA, take-homes, whiteboarding, negotiations', courses: ['FAANG Interview Prep'] },
    ],
  },
]

const STATUS_CONFIG = {
  done:   { label: 'Complete',   cls: 'bg-green-500',  ring: 'ring-green-200',  text: 'text-green-700 bg-green-50' },
  active: { label: 'In Progress',cls: 'bg-primary-500',ring: 'ring-primary-200',text: 'text-primary-700 bg-primary-50' },
  locked: { label: 'Locked',     cls: 'bg-gray-300',   ring: 'ring-gray-100',   text: 'text-gray-500 bg-gray-50' },
}

function RoadmapCard({ rm, isSelected, onSelect }) {
  const doneCount = rm.steps.filter(s => s.status === 'done').length
  const pct       = Math.round((doneCount / rm.steps.length) * 100)
  return (
    <button onClick={() => onSelect(rm.id)}
      className={`text-left card p-5 transition-all duration-200 hover:-translate-y-1 ${isSelected ? 'ring-2 ring-primary-400 shadow-purple' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rm.color} flex items-center justify-center text-2xl mb-3 shadow-md`}>
        {rm.icon}
      </div>
      <h3 className="font-display font-bold text-gray-900 mb-1">{rm.title}</h3>
      <p className="text-xs text-gray-400 mb-3">{rm.duration} · {rm.level}</p>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div className={`h-full bg-gradient-to-r ${rm.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400">{doneCount}/{rm.steps.length} stages complete</p>
    </button>
  )
}

export default function Roadmap() {
  const [selected, setSelected] = useState('frontend')
  const rm = ROADMAPS.find(r => r.id === selected)

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-violet-600 text-white">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-200 mb-3">
            🗺️ Learning Roadmaps
          </span>
          <h1 className="font-display text-4xl font-bold mb-3">Your Path to Mastery</h1>
          <p className="text-primary-100 text-sm max-w-lg">
            Structured, phase-by-phase roadmaps that guide you from zero to job-ready. Track your progress, unlock stages, and never wonder what to learn next.
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Roadmap picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {ROADMAPS.map(r => (
            <RoadmapCard key={r.id} rm={r} isSelected={selected === r.id} onSelect={setSelected} />
          ))}
        </div>

        {/* Active roadmap detail */}
        {rm && (
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rm.color} flex items-center justify-center text-3xl shadow-md`}>
                {rm.icon}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900">{rm.title} Roadmap</h2>
                <p className="text-sm text-gray-400">{rm.duration} · {rm.level}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100" />

              <div className="space-y-0">
                {rm.steps.map((step, i) => {
                  const cfg = STATUS_CONFIG[step.status]
                  return (
                    <div key={step.phase} className="relative flex gap-6 pb-8 last:pb-0">
                      {/* Node */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ring-4 ${cfg.ring} ${step.status === 'locked' ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                        {step.status === 'locked' ? '🔒' : step.icon}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 card p-4 transition-all ${step.status === 'active' ? 'ring-2 ring-primary-200 shadow-purple' : ''} ${step.status === 'locked' ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display font-bold text-gray-900 text-sm">Phase {step.phase}: {step.title}</span>
                              <span className={`badge text-xs ${cfg.text}`}>{cfg.label}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Weeks {step.weeks}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{step.desc}</p>
                        {step.courses?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {step.courses.map(c => (
                              <Link key={c} to="/courses"
                                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                                  step.status === 'locked'
                                    ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'border-primary-100 text-primary-600 hover:bg-primary-50'
                                }`}>
                                📚 {c}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
