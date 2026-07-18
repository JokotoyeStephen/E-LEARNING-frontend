import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/courses',   label: 'Courses',   icon: '📚' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <nav className="sticky top-20 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
