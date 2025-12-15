// Parse Norwegian voice commands and return action objects

export function parseCommand(text, currentText) {
  const lowerText = text.toLowerCase().trim()

  // "slett siste ord" - Delete last word
  if (lowerText.includes('slett siste ord')) {
    return {
      type: 'DELETE_LAST_WORD',
      newText: deleteLastWord(currentText)
    }
  }

  // "slett siste setning" - Delete last sentence (to last period)
  if (lowerText.includes('slett siste setning')) {
    return {
      type: 'DELETE_LAST_SENTENCE',
      newText: deleteLastSentence(currentText)
    }
  }

  // "ny linje" - New line
  if (lowerText.includes('ny linje')) {
    return {
      type: 'NEW_LINE',
      newText: currentText + '\n'
    }
  }

  // "erstatt X med Y" - Replace X with Y
  const replaceMatch = lowerText.match(/erstatt (.+?) med (.+)/)
  if (replaceMatch) {
    const searchText = replaceMatch[1].trim()
    const replaceText = replaceMatch[2].trim()
    return {
      type: 'REPLACE',
      newText: replaceFirst(currentText, searchText, replaceText),
      searchText,
      replaceText
    }
  }

  // "fiks avsnitt" or "fiks tekst" - Fix text with API
  if (lowerText.includes('fiks avsnitt') || lowerText.includes('fiks tekst')) {
    return {
      type: 'FIX_TEXT',
      requiresAPI: true
    }
  }

  // Unknown command
  return {
    type: 'UNKNOWN',
    originalText: text
  }
}

// Helper: Delete last word
function deleteLastWord(text) {
  if (!text.trim()) return text

  const trimmed = text.trimEnd()
  const lastSpaceIndex = trimmed.lastIndexOf(' ')

  if (lastSpaceIndex === -1) {
    return '' // Only one word, delete it all
  }

  return trimmed.substring(0, lastSpaceIndex)
}

// Helper: Delete last sentence (to last period)
function deleteLastSentence(text) {
  if (!text.trim()) return text

  const lastPeriodIndex = text.lastIndexOf('.')

  if (lastPeriodIndex === -1) {
    return '' // No period found, delete all
  }

  // Keep the period and any whitespace before it
  return text.substring(0, lastPeriodIndex + 1)
}

// Helper: Replace first occurrence (case insensitive)
function replaceFirst(text, search, replace) {
  const lowerText = text.toLowerCase()
  const lowerSearch = search.toLowerCase()
  const index = lowerText.indexOf(lowerSearch)

  if (index === -1) {
    return text // Not found, return original
  }

  return text.substring(0, index) +
         replace +
         text.substring(index + search.length)
}
