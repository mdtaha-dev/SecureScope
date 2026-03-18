# ============================================================
# models/schemas.py — Pydantic data models for SecureScope
#
# Defines the request and response shapes used by the /analyze
# endpoint, validated automatically by FastAPI.
# ============================================================

from pydantic import BaseModel
from typing import Optional


# ── Request ──────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    """
    Incoming request from the frontend.
    logs: The raw log text pasted by the user.
    """
    logs: str


# ── Response ─────────────────────────────────────────────────

class FlaggedEvent(BaseModel):
    """
    A single suspicious log entry identified by Claude.
    All fields except content and threat are optional because
    not every log line contains an IP, user, or timestamp.
    """
    line: Optional[int] = None          # Line number in the original log
    content: str                         # The raw log line text
    threat: str                          # Threat category label
    severity: str                        # Critical | High | Medium | Low
    timestamp: Optional[str] = None      # Time string from the log, or null
    ip: Optional[str] = None             # Extracted IP address, or null
    user: Optional[str] = None           # Extracted username, or null


class AnalyzeResponse(BaseModel):
    """
    Full analysis result returned to the frontend.
    """
    severity: str                         # Overall severity: Critical | High | Medium | Low
    flagged_events: list[FlaggedEvent]    # List of suspicious events found
    summary: str                          # Plain-English threat summary paragraph
    recommendations: list[str]           # Actionable remediation steps
