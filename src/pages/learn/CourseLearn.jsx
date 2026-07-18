import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import CertificateCard from '../../components/certificate/CertificateCard'
import { getYouTubeEmbedUrl } from '../../utils/youtube'

export default function CourseLearn() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [course,         setCourse]         = useState(null)
  const [completed,      setCompleted]      = useState([])   // topic names
  const [midQuizPassed,  setMidQuizPassed]  = useState(false)
  const [activeIndex,    setActiveIndex]     = useState(0)
  const [loading,        setLoading]        = useState(true)
  const [marking,        setMarking]        = useState(false)
  const [error,          setError]          = useState('')

  useEffect(() => {
    courseService.getById(id)
      .then(data => {
        if (!data.isEnrolled) { navigate(`/courses/${id}`); return }
        setCourse(data)
        setCompleted(data.completedTopics || [])
        setMidQuizPassed(data.midQuizPassed || false)
        const topics = [...(data.topics || [])].sort((a, b) => a.order - b.order)
        const firstIncomplete = topics.findIndex(t => !(data.completedTopics || []).includes(t.name))
        setActiveIndex(firstIncomplete === -1 ? Math.max(topics.length - 1, 0) : firstIncomplete)
      })
      .catch(() => setError('Course not found.'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const topics = useMemo(
    () => [...(course?.topics || [])].sort((a, b) => a.order - b.order),
    [course]
  )
  const activeTopic = topics[activeIndex]
  const isTopicLocked = (topic) =>
    (topic.prerequisites || []).some(p => !completed.includes(p))
  const allDone = topics.length > 0 && topics.every(t => completed.includes(t.name))

  // Halfway checkpoint: unlocks once the first half of the topics are done.
  // Only meaningful for courses with more than one topic.
  const halfCount     = Math.ceil(topics.length / 2)
  const firstHalf     = topics.slice(0, halfCount)
  const hasMidpoint   = topics.length > 1
  const midUnlocked   = hasMidpoint && firstHalf.every(t => completed.includes(t.name))

  const markComplete = async () => {
    if (!activeTopic) return
    setMarking(true)
    try {
      const { completedTopics } = await courseService.completeTopic(id, activeTopic.name)
      setCompleted(completedTopics)
      if (activeIndex < topics.length - 1) setActiveIndex(activeIndex + 1)
    } catch {
      setError('Could not save your progress. Please try again.')
    } finally { setMarking(false) }
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to={`/courses/${id}`} className="text-sm text-primary-600 hover:underline">← Back to course</Link>
        <h1 className="font-display text-2xl font-bold text-gray-900 mt-2">{course.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Work through each topic before quizzing on it.</p>
      </div>

      {course.completed && (
        <div className="mb-6">
          <CertificateCard
            courseId={id}
            courseTitle={course.title}
            certificateId={course.certificateId}
            score={course.competenceScore != null ? Math.round(course.competenceScore * 100) : null}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic list */}
        <div className="space-y-2">
          {topics.map((topic, i) => {
            const done   = completed.includes(topic.name)
            const locked = isTopicLocked(topic)
            return (
              <button
                key={topic.name}
                onClick={() => !locked && setActiveIndex(i)}
                disabled={locked}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-center gap-3
                  ${i === activeIndex ? 'border-primary-300 bg-primary-50' : 'border-gray-100 bg-white'}
                  ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-200'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${done ? 'bg-green-500 text-white' : locked ? 'bg-gray-200 text-gray-400' : 'bg-primary-100 text-primary-600'}`}>
                  {done ? '✓' : locked ? '🔒' : i + 1}
                </span>
                <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  {topic.name}
                  {topic.lesson?.videoUrl && <span title="Includes video">🎬</span>}
                </span>
              </button>
            )
          })}

          {hasMidpoint && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Midway checkpoint</p>
              {midQuizPassed ? (
                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 px-3 py-2 rounded-xl">
                  <span>✓</span> Checkpoint passed
                </div>
              ) : (
                <Button
                  className="w-full"
                  disabled={!midUnlocked}
                  onClick={() => navigate(`/quiz/${id}?checkpoint=mid`)}
                >
                  {midUnlocked ? 'Take mid-course quiz →' : `Finish topic ${halfCount} to unlock`}
                </Button>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Final quiz</p>
            <Button
              className="w-full"
              disabled={!allDone}
              onClick={() => navigate(`/quiz/${id}?checkpoint=final`)}
            >
              {allDone ? 'Take final quiz →' : 'Finish all topics to unlock'}
            </Button>
          </div>
        </div>

        {/* Lesson content */}
        <div className="lg:col-span-2">
          {activeTopic && (
            <div className="card p-6 space-y-5">
              <h2 className="font-display text-lg font-bold text-gray-900">{activeTopic.name}</h2>

              {activeTopic.lesson?.intro && (
                <p className="text-sm text-gray-600 leading-relaxed">{activeTopic.lesson.intro}</p>
              )}

              {activeTopic.lesson?.videoUrl && getYouTubeEmbedUrl(activeTopic.lesson.videoUrl) && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Video lesson</h3>
                  <div className="relative w-full rounded-xl overflow-hidden bg-gray-900" style={{ aspectRatio: '16 / 9' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={getYouTubeEmbedUrl(activeTopic.lesson.videoUrl)}
                      title={`${activeTopic.name} video lesson`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {activeTopic.lesson?.keyPoints?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Key points</h3>
                  <ul className="space-y-2">
                    {activeTopic.lesson.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTopic.lesson?.deepDive?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Deeper dive</h3>
                  <div className="space-y-3">
                    {activeTopic.lesson.deepDive.map((para, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {activeTopic.lesson?.applications?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Where this shows up</h3>
                  <ul className="space-y-2">
                    {activeTopic.lesson.applications.map((point, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs">🌍</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTopic.lesson?.commonMistakes?.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Common mistakes</h3>
                  <ul className="space-y-2">
                    {activeTopic.lesson.commonMistakes.map((point, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-amber-900">
                        <span className="shrink-0">⚠️</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTopic.lesson?.example && (
                <div className="bg-surface-50 border border-gray-100 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Example</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{activeTopic.lesson.example}</p>
                </div>
              )}

              {activeTopic.lesson?.summary && (
                <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{activeTopic.lesson.summary}</p>
              )}

              {completed.includes(activeTopic.name) ? (
                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 px-3 py-2 rounded-xl">
                  <span>✓</span> Completed
                </div>
              ) : (
                <Button loading={marking} onClick={markComplete}>
                  Mark as complete{activeIndex < topics.length - 1 ? ' & continue' : ''}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
