import CourseCard, { CourseCardList } from './CourseCard'
import Loader from '../ui/Loader'
import { useState } from 'react'

export default function CourseList({ courses, loading, emptyMessage = 'No courses found.' }) {
  const [view, setView] = useState('grid')  // 'grid' | 'list'

  if (loading) return <Loader />
  if (!courses?.length) return (
    <div className="text-center py-20">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-gray-500 text-sm">{emptyMessage}</p>
    </div>
  )

  return (
    <div>
      {/* View toggle + count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-700">1–{courses.length}</span> of <span className="font-semibold text-gray-700">{courses.length}</span> results</p>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setView('grid')}
            className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <button onClick={() => setView('list')}
            className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="10" width="12" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {view === 'grid'
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{courses.map(c => <CourseCard key={c._id} course={c} />)}</div>
        : <div className="space-y-3">{courses.map(c => <CourseCardList key={c._id} course={c} />)}</div>
      }
    </div>
  )
}
