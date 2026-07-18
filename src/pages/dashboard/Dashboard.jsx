import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { courseService } from '../../services/courseService'
import CourseList from '../../components/course/CourseList'

const DIFF_COLORS = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}

const PLATFORM_STATS = [
  { icon: '🎓', value: '13K',  label: 'Courses Offered' },
  { icon: '👨‍🏫', value: '30K',  label: 'Instructors' },
  { icon: '✅', value: '9K',   label: 'Certified Courses' },
  { icon: '👥', value: '3.5M', label: 'Students Enrolled' },
]

const TESTIMONIALS = [
  {
    quote: "Learnly completely transformed my career trajectory. The courses are engaging, the instructors are highly skilled, and I now feel confident applying my skills in real-world projects.",
    name: 'Jessica Turner', role: 'UI/UX Designer', rating: 5,
  },
  {
    quote: "The adaptive quizzes are unlike anything I've seen. They actually adjust to my pace and push me just enough. I passed my certification exam on the first try!",
    name: 'Marcus Chen', role: 'Data Analyst', rating: 5,
  },
  {
    quote: "The courses are well-organized and easy to follow. Complex topics get broken down into simple, actionable steps that genuinely boosted my confidence.",
    name: 'Olivia Brown', role: 'Frontend Developer', rating: 5,
  },
]

const FAQS = [
  { q: 'What is Learnly?', a: 'Learnly is an adaptive learning platform that uses AI-powered quizzes to personalise your learning path, helping you master topics at your own pace with real-time feedback.' },
  { q: 'How can I communicate with my instructor?', a: 'Once enrolled in a course, you can send messages directly to your instructor via the course discussion forum or the in-app messaging feature.' },
  { q: 'Are there interactive features for students?', a: 'Yes! Learnly offers adaptive quizzes, mastery tracking, a personal roadmap, video lectures, and a dedicated learn space for focused study.' },
  { q: 'How can I pay for courses?', a: 'We accept all major credit cards, PayPal, and various regional payment methods. Many courses are also available for free.' },
  { q: 'What is the typical duration of courses?', a: 'Course durations vary from 1 hour to several weeks. Each course lists its estimated duration so you can plan accordingly.' },
]

const BLOG_POSTS = [
  { date: '20 Dec 2025', comments: 8,  title: '5 Strategies to Boost Your Online Learning Efficiency', featured: false },
  { date: '15 Dec 2025', comments: 12, title: 'Top Trends in Education Technology for 2026', featured: true  },
  { date: '10 Dec 2025', comments: 5,  title: 'How to Balance Work, Life, and Online Education Successfully', featured: false },
]

