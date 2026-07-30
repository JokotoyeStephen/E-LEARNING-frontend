export default function LessonResources({ resources = [] }) {
  if (!resources.length) return null

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Downloadable resources</h3>
      <div className="space-y-1.5">
        {resources.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2.5 transition-colors">
            <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-xs shrink-0">⬇</span>
            <span className="flex-1 truncate">{r.title || r.url}</span>
            <span className="text-xs text-gray-400 shrink-0">Open ↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}
