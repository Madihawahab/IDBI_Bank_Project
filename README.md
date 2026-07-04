# IDBI Life Moments AI — Your Personalised Financial Advisor

An intelligent, AI-first financial companion developed for **IDBI Bank**. **IDBI Life Moments AI** predicts customer life milestones and guides them with transparent, secure, and customer-first financial advice, powered by real-time account data and NVIDIA NIM AI models.

---

## 🚀 Key Features

- **Personalised Dashboard**: Comprehensive overview of accounts (Savings, Salary, Credit Card, and Fixed Deposit) with dynamic greeting, cash flow metrics (Income, Expenses, Net Worth), and interactive transfer, bill payment, and scan-pay forms.
- **Interactive History overlay**: Search, filter, and sort transactions inside the dashboard overlay dynamically.
- **AI Advisor**: Real-time multi-turn financial chat assistant powered by **NVIDIA NIM** (`meta/llama-3.1-70b-instruct`). Features keyboard shortcuts (`Enter`/`Shift+Enter`), automatic response tags, markdown support, inputs locking, and localStorage history preservation.
- **Life Events Hub**: Predicts major life milestones (e.g., buying a home, children's education, retirement) and suggests custom target plans.
- **Money Mood**: Analyses spending behavior and sentiment, offering visual mood indexes.
- **Trust Ledger**: A tamper-evident log showing bank recommendations, agreements, and acceptances.
- **Settings Panel**: Configures personal settings, notification flags, biometrics, and languages.
- **Production-Grade Auth UX**: Seamless Login and Registration flows with interactive inline error validation, request loading states, custom Axios refresh tokens interceptors, and strict field preservation on failure.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Full-stack React framework with SSR)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Type-safe file-based routing)
- **Async State**: [TanStack React Query v5](https://tanstack.com/query) (Cached query syncing & lightweight polling)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State management & HTTP client**: Axios (with credentials, automated retry, and `/auth/refresh` token interception)
- **Notifications**: Sonner

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python web framework)
- **Database ORM**: SQLAlchemy (Asynchronous PostgreSQL adapters)
- **Validation**: Pydantic v2 (BaseSettings config)
- **Caching**: Redis
- **AI Engine**: NVIDIA NIM SDK via a reusable, single-instance thread-safe `AsyncOpenAI` provider abstraction.

---

## 💻 Local Development Setup

### ⚙️ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

---

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install python packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the environment file (`backend/.env`)**:
   Create a `.env` file inside the `backend/` folder:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:<password>@localhost:5432/idbi_moments
   JWT_SECRET=supersecretjwtkeyforidbibankapp12345!
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=60
   JWT_REFRESH_EXPIRE_DAYS=7
   REDIS_URL=redis://localhost:6379/0
   NVIDIA_API_KEY=nvapi-your-key-here
   NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
   NVIDIA_MODEL=meta/llama-3.1-70b-instruct
   CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","http://localhost:5173","http://localhost:5174","http://127.0.0.1:3000","http://127.0.0.1:3001","http://127.0.0.1:5173","http://127.0.0.1:5174"]
   ```

5. **Seed the database**:
   Initialize and seed the tables with multi-account customer records:
   ```bash
   python -m app.db.init_db
   ```

6. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will run at `http://localhost:8000`.

---

### 2. Frontend Setup

1. **Navigate to the root directory**:
   ```bash
   cd ..
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure the environment file (`.env`)**:
   Create a `.env` file at the root level of the project:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run the dev server**:
   ```bash
   npm run dev
   ```
   Open the browser to the local port listed (usually `http://localhost:3000` or `http://localhost:5173`).

5. **Build and Preview for Production**:
   ```bash
   npm run build
   npx vite preview
   ```

---

## 🔒 Security Best Practices
- Dotenv configuration files (`.env`, `backend/.env`) are kept out of GitHub tracking via git ignore rules.
- Sensitive credentials (passwords, JWT and refresh tokens) are excluded from all logging routines.
