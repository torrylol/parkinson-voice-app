// Parse Norwegian voice commands and return action objects

// Norwegian number words to digits
const numberWords = {
  'en': 1, 'ett': 1, 'én': 1,
  'to': 2,
  'tre': 3,
  'fire': 4,
  'fem': 5,
  'seks': 6,
  'sju': 7, 'syv': 7,
  'åtte': 8,
  'ni': 9,
  'ti': 10
}

function parseNumber(text) {
  // Try to parse as digit first
  const num = parseInt(text, 10)
  if (!isNaN(num) && num > 0 && num <= 20) return num
  // Try Norwegian word
  return numberWords[text.toLowerCase()] || null
}

export function parseCommand(text, currentText) {
  const lowerText = text.toLowerCase().trim()

  // "angre" - Undo last action
  if (lowerText.includes('angre')) {
    return {
      type: 'UNDO',
      description: 'Angret siste handling'
    }
  }

  // "slett alt" / "tøm tekst" / "fjern alt" - Clear all text
  if (lowerText.includes('slett alt') || lowerText.includes('tøm tekst') || lowerText.includes('fjern alt')) {
    return {
      type: 'CLEAR_ALL',
      newText: '',
      description: 'Slettet all tekst'
    }
  }

  // "slett siste X ord" - Delete last X words (check before single word delete)
  const deleteMultipleMatch = lowerText.match(/slett siste (\w+) ord/)
  if (deleteMultipleMatch) {
    const count = parseNumber(deleteMultipleMatch[1])
    if (count && count > 1) {
      return {
        type: 'DELETE_LAST_N_WORDS',
        newText: deleteLastNWords(currentText, count),
        count,
        description: `Slettet siste ${count} ord`
      }
    }
  }

  // "slett siste ord" - Delete last word
  if (lowerText.includes('slett siste ord')) {
    return {
      type: 'DELETE_LAST_WORD',
      newText: deleteLastWord(currentText),
      description: 'Slettet siste ord'
    }
  }

  // "slett siste setning" - Delete last sentence (to last period)
  if (lowerText.includes('slett siste setning')) {
    return {
      type: 'DELETE_LAST_SENTENCE',
      newText: deleteLastSentence(currentText),
      description: 'Slettet siste setning'
    }
  }

  // "nytt avsnitt" - New paragraph (double line break)
  if (lowerText.includes('nytt avsnitt')) {
    return {
      type: 'NEW_PARAGRAPH',
      newText: currentText.trimEnd() + '\n\n',
      description: 'Nytt avsnitt'
    }
  }

  // "ny linje" - New line
  if (lowerText.includes('ny linje')) {
    return {
      type: 'NEW_LINE',
      newText: currentText + '\n',
      description: 'Ny linje'
    }
  }

  // Punctuation commands
  if (lowerText.includes('punktum') || lowerText === '.') {
    return {
      type: 'INSERT_PUNCTUATION',
      newText: currentText.trimEnd() + '.',
      description: 'La til punktum'
    }
  }
  if (lowerText.includes('komma') || lowerText === ',') {
    return {
      type: 'INSERT_PUNCTUATION',
      newText: currentText.trimEnd() + ',',
      description: 'La til komma'
    }
  }
  if (lowerText.includes('spørsmålstegn') || lowerText === '?') {
    return {
      type: 'INSERT_PUNCTUATION',
      newText: currentText.trimEnd() + '?',
      description: 'La til spørsmålstegn'
    }
  }
  if (lowerText.includes('utropstegn') || lowerText === '!') {
    return {
      type: 'INSERT_PUNCTUATION',
      newText: currentText.trimEnd() + '!',
      description: 'La til utropstegn'
    }
  }
  if (lowerText.includes('kolon')) {
    return {
      type: 'INSERT_PUNCTUATION',
      newText: currentText.trimEnd() + ':',
      description: 'La til kolon'
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
      replaceText,
      description: `Erstattet "${searchText}" med "${replaceText}"`
    }
  }

  // "les opp" / "les teksten" - Read text aloud
  if (lowerText.includes('les opp') || lowerText.includes('les teksten')) {
    return {
      type: 'READ_ALOUD',
      requiresTTS: true,
      description: 'Leser opp teksten'
    }
  }

  // "fiks avsnitt" or "fiks tekst" - Fix text with API
  if (lowerText.includes('fiks avsnitt') || lowerText.includes('fiks tekst')) {
    return {
      type: 'FIX_TEXT',
      requiresAPI: true,
      description: 'Forbedrer teksten med AI'
    }
  }

  // "hjelp" / "kommandoer" - Show help
  if (lowerText.includes('hjelp') || lowerText.includes('kommandoer')) {
    return {
      type: 'SHOW_HELP',
      description: 'Viser tilgjengelige kommandoer'
    }
  }

  // Unknown command
  return {
    type: 'UNKNOWN',
    originalText: text
  }
}

// List of available commands for help display
export const availableCommands = [
  { command: 'slett siste ord', description: 'Sletter siste ord' },
  { command: 'slett siste [tall] ord', description: 'Sletter siste X ord (f.eks. "slett siste tre ord")' },
  { command: 'slett siste setning', description: 'Sletter til siste punktum' },
  { command: 'slett alt', description: 'Sletter all tekst' },
  { command: 'angre', description: 'Angrer siste handling' },
  { command: 'ny linje', description: 'Setter inn linjeskift' },
  { command: 'nytt avsnitt', description: 'Setter inn avsnittskift' },
  { command: 'punktum / komma / spørsmålstegn / utropstegn', description: 'Setter inn tegnsetting' },
  { command: 'erstatt [ord] med [nytt ord]', description: 'Erstatter tekst' },
  { command: 'fiks tekst', description: 'Forbedrer teksten med AI' },
  { command: 'les opp', description: 'Leser opp teksten høyt' },
  { command: 'hjelp', description: 'Viser denne listen' }
]

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

// Helper: Delete last N words
function deleteLastNWords(text, n) {
  if (!text.trim()) return text

  let result = text.trimEnd()
  for (let i = 0; i < n; i++) {
    const lastSpaceIndex = result.lastIndexOf(' ')
    if (lastSpaceIndex === -1) {
      return '' // No more words
    }
    result = result.substring(0, lastSpaceIndex)
  }
  return result
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
