// Client-side persistence for the interactive lesson experience — notes,
// bookmarks, and last playback position. Scoped per (courseId, topicName)
// so switching topics or courses never mixes data up. Kept in localStorage
// rather than the backend since this is personal scratch data, not part of
// the course record or progress tracking.

function key(courseId, topicName, suffix) {
  return `learnly:lesson:${courseId}:${topicName}:${suffix}`
}

function readJSON(k, fallback) {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(k, value) {
  try {
    localStorage.setItem(k, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable — fail silently, it's non-critical
  }
}

export const lessonStorage = {
  getNotes(courseId, topicName) {
    return readJSON(key(courseId, topicName, 'notes'), '')
  },
  setNotes(courseId, topicName, text) {
    writeJSON(key(courseId, topicName, 'notes'), text)
  },

  getBookmarks(courseId, topicName) {
    return readJSON(key(courseId, topicName, 'bookmarks'), [])
  },
  addBookmark(courseId, topicName, bookmark) {
    const list = [...lessonStorage.getBookmarks(courseId, topicName), bookmark]
      .sort((a, b) => a.time - b.time)
    writeJSON(key(courseId, topicName, 'bookmarks'), list)
    return list
  },
  removeBookmark(courseId, topicName, id) {
    const list = lessonStorage.getBookmarks(courseId, topicName).filter(b => b.id !== id)
    writeJSON(key(courseId, topicName, 'bookmarks'), list)
    return list
  },

  getPosition(courseId, topicName) {
    return readJSON(key(courseId, topicName, 'position'), 0)
  },
  setPosition(courseId, topicName, seconds) {
    writeJSON(key(courseId, topicName, 'position'), seconds)
  },

  getPlaybackRate() {
    return readJSON('learnly:lesson:playbackRate', 1)
  },
  setPlaybackRate(rate) {
    writeJSON('learnly:lesson:playbackRate', rate)
  },
}
