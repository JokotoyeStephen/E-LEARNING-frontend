import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { quizService }  from '../../services/quizService'
import { courseService } from '../../services/courseService'
import Loader from '../../components/ui/Loader'
import Card   from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const DIFF_COLORS = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-700',
}

function MasteryBar({ value, label }) {
  const pct = Math.round(value * 100)
  const color = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={pct >= 70 ? 'text-green-600' : 'text-red-500'}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Progress() {
  const { courseId } = useParams()
  const navigate     = useNavigate()
  const [progress, setProgress] = useState(null)
  const [course,   setCourse]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    Promise.all([
      quizService.getProgress(courseId),
      courseService.getById(courseId),
    ])
      .then(([p, c]) => { setProgress(p); setCourse(c) })
      .catch(err => setError(err.response?.data?.message ?? 'Could not load progress.'))
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) return <Loader />
  if (error)   return (
    <div className="page-container text-center py-20">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-gray-500 mb-4">{error}</p>
      <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
    </div>
  )

  const {
    competenceScore, currentDifficulty, quizAttempts,
    completed, topicMastery, scoreTrend,
  } = progress

  const topicEntries = Object.entries(topicMastery || {})
  const weakTopics   = topicEntries.filter(([,v]) => v < 0.6)
  const strongTopics = topicEntries.filter(([,v]) => v >= 0.75)

  // Simple sparkline coordinates from score trend
  const chartPoints = scoreTrend?.length >= 2
    ? scoreTrend.map((p, i) => {
        const x = (i / (scoreTrend.length - 1)) * 280
        const y = 60 - (p.score / 100) * 60
        return `${x},${y}`
      }).join(' ')
    : null

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Progress for</p>
          <h1 className="text-xl font-bold text-gray-900">{course?.title}</h1>
        </div>
        <Button onClick={() => navigate(`/quiz/${courseId}`)}>Take quiz</Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Mastery',    value: `${competenceScore}%`,    icon: '🧠' },
          { label: 'Attempts',   value: quizAttempts,              icon: '📝' },
          { label: 'Level',      value: currentDifficulty,         icon: '📊', badge: true },
          { label: 'Status',     value: completed ? 'Done ✅' : 'Active 🔄', icon: '🎯' },
        ].map(({ label, value, icon, badge }) => (
          <Card key={label} className="p-4 text-center">
            <p className="text-xl mb-1">{icon}</p>
            {badge
              ? <span className={`text-xs font-semibold px-2 py-1 rounded-full ${DIFF_COLORS[value] ?? ''}`}>{value}</span>
              : <p className="text-lg font-bold text-gray-800">{value}</p>
            }
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Overall competence bar */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Overall competence</h2>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              competenceScore >= 75 ? 'bg-green-500' : competenceScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${competenceScore}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Beginner</span>
          <span className="font-medium text-gray-700">{competenceScore}%</span>
          <span>Expert</span>
        </div>
      </Card>

      {/* Score trend sparkline */}
      {scoreTrend?.length >= 2 && (
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Score history</h2>
          <div className="overflow-x-auto">
            <svg width="100%" viewBox="0 0 280 70" className="overflow-visible">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(pct => (
                <g key={pct}>
                  <line x1="0" y1={60 - pct * 0.6} x2="280" y2={60 - pct * 0.6}
                    stroke="#f3f4f6" strokeWidth="1" />
                  <text x="-4" y={63 - pct * 0.6} textAnchor="end" fontSize="8" fill="#9ca3af">{pct}%</text>
                </g>
              ))}
              {/* 70% pass line */}
              <line x1="0" y1="18" x2="280" y2="18" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 3" />
              <text x="284" y="21" fontSize="8" fill="#f59e0b">70%</text>
              {/* Score line */}
              {chartPoints && (
                <polyline points={chartPoints} fill="none" stroke="#3b82f6" strokeWidth="2"
                  strokeLinejoin="round" strokeLinecap="round" />
              )}
              {/* Dots */}
              {scoreTrend.map((p, i) => {
                const x = (i / (scoreTrend.length - 1)) * 280
                const y = 60 - (p.score / 100) * 60
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3.5" fill={p.score >= 70 ? '#22c55e' : '#ef4444'} />
                    <title>Attempt {i + 1}: {p.score}% ({p.difficulty})</title>
                  </g>
                )
              })}
            </svg>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>Passed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Failed</span>
            <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-yellow-400 inline-block"/>Pass mark (70%)</span>
          </div>
        </Card>
      )}

      {/* Topic mastery */}
      {topicEntries.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Topic mastery</h2>
          <div className="space-y-3">
            {topicEntries
              .sort((a, b) => a[1] - b[1])
              .map(([topic, value]) => (
                <MasteryBar key={topic} label={topic} value={value} />
              ))}
          </div>

          {weakTopics.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Needs improvement</p>
              <p className="text-xs text-red-600">{weakTopics.map(([t]) => t).join(', ')}</p>
            </div>
          )}
          {strongTopics.length > 0 && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1">Strong topics</p>
              <p className="text-xs text-green-600">{strongTopics.map(([t]) => t).join(', ')}</p>
            </div>
          )}
        </Card>
      )}

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Button className="flex-1 sm:flex-none" onClick={() => navigate(`/quiz/${courseId}`)}>
          {quizAttempts === 0 ? 'Start first quiz' : 'Take another quiz'}
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/courses/${courseId}`)}>
          Course details
        </Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      </div>
    </div>
  )
}
