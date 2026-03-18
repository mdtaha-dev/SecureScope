# ============================================================
# main.py — FastAPI application entry point for SecureScope
#
# Responsibilities:
# - Load environment variables from .env (ANTHROPIC_API_KEY)
# - Configure CORS so the Vite frontend can talk to this server
# - Register the /analyze router
# - Expose a simple GET /health liveness endpoint
#
# Run with:  uvicorn main:app --reload --port 8000
# ============================================================

from dotenv import load_dotenv

# Load .env file BEFORE importing routes (so API key is in env)
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router as analyze_router

# Create the FastAPI application
app = FastAPI(
    title="SecureScope API",
    description="AI-Powered Security Log Analyzer — powered by Anthropic Claude",
    version="1.0.0",
)

# ── CORS Configuration ────────────────────────────────────────
# Allow the Vite dev server (port 5173) to make requests.
# In production, replace with your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Route Registration ────────────────────────────────────────
# Register the /analyze endpoint (POST)
app.include_router(analyze_router)


# ── Health Check ──────────────────────────────────────────────
@app.get("/health")
async def health():
    """
    Simple liveness check.
    Returns {"status": "ok"} when the server is running.
    """
    return {"status": "ok"}
