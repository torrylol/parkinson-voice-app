import { useRef, useEffect } from 'react'
import './TextEditor.css'

function TextEditor({ text, onChange }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    // Auto-scroll to bottom when text changes
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [text])

  return (
    <div className="text-editor-container">
      <label htmlFor="text-editor" className="text-editor-label">
        Din tekst:
      </label>
      <textarea
        id="text-editor"
        ref={textareaRef}
        className="text-editor"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Teksten din vil dukke opp her..."
        rows={10}
        aria-label="Tekst-redigeringsfelt"
      />
    </div>
  )
}

export default TextEditor
