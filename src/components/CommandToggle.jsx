import './CommandToggle.css'

function CommandToggle({ isCommandMode, onToggle }) {
  return (
    <div className="command-toggle-container">
      <label className="command-toggle-label">
        <span className="toggle-text">
          {isCommandMode ? 'Kommando' : 'Tale'}
        </span>
        <button
          className={`command-toggle ${isCommandMode ? 'active' : ''}`}
          onClick={onToggle}
          role="switch"
          aria-checked={isCommandMode}
          aria-label={isCommandMode ? 'Kommando-modus på' : 'Tale-modus på'}
        >
          <div className="toggle-slider"></div>
        </button>
      </label>
    </div>
  )
}

export default CommandToggle
