import { useState } from 'react'
import './CopyButton.css'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      className={`copy-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      disabled={!text || copied}
      aria-label={copied ? 'Tekst kopiert' : 'Kopier tekst'}
    >
      {copied ? '✓ Kopiert!' : 'Kopier tekst'}
    </button>
  )
}

export default CopyButton
