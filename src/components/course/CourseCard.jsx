import { useState } from 'react'
import { Link } from 'react-router-dom'

const TAG_COLORS = {
  Bestseller: 'bg-accent-500 text-white',
  Popular:    'bg-primary-500 text-white',
  New:        'bg-green-500 text-white',
}
const DIFF_COLORS = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}
const CATEGORY_COLORS = {
  'Data Science':      'bg-blue-50 text-blue-700',
  'Computer Science':  'bg-violet-50 text-violet-700',
  'Business':          'bg-amber-50 text-amber-700',
  'Design':            'bg-pink-50 text-pink-700',
  'Marketing':         'bg-green-50 text-green-700',
  'Cyber Security':    'bg-red-50 text-red-700',
  'UI/UX Design':      'bg-fuchsia-50 text-fuchsia-700',
  'Digital Marketing': 'bg-teal-50 text-teal-700',
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

/* Grid card */
export function CourseCardGrid({ course }) {
  const { _id, title, instructor, thumbnail, tag, rating, reviewCount, level, price, category, duration, currentDifficulty, competenceScore, quizAttempts, completed } = course
  const enrolled = quizAttempts !== undefined
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <Link to={`/courses/${_id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        {thumbnail && !imgFailed
          ? <img src={thumbnail} alt={title} onError={() => setImgFailed(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📚</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {tag && <span className={`absolute top-3 left-3 badge ${TAG_COLORS[tag] ?? 'bg-gray-700 text-white'}`}>{tag}</span>}
        {completed
          ? <span className="absolute top-3 right-3 badge bg-amber-500 text-white">🎓 Certified</span>
          : enrolled && currentDifficulty
            ? <span className={`absolute top-3 right-3 badge ${DIFF_COLORS[currentDifficulty]}`}>{currentDifficulty}</span>
            : !enrolled && price === 0 && <span className="absolute top-3 right-3 badge bg-green-500 text-white">Free</span>}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          {(category) && (
            <span className={`badge text-xs ${CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-500'}`}>{category}</span>
          )}
          {rating != null && (
            <div className="flex items-center gap-1">
              <Stars rating={rating} />
              <span className="text-xs font-bold text-amber-600">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">{title}</h3>
        {instructor && (
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-primary-100 inline-flex items-center justify-center text-primary-600 font-bold text-[9px]">{instructor.charAt(0)}</span>
            {instructor}
          </p>
        )}
        {enrolled && competenceScore !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">Mastery</span>
              <span className="font-semibold text-primary-600">{Math.round(competenceScore * 100)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: `${Math.round(competenceScore * 100)}%` }} />
            </div>
          </div>
        )}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {duration && <span className="flex items-center gap-1">🕒 {duration}</span>}
            {level && <span className="bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{level}</span>}
          </div>
          <span className="text-base font-bold text-primary-600">{price === 0 ? 'Free' : `$${price}`}</span>
        </div>
      </div>
    </Link>
  )
}

/* List row (EduMove list-view style) */
export function CourseCardList({ course }) {
  const { _id, title, instructor, thumbnail, price, category, duration, rating, reviewCount, level } = course
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <Link to={`/courses/${_id}`}
      className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-card hover:shadow-card-hover hover:border-primary-100 transition-all duration-200">
      <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-primary-50 to-primary-100">
        {thumbnail && !imgFailed
          ? <img src={thumbnail} alt={title} onError={() => setImgFailed(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📚</div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug group-hover:text-primary-700 transition-colors">{title}</h3>
            {instructor && <p className="text-xs text-gray-400 mt-0.5">{instructor}</p>}
          </div>
          <span className="text-base font-bold text-primary-600 shrink-0">${price === 0 ? <span className="text-green-600">Free</span> : price}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {category && <span className={`badge text-xs ${CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-500'}`}>{category}</span>}
          {rating != null && (
            <div className="flex items-center gap-1">
              <Stars rating={rating} />
              <span className="text-xs text-gray-400">({reviewCount?.toLocaleString()})</span>
            </div>
          )}
          {duration && <span className="text-xs text-gray-400 flex items-center gap-1">🕒 {duration}</span>}
          {level && <span className="text-xs text-gray-400">{level}</span>}
        </div>
        <p className="text-xs text-primary-600 font-semibold mt-2 group-hover:underline">View Course →</p>
      </div>
    </Link>
  )
}

/* Default export = grid card */
export default CourseCardGrid
