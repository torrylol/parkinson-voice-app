import { useState, useRef, useEffect } from 'react'
import './RecordButton.css'

function RecordButton({ onTranscription, isCommandMode }) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const maxRecordingTimerRef = useRef(null)
  const currentBatchChunksRef = useRef([])

  // Stop recording when switching to command mode
  useEffect(() => {
    if (isCommandMode && isRecording) {
      stopRecording()
    }
  }, [isCommandMode])

  const detectSilence = () => {
    if (!analyserRef.current || !mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
      return
    }

    const bufferLength = analyserRef.current.fftSize
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteTimeDomainData(dataArray)

    // Calculate audio level (RMS)
    let sum = 0
    for (let i = 0; i < bufferLength; i++) {
      const normalized = (dataArray[i] - 128) / 128
      sum += normalized * normalized
    }
    const rms = Math.sqrt(sum / bufferLength)

    // Threshold for silence - higher value = more sensitive (0.01 is good for normal speech)
    const SILENCE_THRESHOLD = 0.01

    if (rms < SILENCE_THRESHOLD) {
      // Start silence timer if not already started
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          // 3 seconds of silence detected, send batch
          processBatch()
        }, 3000)
      }
    } else {
      // Clear silence timer if sound detected
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
    }

    // Continue monitoring
    requestAnimationFrame(detectSilence)
  }

  const processBatch = async () => {
    if (currentBatchChunksRef.current.length === 0) return

    // Don't process if already processing
    if (isProcessing) return

    setIsProcessing(true)

    // Create blob from current batch
    const audioBlob = new Blob(currentBatchChunksRef.current, { type: 'audio/webm' })

    // Clear current batch (ready for next batch while this one processes)
    currentBatchChunksRef.current = []

    // Reset silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    // Send to API (this happens in background while recording continues)
    try {
      await sendAudioToAPI(audioBlob)
    } catch (error) {
      console.error('Batch processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio context for silence detection
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8

      source.connect(analyser)
      analyserRef.current = analyser

      // Set up MediaRecorder with timeslice for continuous chunks
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      currentBatchChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          currentBatchChunksRef.current.push(event.data)
        }
      }

      // Start recording with 100ms timeslice for continuous data
      mediaRecorder.start(100)
      setIsRecording(true)

      // Start silence detection
      detectSilence()

      // Auto-stop after 10 minutes
      maxRecordingTimerRef.current = setTimeout(() => {
        stopRecording()
      }, 10 * 60 * 1000) // 10 minutes

    } catch (err) {
      console.error('Recording error:', err)
      setError('Kunne ikke starte opptak. Sjekk mikrofon-tillatelser.')
    }
  }

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return

    // Set state to false immediately to stop detectSilence loop
    setIsRecording(false)

    // Stop media recorder
    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    // Process final batch if any
    if (currentBatchChunksRef.current.length > 0) {
      await processBatch()
    }

    // Clean up
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (maxRecordingTimerRef.current) {
      clearTimeout(maxRecordingTimerRef.current)
      maxRecordingTimerRef.current = null
    }

    mediaRecorderRef.current = null
    analyserRef.current = null
  }

  const sendAudioToAPI = async (audioBlob) => {
    try {
      // Create FormData to send the audio file
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
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

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="record-button-container">
      <button
        className={`record-button ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
        onClick={handleToggleRecording}
        disabled={isProcessing}
        aria-label={isRecording ? 'Stopp opptak' : 'Start opptak'}
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
        {isRecording
          ? 'Snakk nå... Pause sender tekst automatisk'
          : isProcessing
            ? 'Behandler...'
            : 'Klikk for å starte opptak'}
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
