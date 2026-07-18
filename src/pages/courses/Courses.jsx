import { useEffect, useState } from 'react'
import { courseService } from '../../services/courseService'
import CourseList from '../../components/course/CourseList'
import { CATEGORIES } from '../../data/categories'
import Card from '../../components/ui/Card'

const SORT_OPTIONS = [
  { value: '',           label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
]

/* ---------- Signature icon set (hand-drawn, matches the app's existing
   inline-SVG style rather than pulling in a new icon dependency) ---------- */
const IconBook = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11a1 1 0 0 1 1 1v15a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 1 4 17.5v-12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13a1 1 0 0 0-1 1v15a1 1 0 0 1 1-1h5.5a1.5 1.5 0 0 0 1.5-1.5v-12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3.5 19c0-3.4 2.9-5.5 5.5-5.5s5.5 2.1 5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.5 5.3c1.4.3 2.5 1.6 2.5 3.1s-1.1 2.8-2.5 3.1M18 13.7c2 .5 3.5 2.3 3.5 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconAward = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="8.5" r="5.2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12.8 8 21l4-2.2L16 21l-1-8.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const IconCap = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 4 2 8.6 12 13.2l10-4.6L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M6 10.8v4.4c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M21 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconSpark = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 3.5c.5 3 2 4.5 5 5-3 .5-4.5 2-5 5-.5-3-2-4.5-5-5 3-.5 4.5-2 5-5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M18.5 15c.3 1.5 1 2.2 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.3 2.2-1 2.5-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
)
const IconTrend = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M3 17 9.5 10.5 13.5 14.5 21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconClock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconQuote = (p) => (
  <svg viewBox="0 0 32 24" fill="currentColor" {...p}>
    <path d="M0 24V14.6C0 6.5 4.9 1.3 12.7 0l1.6 3.9C9.2 5.3 6.6 8.3 6.3 12.4H13V24H0Zm18 0V14.6C18 6.5 22.9 1.3 30.7 0l1.6 3.9c-5.1 1.4-7.7 4.4-8 8.5H31V24H18Z"/>
  </svg>
)
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const IconSearch = (p) => (
  <svg viewBox="0 0 16 16" fill="none" {...p}>
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const STATS = [
  { Icon: IconBook,  value: '13K+',  label: 'Courses Offered' },
  { Icon: IconUsers, value: '30K+',  label: 'Instructors' },
  { Icon: IconAward, value: '9K+',   label: 'Certified Courses' },
  { Icon: IconCap,   value: '3.5M+', label: 'Students Enrolled' },
]

const WHY_CHOOSE_US = [
  { Icon: IconSpark, title: 'Adaptive AI Quizzes',   desc: 'Quizzes that adjust to your skill level after every attempt, so you\'re always challenged at the right difficulty.' },
  { Icon: IconTrend, title: 'Real Progress Tracking', desc: 'See mastery scores per topic, score trends over time, and exactly where to focus next.' },
  { Icon: IconClock, title: 'Learn At Your Own Pace', desc: 'Lifetime access to every course you enroll in — pick up right where you left off, any time.' },
]

const TESTIMONIALS = [
  { quote: 'The adaptive quizzes actually felt like they were paying attention to what I was struggling with. Big difference from a static course.', name: 'Amara Chen', role: 'Data Analyst' },
  { quote: 'I liked having a checkpoint quiz partway through instead of one giant test at the end — kept me honest the whole way.', name: 'Daniel Osei', role: 'Frontend Developer' },
  { quote: 'Clean platform, easy to find courses in my field, and the progress dashboard keeps me motivated to finish what I start.', name: 'Priya Nair', role: 'Product Manager' },
]

const FAQS = [
  { q: 'How do the adaptive quizzes work?', a: 'After each quiz attempt, the platform adjusts the difficulty of your next quiz based on your score and per-topic mastery, so you\'re always working at the right level.' },
  { q: 'Do I need to finish a course to take a quiz?', a: 'You\'ll unlock a mid-course checkpoint quiz once you finish the first half of the topics, and the final quiz once every topic is complete.' },
  { q: 'Is there a time limit on course access?', a: 'No — once you enroll, you have lifetime access to the course content and can learn at your own pace.' },
  { q: 'Can I retake a quiz if I don\'t pass?', a: 'Yes, you can retake any quiz as many times as you need. Your progress and mastery scores update after every attempt.' },
]

// Decorative marquee content — a scrolling strip of subjects, purely a mood-setter.
const TICKER_TAGS = ['Data Science', 'UI/UX Design', 'Web Development', 'AI & Machine Learning', 'Cybersecurity', 'Business Strategy', 'Digital Marketing', 'Cloud Computing']

export default function Courses() {
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [sort,     setSort]     = useState('')
  const [showAll,  setShowAll]  = useState(false)
  const [openFaq,  setOpenFaq]  = useState(0)

  useEffect(() => {
    setLoading(true)
    courseService.getAll({ category: category === 'All' ? undefined : category, search: search || undefined })
      .then(data => {
        let sorted = [...data]
        if (sort === 'price-asc')  sorted.sort((a, b) => a.price - b.price)
        if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
        if (sort === 'rating')     sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        setCourses(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, search, sort])

  const visibleCats = showAll ? CATEGORIES : CATEGORIES.slice(0, 10)

  return (
    <div>
      {/* ============ Hero ============ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-primary-900 to-primary-600 text-white">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        {/* Dot-grid motif */}
        <svg className="absolute top-10 right-10 w-28 h-28 text-white/10 hidden sm:block" viewBox="0 0 100 100">
          {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={c * 18 + 6} cy={r * 18 + 6} r="1.6" fill="currentColor" />
          )))}
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pb-28">
          <p className="text-xs text-primary-300 mb-4 font-medium tracking-wide">Home / <span className="text-white">Explore</span></p>
          <span className="section-label bg-white/10 text-primary-100 backdrop-blur-sm">✦ Adaptive Learning</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 leading-[1.1] max-w-xl">
            Find the course that meets you where you are
          </h1>
          <p className="text-primary-100/80 mb-8 text-sm sm:text-base leading-relaxed max-w-md">
            {courses.length > 0 ? `${courses.length}+ courses` : 'Thousands of courses'} across 30+ categories, each with quizzes that adapt to your level as you go.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <IconSearch className="w-4 h-4" />
            </span>
            <input type="text" placeholder="Search courses or instructors..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-sm bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all" />
          </div>
        </div>
      </div>

      {/* Floating stat panel — bridges the hero and the page body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-14 mb-6 bg-white rounded-2xl shadow-card border border-gray-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          {STATS.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-5">
              <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending-subjects marquee — signature scrolling motif */}
      <div className="border-y border-gray-100 bg-white/60 py-3 overflow-hidden">
        <div className="flex w-max animate-ticker">
          {[...TICKER_TAGS, ...TICKER_TAGS].map((tag, i) => (
            <span key={i} className="flex items-center text-xs font-semibold text-gray-400 px-6 whitespace-nowrap">
              {tag}
              <span className="ml-6 text-primary-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="page-container">
        {/* Category pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Browse by category</h2>
            <button onClick={() => setShowAll(v => !v)} className="text-xs text-primary-600 font-semibold hover:text-primary-700">
              {showAll ? 'Show less ↑' : `All ${CATEGORIES.length} categories →`}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleCats.map(cat => (
              <button key={cat.name} onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  category === cat.name
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-purple'
                    : `${cat.color} border border-current/10 hover:shadow-sm hover:scale-105`
                }`}>
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
          {category !== 'All' && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Filtering:</span>
              <span className="badge bg-primary-100 text-primary-700">{category}</span>
              <button onClick={() => setCategory('All')} className="text-xs text-gray-400 hover:text-gray-600">✕ Clear</button>
            </div>
          )}
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {!loading && <><span className="font-semibold text-gray-900">{courses.length}</span> results{search && <> for "<span className="font-semibold">{search}</span>"</>}</>}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort by:</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <CourseList courses={courses} loading={loading}
          emptyMessage={`No courses${search ? ` for "${search}"` : ''}${category !== 'All' ? ` in ${category}` : ''}.`} />

        {/* ============ Why choose us ============ */}
        <div className="mt-20">
          <div className="text-center max-w-md mx-auto mb-9">
            <span className="section-label">Why Learnly</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Built to help you actually retain what you study
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-stagger">
            {WHY_CHOOSE_US.map(({ Icon, title, desc }) => (
              <Card key={title} hover className="p-6">
                <span className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ============ Testimonials ============ */}
        <div className="mt-20">
          <div className="text-center max-w-md mx-auto mb-9">
            <span className="section-label">Learner Stories</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              What learners are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-stagger">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="p-6 flex flex-col relative overflow-hidden">
                <IconQuote className="w-8 h-6 text-primary-100 absolute top-5 right-5" />
                <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1 relative">{t.quote}</p>
                <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-gray-100">
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ============ FAQ ============ */}
        <div className="mt-20 mb-8 max-w-2xl mx-auto">
          <div className="text-center mb-9">
            <span className="section-label">Questions</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-2.5">
            {FAQS.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={f.q} className={`border rounded-2xl overflow-hidden bg-white transition-colors ${open ? 'border-primary-200' : 'border-gray-100'}`}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between text-left px-5 py-4"
                  >
                    <span className={`text-sm font-semibold ${open ? 'text-primary-700' : 'text-gray-800'}`}>{f.q}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 transition-all ${open ? 'bg-primary-500 text-white rotate-45' : 'bg-gray-100 text-gray-400'}`}>
                      <IconPlus className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  {open && (
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
