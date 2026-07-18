import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input  from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    tagline: 'I want to learn',
    description: 'Access adaptive courses, take quizzes, and track your mastery as you grow.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L4 9l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M4 9v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8 11.5v6a6 6 0 0012 0v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'instructor',
    label: 'Instructor',
    tagline: 'I want to teach',
    description: 'Create courses, manage content, and watch your students grow in real time.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 23h8M14 19v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M10 12l2.5 2.5L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [role,    setRole]    = useState('student')
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [step,    setStep]    = useState(1)   // 1 = pick role, 2 = fill form

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, role)
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-purple">
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L3 5.5V9c0 3.87 2.57 7.49 6 8.93C12.43 16.49 15 12.87 15 9V5.5L9 2Z" fill="white" opacity="0.9"/>
              <path d="M6.5 9l1.5 1.5L11.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Step 1 — Role picker */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Join Learnly</h1>
              <p className="text-sm text-gray-500">How do you want to use Learnly?</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`group relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    role === r.id
                      ? 'border-primary-500 bg-primary-50 shadow-purple'
                      : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/40'
                  }`}
                >
                  {/* Check indicator */}
                  <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    role === r.id ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                  }`}>
                    {role === r.id && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div className={`p-2 rounded-xl transition-colors ${role === r.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                    {r.icon}
                  </div>

                  <div>
                    <p className={`font-display font-bold text-sm ${role === r.id ? 'text-primary-700' : 'text-gray-900'}`}>
                      {r.label}
                    </p>
                    <p className={`text-xs font-medium mt-0.5 ${role === r.id ? 'text-primary-500' : 'text-gray-400'}`}>
                      {r.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                </button>
              ))}
            </div>

            <Button className="w-full" size="lg" onClick={() => setStep(2)}>
              Continue as {ROLES.find(r => r.id === role)?.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>

            <p className="text-sm text-center text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
            </p>
          </div>
        )}

        {/* Step 2 — Form */}
        {step === 2 && (
          <div className="animate-fade-up">
            {/* Role badge + back */}
            <div className="flex items-center justify-between mb-7">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <span className={`flex items-center gap-1.5 badge ${role === 'instructor' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'}`}>
                {ROLES.find(r => r.id === role)?.icon && (
                  <span className="scale-50 -mx-1">{ROLES.find(r => r.id === role)?.icon}</span>
                )}
                {ROLES.find(r => r.id === role)?.label}
              </span>
            </div>

            <div className="text-center mb-7">
              <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
              <p className="text-sm text-gray-500">
                {role === 'instructor' ? 'Set up your instructor profile' : 'Start your learning journey'}
              </p>
            </div>

            <div className="card p-6">
              {error && (
                <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 4v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={role === 'instructor' ? 'Full name (shown on courses)' : 'Full name'}
                  placeholder={role === 'instructor' ? 'Dr. Jane Doe' : 'Jane Doe'}
                  value={form.name} onChange={set('name')} required
                />
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} minLength={8} required />

                <div className="pt-1">
                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    Create {role === 'instructor' ? 'instructor' : ''} account
                  </Button>
                </div>
              </form>
            </div>

            <p className="text-sm text-center text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
            </p>

            <div className="flex items-center justify-center gap-5 mt-5">
              {['Free forever', 'No credit card', 'Instant access'].map(item => (
                <span key={item} className="flex items-center gap-1 text-xs text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}