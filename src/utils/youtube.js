// Extracts a YouTube video ID from any common URL shape a user might paste:
//   https://www.youtube.com/watch?v=ID
//   https://youtu.be/ID
//   https://www.youtube.com/embed/ID
//   https://www.youtube.com/shorts/ID
// Returns null if the string doesn't look like a YouTube URL/ID at all.
export function getYouTubeId(url) {
  if (!url) return null

  const trimmed = url.trim()

  // Bare 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const re of patterns) {
    const match = trimmed.match(re)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Returns an embeddable YouTube URL
export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

// Returns the video's thumbnail
export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

// Loads the YouTube IFrame API only once.
// Gives access to the YT.Player object for:
// • Seeking to timestamps
// • Reading playback position
// • Controlling playback speed
// • Play / Pause / Stop
let ytApiPromise = null

export function loadYouTubeIframeAPI() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('No window object'))
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT)
  }

  if (ytApiPromise) {
    return ytApiPromise
  }

  ytApiPromise = new Promise(resolve => {
    const previousCallback = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve(window.YT)
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    }
  })

  return ytApiPromise
}

// Converts seconds into:
// 45 -> 0:45
// 125 -> 2:05
// 3725 -> 1:02:05
export function formatTime(totalSeconds) {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) {
    return '0:00'
  }

  const seconds = Math.max(0, Math.floor(totalSeconds))

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const mm =
    hours > 0
      ? String(minutes).padStart(2, '0')
      : String(minutes)

  const ss = String(remainingSeconds).padStart(2, '0')

  return hours > 0
    ? `${hours}:${mm}:${ss}`
    : `${mm}:${ss}`
}

// Converts:
// "2:30" -> 150
// "1:05:30" -> 3930
// "120" -> 120
export function parseTimeToSeconds(input) {
  if (input == null) {
    return null
  }

  const value = String(input).trim()

  if (/^\d+$/.test(value)) {
    return parseInt(value, 10)
  }

  const parts = value
    .split(':')
    .map(part => parseInt(part, 10))

  if (parts.some(Number.isNaN)) {
    return null
  }

  return parts.reduce((total, part) => total * 60 + part, 0)
}