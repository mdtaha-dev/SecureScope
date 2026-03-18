/* ============================================================
   LogInput.jsx — Main log input screen (STATE 1)
   
   Local state:
   - logText:  the text typed/pasted into the textarea
   - loading:  true while waiting for the /analyze API response
   - error:    holds an error message string on failure, else null
   
   Props:
   - onAnalyze(data): callback called with the parsed JSON result
                      when the API call succeeds
   ============================================================ */

import { useState } from 'react'

// Placeholder log text shown in the textarea before the user types
const PLACEHOLDER = `Oct 12 14:02:11 dev-srv-01 sshd[21332]: Failed password for root from 192.168.1.105 port 54332 ssh2
Oct 12 14:02:14 dev-srv-01 sshd[21332]: Failed password for root from 192.168.1.105 port 54332 ssh2
Oct 12 14:02:18 dev-srv-01 sshd[21332]: Connection closed by 192.168.1.105 port 54332 [preauth]
Oct 12 14:05:01 dev-srv-01 CRON[21450]: pam_unix(cron:session): session opened for user root`

function LogInput({ onAnalyze }) {
  const [logText, setLogText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Compute line count from the current textarea value
  const lineCount = logText.trim()
    ? logText.split('\n').length.toLocaleString()
    : '0'

  // Handle the "Analyze Logs" button click
  const handleSubmit = async () => {
    // Validate: must have some log content
    if (!logText.trim()) {
      setError('Please paste some log content before analyzing.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // POST to /analyze — proxied to http://localhost:8000/analyze in dev
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logText }),
      })

      if (!res.ok) {
        // Try to parse a detail message from FastAPI error responses
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.detail || `Server error: ${res.status}`)
      }

      const data = await res.json()
      // Pass the result up to App.jsx which will switch to the results view
      onAnalyze(data)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center animate-in fade-in duration-700">
      {/* Hero text */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl font-bold font-headline tracking-tight text-on-surface">
          Analyze Security Logs{' '}
          <span className="text-primary italic">with AI</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">
          Paste your raw SSH, Auth, or System logs below. Our AI Sentinel will
          parse, categorize, and identify potential threat vectors in real-time.
        </p>
      </div>

      {/* Log input panel */}
      <div className="w-full max-w-5xl relative group">
        {/* Glowing gradient border on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />

        <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col shadow-2xl">
          {/* Fake terminal title bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/40" />
              <div className="w-3 h-3 rounded-full bg-tertiary/40" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/60">
              log_input_stream.txt
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-primary">SSH_AUTH_READY</span>
            </div>
          </div>

          {/* The main textarea where users paste logs */}
          <textarea
            className="w-full h-96 p-6 bg-transparent border-none focus:ring-0 font-mono text-sm text-secondary placeholder:text-outline/40 leading-relaxed resize-none custom-scrollbar outline-none"
            placeholder={PLACEHOLDER}
            value={logText}
            onChange={(e) => {
              setLogText(e.target.value)
              setError(null) // Clear error when user starts typing
            }}
            spellCheck={false}
          />

          {/* Status bar: line count, encoding, and Analyze button */}
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant/10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  Line Count
                </span>
                <span className="text-sm font-mono font-bold text-on-surface">{lineCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  Encoding
                </span>
                <span className="text-sm font-mono font-bold text-on-surface">UTF-8</span>
              </div>
            </div>

            {/* Analyze button — shows spinner while loading */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-lg shadow-[0_0_20px_rgba(47,129,247,0.3)] hover:shadow-[0_0_30px_rgba(47,129,247,0.5)] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  {/* Animated spinner icon when loading */}
                  <span
                    className="material-symbols-outlined text-lg animate-spin"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    progress_activity
                  </span>
                  Analyzing…
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    magic_button
                  </span>
                  Analyze Logs
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error message shown below the panel */}
      {error && (
        <div className="mt-4 w-full max-w-5xl flex items-center gap-3 p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      {/* Feature hint cards below the input panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary mb-3 block">security</span>
          <h3 className="font-bold mb-2">Threat Detection</h3>
          <p className="text-sm text-on-surface-variant">
            Automatically identify brute force, SQL injection, and unauthorized access patterns.
          </p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <span className="material-symbols-outlined text-tertiary mb-3 block">auto_graph</span>
          <h3 className="font-bold mb-2">Anomalous Activity</h3>
          <p className="text-sm text-on-surface-variant">
            Spot unusual user behavior and timed execution patterns with AI clustering.
          </p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <span className="material-symbols-outlined text-secondary mb-3 block">bolt</span>
          <h3 className="font-bold mb-2">Rapid Insights</h3>
          <p className="text-sm text-on-surface-variant">
            Get actionable recommendations and immediate security posture summaries.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LogInput
