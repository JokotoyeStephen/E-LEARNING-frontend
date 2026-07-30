import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [unverified, setUnverified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setUnverified(false)
    setLoading(true)

    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setUnverified(true)
      } else {
        setError(err.response?.data?.message ?? 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = form.email.trim() && form.password.trim() && !loading

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image / Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:40px_40px] z-0" />

        {/* Decorative Elements */}
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0" />
        <div className="absolute -right-32 bottom-10 w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl z-0" />

        {/* Full Panel Image */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          alt="Learning"
          className="absolute inset-0 w-full h-full opacity-75 mix-blend-overlay object-cover z-0"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white h-full">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">Learnly</span>
            </div>

            <h2 className="text-5xl font-semibold leading-tight tracking-tighter mb-6">
              Master new skills.<br />
              Anytime. Anywhere.
            </h2>

            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of learners advancing their careers with world-class courses.
            </p>

            {/* Testimonial / Trust signals */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-2xl border-2 border-white bg-white/30 backdrop-blur-md"
                    />
                  ))}
                </div>
                <p className="text-blue-100">
                  Trusted by <span className="font-semibold text-white">12,459+</span> students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-semibold text-slate-900">Learnly</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/70 border border-slate-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
              <p className="mt-2 text-slate-600">Sign in to continue learning</p>
            </div>

            {error && (
              <div
                className="mb-6 flex gap-3 text-sm bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3.5"
                role="alert"
                aria-live="polite"
              >
                ⚠️ {error}
              </div>
            )}

            {unverified && (
              <div className="mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm">
                <p className="font-semibold text-amber-800">Email not verified</p>
                <p className="mt-1 text-amber-700">
                  We sent a 6-digit code to <span className="font-medium">{form.email}</span>.
                </p>
                <button
                  disabled={loading}
                  onClick={() =>
                    navigate('/verify-email', { state: { email: form.email } })
                  }
                  className={`mt-3 text-amber-700 hover:text-amber-800 font-medium underline underline-offset-4 ${
                    loading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  Enter code →
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
                disabled={loading}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                className={`h-12 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  icon={<Lock className="w-4 h-4 text-slate-400" />}
                  className={`h-12 rounded-2xl pr-12 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
                    loading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
                <button
                  type="button"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-9 text-slate-400 hover:text-slate-600 transition-colors ${
                    loading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className={`text-sm text-blue-600 hover:underline font-medium ${
                    loading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={!canSubmit}
                className={`w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.985] ${
                  !canSubmit ? 'opacity-60 cursor-not-allowed hover:bg-blue-600' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className={`text-blue-600 font-semibold hover:underline ${
                  loading ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}