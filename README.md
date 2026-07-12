# 🏦 Life Moments Avatar — IDBI Bank AI Wealth Advisor

> **IDBI Innovate Hackathon Submission** — AI-Powered Digital Wealth Management Application

An intelligent, avatar-based financial companion built for **IDBI Bank**. The **Life Moments Avatar** predicts customer life milestones, provides explainable AI-driven wealth advice, and executes real banking actions — all through a voice-enabled, multilingual animated avatar experience.

---

## 🎯 Problem Statement

Wealth management and advisory services remain fragmented and inaccessible to most retail banking customers. The absence of behavioral intelligence limits IDBI's ability to provide timely, personalized, data-driven guidance at scale.

**Our Solution:** An AI-first, avatar-driven wealth advisor that predicts life events, explains every recommendation, and executes actions — securely, transparently, and in the customer's own language.

---

## ✨ Core Features

### 🤖 Life Moments Avatar
An animated AI avatar with **4 emotional states** and **3 selectable personas**:
- **States:** Idle (floating) → Thinking (gears) → Speaking (waveform) → Celebrating (confetti)
- **Personas:** Companion | Advisor | Assistant
- Real-time voice synthesis reads all advice aloud via Web Speech API TTS

### 🔮 Predictive Life Event Detection
AI analyzes spending patterns, savings velocity, and transaction signals to predict:
- 🏠 Home Purchase — with mortgage readiness score
- ✈️ International Travel — with savings gap analysis
- 🎓 Children's Education — with corpus calculator
- 💒 Wedding Planning — with milestone timeline
- 🚗 Vehicle Purchase

Each prediction includes a **confidence score** and **explainable signal reasoning**.

### 💬 Conversational Wealth Advisory (NVIDIA NIM)
Multi-turn AI chat powered by **NVIDIA NIM (`meta/llama-3.1-70b-instruct`)**. Every response includes:
- 📊 Confidence score (%)
- 🔍 Observed financial signals
- 💡 Reasoning narrative
- 🔄 Alternative options
- 🚨 Human RM review flag when confidence < 70%

### ⚡ AI Execution Sandbox (Advisory → Action)
- Avatar recommends an action → pre-filled transaction form appears
- Customer authorizes via **4-digit PIN or FaceID biometric**
- Real banking action executes → Trust Ledger records it → Avatar celebrates
- Zero transactions without explicit authenticated consent

### 📈 Interactive What-If Milestone Simulator
- Drag a savings rate slider (₹5,000–₹50,000/month)
- All goal dates (Home, Travel, Education) shift **in real time**
- Shows exactly how much earlier each goal can be achieved
- "Apply Sweep Schedule" CTA connects directly to AI advisor

### 🌐 Multilingual Voice (10 Indian Languages)
When the app language changes, the avatar's voice switches automatically to native neural TTS:

| Language | Voice Code |
|---|---|
| Hindi | hi-IN |
| Tamil | ta-IN |
| Telugu | te-IN |
| Marathi | mr-IN |
| Gujarati | gu-IN |
| Bengali | bn-IN |

Enables true **Bharat-first financial inclusion** for semi-urban and rural India.

### 🏦 CBS & Account Aggregator Integration Console
A transparency dashboard for bank judges and integration engineers:
- **Tab 1 — Core Banking (ISO 20022):** Generates live `pain.001.001.08` XML payment messages — the same standard used by SWIFT, RBI RTGS/NEFT
- **Tab 2 — Account Aggregator (RBI AA):** Fetches multi-bank data (SBI, HDFC, ICICI) via the RBI AA framework with real-time consent toggle
- **Tab 3 — LlamaGuard Compliance:** Full audit log of AI safety decisions with blocked rogue query demonstration

### 💡 Floating Dashboard Avatar Nudges
- Avatar widget appears bottom-right on dashboard after 2 seconds
- Shows proactive AI-generated insight: *"You have ₹47,200 idle — sweep to earn 7.1% yield"*
- "Consult Avatar" button redirects to AI advisor with pre-filled query

### 📊 Trust Ledger (Explainable AI Audit Trail)
Every AI recommendation permanently recorded with:
- What action was taken and WHY
- Alternatives that were considered
- Multi-agent consensus (Risk, Planner, Compliance, Advocate agents)
- Counterfactual scenario comparison
- Wealth impact metrics
- Human RM review flag for high-stakes decisions

