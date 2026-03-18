# SecureScope — AI-Powered Security Log Analyzer

A full-stack cybersecurity tool that analyzes raw server/auth logs using Groq AI and returns structured threat reports.

## Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS      |
| Backend   | Python FastAPI + Uvicorn            |
| AI Engine | Groq API (llama-3.3-70b-versatile)  |

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
    │   ├── prompt_builder.py   # Builds AI prompt
    │   └── response_parser.py  # Parses AI response
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

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Install Python dependencies
pip install -r requirements.txt

# Set your Groq API key
cp .env.example .env
# Open .env and replace `your_groq_api_key_here` with your real key

# Start the server
python -m uvicorn main:app --reload
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

---

## API Contract

### `POST /analyze`

**Request:**
```json
{ "logs": "" }
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

## Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google or email — no credit card required
3. Navigate to **API Keys** → **Create API Key**
4. Paste the key into `backend/.env`
```dotenv
GROQ_API_KEY=your_groq_api_key_here
```