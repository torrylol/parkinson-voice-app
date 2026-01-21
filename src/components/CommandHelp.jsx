import './CommandHelp.css'

function CommandHelp({ commands, onClose }) {
  return (
    <div className="command-help-overlay" onClick={onClose}>
      <div className="command-help-panel" onClick={e => e.stopPropagation()}>
        <div className="command-help-header">
          <h2>Tilgjengelige kommandoer</h2>
          <button className="close-button" onClick={onClose} aria-label="Lukk">
            ×
          </button>
        </div>
        <div className="command-help-list">
          {commands.map((cmd, index) => (
            <div key={index} className="command-item">
              <span className="command-text">"{cmd.command}"</span>
              <span className="command-description">{cmd.description}</span>
            </div>
          ))}
        </div>
        <p className="command-help-tip">
          Si "hjelp" eller "kommandoer" for å vise denne listen
        </p>
      </div>
    </div>
  )
}

export default CommandHelp
