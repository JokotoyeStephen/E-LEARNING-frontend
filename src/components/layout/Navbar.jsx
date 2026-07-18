import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const STUDENT_LINKS = [
  { to: '/courses',   label: 'Explore' },
  { to: '/roadmap',   label: 'Roadmap' },
  { to: '/learn',     label: 'Learn Space' },
  { to: '/videos',    label: 'Videos' },
  { to: '/lecture',   label: 'Lectures' },
  { to: '/achievements', label: 'Badges' },
  { to: '/analytics',    label: 'Analytics' },
  { to: '/dashboard', label: 'Dashboard' },
]
const INSTRUCTOR_LINKS = [
  { to: '/courses',   label: 'Course Library' },
  { to: '/dashboard', label: 'My Courses' },
]

const TICKER_ITEMS = [
  '🎓 Web Design  ·  25 Courses',
  '📊 Data Science  ·  18 Courses',
  '💻 Development  ·  30 Courses',
  '🎨 Graphic Design  ·  10 Courses',
  '📱 Mobile Application  ·  15 Courses',
  '💼 Business  ·  22 Courses',
  '📣 Marketing  ·  11 Courses',
  '🔒 Cyber Security  ·  8 Courses',
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin'
  const links = isInstructor ? INSTRUCTOR_LINKS : STUDENT_LINKS

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-50">
      {/* Ticker strip */}
      <div className="bg-primary-600 text-white text-xs py-1.5 overflow-hidden">
        <div className="flex gap-12 animate-[ticker_28s_linear_infinite] whitespace-nowrap w-max">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-3 font-medium opacity-90">
              <span className="w-1 h-1 rounded-full bg-white/50 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className={`bg-white/90 backdrop-blur-md border-b transition-shadow ${scrolled ? 'shadow-md border-gray-200' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-purple group-hover:scale-105 transition-transform">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L3 5.5V9c0 3.87 2.57 7.49 6 8.93C12.43 16.49 15 12.87 15 9V5.5L9 2Z" fill="white" opacity="0.9"/>
                  <path d="M6.5 9l1.5 1.5L11.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">Learn<span className="text-primary-500">ly</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-0.5">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                      ? isInstructor ? 'bg-amber-50 text-amber-700' : 'bg-primary-50 text-primary-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 mr-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isInstructor ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-primary-400 to-primary-600'}`}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                  <span className={`badge text-xs font-bold ${isInstructor ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'}`}>{user.role}</span>
                </div>
                <button onClick={handleLogout} className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-1.5">
                  Login
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Contact Us
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => setOpen(!open)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-1 bg-white">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              {user
                ? <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Log out</button>
                : <Link to="/login" onClick={() => setOpen(false)} className="flex px-3 py-2.5 rounded-xl text-sm font-medium text-primary-600 hover:bg-primary-50">Log in</Link>
              }
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
