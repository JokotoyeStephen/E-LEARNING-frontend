import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'

// ── Icons ────────────────────────────────────────────────────────────────────
const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" className="w-14 h-14 text-blue-500 mx-auto">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" className="w-14 h-14 text-green-500 mx-auto">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

// ── Main component ───────────────────────────────────────────────────────────
export default function VerifyEmail() {
  const navigate           = useNavigate()
  const location           = useLocation()
  const { loginWithToken } = useAuth()

  const emailFromState = location.state?.email   // passed from Register page

  const [digits, setDigits]     = useState(['', '', '', '', '', ''])
  const [status, setStatus]     = useState('idle')   // idle | verifying | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(3)
  const [resending, setResending]   = useState(false)
  const [resendMsg, setResendMsg]   = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const inputRefs = useRef([])

  // Focus first box on mount
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  // Countdown redirect after success
  useEffect(() => {
    if (status !== 'success') return
    if (countdown === 0) { navigate('/dashboard'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [status, countdown, navigate])

  // ── OTP input handlers ───────────────────────────────────────────────────
  const handleChange = (i, val) => {
    // Only allow digits
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    const next = [...digits]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    // Focus the box after the last pasted digit
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault()
    const code = digits.join('')
    if (code.length < 6) {
      setErrorMsg('Please enter the full 6-digit code.')
      return
    }
    if (!emailFromState) {
      setErrorMsg('Email address not found. Please register again.')
      return
    }

    setStatus('verifying')
    setErrorMsg('')
    try {
      const data = await authService.verifyEmail(emailFromState, code)
      loginWithToken(data.user, data.token)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? 'Invalid or expired code. Please try again.')
      setStatus('idle')
      setDigits(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    }
  }

  // Auto-submit once all 6 digits are filled
  useEffect(() => {
    if (digits.every(d => d !== '') && status === 'idle') handleSubmit()
  }, [digits]) // eslint-disable-line react-hooks/exhaustive-deps

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleResend = async () => {
    if (!emailFromState || resendCooldown > 0) return
    setResending(true)
    setResendMsg('')
    setErrorMsg('')
    try {
      await authService.resendOtp(emailFromState)
      setResendMsg('A new code has been sent to your email.')
      setResendCooldown(30)
      setDigits(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? 'Could not resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-sm p-10 text-center">

        {/* ── SUCCESS ── */}
        {status === 'success' ? (
          <>
            <CheckIcon />
            <h1 className="text-2xl font-bold text-gray-900 mt-5 mb-2">Email verified!</h1>
            <p className="text-gray-500 text-sm">
              Your account is all set. Redirecting to your dashboard in{' '}
              <span className="font-semibold text-blue-600">{countdown}s</span>…
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <EnvelopeIcon />
            <h1 className="text-2xl font-bold text-gray-900 mt-5 mb-2">Check your inbox</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We sent a 6-digit code to{' '}
              {emailFromState
                ? <span className="font-medium text-gray-700">{emailFromState}</span>
                : 'your email address'
              }.{' '}Enter it below to activate your account.
            </p>

            {/* OTP boxes */}
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-3 mb-5" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    disabled={status === 'verifying'}
                    className={`
                      w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none
                      transition-colors focus:border-blue-500 bg-gray-50
                      ${d ? 'border-blue-400 text-blue-600' : 'border-gray-200 text-gray-900'}
                      ${status === 'verifying' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
              )}

              {resendMsg && (
                <p className="text-green-600 text-sm mb-4">{resendMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'verifying' || digits.some(d => d === '')}
                className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl
                           hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'verifying' ? 'Verifying…' : 'Verify Email'}
              </button>
            </form>

            <p className="text-gray-400 text-xs mt-5">
              Didn't receive it?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              >
                {resending
                  ? 'Sending…'
                  : resendCooldown > 0
                    ? `Resend code (${resendCooldown}s)`
                    : 'Resend code'}
              </button>
              {' '}or{' '}
              <Link to="/register" className="text-blue-600 hover:underline">register again</Link>.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
