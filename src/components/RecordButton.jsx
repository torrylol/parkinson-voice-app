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
  const isRecordingRef = useRef(false) // Ref version for immediate access in detectSilence

  // Stop recording when switching to command mode
  useEffect(() => {
    if (isCommandMode && isRecording) {
      stopRecording()
    }
  }, [isCommandMode, isRecording])

  const detectSilence = () => {
    // Use ref instead of state to avoid closure issues and race conditions
    if (!analyserRef.current || !isRecordingRef.current) {
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

    // Save current chunks BEFORE any operations
    const chunksToSend = [...currentBatchChunksRef.current]

    // Create blob from saved chunks
    const audioBlob = new Blob(chunksToSend, { type: 'audio/webm' })

    // Validate blob size (WebM files need minimum size to be valid - at least 0.5 seconds of audio)
    // At 100ms chunks, 3 seconds of silence = ~30 chunks, each ~500-2000 bytes = minimum 15KB
    if (audioBlob.size < 10000) {
      console.warn('Audio blob too small, skipping:', audioBlob.size, 'bytes')
      setIsProcessing(false)
      // Clear silence timer to restart detection
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      return
    }

    console.log('Processing batch with', chunksToSend.length, 'chunks, total size:', audioBlob.size, 'bytes')

    // Reset silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    // CRITICAL: Stop and restart MediaRecorder to get fresh WebM header for next batch
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording' && streamRef.current) {
      // Remove event handler from old recorder
      const oldRecorder = mediaRecorderRef.current
      oldRecorder.ondataavailable = null

      // Stop the current recorder (this may trigger final ondataavailable, but handler is now null)
      oldRecorder.stop()

      // Clear the batch array for the new recording
      currentBatchChunksRef.current = []

      // Small delay to let stop() complete
      await new Promise(resolve => setTimeout(resolve, 50))

      // Create and start new recorder
      const newRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm'
      })

      newRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Chunk received:', event.data.size, 'bytes. Current batch has', currentBatchChunksRef.current.length, 'chunks')
          audioChunksRef.current.push(event.data)
          currentBatchChunksRef.current.push(event.data)
        }
      }

      newRecorder.start(100)
      mediaRecorderRef.current = newRecorder
      console.log('MediaRecorder restarted for next batch')
    }

    // Send to API (this happens while new recording has started)
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
          console.log('Chunk received:', event.data.size, 'bytes. Current batch has', currentBatchChunksRef.current.length, 'chunks')
          audioChunksRef.current.push(event.data)
          currentBatchChunksRef.current.push(event.data)
        }
      }

      // Start recording with 100ms timeslice for continuous data
      mediaRecorder.start(100)

      // Set BOTH state and ref
      setIsRecording(true)
      isRecordingRef.current = true

      // Start silence detection AFTER setting the ref
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
    if (!mediaRecorderRef.current || !isRecordingRef.current) return

    // Set BOTH state and ref to false immediately to stop detectSilence loop
    setIsRecording(false)
    isRecordingRef.current = false

    // Stop media recorder
    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    // Wait a bit for final chunks to arrive before processing
    await new Promise(resolve => setTimeout(resolve, 200))

    // Process final batch if any
    if (currentBatchChunksRef.current.length > 0) {
      const finalBlob = new Blob(currentBatchChunksRef.current, { type: 'audio/webm' })
      if (finalBlob.size >= 10000) {
        console.log('Processing final batch:', finalBlob.size, 'bytes')
        await sendAudioToAPI(finalBlob)
      }
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
      console.log('Sending audio blob, size:', audioBlob.size, 'bytes')

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
        console.log('Transcription received:', data.text)
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
