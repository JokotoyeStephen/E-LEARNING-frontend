import { useState } from 'react'
import { courseService } from '../../services/courseService'
import { triggerBlobDownload } from '../../utils/download'
import { buildLinkedInAddUrl, buildVerifyUrl } from '../../utils/certificate'
import Button from '../ui/Button'

// Shown wherever a student has just completed (or previously completed) a
// course: lets them download the PDF certificate, share it to LinkedIn, and
// see/copy the public verification link tied to the QR code on the PDF.
export default function CertificateCard({ courseId, courseTitle, certificateId, completedAt, score }) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    setError('')
    try {
      const blob = await courseService.getCertificate(courseId)
      const safeName = (courseTitle || 'certificate').replace(/[^a-z0-9\- ]/gi, '').trim().replace(/\s+/g, '-')
      triggerBlobDownload(blob, `${safeName}-certificate.pdf`)
    } catch {
      setError('Could not download your certificate. Try again in a moment.')
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildVerifyUrl(certificateId))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard not available — ignore */ }
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">🎓</div>
        <div>
          <p className="text-sm font-bold text-gray-900">Course completed — certificate unlocked!</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {courseTitle ? `For "${courseTitle}"` : 'Download your certificate or add it to LinkedIn.'}
          </p>
          {certificateId && (
            <p className="text-[11px] text-gray-400 mt-1 font-mono">ID: {certificateId}</p>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <Button size="default" loading={downloading} onClick={handleDownload} className="!px-4 !py-2 text-sm">
          ⬇ Download PDF
        </Button>
        <a
          href={buildLinkedInAddUrl({ courseTitle, completedAt, certificateId })}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#0A66C2' }}
        >
          Share to LinkedIn
        </a>
        {certificateId && (
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copied ? '✓ Link copied' : '🔗 Copy verify link'}
          </button>
        )}
      </div>
    </div>
  )
}
