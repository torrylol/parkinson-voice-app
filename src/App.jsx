import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [isCommandMode, setIsCommandMode] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Parkinson Tale-app</h1>
      </header>

      <main className="app-main">
        <p>App starter snart...</p>
      </main>
    </div>
  )
}

export default App
