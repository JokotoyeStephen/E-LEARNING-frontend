import { useEffect, useState } from 'react'
import { courseService } from '../../services/courseService'

function Stars({ value, onChange, size = 'text-base' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`${size} ${onChange ? 'cursor-pointer' : 'cursor-default'} ${n <= value ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewsSection({ courseId, enrolled }) {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [myRating,  setMyRating]  = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting,setSubmitting]= useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    courseService.getReviews(courseId)
      .then(setData)
      .catch(() => setError('Could not load reviews.'))
      .finally(() => setLoading(false))
  }, [courseId])

  const handleSubmit = async () => {
    if (!myRating) return
    setSubmitting(true)
    setError('')
    try {
      await courseService.submitReview(courseId, myRating, myComment)
      const refreshed = await courseService.getReviews(courseId)
      setData(refreshed)
      setMyRating(0)
      setMyComment('')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not submit your review.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">Reviews</h2>
        {data?.avgRating != null && (
          <div className="flex items-center gap-1.5 text-sm">
            <Stars value={Math.round(data.avgRating)} />
            <span className="font-semibold text-gray-900">{data.avgRating}</span>
            <span className="text-gray-400">({data.totalReviews})</span>
          </div>
        )}
      </div>

      {enrolled && (
        <div className="bg-surface-50 rounded-xl border border-gray-100 p-4 mb-5">
          <p className="text-xs font-semibold text-gray-700 mb-2">Leave a review</p>
          <Stars value={myRating} onChange={setMyRating} size="text-xl" />
          <textarea
            value={myComment}
            onChange={e => setMyComment(e.target.value)}
            placeholder="What did you think of this course? (optional)"
            rows={2}
            maxLength={1000}
            className="w-full mt-3 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!myRating || submitting}
            className="mt-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </div>
      )}

      {data?.reviews?.length > 0 ? (
        <div className="space-y-4">
          {data.reviews.map(r => (
            <div key={r._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-900">{r.studentName}</p>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No reviews yet — be the first to share your thoughts.</p>
      )}
    </section>
  )
}
