# ============================================================
# services/prompt_builder.py — Claude prompt construction
#
# Builds the user message sent to Claude for log analysis.
# The prompt instructs Claude to return ONLY valid JSON matching
# the API contract, with no extra text or markdown fences.
# ============================================================


def build_prompt(logs: str) -> str:
    """
    Construct the user prompt for the Claude API.

    Args:
        logs: Raw log text pasted by the user.

    Returns:
        A formatted string prompt ready to send to Claude.
    """
    return f"""You are a cybersecurity expert tasked with analyzing server/auth logs.

Analyze the following raw log data and identify all security threats, suspicious activity, and anomalies.

LOGS:
```
{logs}
```

Respond with ONLY a valid JSON object — no markdown code fences, no extra text, no explanation outside the JSON.

The JSON must follow this exact structure:
{{
  "severity": "<Overall severity: one of Critical | High | Medium | Low>",
  "flagged_events": [
    {{
      "line": <integer line number or null>,
      "content": "<the exact raw log line>",
      "threat": "<one of: Brute Force | Unauthorized Access | Suspicious IP | Port Scan | Privilege Escalation | Other>",
      "severity": "<one of: Critical | High | Medium | Low>",
      "timestamp": "<time string from log such as '14:02:11 UTC', or null>",
      "ip": "<extracted IP address string, or null>",
      "user": "<extracted username string, or null>"
    }}
  ],
  "summary": "<A plain-English paragraph describing the overall threat landscape found in the logs>",
  "recommendations": [
    "<Specific, actionable remediation step 1>",
    "<Specific, actionable remediation step 2>",
    "<Specific, actionable remediation step 3>"
  ]
}}

Rules:
- Only flag genuinely suspicious or malicious entries. Ignore routine/normal log lines.
- Assign overall "severity" based on the most critical threat found.
- Provide 3-5 targeted, actionable recommendations.
- Keep the summary concise but informative (2-4 sentences).
- If no threats are found, return severity "Low", an empty flagged_events array, and an appropriate summary.
"""
