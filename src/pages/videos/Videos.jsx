import { useState } from 'react'
import { CATEGORIES } from '../../data/categories'

const VIDEOS = [
  { id: 1,  title: 'React 19 — What\'s New',                  instructor: 'Sarah Chen',    category: 'Web Development',    duration: '14:32', views: '48.2K', thumb: '⚛️',  tag: 'New',        desc: 'A complete walkthrough of React 19\'s new compiler, server actions, and more.' },
  { id: 2,  title: 'Intro to Neural Networks',               instructor: 'Dr. Marcus Lee', category: 'Artificial Intelligence', duration: '22:10', views: '91.7K', thumb: '🧠',  tag: 'Popular',    desc: 'Build your intuition for how neural networks learn from scratch.' },
  { id: 3,  title: 'SQL Window Functions Explained',          instructor: 'Priya Nair',     category: 'Data Science',       duration: '18:05', views: '33.4K', thumb: '🗄️',  tag: null,         desc: 'Master OVER, PARTITION BY, ROW_NUMBER and more with real examples.' },
  { id: 4,  title: 'Python List Comprehensions',             instructor: 'Tom Walsh',      category: 'Computer Science',   duration: '9:47',  views: '62.1K', thumb: '🐍',  tag: 'Bestseller', desc: 'Write clean, fast Pythonic code using list comprehensions and generators.' },
  { id: 5,  title: 'CSS Grid — The Complete Guide',           instructor: 'Laura Kim',      category: 'Web Development',    duration: '31:18', views: '27.9K', thumb: '🌐',  tag: null,         desc: 'From basic grid tracks to complex magazine layouts.' },
  { id: 6,  title: 'Machine Learning in 20 Minutes',         instructor: 'Dr. Marcus Lee', category: 'Data Science',       duration: '20:02', views: '105K',  thumb: '📊',  tag: 'Popular',    desc: 'The fastest possible introduction to core ML concepts.' },
  { id: 7,  title: 'Figma for Developers',                   instructor: 'Aisha Okonkwo',  category: 'Design',             duration: '15:33', views: '41.3K', thumb: '🎨',  tag: null,         desc: 'Understand Figma tokens, auto-layout, and developer handoff.' },
  { id: 8,  title: 'Docker Crash Course',                    instructor: 'Jake Morrison',  category: 'Cloud Computing',    duration: '28:44', views: '58.8K', thumb: '☁️',  tag: 'New',        desc: 'Containers, images, Compose — everything you need to get started.' },
  { id: 9,  title: 'TypeScript Generics Deep Dive',          instructor: 'Sarah Chen',     category: 'Computer Science',   duration: '24:15', views: '19.6K', thumb: '💻',  tag: null,         desc: 'Stop avoiding generics. This video makes them click.' },
  { id: 10, title: 'Intro to Prompt Engineering',            instructor: 'Wei Zhang',      category: 'Artificial Intelligence', duration: '17:50', views: '73.2K', thumb: '🤖',  tag: 'Bestseller', desc: 'Chain-of-thought, few-shot, and system prompts demystified.' },
  { id: 11, title: 'Building a REST API with Node.js',       instructor: 'Tom Walsh',      category: 'Web Development',    duration: '35:10', views: '44.6K', thumb: '🟩',  tag: null,         desc: 'Express, middleware, JWT auth, and MongoDB in one project.' },
  { id: 12, title: 'Color Theory for UI Designers',          instructor: 'Aisha Okonkwo',  category: 'Design',             duration: '12:20', views: '31.0K', thumb: '🎨',  tag: 'New',        desc: 'Hue, saturation, contrast, and choosing the perfect palette.' },
  { id: 13, title: 'Kubernetes for Beginners',                instructor: 'Jake Morrison',  category: 'Cloud Computing',    duration: '26:40', views: '52.1K', thumb: '☸️',  tag: 'Popular',    desc: 'Pods, deployments, services, and how they all fit together.' },
  { id: 14, title: 'Pandas DataFrames from Zero',             instructor: 'Priya Nair',     category: 'Data Science',       duration: '21:15', views: '38.9K', thumb: '🐼',  tag: null,         desc: 'Filtering, grouping, and reshaping real datasets with pandas.' },
  { id: 15, title: 'Building Your First iOS App with Swift',  instructor: 'Daniel Osei',    category: 'Mobile Development', duration: '33:05', views: '29.4K', thumb: '📱',  tag: 'New',        desc: 'SwiftUI basics, navigation, and shipping to TestFlight.' },
  { id: 16, title: 'Ethical Hacking: Recon Fundamentals',     instructor: 'Maya Torres',    category: 'Cybersecurity',      duration: '19:22', views: '47.0K', thumb: '🔐',  tag: 'Bestseller', desc: 'Footprinting, OSINT, and the first steps of a pentest engagement.' },
  { id: 17, title: 'Linear Regression, Visually Explained',   instructor: 'Dr. Marcus Lee', category: 'Data Science',       duration: '13:48', views: '66.3K', thumb: '📈',  tag: 'Popular',    desc: 'What the model is actually doing under the hood, with intuitive visuals.' },
  { id: 18, title: 'Personal Finance 101: Budgeting That Sticks', instructor: 'Grace Liu',  category: 'Finance',            duration: '16:12', views: '81.5K', thumb: '💰',  tag: 'Bestseller', desc: 'A simple, realistic budgeting system that actually survives real life.' },
  { id: 19, title: 'Pitching Your Startup in 60 Seconds',     instructor: 'Kwame Asante',   category: 'Entrepreneurship',   duration: '11:30', views: '24.7K', thumb: '🚀',  tag: null,         desc: 'Structure, pacing, and the one slide investors actually remember.' },
  { id: 20, title: 'Photography Composition Rules (and When to Break Them)', instructor: 'Elena Petrova', category: 'Photography', duration: '20:55', views: '35.2K', thumb: '📷', tag: 'Popular', desc: 'Rule of thirds, leading lines, and knowing when to ignore them.' },
  { id: 21, title: 'Music Theory: Chords in 15 Minutes',      instructor: 'Marcus Webb',    category: 'Music',              duration: '15:02', views: '29.8K', thumb: '🎵',  tag: null,         desc: 'Triads, sevenths, and building chord progressions that work.' },
  { id: 22, title: 'Public Speaking: Beating Stage Fright',   instructor: 'Grace Liu',      category: 'Public Speaking',    duration: '18:40', views: '53.6K', thumb: '🎤',  tag: 'Bestseller', desc: 'Practical techniques to calm nerves before and during a talk.' },
  { id: 23, title: 'Unity Basics: Your First 2D Game',        instructor: 'Daniel Osei',    category: 'Game Development',   duration: '39:12', views: '43.9K', thumb: '🎮',  tag: 'New',        desc: 'Scenes, sprites, physics, and a playable prototype by the end.' },
  { id: 24, title: 'Smart Contracts 101 with Solidity',       instructor: 'Wei Zhang',      category: 'Blockchain & Web3',  duration: '25:30', views: '22.1K', thumb: '⛓️',  tag: null,         desc: 'Writing, deploying, and testing your first Solidity contract.' },
  { id: 25, title: 'Cell Biology Crash Course',               instructor: 'Dr. Amara Diallo', category: 'Science',          duration: '17:05', views: '39.4K', thumb: '🔬',  tag: 'Popular',    desc: 'Organelles, membranes, and how a cell actually functions.' },
  { id: 26, title: 'Calculus: Derivatives Made Intuitive',    instructor: 'Priya Nair',     category: 'Mathematics',        duration: '23:18', views: '61.0K', thumb: '📐',  tag: 'Bestseller', desc: 'What a derivative really represents, before the formal rules.' },
]

