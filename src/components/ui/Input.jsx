export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <input
        className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-white transition-all
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
