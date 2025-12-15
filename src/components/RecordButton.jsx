import { useState, useRef } from 'react'
import './RecordButton.css'

function RecordButton({ onTranscription, isCommandMode }) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState('')
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await sendAudioToAPI(audioBlob)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Recording error:', err)
      setError('Kunne ikke starte opptak. Sjekk mikrofon-tillatelser.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const sendAudioToAPI = async (audioBlob) => {
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/webm',
        },
        body: audioBlob,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Transkribering feilet')
      }

      if (data.text) {
        onTranscription(data.text, isCommandMode)
      }
    } catch (err) {
      console.error('Transcription error:', err)
      setError(`Transkribering feilet: ${err.message}`)
    }
  }

  const handleMouseDown = () => {
    startRecording()
  }

  const handleMouseUp = () => {
    stopRecording()
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    startRecording()
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    stopRecording()
  }

  return (
    <div className="record-button-container">
      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={stopRecording}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={isRecording ? 'Tar opp...' : 'Hold inne for å ta opp'}
      >
        <div className="record-icon">
          {isRecording ? (
            <div className="recording-pulse"></div>
          ) : (
            <div className="microphone-icon"></div>
          )}
        </div>
      </button>

      <p className="record-instruction">
        {isRecording ? 'Snakk nå... Slipp for å stoppe' : 'Hold inne for å ta opp'}
      </p>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

export default RecordButton