const TAG_COLORS = {
  Bestseller: 'bg-accent-500 text-white',
  Popular:    'bg-primary-500 text-white',
  New:        'bg-green-500 text-white',
}

function VideoCard({ video, onPlay }) {
  return (
    <div className="card overflow-hidden group hover:-translate-y-1 transition-all duration-200 hover:shadow-card-hover cursor-pointer" onClick={() => onPlay(video)}>
      {/* Thumb */}
      <div className="relative h-40 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center overflow-hidden">
        <span className="text-5xl opacity-40">{video.thumb}</span>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3l8 5-8 5V3z" fill="#7c3aed"/>
            </svg>
          </div>
        </div>
        {/* Duration */}
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">{video.duration}</span>
        {video.tag && (
          <span className={`absolute top-2 left-2 badge text-white text-xs ${TAG_COLORS[video.tag] ?? 'bg-gray-700'}`}>{video.tag}</span>
        )}
      </div>
      {/* Body */}
      <div className="p-4">
        <span className="badge bg-primary-50 text-primary-600 text-xs mb-2">{video.category}</span>
        <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-primary-700 transition-colors line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-primary-100 inline-flex items-center justify-center text-primary-600 font-bold" style={{fontSize:8}}>{video.instructor.charAt(0)}</span>
          {video.instructor}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2">{video.desc}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">👁 {video.views} views</span>
          <span className="text-xs text-primary-600 font-semibold">▶ Watch</span>
        </div>
      </div>
    </div>
  )
}

