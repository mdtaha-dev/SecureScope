# ============================================================
# routes/analyze.py — POST /analyze route handler
#
# This module defines the /analyze endpoint that:
# 1. Validates the incoming log text (via Pydantic schema)
# 2. Builds a prompt using prompt_builder
# 3. Calls the Anthropic Claude API
# 4. Parses and validates Claude's response
# 5. Returns the structured AnalyzeResponse JSON
# ============================================================

import os
from groq import Groq

from fastapi import APIRouter, HTTPException

from models.schemas import AnalyzeRequest, AnalyzeResponse
from services.prompt_builder import build_prompt
from services.response_parser import parse_response

# Create a FastAPI router — registered in main.py
router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_logs(request: AnalyzeRequest):
    """
    Analyze raw security logs using Groq (Llama 3.3).

    Accepts a JSON body with { "logs": "<log text>" } and returns
    a structured security analysis report.
    """
    # Validate that log text is not just whitespace
    if not request.logs.strip():
        raise HTTPException(
            status_code=422,
            detail="Log content cannot be empty. Please paste some log lines."
        )

    # Build the AI prompt from the log content
    prompt = build_prompt(request.logs)

    try:
        # Initialize the Groq client — reads GROQ_API_KEY from env
        # Note: Switched from Anthropic to Groq for faster inference and Llama 3.3 support.
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        # Call the Llama 3.3 70B model via Groq
        message = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            max_tokens=2000,
        )

        # Extract the raw text content from Groq's response
        raw_response = message.choices[0].message.content

    except Exception as e:
        # Generic error handling for Groq API issues
        # In a production app, you'd catch specific groq.APIError types.
        if "GROQ_API_KEY" not in os.environ or not os.environ["GROQ_API_KEY"]:
            raise HTTPException(
                status_code=500,
                detail="GROQ_API_KEY is not set. Please add it to backend/.env"
            )
        raise HTTPException(
            status_code=502,
            detail=f"Groq API error: {str(e)}"
        )

    # Parse Claude's JSON response into our schema
    try:
        result = parse_response(raw_response)
    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response: {str(e)}"
        )

    # Return as validated Pydantic model (FastAPI serializes it to JSON)
    return AnalyzeResponse(**result)
