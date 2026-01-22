import { NavLink, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  // Don't show navigation on landing page
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className="main-nav" aria-label="Hovednavigasjon">
      <NavLink to="/" className="nav-home-link">
        Parkinson Digitalhjelp
      </NavLink>
      <div className="nav-links">
        <NavLink
          to="/tale-app"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Tale-app
        </NavLink>
        <NavLink
          to="/ressurser"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Ressurser
        </NavLink>
      </div>
    </nav>
  )
}

export default Navigation
