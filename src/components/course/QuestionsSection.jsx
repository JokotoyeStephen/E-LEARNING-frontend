import { useEffect, useState } from 'react'
import { courseService } from '../../services/courseService'

export default function QuestionsSection({ courseId, enrolled }) {
  const [questions,  setQuestions]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [draft,      setDraft]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const load = () => courseService.getQuestions(courseId).then(setQuestions).catch(() => setError('Could not load questions.'))

  useEffect(() => { load().finally(() => setLoading(false)) }, [courseId])

  const handleAsk = async () => {
    if (!draft.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await courseService.askQuestion(courseId, draft.trim())
      setDraft('')
      await load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not post your question.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <section className="card p-6">
      <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Student questions</h2>

      {enrolled && (
        <div className="bg-surface-50 rounded-xl border border-gray-100 p-4 mb-5">
          <p className="text-xs font-semibold text-gray-700 mb-2">Ask the instructor something</p>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="e.g. Does this course cover async/await in depth?"
            rows={2}
            maxLength={1000}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <button
            onClick={handleAsk}
            disabled={!draft.trim() || submitting}
            className="mt-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            {submitting ? 'Posting...' : 'Post question'}
          </button>
        </div>
      )}

      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map(q => (
            <div key={q._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-2">
                <span className="text-primary-500 text-sm font-bold shrink-0">Q</span>
                <div>
                  <p className="text-sm text-gray-800">{q.text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{q.studentName}</p>
                </div>
              </div>
              {q.answer ? (
                <div className="flex items-start gap-2 mt-2 ml-1">
                  <span className="text-green-600 text-sm font-bold shrink-0">A</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{q.answer}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2 ml-6 italic">Awaiting instructor reply...</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No questions yet — be the first to ask.</p>
      )}
    </section>
  )
}
