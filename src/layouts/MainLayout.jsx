import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="main-layout">
      <Navigation />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
