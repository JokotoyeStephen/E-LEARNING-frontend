import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card   from '../../components/ui/Card'
import CertificateCard from '../../components/certificate/CertificateCard'

const DIFF_COLORS = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-700',
}

export default function Result() {
  const { courseId } = useParams()
  const { state }    = useLocation()
  const navigate     = useNavigate()

  const result      = state?.result
  const courseTitle = state?.courseTitle
  const checkpoint  = state?.checkpoint === 'mid' ? 'mid' : 'final'

  if (!result) {
    navigate(`/quiz/${courseId}`)
    return null
  }

  const {
    score, correctCount, totalQuestions, passed,
    topicBreakdown, weakTopics, nextDifficulty,
    competenceScore, aiFeedback, answers,
    newBadges, justCompleted, certificateId,
  } = result

  const sortedTopics = Object.entries(topicBreakdown || {})
    .sort((a, b) => a[1].accuracy - b[1].accuracy)

  return (
    <div className="page-container max-w-3xl">
      {/* Score hero */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6 text-center">
        <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto mb-5 text-white text-3xl font-bold shadow-lg ${
          passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-500'
        }`}>
          <span>{score}%</span>
          <span className="text-xs font-normal opacity-80 mt-0.5">score</span>
        </div>

        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">
          {checkpoint === 'mid' ? 'Mid-course Checkpoint' : 'Final Quiz'}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {passed ? '🎉 Well done!' : '😔 Not quite there'}
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          {correctCount} out of {totalQuestions} correct
        </p>
        <p className={`text-sm font-semibold mb-4 ${passed ? 'text-green-600' : 'text-red-500'}`}>
          {passed ? 'You passed! (≥70% required)' : 'You need 70% to pass.'}
        </p>

        {/* Next level badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-gray-400">Next quiz difficulty:</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFF_COLORS[nextDifficulty]}`}>
            {nextDifficulty}
          </span>
        </div>

        {competenceScore != null && (
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Overall mastery</span>
              <span>{competenceScore}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${competenceScore}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Certificate — shown the moment the final quiz is passed and the course is completed */}
      {justCompleted && certificateId && (
        <div className="mb-6">
          <CertificateCard
            courseId={courseId}
            courseTitle={courseTitle}
            certificateId={certificateId}
            score={score}
          />
        </div>
      )}

      {/* Newly earned badges */}
      {newBadges?.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">🎉 New badge{newBadges.length > 1 ? 's' : ''} earned!</h2>
          <div className="flex flex-wrap gap-3">
            {newBadges.map(b => (
              <div key={b.id} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <span className="text-xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-amber-800">{b.title}</p>
                  <p className="text-[11px] text-amber-600">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/achievements" className="inline-block mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium">
            View all your badges →
          </Link>
        </Card>
      )}

      {/* AI Feedback */}
      {aiFeedback && (
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🤖</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">AI Feedback</p>
              <p className="text-sm text-gray-600 leading-relaxed">{aiFeedback}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Topic breakdown */}
      {sortedTopics.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Topic breakdown</h2>
          <div className="space-y-3">
            {sortedTopics.map(([topic, stats]) => (
              <div key={topic}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{topic}</span>
                  <span className={stats.accuracy >= 70 ? 'text-green-600' : 'text-red-500'}>
                    {stats.correct}/{stats.total} ({stats.accuracy}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${stats.accuracy >= 70 ? 'bg-green-500' : 'bg-red-400'}`}
                    style={{ width: `${stats.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
          {weakTopics?.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs font-medium text-amber-700">
                📌 Focus areas: {weakTopics.join(', ')}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Per-question review */}
      {answers?.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Question review</h2>
          <div className="space-y-4">
            {answers.map((a, i) => (
              <div key={i} className={`p-4 rounded-lg border ${a.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className={`text-sm font-bold shrink-0 ${a.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {a.isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{a.topic}</span>
                </div>
                {!a.isCorrect && a.explanation && (
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    <span className="font-medium">Explanation:</span> {a.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="secondary" onClick={() => navigate(`/quiz/${courseId}/progress`)}>
          View progress
        </Button>
        {!passed && (
          <Button variant="secondary" onClick={() => navigate(`/quiz/${courseId}?checkpoint=${checkpoint}`)}>
            Retry quiz
          </Button>
        )}
        {checkpoint === 'mid' ? (
          <Button onClick={() => navigate(`/courses/${courseId}/learn`)}>
            Continue learning →
          </Button>
        ) : (
          <Button onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        )}
      </div>
    </div>
  )
}