const FEATURES = [
  { icon: '⏰', title: 'Flexible Study Hours',    desc: 'Flexible scheduling empowers students to learn at their own pace and convenience.' },
  { icon: '🎓', title: 'Qualified Instructors',   desc: 'Every instructor is certified and holds advanced degrees, guided by true professionals.' },
  { icon: '💼', title: 'Advance Your Career',     desc: 'Build confidence for job interviews through realistic practice sessions and detailed feedback.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-xl border transition-all ${open ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-100'}`}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setOpen(v => !v)}>
        <span className={`text-sm font-semibold ${open ? 'text-white' : 'text-gray-900'}`}>{q}</span>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${open ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
          {open ? '×' : '+'}
        </span>
      </button>
      {open && <p className="px-5 pb-4 text-sm text-primary-100 leading-relaxed">{a}</p>}
    </div>
  )
}

function StarRating({ n = 5 }) {
  return <div className="flex gap-0.5">{Array.from({length:n}).map((_,i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
}

export default function Dashboard() {
  const { user } = useAuth()
  const [enrolled, setEnrolled] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tIdx,     setTIdx]     = useState(0)

  useEffect(() => {
    courseService.getEnrolled()
      .then(setEnrolled)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const completed  = enrolled.filter(c => c.completed).length
  const inProgress = enrolled.filter(c => !c.completed && c.quizAttempts > 0).length
  const avgMastery = enrolled.length
    ? Math.round(enrolled.reduce((sum, c) => sum + (c.competenceScore ?? 0.5), 0) / enrolled.length * 100) : 0

  const activeCourses = enrolled.filter(c => !c.completed)

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-primary-200 text-sm font-medium mb-1">Welcome back 👋</p>
              <h1 className="font-display text-3xl font-bold">{user?.name?.split(' ')[0]}</h1>
              <p className="text-primary-200 text-sm mt-1">Your learning journey starts here.</p>
            </div>
            <Link to="/courses"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              Browse All Courses →
            </Link>
          </div>
        </div>
      </div>

      <div className="page-container -mt-4 space-y-16">
        {/* My stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-stagger">
          {[
            { icon: '📚', value: enrolled.length, label: 'Enrolled' },
            { icon: '✅', value: completed,        label: 'Completed' },
            { icon: '🔄', value: inProgress,       label: 'In Progress' },
            { icon: '🧠', value: `${avgMastery}%`, label: 'Avg Mastery' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="card p-5 relative overflow-hidden">
              <p className="text-2xl mb-2">{icon}</p>
              <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Continue learning */}
        {activeCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-gray-900">Continue learning</h2>
              <span className="text-xs text-gray-400">{activeCourses.length} active</span>
            </div>
            <div className="space-y-3">
              {activeCourses.map(course => (
                <div key={course._id} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl shrink-0">📖</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{course.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                          style={{ width: `${Math.round((course.competenceScore ?? 0.5) * 100)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-primary-600 shrink-0">
                        {Math.round((course.competenceScore ?? 0.5) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{course.quizAttempts ?? 0} attempts</span>
                      {course.currentDifficulty && <span className={`badge text-xs ${DIFF_COLORS[course.currentDifficulty]}`}>{course.currentDifficulty}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/quiz/${course._id}/progress`} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">Progress</Link>
                    {course.topics?.length > 0 && course.topics.every(t => course.completedTopics?.includes(t.name)) ? (
                      <Link to={`/quiz/${course._id}`} className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors font-semibold shadow-sm">Take Quiz →</Link>
                    ) : (
                      <Link to={`/courses/${course._id}/learn`} className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors font-semibold shadow-sm">Continue →</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My courses */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-gray-900">My courses</h2>
            <Link to="/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Browse more →</Link>
          </div>
          <CourseList courses={enrolled} loading={loading} emptyMessage="You haven't enrolled in any courses yet." />
        </div>

        {/* Why choose us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✦</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">A Fresh Approach</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              Enhancing <span className="text-primary-500">Your Skills</span>
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm">
              Possessing a strong education is among the most important advantages a person can hold. It profoundly impacts personal and professional development.
            </p>
            <div className="space-y-5 mb-7">
              {FEATURES.map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-xl shrink-0">{f.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/courses" className="btn-primary text-sm">Know More →</Link>
          </div>
          {/* Platform stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {PLATFORM_STATS.map(s => (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-xl shrink-0 shadow-purple">{s.icon}</div>
                <div>
                  <p className="font-display text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">👑</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">What</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Learners Saying About <span className="text-primary-500">Learnly</span>
            </h2>
          </div>

          <div className="card p-6 mb-4">
            <StarRating n={TESTIMONIALS[tIdx].rating} />
            <p className="text-sm text-gray-700 leading-relaxed mt-3 mb-5 italic">"{TESTIMONIALS[tIdx].quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                {TESTIMONIALS[tIdx].name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{TESTIMONIALS[tIdx].name}</p>
                <p className="text-xs text-gray-400">{TESTIMONIALS[tIdx].role}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => setTIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all">
                ←
              </button>
              <button onClick={() => setTIdx(i => (i + 1) % TESTIMONIALS.length)}
                className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all">
                →
              </button>
            </div>
            <p className="text-xs text-gray-400">Trusted by <span className="font-bold text-primary-600">120K+</span> learners worldwide</p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Frequently <span className="text-primary-500">Asked</span> Questions
            </h2>
          </div>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
          </div>
        </div>

        {/* Blog */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-gray-900">
              Post Most <span className="text-primary-500">Liked Content</span>
            </h2>
            <Link to="/courses" className="btn-primary text-xs py-2">View All Courses</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLOG_POSTS.slice(0, 2).map(post => (
              <div key={post.title} className="card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-5xl">📖</div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">📅 {post.date}</span>
                    <span className="flex items-center gap-1">💬 Comments ({post.comments})</span>
                  </div>
                  <h3 className={`font-display text-sm font-semibold leading-snug mb-3 ${post.featured ? 'text-primary-600' : 'text-gray-900'}`}>{post.title}</h3>
                  <button className="btn-primary text-xs py-1.5">Read More →</button>
                </div>
              </div>
            ))}
          </div>
          {/* Third post - centered */}
          <div className="mt-4 card overflow-hidden hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-36 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-4xl shrink-0">🎓</div>
              <div className="p-4 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <span>📅 {BLOG_POSTS[2].date}</span>
                  <span>💬 Comments ({BLOG_POSTS[2].comments})</span>
                </div>
                <h3 className="font-display text-sm font-semibold text-gray-900 mb-3">{BLOG_POSTS[2].title}</h3>
                <button className="btn-primary text-xs py-1.5 self-start">Read More →</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
