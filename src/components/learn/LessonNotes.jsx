import { useEffect, useRef, useState } from 'react'
import { lessonStorage } from '../../utils/lessonStorage'

export default function LessonNotes({ courseId, topicName }) {
  const [text, setText] = useState('')
  const [savedAt, setSavedAt] = useState(null)
  const debounceRef = useRef(null)

  // Load whenever the topic changes
  useEffect(() => {
    setText(lessonStorage.getNotes(courseId, topicName))
    setSavedAt(null)
  }, [courseId, topicName])

  const onChange = (e) => {
    const value = e.target.value
    setText(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      lessonStorage.setNotes(courseId, topicName, value)
      setSavedAt(new Date())
    }, 600)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col h-full min-h-[220px]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your notes</h4>
        <span className="text-[10px] text-gray-300">
          {savedAt ? 'Saved' : 'Autosaves as you type'}
        </span>
      </div>
      <textarea
        value={text}
        onChange={onChange}
        placeholder="Jot down anything worth remembering from this lesson..."
        className="flex-1 w-full text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
      />
    </div>
  )
}
