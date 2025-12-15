import { useState, useEffect } from 'react'
import './App.css'
import RecordButton from './components/RecordButton'
import CommandToggle from './components/CommandToggle'
import TextEditor from './components/TextEditor'
import CopyButton from './components/CopyButton'
import { parseCommand } from './utils/commandParser'

function App() {
  const [text, setText] = useState('')
  const [isCommandMode, setIsCommandMode] = useState(false)
  const [notification, setNotification] = useState('')
  const [isFixing, setIsFixing] = useState(false)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.error('Service Worker registration failed:', err))
    }
  }, [])

  const handleTranscription = async (transcribedText, inCommandMode) => {
    if (inCommandMode) {
      // Process as command
      const command = parseCommand(transcribedText, text)

      if (command.type === 'UNKNOWN') {
        showNotification('Kommando ikke gjenkjent: ' + command.originalText)
        return
      }

      if (command.type === 'FIX_TEXT') {
        await fixText()
        return
      }

      // Apply command
      setText(command.newText)
      showNotification('Kommando utført')
    } else {
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
    <div className="app">
      <header className="app-header">
        <h1>Parkinson Tale-app</h1>
        <CommandToggle
          isCommandMode={isCommandMode}
          onToggle={toggleCommandMode}
        />
      </header>

      <main className="app-main">
        <RecordButton
          onTranscription={handleTranscription}
          isCommandMode={isCommandMode}
        />

        <TextEditor
          text={text}
          onChange={setText}
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
    </div>
  )
}

export default App
