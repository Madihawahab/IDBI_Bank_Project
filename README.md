# SBI Life Moments AI---your personalised financial advisor

An intelligent, AI-first financial companion that understands you. Developed for State Bank of India, **SBI Life Moments AI** predicts your life events and guides you with transparent, personalized, customer-first recommendations.

## 🚀 Key Features

- **AI Advisor:** An interactive assistant providing smart, personalized financial advice.
- **Finances Hub:** Complete overview of accounts, income, expenses, investments, and financial goals.
- **Life Events Prediction:** Anticipate major life milestones (e.g., buying a home, education, retirement) and plan for them financially.
- **Money Mood:** Track and understand your relationship with money through interactive sentiment and behavioral insights.
- **Trust Ledger:** Transparent records of your recommendations, agreements, and secure financial history.
- **Personalized Offers:** Specially curated banking offers tailored to your predicted life events.

---

## 🛠️ Technology Stack

- **Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Full-stack React framework with SSR)
- **Routing:** [TanStack Router](https://tanstack.com/router) (Type-safe routing)
- **State & Fetching:** [TanStack React Query](https://tanstack.com/query) (Async state management)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Using `@tailwindcss/vite` compiler)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server:** [Vite](https://vite.dev/)
- **Server Layer:** [Nitro](https://nitro.build/)

---

## 💻 Local Development

Follow these steps to run the application locally:

### 1. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 2. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 3. Build for Production

To compile the application, build the assets, and package the Nitro server:

```bash
npm run build
```

You can preview the built production app locally using:

```bash
npx vite preview
```

---

## 🌐 Deployment to Vercel

This project is configured to deploy seamlessly to Vercel using **Nitro**.

### How it Works

When deployed to Vercel, the Nitro server engine automatically detects the environment and switches the build preset to `vercel`. It outputs the compiled Server-Side Rendered (SSR) handlers to `.vercel/output`, which Vercel serves as Serverless Functions.

### Vercel Project Settings

When setting up the project on Vercel, use the following settings:

- **Framework Preset:** `Other` (or `Vite`)
- **Build Command:** `npm run build`
- **Output Directory:** Default (Vercel will automatically detect and serve from the generated `.vercel/output` directory)
