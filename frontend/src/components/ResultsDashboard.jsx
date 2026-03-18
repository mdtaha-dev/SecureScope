/* ============================================================
   ResultsDashboard.jsx — Analysis results view (STATE 2)
   
   Props:
   - results: {
       severity, flagged_events, summary, recommendations
     }
   - onReset(): callback to return to the LogInput view
   
   Layout:
   - Summary header card (severity score, event count, description)
   - Two-column grid:
     - Left (7/12): scrollable list of <FlaggedEventCard /> items
     - Right (5/12): sticky AI Threat Analyst panel with summary
                     and recommendations
   - "Analyze New Logs" reset button at the bottom of the right column
   ============================================================ */

import FlaggedEventCard from './FlaggedEventCard'

// Map overall severity to display color classes
const SEVERITY_COLORS = {
  Critical: { text: 'text-error', border: 'border-error/30', bg: 'bg-error/10', blur: 'bg-error' },
  High:     { text: 'text-tertiary', border: 'border-tertiary/30', bg: 'bg-tertiary/10', blur: 'bg-tertiary' },
  Medium:   { text: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10', blur: 'bg-secondary' },
  Low:      { text: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10', blur: 'bg-primary' },
}

// Severity sort order for sorting flagged events (most severe first)
const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }

// Icons to display next to each recommendation bullet
const RECOMMENDATION_ICONS = ['block', 'key', 'terminal', 'shield', 'lock', 'warning']

function ResultsDashboard({ results, onReset }) {
  const { severity, flagged_events = [], summary, recommendations = [] } = results

  // Sort flagged events from most to least severe
  const sortedEvents = [...flagged_events].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99)
  )

  // Get the color classes for the overall severity level
  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.Low

  return (
    <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">

      {/* ─── SUMMARY HEADER CARD ─────────────────────────────── */}
      <div className="w-full p-8 bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Severity score box with glow effect */}
          <div className="relative">
            <div className={`absolute inset-0 ${colors.blur} blur-xl opacity-20`} />
            <div className={`relative h-20 w-20 rounded-2xl ${colors.bg} border-2 ${colors.border} flex flex-col items-center justify-center`}>
              <span className={`${colors.text} font-headline text-3xl font-bold tracking-tight`}>
                {/* Show count of critical/high events as the score */}
                {String(sortedEvents.filter(e => e.severity === 'Critical' || e.severity === 'High').length).padStart(2, '0')}
              </span>
              <span className={`text-[10px] ${colors.text} font-bold uppercase tracking-widest`}>
                {severity}
              </span>
            </div>
          </div>

          {/* Summary text */}
          <div>
            <h2 className="text-2xl font-bold font-headline">Analysis Complete</h2>
            <p className="text-on-surface-variant max-w-md">
              Detected {flagged_events.length} security event{flagged_events.length !== 1 ? 's' : ''}.{' '}
              {severity === 'Critical' || severity === 'High'
                ? 'Immediate attention required.'
                : 'Review the flagged events below.'}
            </p>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <span className="block text-[10px] uppercase text-on-surface-variant tracking-tighter">
              Events Flagged
            </span>
            <span className="text-xl font-mono font-bold text-on-surface">
              {flagged_events.length}
            </span>
          </div>
          <div className="px-6 py-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <span className="block text-[10px] uppercase text-on-surface-variant tracking-tighter">
              Overall Risk
            </span>
            <span className={`text-xl font-mono font-bold ${colors.text}`}>{severity}</span>
          </div>
        </div>
      </div>

      {/* ─── TWO-COLUMN GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: Flagged events list (7/12 columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-lg font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">list</span>
              Flagged Events
            </h3>
            <span className="text-xs text-on-surface-variant/60">Sorted by Severity</span>
          </div>

          {sortedEvents.length > 0 ? (
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {sortedEvents.map((event, idx) => (
                <FlaggedEventCard key={idx} event={event} />
              ))}
            </div>
          ) : (
            // Empty state when no events were flagged
            <div className="p-8 text-center bg-surface-container-low rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">verified_user</span>
              <p className="text-on-surface-variant">No specific events were flagged.</p>
            </div>
          )}
        </div>

        {/* RIGHT: AI Threat Analyst panel (5/12 columns, sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-8 bg-surface-container rounded-2xl border border-outline-variant/20 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />

            {/* Panel header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  psychology
                </span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface leading-none">AI Threat Analyst</h3>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                  Intelligence Engine Active
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Threat Summary paragraph */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  Threat Summary
                </h4>
                <p className="text-on-surface text-sm leading-relaxed">{summary}</p>
              </div>

              {/* Recommendations list */}
              {recommendations.length > 0 && (
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-tertiary mb-3">
                    Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-on-surface-variant leading-normal">
                        <span className="material-symbols-outlined text-sm shrink-0" style={{ color: ['#ffb4ab', '#ffb68b', '#acc7ff'][idx % 3] }}>
                          {RECOMMENDATION_ICONS[idx % RECOMMENDATION_ICONS.length]}
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-high hover:bg-surface-bright text-on-surface font-bold rounded-xl border border-outline-variant/30 transition-all group"
          >
            <span className="material-symbols-outlined group-hover:-rotate-45 transition-transform">
              restart_alt
            </span>
            Analyze New Logs
          </button>
        </div>
      </div>
    </section>
  )
}

export default ResultsDashboard
