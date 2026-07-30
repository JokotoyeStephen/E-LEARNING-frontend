import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { courseService } from '../../services/courseService'
import { instructorService } from '../../services/instructorService'
import { CATEGORIES as ALL_CATEGORIES } from '../../data/categories'
import { getYouTubeId } from '../../utils/youtube'

const LEVELS    = ['Beginner', 'Intermediate', 'Advanced']
const TAGS      = ['', 'Bestseller', 'Popular', 'New']
const CATEGORIES = ALL_CATEGORIES.filter(c => c.name !== 'All').map(c => c.name)

const EMPTY_FORM = {
  title: '', description: '', category: 'Data Science', level: 'Beginner',
  price: 0, duration: '', organization: '', thumbnail: '', tag: '',
  syllabus: [''], topics: [{ name: '', description: '', order: 0, lesson: { videoUrl: '' } }],
}

function StatCard({ icon, value, label, sub, color }) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 ${color}`} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color.replace('bg-gradient-to-br','bg-gradient-to-br')} bg-opacity-10`}
        style={{background: 'none'}}>
        <span>{icon}</span>
      </div>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function CourseRow({ course, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false)
  const doDelete = async () => {
    if (!confirm(`Delete "${course.title}"?`)) return
    setDeleting(true)
    try { await courseService.deleteCourse(course._id); onDelete(course._id) }
    catch { alert('Delete failed') }
    finally { setDeleting(false) }
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors group">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0 overflow-hidden">
        {course.thumbnail
          ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
          : <span className="text-2xl">📚</span>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 text-sm truncate">{course.title}</p>
          {course.tag && (
            <span className="badge bg-amber-100 text-amber-700 text-xs">{course.tag}</span>
          )}
          {!course.isPublished && (
            <span className="badge bg-gray-100 text-gray-500 text-xs">Draft</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-gray-400">{course.category}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{course.level}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs font-semibold text-primary-600">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onEdit(course)}
          className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Edit
        </button>
        <Link to={`/instructor/courses/${course._id}`}
          className="text-xs border border-primary-200 text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors font-medium">
          Analytics
        </Link>
        <Link to={`/courses/${course._id}`}
          className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Preview
        </Link>
        <button onClick={doDelete} disabled={deleting}
          className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50">
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

function CourseModal({ editingCourse, onClose, onCreate, onUpdate }) {
  const { user } = useAuth()
  const isEdit = !!editingCourse
  const [form,    setForm]    = useState(() =>
    isEdit
      ? {
          ...EMPTY_FORM,
          ...editingCourse,
          syllabus: editingCourse.syllabus?.length ? editingCourse.syllabus : [''],
          topics:   editingCourse.topics?.length
            ? editingCourse.topics.map(t => ({ ...t, lesson: { videoUrl: t.lesson?.videoUrl || '' } }))
            : [{ name: '', description: '', order: 0, lesson: { videoUrl: '' } }],
        }
      : { ...EMPTY_FORM, instructor: user?.name || '' }
  )
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [step,    setStep]    = useState(1)  // 1=basics, 2=details

  const set    = k => v => setForm(f => ({ ...f, [k]: v }))
  const setEvt = k => e => set(k)(e.target.value)

  const setSyllabusItem = (i, v) => setForm(f => {
    const s = [...f.syllabus]; s[i] = v; return { ...f, syllabus: s }
  })
  const addSyllabus = () => setForm(f => ({ ...f, syllabus: [...f.syllabus, ''] }))
  const removeSyllabus = i => setForm(f => ({ ...f, syllabus: f.syllabus.filter((_, j) => j !== i) }))

  const setTopicItem = (i, k, v) => setForm(f => {
    const t = [...f.topics]; t[i] = { ...t[i], [k]: v }; return { ...f, topics: t }
  })
  const setTopicVideo = (i, v) => setForm(f => {
    const t = [...f.topics]; t[i] = { ...t[i], lesson: { ...t[i].lesson, videoUrl: v } }; return { ...f, topics: t }
  })
  const addTopic    = () => setForm(f => ({ ...f, topics: [...f.topics, { name: '', description: '', order: f.topics.length, lesson: { videoUrl: '' } }] }))
  const removeTopic = i  => setForm(f => ({ ...f, topics: f.topics.filter((_, j) => j !== i) }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        price:    Number(form.price),
        syllabus: form.syllabus.filter(Boolean),
        topics:   form.topics.filter(t => t.name).map((t, i) => ({
          ...t,
          order: i,
          lesson: t.lesson?.videoUrl ? { videoUrl: t.lesson.videoUrl } : undefined,
        })),
        tag:      form.tag || undefined,
      }
      if (isEdit) {
        const updated = await courseService.updateCourse(editingCourse._id, payload)
        onUpdate(updated)
      } else {
        const created = await courseService.createCourse(payload)
        onCreate(created)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message ?? `Failed to ${isEdit ? 'update' : 'create'} course.`)
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">{isEdit ? 'Edit Course' : 'Create New Course'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Step {step} of 2 — {step === 1 ? 'Basic info' : 'Syllabus & topics'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary-500' : 'bg-gray-100'}`} />
          ))}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
          )}

          {step === 1 && (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title <span className="text-red-400">*</span></label>
                <input required value={form.title} onChange={setEvt('title')} placeholder="e.g. Introduction to Machine Learning"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all hover:border-gray-300" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
                <textarea required value={form.description} onChange={setEvt('description')} rows={3}
                  placeholder="What will students learn in this course?"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all hover:border-gray-300 resize-none" />
              </div>

              {/* Category + Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select value={form.category} onChange={setEvt('category')}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white transition-all">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                  <select value={form.level} onChange={setEvt('level')}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white transition-all">
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input type="number" min={0} value={form.price} onChange={setEvt('price')}
                      className="w-full pl-7 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                  <input value={form.duration} onChange={setEvt('duration')} placeholder="e.g. 6 weeks"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all hover:border-gray-300" />
                </div>
              </div>

              {/* Thumbnail + Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
                  <input value={form.thumbnail} onChange={setEvt('thumbnail')} placeholder="https://..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all hover:border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge</label>
                  <select value={form.tag} onChange={setEvt('tag')}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white transition-all">
                    <option value="">None</option>
                    {TAGS.filter(Boolean).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization / Institution</label>
                <input value={form.organization} onChange={setEvt('organization')} placeholder="e.g. MIT, Google"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all hover:border-gray-300" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Syllabus */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">What students will learn</label>
                  <button type="button" onClick={addSyllabus}
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Add item
                  </button>
                </div>
                <div className="space-y-2">
                  {form.syllabus.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-6 h-9 flex items-center justify-center shrink-0">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      </div>
                      <input value={item} onChange={e => setSyllabusItem(i, e.target.value)}
                        placeholder={`Learning outcome ${i + 1}`}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      {form.syllabus.length > 1 && (
                        <button type="button" onClick={() => removeSyllabus(i)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Course Topics</label>
                  <button type="button" onClick={addTopic}
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Add topic
                  </button>
                </div>
                <div className="space-y-3">
                  {form.topics.map((topic, i) => (
                    <div key={i} className="p-4 bg-surface-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="badge bg-primary-100 text-primary-600 text-xs shrink-0">Topic {i + 1}</span>
                        {form.topics.length > 1 && (
                          <button type="button" onClick={() => removeTopic(i)}
                            className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                        )}
                      </div>
                      <input value={topic.name} onChange={e => setTopicItem(i, 'name', e.target.value)}
                        placeholder="Topic name"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      <input value={topic.description} onChange={e => setTopicItem(i, 'description', e.target.value)}
                        placeholder="Short description (optional)"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 shrink-0">🎬</span>
                        <input value={topic.lesson?.videoUrl || ''} onChange={e => setTopicVideo(i, e.target.value)}
                          placeholder="YouTube video URL (optional)"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      </div>
                      {topic.lesson?.videoUrl && !getYouTubeId(topic.lesson.videoUrl) && (
                        <p className="text-xs text-amber-600 pl-6">Doesn't look like a valid YouTube URL — double-check the link.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-surface-50">
          {step === 1
            ? <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">Cancel</button>
            : <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
          }
          {step === 1
            ? <button type="button" onClick={() => setStep(2)}
                className="btn-primary text-sm">
                Next: Curriculum
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            : <button type="submit" onClick={handleSubmit} disabled={loading}
                className="btn-primary text-sm disabled:opacity-60">
                {loading
                  ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>{isEdit ? 'Saving...' : 'Creating...'}</>
                  : <>{isEdit ? 'Save Changes ✦' : 'Publish Course ✦'}</>}
              </button>
          }
        </div>
      </div>
    </div>
  )
}

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses,  setCourses]  = useState([])
  const [overview, setOverview] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)

  const openCreate = () => { setEditingCourse(null); setShowModal(true) }
  const openEdit   = course => { setEditingCourse(course); setShowModal(true) }

  useEffect(() => {
    courseService.getMyCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false))
    instructorService.getOverview()
      .then(setOverview)
      .catch(console.error)
  }, [])

  const published     = courses.filter(c => c.isPublished).length

  return (
    <div>
      {/* Header banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-white/20 text-white text-xs font-bold tracking-wide">
                  ✦ Instructor
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold">
                Hey, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-orange-100 text-sm mt-1">Manage your courses and grow your audience.</p>
            </div>
            <button onClick={() => openCreate()}
              className="flex items-center gap-2 bg-white text-primary-700 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 active:scale-[0.98] transition-all shadow-lg text-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Course
            </button>
          </div>
        </div>
      </div>

      <div className="page-container -mt-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 animate-stagger">
          <StatCard icon="📚" value={courses.length}  label="Total Courses"  color="bg-gradient-to-br from-primary-400 to-primary-600" />
          <StatCard icon="✅" value={published}        label="Published"      color="bg-gradient-to-br from-green-400 to-emerald-500" />
          <StatCard icon="👥" value={overview?.totalStudents ?? '—'}   label="Total Students" color="bg-gradient-to-br from-amber-400 to-orange-500" />
          <StatCard icon="💰" value={overview ? `$${overview.totalEarnings.toLocaleString()}` : '—'} label="Earnings" color="bg-gradient-to-br from-emerald-400 to-teal-500" />
          <StatCard icon="🎯" value={overview ? `${overview.avgCompletionRate}%` : '—'} label="Completion Rate" color="bg-gradient-to-br from-blue-400 to-cyan-500" />
          <StatCard icon="⭐" value={overview?.avgRating ?? '—'} label="Avg Rating" sub={overview?.totalReviews ? `${overview.totalReviews} reviews` : undefined} color="bg-gradient-to-br from-violet-400 to-purple-500" />
        </div>

        {overview?.unansweredQuestions > 0 && (
          <div className="mb-8 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-xl">💬</span>
            <p className="text-sm text-amber-800">
              You have <span className="font-bold">{overview.unansweredQuestions}</span> unanswered student question{overview.unansweredQuestions !== 1 ? 's' : ''} across your courses.
            </p>
          </div>
        )}

        {/* Courses list */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="font-display font-bold text-gray-900">My Courses</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {courses.length === 0 ? 'No courses yet' : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button onClick={() => openCreate()}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 px-3.5 py-2 rounded-xl transition-all hover:bg-primary-50">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New Course
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-primary-100 border-t-primary-500 animate-spin" />
              <p className="text-sm text-gray-400">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-4">📖</div>
              <h3 className="font-display font-bold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-6">
                Create your first course and share your knowledge with learners worldwide.
              </p>
              <button onClick={() => openCreate()} className="btn-primary text-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Create your first course
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 px-2 py-2">
              {courses.map(course => (
                <CourseRow
                  key={course._id}
                  course={course}
                  onDelete={id => setCourses(cs => cs.filter(c => c._id !== id))}
                  onEdit={openEdit}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tips card */}
        {courses.length > 0 && (
          <div className="mt-6 card p-5 bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <h3 className="font-display font-bold text-gray-900 text-sm mb-3">💡 Tips to grow your courses</h3>
            <ul className="space-y-2">
              {[
                'Add a clear thumbnail image to increase click-through rates',
                'Break your content into bite-sized topics for better quiz generation',
                'Set competitive pricing — free courses attract more initial enrollments',
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-primary-400 shrink-0 mt-0.5">✦</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <CourseModal
          editingCourse={editingCourse}
          onClose={() => { setShowModal(false); setEditingCourse(null) }}
          onCreate={course => setCourses(cs => [course, ...cs])}
          onUpdate={updated => setCourses(cs => cs.map(c => c._id === updated._id ? updated : c))}
        />
      )}
    </div>
  )
}
