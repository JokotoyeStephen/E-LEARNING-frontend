import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { analyticsService } from '../../services/analyticsService'
import Loader from '../../components/ui/Loader'

const PURPLE = '#7c3aed'
const ORANGE = '#f97316'
const GREEN  = '#16a34a'
const GRAY   = '#9ca3af'

function StatCard({ icon, value, label, sub }) {
  return (
    <div className="card p-5">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, subtitle, children, empty }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display text-sm font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {empty ? (
        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
          Not enough activity yet — this fills in as you learn.
        </div>
      ) : (
        <div className="h-64">{children}</div>
      )}
    </div>
  )
}

export default function LearningAnalytics() {
  const [data,    setData]    = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getOverview()
      .then(setData)
      .catch(() => setError('Could not load your analytics right now.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <div className="page-container text-center py-20 text-gray-500">{error}</div>

  const {
    hoursStudiedEstimate, lessonsCompletedTotal, quizzesTakenTotal, avgQuizScore,
    coursesCompleted, coursesEnrolled, monthlyProgress, quizPerformance,
    skillImprovement, courseCompletion,
  } = data

  const hasMonthly = monthlyProgress?.some(m => m.lessonsCompleted > 0 || m.quizzesTaken > 0)
  const hasQuizzes = quizPerformance?.length > 0
  const hasSkills  = skillImprovement?.length > 0
  const hasCourses = courseCompletion?.length > 0

  return (
    <div className="page-container max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Your study activity and progress at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon="⏱️" value={`${hoursStudiedEstimate}h`} label="Hours Studied" sub="Estimated" />
        <StatCard icon="📘" value={lessonsCompletedTotal} label="Lessons Completed" />
        <StatCard icon="🎯" value={`${avgQuizScore}%`} label="Avg Quiz Score" sub={`${quizzesTakenTotal} quizzes taken`} />
        <StatCard icon="✅" value={`${coursesCompleted}/${coursesEnrolled}`} label="Courses Completed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly progress */}
        <ChartCard title="Monthly Progress" subtitle="Lessons and quizzes over the last 6 months" empty={!hasMonthly}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyProgress} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="lessonsCompleted" name="Lessons" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="quizzesTaken" name="Quizzes" stroke={ORANGE} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Quiz performance */}
        <ChartCard title="Quiz Performance" subtitle="Score on your most recent attempts" empty={!hasQuizzes}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quizPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e5e7eb' }}
                formatter={(value, name) => [`${value}%`, name]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.course ? `${label} · ${payload[0].payload.course}` : label}
              />
              <Line type="monotone" dataKey="score" name="Score" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Skill improvement */}
        <ChartCard title="Skill Improvement" subtitle="First attempt vs. most recent, by topic" empty={!hasSkills}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillImprovement} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="topic" width={110} tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e5e7eb' }}
                formatter={(value) => `${value}%`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="first" name="First attempt" fill={GRAY} radius={[0, 4, 4, 0]} barSize={10} />
              <Bar dataKey="latest" name="Most recent" fill={PURPLE} radius={[0, 4, 4, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Course completion percentage */}
        <ChartCard title="Course Completion" subtitle="Percentage of topics finished per course" empty={!hasCourses}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseCompletion} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="course" width={110} tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e5e7eb' }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="percent" name="Complete" fill={ORANGE} radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        "Hours Studied" is an estimate based on your lesson and quiz activity, not precise time tracking.
      </p>
    </div>
  )
}
