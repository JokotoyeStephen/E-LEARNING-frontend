import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-4">📭</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-sm bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
        Go home
      </Link>
    </div>
  )
}
