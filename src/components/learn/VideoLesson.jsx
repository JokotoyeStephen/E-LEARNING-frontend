import { useEffect, useRef, useState } from 'react'
import { getYouTubeId, loadYouTubeIframeAPI, formatTime } from '../../utils/youtube'
import { lessonStorage } from '../../utils/lessonStorage'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export default function VideoLesson({ courseId, topicName, videoUrl, highlights = [] }) {
  const videoId = getYouTubeId(videoUrl)
  const mountRef  = useRef(null)
  const playerRef = useRef(null)
  const saveTimer = useRef(null)

  const [ready,   setReady]   = useState(false)
  const [rate,    setRate]    = useState(() => lessonStorage.getPlaybackRate())
  const [bookmarks, setBookmarks] = useState(() => lessonStorage.getBookmarks(courseId, topicName))
  const [resumeAt, setResumeAt]   = useState(null)
  const [pipSupported, setPipSupported] = useState(false)

  // Mount the real YouTube player (not a bare iframe) so we get seekTo /
  // getCurrentTime / setPlaybackRate control.
  useEffect(() => {
    if (!videoId) return
    let cancelled = false
    let player = null

    loadYouTubeIframeAPI().then(YT => {
      if (cancelled || !mountRef.current) return
      player = new YT.Player(mountRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            playerRef.current = e.target
            e.target.setPlaybackRate(lessonStorage.getPlaybackRate())
            const saved = lessonStorage.getPosition(courseId, topicName)
            if (saved > 5) setResumeAt(saved)
            setReady(true)
          },
        },
      })
    })

    return () => {
      cancelled = true
      player?.destroy?.()
      playerRef.current = null
      clearInterval(saveTimer.current)
    }
  }, [videoId, courseId, topicName])

  // Auto-save playback position every few seconds while playing
  useEffect(() => {
    if (!ready) return
    saveTimer.current = setInterval(() => {
      const p = playerRef.current
      if (!p?.getCurrentTime) return
      const t = p.getCurrentTime()
      if (t > 1) lessonStorage.setPosition(courseId, topicName, t)
    }, 4000)
    return () => clearInterval(saveTimer.current)
  }, [ready, courseId, topicName])

  useEffect(() => {
    setPipSupported(typeof window !== 'undefined' && 'documentPictureInPicture' in window)
  }, [])

  if (!videoId) return null

  const seekTo = (seconds) => playerRef.current?.seekTo?.(seconds, true)

  const changeRate = (r) => {
    setRate(r)
    lessonStorage.setPlaybackRate(r)
    playerRef.current?.setPlaybackRate?.(r)
  }

  const addBookmark = () => {
    const p = playerRef.current
    if (!p?.getCurrentTime) return
    const time = Math.floor(p.getCurrentTime())
    const updated = lessonStorage.addBookmark(courseId, topicName, {
      id: `${Date.now()}`, time, label: `Bookmark at ${formatTime(time)}`,
    })
    setBookmarks(updated)
  }

  const removeBookmark = (id) => {
    setBookmarks(lessonStorage.removeBookmark(courseId, topicName, id))
  }

  const openPip = async () => {
    if (!pipSupported || !mountRef.current) return
    try {
      const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 480, height: 270 })
      // Move the live player node into the PiP window; the browser moves it back
      // to its original parent automatically when the PiP window closes.
      pipWindow.document.body.style.margin = '0'
      pipWindow.document.body.appendChild(mountRef.current.parentElement)
    } catch {
      // User dismissed the permission prompt or the browser blocked it — no-op
    }
  }

  return (
    <div>
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-900" style={{ aspectRatio: '16 / 9' }}>
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      </div>

      {resumeAt != null && (
        <div className="mt-2 flex items-center justify-between bg-primary-50 text-primary-700 text-xs rounded-lg px-3 py-2">
          <span>You were at {formatTime(resumeAt)} last time.</span>
          <div className="flex gap-3">
            <button onClick={() => { seekTo(resumeAt); setResumeAt(null) }} className="font-semibold hover:underline">Resume</button>
            <button onClick={() => setResumeAt(null)} className="text-primary-400 hover:underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <label className="text-xs text-gray-500">Speed:</label>
        <select value={rate} onChange={e => changeRate(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer">
          {SPEEDS.map(s => <option key={s} value={s}>{s}x</option>)}
        </select>

        <button onClick={addBookmark} disabled={!ready}
          className="text-xs font-semibold text-primary-600 border border-primary-200 rounded-lg px-2.5 py-1 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed">
          🔖 Bookmark this moment
        </button>

        {pipSupported && (
          <button onClick={openPip} disabled={!ready}
            className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ⧉ Picture-in-picture
          </button>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Key moments</h4>
          <div className="flex flex-wrap gap-1.5">
            {highlights.map((h, i) => (
              <button key={i} onClick={() => seekTo(h.time)}
                className="text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-600 rounded-full px-3 py-1 transition-colors">
                {formatTime(h.time)} · {h.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your bookmarks</h4>
          <div className="space-y-1">
            {bookmarks.map(b => (
              <div key={b.id} className="flex items-center justify-between text-xs bg-amber-50 text-amber-800 rounded-lg px-3 py-1.5">
                <button onClick={() => seekTo(b.time)} className="hover:underline text-left">
                  🔖 {formatTime(b.time)} — {b.label}
                </button>
                <button onClick={() => removeBookmark(b.id)} className="text-amber-400 hover:text-amber-600 ml-2 shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
