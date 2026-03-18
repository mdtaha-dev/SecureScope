/* ============================================================
   App.jsx — Root component for SecureScope
   
   Manages the top-level view state:
   - results === null  → show <LogInput /> (the input screen)
   - results !== null  → show <ResultsDashboard /> (analysis report)
   
   Passes onAnalyze and onReset callbacks down to children.
   ============================================================ */

import { useState } from 'react'
import Navbar from './components/Navbar'
import LogInput from './components/LogInput'
import ResultsDashboard from './components/ResultsDashboard'

function App() {
  // results holds the parsed JSON from the /analyze API.
  // When null, the input view is shown; when populated, the dashboard is shown.
  const [results, setResults] = useState(null)

  // Called by LogInput when the API returns successfully
  const handleAnalyze = (data) => {
    setResults(data)
    window.scrollTo(0, 0)
  }

  // Called by ResultsDashboard's "Analyze New Logs" button to reset the view
  const handleReset = () => {
    setResults(null)
    window.scrollTo(0, 0)
  }

  return (
    // dark class on the html element (in index.html) enables Tailwind dark mode
    <div className="min-h-screen bg-background text-on-surface">
      {/* Fixed top navigation bar — always visible */}
      <Navbar />

      {/* Main content area, padded below the fixed navbar */}
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
        {results === null ? (
          // INPUT VIEW: shown when no analysis has run yet
          <LogInput onAnalyze={handleAnalyze} />
        ) : (
          // RESULTS VIEW: shown after a successful analysis
          <ResultsDashboard results={results} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-outline-variant/10 text-center">
        <p className="text-[11px] text-on-surface-variant/40 tracking-widest uppercase">
          © 2025 SecureScope Intelligence — Encrypted Analysis Protocol Active
        </p>
      </footer>
    </div>
  )
}

export default App
