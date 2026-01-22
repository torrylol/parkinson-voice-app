import { useState, useEffect, useRef } from 'react'
import './VoiceApp.css'
import RecordButton from '../components/RecordButton'
import CommandToggle from '../components/CommandToggle'
import TextEditor from '../components/TextEditor'
import CopyButton from '../components/CopyButton'
import CommandHelp from '../components/CommandHelp'
import { parseCommand, availableCommands } from '../utils/commandParser'

const MAX_HISTORY = 50 // Maximum undo steps

function VoiceApp() {
  const [text, setText] = useState('')
  const [isCommandMode, setIsCommandMode] = useState(false)
  const [notification, setNotification] = useState('')
  const [isFixing, setIsFixing] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Text history for undo
  const textHistoryRef = useRef([])
  const isUndoingRef = useRef(false)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.error('Service Worker registration failed:', err))
    }
  }, [])

  // Save text to history (for undo)
  const saveToHistory = (currentText) => {
    if (isUndoingRef.current) return // Don't save during undo
    textHistoryRef.current.push(currentText)
    if (textHistoryRef.current.length > MAX_HISTORY) {
      textHistoryRef.current.shift()
    }
  }

  // Undo last action
  const undo = () => {
    if (textHistoryRef.current.length === 0) {
      showNotification('Ingenting å angre')
      return false
    }
    isUndoingRef.current = true
    const previousText = textHistoryRef.current.pop()
    setText(previousText)
    isUndoingRef.current = false
    return true
  }

  // Read text aloud using TTS
  const readAloud = () => {
    if (!text.trim()) {
      showNotification('Ingen tekst å lese')
      return
    }
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'no-NO' // Norwegian
      utterance.rate = 0.9 // Slightly slower for clarity

      // Try to find a Norwegian voice
      const voices = window.speechSynthesis.getVoices()
      const norwegianVoice = voices.find(v => v.lang.startsWith('no') || v.lang.startsWith('nb'))
      if (norwegianVoice) {
        utterance.voice = norwegianVoice
      }

      window.speechSynthesis.speak(utterance)
      showNotification('Leser opp teksten...')
    } else {
      showNotification('Talesyntese er ikke støttet i denne nettleseren')
    }
  }

  const handleTranscription = async (transcribedText, inCommandMode) => {
    if (inCommandMode) {
      // Process as command
      const command = parseCommand(transcribedText, text)

      if (command.type === 'UNKNOWN') {
        showNotification('Kommando ikke gjenkjent: ' + command.originalText)
        return
      }

      // Handle special commands that don't modify text directly
      if (command.type === 'UNDO') {
        if (undo()) {
          showNotification(command.description)
        }
        return
      }

      if (command.type === 'FIX_TEXT') {
        await fixText()
        return
      }

      if (command.type === 'READ_ALOUD') {
        readAloud()
        return
      }

      if (command.type === 'SHOW_HELP') {
        setShowHelp(true)
        showNotification(command.description)
        return
      }

      // Save current text to history before applying command
      saveToHistory(text)

      // Apply command that modifies text
      setText(command.newText)
      showNotification(command.description || 'Kommando utført')
    } else {
      // Save current text to history before adding new text
      saveToHistory(text)
      // Add transcribed text
      setText(prev => prev ? prev + ' ' + transcribedText : transcribedText)
    }
  }

  const fixText = async () => {
    if (!text.trim()) {
      showNotification('Ingen tekst å fikse')
      return
    }

    setIsFixing(true)
    try {
      const response = await fetch('/api/fix-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Tekstforbedring feilet')
      }

      setText(data.text)
      showNotification('Tekst forbedret!')
    } catch (err) {
      showNotification(`Feil: ${err.message}`)
    } finally {
      setIsFixing(false)
    }
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  const toggleCommandMode = () => {
    setIsCommandMode(prev => !prev)
  }

  return (
    <div className="voice-app">
      <div className="voice-app-header">
        <h1>Tale-app</h1>
        <CommandToggle
          isCommandMode={isCommandMode}
          onToggle={toggleCommandMode}
        />
      </div>

      <main className="voice-app-main">
        <RecordButton
          onTranscription={handleTranscription}
          isCommandMode={isCommandMode}
        />

        {isCommandMode && (
          <button
            className="help-button"
            onClick={() => setShowHelp(true)}
            aria-label="Vis kommandoer"
          >
            ? Vis kommandoer
          </button>
        )}

        <TextEditor
          text={text}
          onChange={(newText) => {
            saveToHistory(text)
            setText(newText)
          }}
        />

        <div className="button-row">
          <CopyButton text={text} />
          <button
            className="fix-text-button"
            onClick={fixText}
            disabled={!text.trim() || isFixing}
          >
            {isFixing ? 'Forbedrer...' : 'Fiks tekst'}
          </button>
        </div>

        {notification && (
          <div className="notification" role="alert">
            {notification}
          </div>
        )}
      </main>

      {showHelp && (
        <CommandHelp
          commands={availableCommands}
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  )
}

export default VoiceApp
