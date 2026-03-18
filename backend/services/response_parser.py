# ============================================================
# services/response_parser.py — Claude response parser
#
# Safely parses the JSON returned by Claude.
# Handles cases where Claude wraps the JSON in markdown code
# fences (```json ... ```) despite being instructed not to.
# Raises ValueError if the response cannot be parsed or is
# missing required fields.
# ============================================================

import json
import re


def parse_response(raw: str) -> dict:
    """
    Parse the raw text response from Claude into a Python dict.

    Strips markdown code fences if present, then parses JSON.
    Validates that all required top-level keys are present.

    Args:
        raw: The raw string content from Claude's response.

    Returns:
        A dict matching the AnalyzeResponse schema.

    Raises:
        ValueError: If the response cannot be parsed or is invalid.
    """
    text = raw.strip()

    # Strip ```json ... ``` or ``` ... ``` code fences if Claude added them
    # despite being told not to (this happens occasionally)
    fence_pattern = re.compile(r'^```(?:json)?\s*(.*?)\s*```$', re.DOTALL)
    match = fence_pattern.match(text)
    if match:
        text = match.group(1).strip()

    # Attempt to parse the cleaned text as JSON
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Claude returned non-JSON content. Parse error: {e}\n"
            f"Raw response (first 500 chars): {raw[:500]}"
        )

    # Validate that required top-level keys exist
    required_keys = {"severity", "flagged_events", "summary", "recommendations"}
    missing = required_keys - set(data.keys())
    if missing:
        raise ValueError(
            f"Claude response is missing required fields: {missing}\n"
            f"Got keys: {list(data.keys())}"
        )

    # Ensure flagged_events is a list (not null)
    if not isinstance(data.get("flagged_events"), list):
        data["flagged_events"] = []

    # Ensure recommendations is a list
    if not isinstance(data.get("recommendations"), list):
        data["recommendations"] = []

    return data
