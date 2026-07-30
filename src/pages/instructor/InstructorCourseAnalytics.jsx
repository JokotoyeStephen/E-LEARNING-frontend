import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { instructorService } from '../../services/instructorService'
import { courseService } from '../../services/courseService'
import Loader from '../../components/ui/Loader'
import { triggerBlobDownload } from '../../utils/download'

const DIFF_COLORS = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}

function Stat({ icon, value, label }) {
  return (
    <div className="card p-5">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5 font-medium">{label}</p>
    </div>
  )
}

function AnswerBox({ courseId, question, onAnswered }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await courseService.answerQuestion(courseId, question._id, text.trim())
      onAnswered()
    } catch {
      /* surfaced via the disabled state resetting — keep it simple */
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-start gap-2 mt-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
      />
      <button
        onClick={submit}
        disabled={!text.trim() || submitting}
        className="text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 px-3 py-2 rounded-lg transition-colors shrink-0"
      >
        {submitting ? '...' : 'Reply'}
      </button>
    </div>
  )
}

export default function InstructorCourseAnalytics() {
  const { id } = useParams()
  const [data,    setData]    = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => instructorService.getCourseAnalytics(id).then(setData)

  useEffect(() => {
    load().catch(err => setError(err.response?.data?.message ?? 'Could not load analytics.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (error) return (
    <div className="page-container text-center py-20">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-gray-500">{error}</p>
      <Link to="/dashboard" className="mt-4 inline-block text-sm text-primary-600 hover:underline">← Back to dashboard</Link>
    </div>
  )

  const { courseTitle, price, totalEnrollments, completedCount, completionRate, earnings,
          quizStats, avgRating, totalReviews, reviews, questions, unansweredCount, enrollments } = data

  const exportStudentsCsv = () => {
    const header = ['Name', 'Email', 'Enrolled At', 'Completed', 'Completed At', 'Mastery %', 'Quiz Attempts', 'Current Difficulty']
    const rows = enrollments.map(e => [
      e.name, e.email,
      new Date(e.enrolledAt).toISOString().slice(0, 10),
      e.completed ? 'Yes' : 'No',
      e.completedAt ? new Date(e.completedAt).toISOString().slice(0, 10) : '',
      e.competenceScore, e.quizAttempts, e.currentDifficulty,
    ])
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const safeName = courseTitle.replace(/[^a-z0-9\- ]/gi, '').trim().replace(/\s+/g, '-')
    triggerBlobDownload(blob, `${safeName}-students.csv`)
  }

  return (
    <div className="page-container max-w-6xl">
      <Link to="/dashboard" className="text-sm text-primary-600 hover:underline">← Back to dashboard</Link>
      <div className="flex items-center justify-between flex-wrap gap-3 mt-2 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">{courseTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Course analytics — {price === 0 ? 'Free course' : `$${price} per enrollment`}</p>
        </div>
        <Link to={`/courses/${id}`} className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
          View public page
        </Link>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <Stat icon="👥" value={totalEnrollments} label="Enrolled" />
        <Stat icon="🎓" value={completedCount}   label="Completed" />
        <Stat icon="🎯" value={`${completionRate}%`} label="Completion Rate" />
        <Stat icon="💰" value={`$${earnings.toLocaleString()}`} label="Earnings" />
        <Stat icon="⭐" value={avgRating ?? '—'} label={`Rating${totalReviews ? ` (${totalReviews})` : ''}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Quiz statistics */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Quiz statistics</h2>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center bg-surface-50 rounded-xl p-3">
              <p className="font-display text-xl font-bold text-gray-900">{quizStats.totalAttempts}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">Attempts</p>
            </div>
            <div className="text-center bg-surface-50 rounded-xl p-3">
              <p className="font-display text-xl font-bold text-gray-900">{quizStats.avgScore}%</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">Avg Score</p>
            </div>
            <div className="text-center bg-surface-50 rounded-xl p-3">
              <p className="font-display text-xl font-bold text-gray-900">{quizStats.passRate}%</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">Pass Rate</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 mb-2">By difficulty</p>
          <div className="space-y-2">
            {quizStats.byDifficulty.map(d => (
              <div key={d.difficulty} className="flex items-center justify-between text-xs">
                <span className={`badge ${DIFF_COLORS[d.difficulty]}`}>{d.difficulty}</span>
                <span className="text-gray-500">{d.attempts} attempt{d.attempts !== 1 ? 's' : ''}</span>
                <span className="text-gray-500">{d.avgScore}% avg</span>
                <span className="text-gray-500">{d.passRate}% pass</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50">
            Final quiz: {quizStats.finalQuizAttempts} attempt{quizStats.finalQuizAttempts !== 1 ? 's' : ''}, {quizStats.finalQuizPassRate}% pass rate
          </p>
        </section>

        {/* Enrollment list */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Students ({totalEnrollments})</h2>
            {enrollments.length > 0 && (
              <button onClick={exportStudentsCsv}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 px-3 py-1.5 rounded-lg transition-all hover:bg-primary-50">
                ⬇ Export CSV
              </button>
            )}
          </div>
          {enrollments.length === 0 ? (
            <p className="text-sm text-gray-400">No one has enrolled yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {enrollments.map(e => (
                <div key={e.studentId} className="flex items-center justify-between gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{e.name}</p>
                    <p className="text-xs text-gray-400 truncate">{e.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {e.completed
                      ? <span className="badge bg-green-100 text-green-700 text-xs">🎓 Completed</span>
                      : <span className="badge bg-gray-100 text-gray-500 text-xs">{e.competenceScore}% mastery</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Reviews {totalReviews > 0 && `(${totalReviews})`}</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {reviews.map(r => (
                <div key={r._id} className="border-b border-gray-50 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900">{r.studentName}</p>
                    <span className="text-amber-500 text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Questions */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Student questions</h2>
            {unansweredCount > 0 && (
              <span className="badge bg-amber-100 text-amber-700 text-xs">{unansweredCount} unanswered</span>
            )}
          </div>
          {questions.length === 0 ? (
            <p className="text-sm text-gray-400">No questions yet.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {questions.map(q => (
                <div key={q._id} className="border-b border-gray-50 pb-3 last:border-0">
                  <p className="text-xs text-gray-400 mb-1">{q.studentName}</p>
                  <p className="text-sm text-gray-800">{q.text}</p>
                  {q.answer ? (
                    <p className="text-xs text-green-700 bg-green-50 rounded-lg px-2.5 py-1.5 mt-2">{q.answer}</p>
                  ) : (
                    <AnswerBox courseId={id} question={q} onAnswered={load} />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
