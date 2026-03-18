# SecureScope — AI-Powered Security Log Analyzer

A full-stack cybersecurity tool that analyzes raw server/auth logs using Anthropic Claude AI and returns structured threat reports.

## Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS      |
| Backend   | Python FastAPI + Uvicorn            |
| AI Engine | Anthropic Claude claude-sonnet-4-20250514 |

---

## Project Structure

```
securescope/
├── frontend/           # Vite + React app
│   ├── src/
│   │   ├── components/ # Navbar, LogInput, ResultsDashboard, FlaggedEventCard, SeverityBadge
│   │   ├── App.jsx     # Root component, view state
│   │   ├── main.jsx    # React entry point
│   │   └── index.css   # Tailwind + global styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── backend/            # FastAPI server
    ├── main.py         # App init, CORS, /health
    ├── routes/
    │   └── analyze.py  # POST /analyze
    ├── services/
    │   ├── prompt_builder.py   # Builds Claude prompt
    │   └── response_parser.py  # Parses Claude response
    ├── models/
    │   └── schemas.py          # Pydantic request/response models
    ├── .env.example
    └── requirements.txt
```

---

## Setup & Running

### 1. Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set your Anthropic API key
cp .env.example .env
# Open .env and replace `your_anthropic_api_key_here` with your real key

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Health check: `GET http://localhost:8000/health` → `{"status":"ok"}`

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

> The Vite dev server proxies all `/analyze` and `/health` requests to `http://localhost:8000` automatically.

---

## API Contract

### `POST /analyze`

**Request:**
```json
{ "logs": "<raw log text>" }
```

**Response:**
```json
{
  "severity": "Critical | High | Medium | Low",
  "flagged_events": [
    {
      "line": 42,
      "content": "sshd[21332]: Failed password for root from 192.168.1.105 port 54332 ssh2",
      "threat": "Brute Force | Unauthorized Access | Suspicious IP | Port Scan | Privilege Escalation | Other",
      "severity": "Critical | High | Medium | Low",
      "timestamp": "14:02:11 UTC",
      "ip": "192.168.1.105",
      "user": "root"
    }
  ],
  "summary": "Plain English threat summary paragraph",
  "recommendations": ["Action 1", "Action 2", "Action 3"]
}
```

### `GET /health`

```json
{ "status": "ok" }
```

---

## Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and navigate to **API Keys**
3. Generate a new key and paste it into `backend/.env`
