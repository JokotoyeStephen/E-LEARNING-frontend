import { Link } from 'react-router-dom'

const EXPLORE = ['About us', 'Courses', 'Pricing', 'Blogs']
const PAGES   = ['Instructors', 'Contact', 'Privacy Policy', 'Terms & Conditions']

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Newsletter strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">👑</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Keep It Fresh with Us</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-1">Subscribe Our Newsletter</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Subscribe now to receive exclusive learning tips, updates on new courses, and special offers.
              </p>
            </div>
            <div className="md:w-96">
              <div className="flex items-center bg-gray-900 border border-gray-700 rounded-xl overflow-hidden focus-within:border-primary-500 transition-colors">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none"
                />
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 transition-colors shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L3 5.5V9c0 3.87 2.57 7.49 6 8.93C12.43 16.49 15 12.87 15 9V5.5L9 2Z" fill="white" opacity="0.9"/>
                  <path d="M6.5 9l1.5 1.5L11.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white">Learn<span className="text-primary-400">ly</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              Intelligent adaptive learning — quizzes that grow with you, courses built to last.
            </p>
            <div className="flex items-center gap-3">
              {['f', 'tw', 'in', 'ig'].map((s, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-primary-500 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-5">Explore</p>
            <ul className="space-y-3">
              {EXPLORE.map(item => (
                <li key={item}>
                  <Link to="/courses" className="text-sm text-gray-500 hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-5">Pages</p>
            <ul className="space-y-3">
              {PAGES.map(item => (
                <li key={item}>
                  <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-5">Contact Us</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-primary-400">📞</span> (568) 367-987-237
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-primary-400">✉️</span> info@learnly.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-primary-400">📍</span> 463 7th Ave, NY 10018, USA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} <span className="text-primary-400">Learnly</span> || All Rights Reserved</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" style={{animation:'pulse-dot 2s ease-in-out infinite'}} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
