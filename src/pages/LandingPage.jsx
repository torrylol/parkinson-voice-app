import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Parkinson Digitalhjelp</h1>
        <p className="landing-subtitle">Verktøy og tips for en enklere digital hverdag</p>
      </header>

      <main className="landing-main">
        <div className="landing-cards">
          <Link to="/tale-app" className="landing-card">
            <div className="landing-card-icon" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <h2>Tale-app</h2>
            <p>Bruk stemmen din til å skrive tekst. Perfekt når det er vanskelig å bruke tastaturet.</p>
          </Link>

          <Link to="/ressurser" className="landing-card">
            <div className="landing-card-icon" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <line x1="8" y1="6" x2="16" y2="6"/>
                <line x1="8" y1="10" x2="16" y2="10"/>
                <line x1="8" y1="14" x2="12" y2="14"/>
              </svg>
            </div>
            <h2>Ressurser</h2>
            <p>Tips og verktøy for å navigere den digitale hverdagen med Parkinson.</p>
          </Link>
        </div>
      </main>

      <footer className="landing-footer">
        <p>Utviklet i samarbeid med Norges Parkinsonforbund</p>
      </footer>
    </div>
  )
}

export default LandingPage
