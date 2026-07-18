import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import Loader from '../../components/ui/Loader'

// Public page — no login required. Anyone who scans the QR code on a
// Learnly certificate, or gets sent the /verify/:id link directly, lands
// here and can confirm the certificate is genuine.
export default function VerifyCertificate() {
  const { certificateId } = useParams()
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courseService.verifyCertificate(certificateId)
      .then(setResult)
      .catch(err => setResult(err.response?.data ?? { valid: false, message: 'Certificate not found' }))
      .finally(() => setLoading(false))
  }, [certificateId])

  if (loading) return <Loader />

  const dateStr = result?.completedAt
    ? new Date(result.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-gray-900">
            Learn<span className="text-primary-500">ly</span>
          </Link>
        </div>

        {result?.valid ? (
          <div className="card p-8 text-center border-2 border-green-200">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <h1 className="font-display text-lg font-bold text-gray-900 mb-1">Certificate Verified</h1>
            <p className="text-sm text-gray-500 mb-6">This is a genuine Learnly certificate.</p>

            <div className="text-left space-y-3 bg-surface-50 rounded-xl p-4 border border-gray-100">
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Awarded to</p>
                <p className="text-sm font-semibold text-gray-900">{result.studentName}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Course</p>
                <p className="text-sm font-semibold text-gray-900">{result.courseTitle}</p>
              </div>
              {result.instructor && (
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Instructor</p>
                  <p className="text-sm text-gray-700">{result.instructor}</p>
                </div>
              )}
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Completed</p>
                  <p className="text-sm text-gray-700">{dateStr}</p>
                </div>
                {result.score != null && (
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Score</p>
                    <p className="text-sm text-gray-700">{result.score}%</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Certificate ID</p>
                <p className="text-xs font-mono text-gray-500">{result.certificateId}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center border-2 border-red-200">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">❌</div>
            <h1 className="font-display text-lg font-bold text-gray-900 mb-1">Certificate Not Found</h1>
            <p className="text-sm text-gray-500">
              {result?.message || "We couldn't verify this certificate ID. Double-check the link and try again."}
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by <Link to="/" className="text-primary-600 hover:underline">Learnly</Link>
        </p>
      </div>
    </div>
  )
}