### 🧭 Additional Features
- **Personalised Dashboard:** Savings, Salary, Credit Card, FD accounts with cash flow metrics
- **Money Mood:** Spending behavior sentiment analysis with savings diagnostics
- **Settings Panel:** Notification flags, biometrics, theme, language preferences
- **Production Auth:** Login + Registration with JWT refresh tokens, inline validation

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) | Full-stack React SSR framework |
| [TanStack Router](https://tanstack.com/router) | Type-safe file-based routing |
| [TanStack React Query v5](https://tanstack.com/query) | Async state & API caching |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| Web Speech API | TTS (text-to-speech) + STT (speech-to-text) |
| Axios | HTTP client with JWT refresh interceptor |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | High-performance async Python API |
| SQLAlchemy (asyncpg) | Async PostgreSQL ORM |
| Pydantic v2 | Config validation (BaseSettings) |
| Redis | Session caching + rate limiting |
| NVIDIA NIM SDK | LLM via `AsyncOpenAI` thread-safe provider |

### AI & Integrations
| Technology | Purpose |
|---|---|
| NVIDIA NIM (`meta/llama-3.1-70b-instruct`) | Core wealth advisory LLM |
| LlamaGuard | AI safety classification layer |
| ISO 20022 (`pain.001.001.08`) | CBS payment message standard |
| RBI Account Aggregator Framework | Multi-bank financial data aggregation |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker Compose | 4-container orchestration |
| PostgreSQL | ACID-compliant transactional DB |
| Redis | High-speed caching layer |
| Nginx | Reverse proxy (production) |

---

## 💻 Local Development Setup

### ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

> **Port Note:** This app runs on **port 3001** by default. Configure in `package.json` → `"dev": "vinxi dev --port 3001"`.

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\\venv\\Scripts\\activate        # Windows
source venv/bin/activate         # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://postgres:<password>@localhost:5432/idbi_moments
JWT_SECRET=supersecretjwtkeyforidbibankapp12345!
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
JWT_REFRESH_EXPIRE_DAYS=7
REDIS_URL=redis://localhost:6379/0
NVIDIA_API_KEY=nvapi-your-nvidia-nim-key-here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","http://localhost:5173"]
```

```bash
# Seed the database with demo data
python -m app.db.init_db

# Start backend
uvicorn app.main:app --reload
# Backend runs at http://localhost:8000
```

---

### 2. Frontend Setup

```bash
# From project root
npm install
```

Create `.env` at project root:
```env
VITE_API_BASE_URL=http://localhost:8000
```

```bash
# Start dev server on port 3001
npm run dev
# Open http://localhost:3001
```

---

### 3. Docker Setup (Recommended)

```bash
# Start all services (Frontend + Backend + PostgreSQL + Redis)
docker-compose up --build

# App available at http://localhost:3001
```

---

## 🔐 Demo Credentials

| Field | Value |
|---|---|
| Email | `aarav.sharma@idbi.co.in` |
| Password | `demo1234` |
| Transaction PIN | `1234` |

---

## 🗺️ Application Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Authentication |
| `/app/dashboard` | Main financial dashboard + avatar nudge |
| `/app/ai-advisor` | Voice-enabled avatar wealth advisor |
| `/app/life-events` | Life event predictions + What-If simulator |
| `/app/trust-ledger` | Explainable AI audit trail |
| `/app/money-mood` | Spending sentiment analysis |
| `/app/integration` | CBS & AA Integration Console (judge demo) |
| `/app/settings` | User preferences + language + biometrics |

---

## 🔒 Security Architecture

- **Biometric/PIN Consent Gate:** No AI action executes without explicit user authentication
- **JWT + Refresh Tokens:** Auto-refresh with Axios interceptors; credentials never logged
- **LlamaGuard Safety Layer:** All user queries classified before reaching the LLM
- **Trust Ledger:** Immutable audit trail for every AI decision and transaction
- **DPAA Aligned:** Customer data consent model compliant with Digital Personal Data Protection Act
- **ISO 20022 Compliant:** All CBS interactions use internationally standardized payment messages
- **`.env` gitignored:** No secrets committed to version control

---

## 🏗️ Project Structure

```
IDBI_Bank_Project/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI route handlers
│   │   ├── db/           # SQLAlchemy models + init_db seed script
│   │   ├── schemas/      # Pydantic request/response models
│   │   └── main.py       # FastAPI app entry point
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── app-shell.tsx       # Global nav + layout
│   │   └── AvatarWidget.tsx    # Floating proactive nudge widget
│   ├── routes/
│   │   ├── _app.dashboard.tsx      # Dashboard + avatar nudge
│   │   ├── _app.ai-advisor.tsx     # Voice avatar + PIN consent
│   │   ├── _app.life-events.tsx    # Life events + What-If simulator
│   │   ├── _app.integration.tsx    # CBS & AA integration console
│   │   ├── _app.trust-ledger.tsx   # Explainable AI audit trail
│   │   ├── _app.money-mood.tsx     # Spending sentiment analysis
│   │   └── _app.settings.tsx       # User settings + language
│   └── lib/
│       └── translations.ts     # i18n strings for 10 languages
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 📊 Business Impact

| Metric | Expected Impact |
|---|---|
| Wealth AUM per customer | +35% via proactive sweep suggestions |
| SIP adoption | +40% via AI-nudged onboarding |
| Branch advisory visits | −60% via always-on digital advisor |
| Financial inclusion reach | 10x via multilingual voice in 10 languages |
| Advisory cost | ₹0.02/query (AI) vs ₹500/session (human RM) |

---

## 🚀 Roadmap

- **Phase 1 (Current):** Working prototype with NVIDIA NIM + all core features
- **Phase 2 (Pilot):** Integrate with IDBI's real CBS (Finacle/BaNCS) + actual RBI AA registry
- **Phase 3 (Scale):** Deploy to all 3.5 crore IDBI customers + React Native mobile app

---

*Built for IDBI Innovate Hackathon | Powered by NVIDIA NIM | Aligned with RBI guidelines*
