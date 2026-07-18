import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import CertificateCard from '../../components/certificate/CertificateCard'
import ReviewsSection from '../../components/course/ReviewsSection'
import QuestionsSection from '../../components/course/QuestionsSection'

const DIFF_COLORS = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}

export default function CourseDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [course,    setCourse]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled,  setEnrolled]  = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    courseService.getById(id)
      .then(data => { setCourse(data); setEnrolled(data.isEnrolled ?? false) })
      .catch(() => setError('Course not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await courseService.enroll(id)
      setEnrolled(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Enrollment failed.')
    } finally { setEnrolling(false) }
  }

  if (loading) return <Loader />
  if (error) return (
    <div className="page-container text-center py-20">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-gray-500">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary-600 hover:underline">Go back</button>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-primary-900 to-primary-700 text-white">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {course.tag && (
            <span className="badge bg-accent-500 text-white mb-4 inline-block">{course.tag}</span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3 leading-tight max-w-2xl">
            {course.title}
          </h1>
          {course.instructor && (
            <p className="text-primary-200 text-sm mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                {course.instructor.charAt(0)}
              </span>
              {course.instructor}{course.organization ? ` · ${course.organization}` : ''}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
            {course.rating && (
              <span className="flex items-center gap-1">
                <span className="text-amber-400">★</span>
                <span className="font-semibold text-white">{course.rating}</span>
                <span>({course.reviewCount?.toLocaleString()} reviews)</span>
              </span>
            )}
            {course.level    && <span className="flex items-center gap-1">📊 {course.level}</span>}
            {course.duration && <span className="flex items-center gap-1">🕒 {course.duration}</span>}
          </div>
          {enrolled && course.currentDifficulty && (
            <div className="mt-5 flex items-center gap-3">
              <span className={`badge ${DIFF_COLORS[course.currentDifficulty]} border border-current/20`}>
                Current level: {course.currentDifficulty}
              </span>
              {course.competenceScore != null && (
                <span className="text-xs text-primary-200">
                  Mastery: <span className="font-semibold text-white">{Math.round(course.competenceScore * 100)}%</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {course.description && (
              <section className="card p-6">
                <h2 className="font-display text-lg font-bold text-gray-900 mb-3">About this course</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
              </section>
            )}

            {course.syllabus?.length > 0 && (
              <section className="card p-6">
                <h2 className="font-display text-lg font-bold text-gray-900 mb-4">What you'll learn</h2>
                <ul className="space-y-2.5">
                  {course.syllabus.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.topics?.length > 0 && (
              <section className="card p-6">
                <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Topics covered</h2>
                <div className="space-y-2">
                  {course.topics.sort((a,b) => a.order - b.order).map(topic => {
                    const mastery = course.topicMastery?.[topic.name]
                    return (
                      <div key={topic.name} className="flex items-center justify-between p-3.5 bg-surface-50 rounded-xl border border-gray-100 hover:border-primary-100 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{topic.name}</p>
                          {topic.prerequisites?.length > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">Requires: {topic.prerequisites.join(', ')}</p>
                          )}
                        </div>
                        {mastery !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                                style={{ width: `${Math.round(mastery * 100)}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-primary-600">{Math.round(mastery * 100)}%</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            <ReviewsSection courseId={id} enrolled={enrolled} />
            <QuestionsSection courseId={id} enrolled={enrolled} />
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 card p-6 space-y-5">
              <div>
                <p className="font-display text-3xl font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </p>
                {course.price > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">One-time payment · Lifetime access</p>
                )}
              </div>

              {enrolled ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 px-3 py-2 rounded-xl">
                    <span>✓</span> You're enrolled
                  </div>
                  <Button className="w-full" onClick={() => navigate(`/courses/${id}/learn`)}>
                    {course.completedTopics?.length ? 'Continue learning →' : 'Start learning →'}
                  </Button>
                  <Link to={`/quiz/${id}/progress`}
                    className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-1">
                    View progress
                  </Link>
                </div>
              ) : (
                <Button className="w-full" loading={enrolling} onClick={handleEnroll} size="lg">
                  Enroll now — it's free
                </Button>
              )}

              {course.completed && (
                <CertificateCard
                  courseId={id}
                  courseTitle={course.title}
                  certificateId={course.certificateId}
                  score={course.competenceScore != null ? Math.round(course.competenceScore * 100) : null}
                />
              )}

              <ul className="space-y-2.5 pt-4 border-t border-gray-100">
                {[
                  course.level    && `📊 ${course.level} level`,
                  course.duration && `🕒 ${course.duration}`,
                  '🧠 Adaptive AI quizzes',
                  '📈 Progress tracking',
                  '💬 Personalised feedback',
                  '🏆 Certificate on completion',
                ].filter(Boolean).map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
