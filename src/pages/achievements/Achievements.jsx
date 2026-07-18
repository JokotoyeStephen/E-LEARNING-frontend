import { useEffect, useState } from 'react'
import { badgeService } from '../../services/badgeService'
import Loader from '../../components/ui/Loader'

export default function Achievements() {
  const [data,    setData]    = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    badgeService.getAll()
      .then(setData)
      .catch(() => setError('Could not load your badges.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <div className="page-container text-center py-20 text-gray-500">{error}</div>

  const { badges, earnedCount, totalCount } = data

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Your badges</h1>
        <p className="text-sm text-gray-500 mt-1">
          {earnedCount} of {totalCount} earned — keep learning to unlock the rest.
        </p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4 max-w-sm">
          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
            style={{ width: `${totalCount ? (earnedCount / totalCount) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map(b => (
          <div key={b.id}
            className={`rounded-2xl border p-5 text-center transition-all ${
              b.earned
                ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-60'
            }`}>
            <div className={`text-4xl mb-3 ${b.earned ? '' : 'grayscale opacity-50'}`}>{b.icon}</div>
            <p className={`text-sm font-bold ${b.earned ? 'text-gray-900' : 'text-gray-400'}`}>{b.title}</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">{b.description}</p>
            {b.earned && (
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                Earned
              </span>
            )}
            {!b.earned && (
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                🔒 Locked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
