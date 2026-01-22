import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import VoiceApp from './pages/VoiceApp'
import ResourcePortal from './pages/ResourcePortal'
import CategoryPage from './pages/CategoryPage'
import ResourcePage from './pages/ResourcePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="tale-app" element={<VoiceApp />} />
          <Route path="ressurser" element={<ResourcePortal />} />
          <Route path="kategori/:slug" element={<CategoryPage />} />
          <Route path="ressurs/:slug" element={<ResourcePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
