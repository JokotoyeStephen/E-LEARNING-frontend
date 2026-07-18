import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { quizService } from '../../services/quizService'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

const DIFF_STYLES = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-700',
}

function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function Quiz() {
  const { courseId }      = useParams()
  const navigate           = useNavigate()
  const [searchParams]     = useSearchParams()
  const checkpoint         = searchParams.get('checkpoint') === 'mid' ? 'mid' : 'final'

  const [quiz,       setQuiz]       = useState(null)
  const [answers,    setAnswers]    = useState({})   // { questionId: optionIndex }
  const [current,    setCurrent]    = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [lessonsIncomplete, setLessonsIncomplete] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    quizService.generate(courseId, checkpoint)
      .then(data => {
        setQuiz(data)
        if (data.timeLimitSeconds) setSecondsLeft(data.timeLimitSeconds)
      })
      .catch(err => {
        setError(err.response?.data?.message ?? 'Could not load quiz.')
        setLessonsIncomplete(err.response?.data?.code === 'LESSONS_INCOMPLETE')
      })
      .finally(() => setLoading(false))
  }, [courseId, checkpoint])

  const select = (qId, idx) => setAnswers(prev => ({ ...prev, [qId]: idx }))

  const handleSubmit = async (finalAnswers = answers) => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    try {
      const result = await quizService.submit(courseId, finalAnswers, quiz.difficulty, checkpoint)
      navigate(`/quiz/${courseId}/result`, { state: { result, courseTitle: quiz.courseTitle, checkpoint } })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Submission failed.')
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  // Countdown timer — ticks once per second while the quiz is active, and
  // auto-submits whatever's been answered so far once time runs out.
  useEffect(() => {
    if (secondsLeft === null || submitting) return
    if (secondsLeft <= 0) { handleSubmit(); return }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitting])

  if (loading) return <Loader />
  if (error)   return (
    <div className="page-container max-w-lg text-center py-20">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-gray-600 mb-4">{error}</p>
      {lessonsIncomplete ? (
        <Button onClick={() => navigate(`/courses/${courseId}/learn`)}>Back to lessons →</Button>
      ) : (
        <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
      )}
    </div>
  )

  const questions    = quiz.questions
  const q            = questions[current]
  const totalQ       = questions.length
  const isAnswered   = answers[q._id] !== undefined
  const allAnswered  = questions.every(q => answers[q._id] !== undefined)
  const isLast       = current === totalQ - 1
  const answeredCount = Object.keys(answers).length

  return (
    <div className="page-container max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">{quiz.courseTitle}</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {checkpoint === 'mid' ? 'Mid-course Checkpoint' : 'Final Quiz'} — {totalQ} questions
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {secondsLeft !== null && (
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full transition-colors ${
              secondsLeft <= 30 ? 'bg-red-100 text-red-700 animate-pulse' : secondsLeft <= 90 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
            }`} title="Time remaining">
              ⏱ {formatTime(secondsLeft)}
            </span>
          )}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFF_STYLES[quiz.difficulty]}`}>
            {quiz.difficulty}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Question {current + 1} of {totalQ}</span>
          <span>{answeredCount}/{totalQ} answered</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / totalQ) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-5">
        <span className="inline-block text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded mb-4">
          {q.topic}
        </span>
        <h2 className="text-base font-semibold text-gray-900 mb-5 leading-relaxed">{q.text}</h2>

        <div className="space-y-3">
          {q.options.map((option, i) => {
            const selected = answers[q._id] === i
            return (
              <button key={i} onClick={() => select(q._id, i)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  selected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                }`}>
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2.5 ${
                  selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-5">
        <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>
          ← Previous
        </Button>
        {isLast ? (
          <Button disabled={!allAnswered} loading={submitting} onClick={() => handleSubmit()}>
            Submit quiz
          </Button>
        ) : (
          <Button disabled={!isAnswered} onClick={() => setCurrent(c => c + 1)}>
            Next →
          </Button>
        )}
      </div>

      {/* Question dots navigator */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {questions.map((qItem, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            title={`Question ${i + 1}${answers[qItem._id] !== undefined ? ' (answered)' : ''}`}
            className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
              i === current
                ? 'bg-blue-600 text-white'
                : answers[qItem._id] !== undefined
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}>
            {i + 1}
          </button>
        ))}
      </div>

      {isLast && !allAnswered && (
        <p className="text-xs text-center text-amber-500 mt-3">
          Answer all {totalQ} questions before submitting.
        </p>
      )}
    </div>
  )
}