function VideoModal({ video, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Fake video player */}
        <div className="relative h-64 sm:h-80 bg-gray-950 flex items-center justify-center">
          <span className="text-8xl opacity-20">{video.thumb}</span>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5l11 7-11 7V5z" fill="white"/>
              </svg>
            </div>
            <p className="text-white/60 text-sm">Video player preview</p>
          </div>
          {/* Controls bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="h-1 bg-white/20 rounded-full mb-3">
              <div className="h-full w-1/3 bg-primary-400 rounded-full" />
            </div>
            <div className="flex items-center justify-between text-white/70 text-xs">
              <span>4:47 / {video.duration}</span>
              <div className="flex items-center gap-3">
                <span>⚙️</span>
                <span>⛶</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm">✕</button>
        </div>
        <div className="p-5">
          <span className="badge bg-primary-50 text-primary-600 text-xs mb-2">{video.category}</span>
          <h2 className="font-display font-bold text-gray-900 text-lg mb-1">{video.title}</h2>
          <p className="text-xs text-gray-500 mb-3">{video.instructor} · {video.views} views · {video.duration}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{video.desc}</p>
        </div>
      </div>
    </div>
  )
}

export default function Videos() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [playing,  setPlaying]  = useState(null)

  const filtered = VIDEOS.filter(v => {
    const matchCat = category === 'All' || v.category === category
    const matchQ   = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.instructor.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchQ
  })

  // Only show categories that have videos
  const usedCats = ['All', ...new Set(VIDEOS.map(v => v.category))]
  const catList  = CATEGORIES.filter(c => usedCats.includes(c.name))

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-primary-900 to-primary-700 text-white">
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-200 mb-3">🎥 Video Library</span>
          <h1 className="font-display text-4xl font-bold mb-3">Learn by watching</h1>
          <p className="text-primary-100 text-sm max-w-md mb-6">Short, focused video lessons from expert instructors. Watch at your own pace.</p>
          <div className="relative max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <input type="text" placeholder="Search videos or instructors..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm transition-all" />
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {catList.map(cat => (
            <button key={cat.name} onClick={() => setCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat.name ? 'bg-primary-500 text-white shadow-purple' : `${cat.color} border border-current/10 hover:scale-105`
              }`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-6"><span className="font-semibold text-gray-900">{filtered.length}</span> videos</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(v => <VideoCard key={v.id} video={v} onPlay={setPlaying} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🎬</p>
              <p className="font-semibold">No videos found</p>
            </div>
          )}
        </div>
      </div>

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  )
}
