/* ============================================================
   SeverityBadge.jsx — Color-coded severity/threat pill badge
   
   Props:
   - severity: "Critical" | "High" | "Medium" | "Low"
   - label: The text to display inside the badge
   
   Maps severity levels to the design-system color tokens so
   the color consistently conveys danger level throughout the UI.
   ============================================================ */

// Map severity to Tailwind color classes from our design tokens
const SEVERITY_CLASSES = {
  Critical: 'bg-error/20 text-error',
  High:     'bg-tertiary/20 text-tertiary',
  Medium:   'bg-secondary/20 text-secondary',
  Low:      'bg-primary/20 text-primary',
}

// Map threat types to severity for consistent coloring when no severity prop provided
const THREAT_SEVERITY_MAP = {
  'Brute Force': 'Critical',
  'Unauthorized Access': 'High',
  'Suspicious IP': 'High',
  'Port Scan': 'Medium',
  'Privilege Escalation': 'Critical',
  'Other': 'Low',
}

function SeverityBadge({ severity, label, threat }) {
  // Determine which severity to use for coloring
  // If a severity prop is provided, use it; otherwise derive it from the threat type
  const effectiveSeverity = severity || THREAT_SEVERITY_MAP[threat] || 'Low'
  const classes = SEVERITY_CLASSES[effectiveSeverity] || SEVERITY_CLASSES.Low

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${classes}`}>
      {label || threat || severity}
    </span>
  )
}

export default SeverityBadge
