/* ============================================================
   FlaggedEventCard.jsx — Single security event card
   
   Props:
   - event: {
       line, content, threat, severity,
       timestamp, ip, user
     }
   
   Renders one flagged log entry with line number, threat badge,
   timestamp, the raw log line in monospace, and optional
   IP address / username metadata.
   ============================================================ */

import SeverityBadge from './SeverityBadge'

function FlaggedEventCard({ event }) {
  const { line, content, threat, severity, timestamp, ip, user } = event

  return (
    <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer group">
      {/* Card header: line number + threat badge on left, timestamp on right */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Line number indicator */}
          <span className="px-2 py-0.5 rounded bg-surface-container-highest text-[11px] font-mono text-on-surface-variant">
            L:{line ?? '—'}
          </span>
          {/* Threat type badge — color driven by severity */}
          <SeverityBadge threat={threat} severity={severity} label={threat} />
        </div>

        {/* Timestamp, if available */}
        {timestamp && (
          <span className="text-[11px] font-mono text-on-surface-variant/50">
            {timestamp}
          </span>
        )}
      </div>

      {/* Raw log line in monospace font */}
      <p className="font-mono text-[13px] text-on-surface leading-relaxed break-all bg-surface-container-lowest p-3 rounded border border-outline-variant/10">
        {content}
      </p>

      {/* Optional metadata: IP address and/or username */}
      {(ip || user) && (
        <div className="mt-3 flex items-center gap-4 text-[11px] text-on-surface-variant">
          {ip && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">public</span>
              IP: {ip}
            </span>
          )}
          {user && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">account_circle</span>
              User: {user}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default FlaggedEventCard
