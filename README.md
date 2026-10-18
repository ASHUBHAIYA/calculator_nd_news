# BharatCalc — Financial Intelligence & Calculator Suite

> **Production-grade Indian financial calculator suite paired with real-time regulatory explainers, powered by Supabase for cloud data persistence and architected for edge deployment on Cloudflare Pages.**

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Admin Control Center & CMS](#-admin-control-center--cms)
4. [File & Directory Structure (What Each File Does)](#-file--directory-structure)
5. [How Explainers Work (Data Flow & Architecture)](#-how-explainers-work)
6. [How to Add More Explainers](#-how-to-add-more-explainers)
7. [Calculators & Mathematical Engines](#-calculators--mathematical-engines)
8. [Supabase Setup & SQL Schema](#-supabase-setup--sql-schema)
9. [Cloudflare Pages Deployment](#-cloudflare-pages-deployment)
10. [Environment Variables](#-environment-variables)
11. [Local Development](#-local-development)

---

## 🌟 Project Overview

**BharatCalc** is an all-in-one financial intelligence web application engineered specifically for the Indian economy. It unifies:

- **Admin Control Center (`/admin`)**: Fully encrypted, password-protected administrative portal to add, edit, and delete explainers, as well as live-edit all bullion spot rates, home loan prime rates, standard deductions, solar subsidies, fuel prices, and the 7 homepage hero ticker cards in real time.
- **5 High-Precision Interactive Calculators**: In-Hand Salary (FY 2026-27 Union Budget rules), Gold & Silver Jewelry Billing (with BIS hallmark purity, making charges, and GST), Home Loan Prepayment & Amortization, Daily Commute Fuel vs EV Cost comparison, and PM Surya Ghar Solar Rooftop ROI.
- **Trending Regulatory Explainers**: Authoritative, data-backed editorial deep-dives explaining market movements, tax amendments, and regulatory shifts, each paired with an embedded live calculator widget.
- **Supabase Cloud Persistence**: Scalable PostgreSQL persistence with Row-Level Security (RLS) for dynamic article publishing and user calculation history.
- **SEO & Social Sharing Optimization**: Schema.org JSON-LD structured data, dynamic OpenGraph meta tags, canonical link management, XML sitemaps, and robots.txt.
- **Cloudflare Pages Edge Architecture**: Static Single-Page Application (SPA) delivery with edge routing redirects and strict HTTP security headers.

---

## 🛡️ Admin Control Center & CMS

Access the administration dashboard at **`/admin`** (or click the "Admin" link in the top navigation bar or footer).

- **Authentication**: One-way SHA-256 cryptographic hash verification (salted client-side Web Crypto verification with session tokens).
- **Features**:
  1. **Explainers CMS**: Add new articles, edit existing Markdown articles, update categories, link calculators, attach primary citations, or delete articles.
  2. **Bullion & Precious Metals (with GitHub Auto-Deploy)**: Edit 24K, 22K (916), 18K Gold, 999 and 925 Silver spot benchmarks, making charges, GST %, BIS hallmarking fees, and city-level overrides. Features direct GitHub REST API sync (`data/site-config.json` commit) triggering automatic Cloudflare Pages redeployment in ~60s without Supabase or Cloudflare KV.
  3. **Live Ticker Cards**: Customise the 7 homepage hero benchmark cards (labels, values, deltas, and trend tags).
  4. **Tax & Salary Rules**: Edit the Standard Deduction (default ₹75,000), Section 87A rebate ceiling (₹7,00,000), EPFO annual interest rate (8.25%), Cess (4%), and Employer PF contribution (12%).
  5. **Home Loan & Mortgages**: Modify RBI Prime benchmark lending rates (8.40% – 8.65%) and default tenures.
  6. **Fuel & Energy Tariffs**: Set Petrol (₹104.2/L), Diesel (₹92.8/L), CNG (₹78.5/kg), and EV domestic/commercial charging unit rates.
  7. **PM Surya Ghar Solar Scheme**: Configure central DBT subsidies (₹30k for 1kW, ₹60k for 2kW, ₹78k for 3kW+) and installation cost benchmarks.
  8. **Database & Backup Sync**: Real-time Supabase connection diagnostics, export JSON backup, and one-click reset to statutory standards.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion |
| **Routing** | React Router v7 (SPA with client-side deep linking) |
| **Persistence & Database** | Supabase (PostgreSQL 15+ with Row Level Security) |
| **Markdown Rendering** | Marked (GFM formatted content with secure typography) |
| **Build & Dev Server** | Vite, Express with Vite Middlewares, TSX |
| **Deployment Target** | Cloudflare Pages (Frontend Edge CDN) & Supabase Cloud |

---

## 📂 File & Directory Structure

```
.
├── app/                                # Application Pages & View Routes
│   ├── calculators/                    # Calculator Route Pages
│   │   ├── commute-fuel/page.tsx       # Petrol vs EV Commute Fuel Calculator UI
│   │   ├── gold-jewelry-bill/page.tsx  # 24K/22K/18K Gold & Silver Hallmarking Bill UI
│   │   ├── home-loan-prepayment/page.tsx # RBI Prepayment & Loan Amortization UI
│   │   ├── in-hand-salary/page.tsx     # FY 2026-27 New vs Old Tax Regime Salary UI
│   │   └── solar-rooftop/page.tsx      # PM Surya Ghar Solar Rooftop Subsidy UI
│   ├── explainers/                     # Trending Explainers Editorial Hub
│   │   ├── ExplainerDetailPage.tsx     # Deep-dive article reader + interactive widget + SEO
│   │   └── ExplainersIndexPage.tsx     # Explainer feed, category filters, and search
│   ├── layout.tsx                      # Root layout with Header, Live Bullion Ticker & Footer
│   └── page.tsx                        # Homepage dashboard hub linking all tools
│
├── components/                         # Reusable UI & Core Modules
│   ├── AdBanner.tsx                    # Google AdSense responsive banner unit
│   ├── BullionTicker.tsx               # Live gold & silver market rate ticker
│   ├── ComplianceModal.tsx             # Legal, regulatory & tax disclaimer modal
│   ├── CreateExplainerModal.tsx        # Interactive authoring modal to publish new explainers
│   ├── ExplainerCalculatorWidget.tsx   # Interactive embedded calculator for article pages
│   ├── Footer.tsx                      # Global footer with navigation, disclaimers & version
│   ├── MarkdownContent.tsx             # Markdown parser & rich typography renderer
│   ├── Navbar.tsx                      # Navigation bar with calculator links & live status
│   └── SeoHead.tsx                     # Head manager (Title, Meta, OpenGraph, Schema JSON-LD)
│
├── data/                               # Local Fallback Data
│   └── articles.json                   # Server-side persisted article database fallback
│
├── lib/                                # Business Logic, State, and Utilities
│   ├── articlesData.ts                 # Initial authoritative explainer seed dataset
│   ├── formatters.ts                   # Indian currency (₹ Lakhs/Crores) & number formatters
│   ├── serverArticlesStorage.ts        # Node.js file-backed article storage fallback
│   ├── supabase.ts                     # Supabase client, queries, mutations & status
│   ├── calculators/                    # Pure, deterministic math calculation engines
│   │   ├── __tests__/                  # Unit test test-suites for financial accuracy
│   │   ├── fuel.ts                     # Commute fuel & EV mileage calculations
│   │   ├── gold.ts                     # Bullion purity, making charges, and GST logic
│   │   ├── loan.ts                     # EMI amortization & prepayment reduction logic
│   │   ├── salary.ts                   # FY 2026-27 Section 115BAC & Old Regime tax engine
│   │   └── solar.ts                    # MNRE PM Surya Ghar subsidy & rooftop solar ROI
│   └── types/                          # TypeScript definitions
│       └── article.ts                  # Article schema, categories, sources, and helpers
│
├── public/                             # Static Edge Assets for Cloudflare Pages
│   ├── _headers                        # Cloudflare Edge security headers & asset caching
│   ├── _redirects                      # SPA deep-linking rewrite rule (/* -> /index.html 200)
│   ├── robots.txt                      # Search crawler configuration
│   └── sitemap.xml                     # XML sitemap covering all calculators and explainers
│
├── src/                                # Vite Entry & Global Styles
│   ├── App.tsx                         # Client-side router and route definitions
│   ├── index.css                       # Global Tailwind CSS imports and custom styling
│   └── main.tsx                        # React DOM mounting entry point
│
├── supabase/                           # Database Schema & Migrations
│   └── schema.sql                      # Complete PostgreSQL schema, RLS policies & seed data
│
├── .env.example                        # Environment variable documentation & templates
├── CLOUDFLARE_PAGES.md                 # Complete Cloudflare Pages deployment walkthrough
├── package.json                        # Scripts and npm dependencies
├── server.ts                           # Express backend for local dev and preview proxy
├── tsconfig.json                       # TypeScript compiler configuration
└── vite.config.ts                      # Vite build pipeline and plugin configurations
```

---

## 🔍 How Explainers Work

The Explainer engine bridges **real-time financial news** with **actionable calculation tools**.

```
                       User requests /explainers
                                   │
                                   ▼
                   Does lib/supabase.ts have credentials?
                                   │
                   ┌───────────────┴───────────────┐
                   │ YES                           │ NO (Fallback)
                   ▼                               ▼
      Query Supabase PostgreSQL            Fetch /api/articles (Server storage)
      (articles table with RLS)            OR read lib/articlesData.ts (Memory)
                   │                               │
                   └───────────────┬───────────────┘
                                   │
                                   ▼
                     Render ExplainerDetailPage
                     - Full Markdown Body
                     - Live Sources & Citations
                     - Embedded Contextual Calculator Widget
                     - Schema.org NewsArticle Structured Data
```

### Data Flow Breakdown
1. **Repository Layer (`lib/supabase.ts`)**:
   - `fetchArticles(category?, search?)`: Fetches published articles ordered by publication date.
   - `fetchArticleBySlug(slug)`: Retrieves a single explainer by its unique URL slug and fires a view count increment.
   - `insertArticle(article)`: Publishes a new explainer directly to Supabase with instant client UI reactivity.
2. **Resilience & Fallback**:
   - If Supabase environment variables are connected, it communicates directly with your Supabase PostgreSQL cluster.
   - If you run the app locally without Supabase keys, it automatically falls back to `serverArticlesStorage.ts` / `data/articles.json` and `lib/articlesData.ts`, guaranteeing that the app **never crashes or displays empty screens**.

---

## ✍️ How to Add More Explainers

You can add explainers through **3 different methods**:

### Method 1: In-App Web UI (Fastest & Easiest)
1. Open the application in your browser.
2. Navigate to **"Trending Explainers"** (or URL `/explainers`).
3. Click the black **"Publish Explainer"** button in the top right.
4. Fill in the modal form:
   - **Title**: e.g., `Why Is Gold Hitting Record Highs This Week?`
   - **Slug**: Auto-generated from title, or enter a custom URL slug.
   - **Category**: Choose from `Gold & Commodities`, `Tax & Salary`, `Fuel & Energy`, or `Market Trends`.
   - **Related Calculator**: Link an interactive widget (`Gold Bill`, `Salary Tax`, `Home Loan`, `Fuel Commute`, `Solar Rooftop`, or `None`).
   - **Summary**: A concise 2-3 sentence overview.
   - **Full Content**: Write your article in standard **Markdown** (supports `# Headings`, `**bold**`, `- bullet lists`, `> callouts`, and tables).
   - **Sources & Citations**: Add primary source references with labels and URLs (e.g., *MCX India*, *Income Tax Department*).
5. Click **"Publish Explainer"**. The explainer is instantly saved to Supabase and published live!

---

### Method 2: Supabase Dashboard (Table Editor or SQL)
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and select **Table Editor** > `articles`.
3. Click **Insert row** and fill in:
   - `title`: `Understanding 18K vs 22K Gold for Diamond Jewelry`
   - `slug`: `understanding-18k-vs-22k-gold-diamond-jewelry`
   - `summary`: `Why luxury jewelers prefer 18 Karat gold for stone setting...`
   - `full_content`: `### 18K vs 22K Durability... (Markdown string)`
   - `category`: `Gold & Commodities`
   - `related_calculator`: `gold`
   - `sources`: `[{"label":"BIS Hallmarking Guidelines","url":"https://www.bis.gov.in"}]`
4. Or execute an SQL query in the **SQL Editor**:
   ```sql
   INSERT INTO public.articles (title, slug, summary, full_content, category, related_calculator, sources)
   VALUES (
     'How RBI Repo Rate Cuts Impact Your Home Loan EMI',
     'how-rbi-repo-rate-cuts-impact-home-loan-emi',
     'A 25 bps cut in RBI repo rates directly reduces floating mortgage EMIs...',
     '### Floating Rate Amortization Dynamics\n\nWhen the RBI MPC announces...',
     'Market Trends',
     'loan',
     '[{"label":"RBI Monetary Policy Statement","url":"https://rbi.org.in"}]'::jsonb
   );
   ```

---

### Method 3: Static Seed File (`lib/articlesData.ts`)
If you want to bundle explainers directly into the source code for static generation:
1. Open `lib/articlesData.ts`.
2. Add a new object to the `INITIAL_ARTICLES` array:
   ```typescript
   {
     id: 'article-custom-6',
     title: 'Sovereign Gold Bonds (SGB) vs Physical Gold Bullion in 2026',
     slug: 'sgb-vs-physical-gold-bullion-2026',
     summary: 'Comparing 2.5% annual sovereign interest, capital gains tax exemption, and liquidity...',
     category: 'Gold & Commodities',
     relatedCalculator: 'gold',
     sources: [
       { label: 'Reserve Bank of India (SGB Scheme)', url: 'https://rbi.org.in' }
     ],
     publishedAt: '2026-10-01T10:00:00.000Z',
     updatedAt: '2026-10-01T10:00:00.000Z',
     fullContent: `### SGB Tax Advantage\n\nUnlike physical gold which attracts capital gains tax...`
   }
   ```

---

## 🧮 Calculators & Mathematical Engines

All mathematical models are isolated in `lib/calculators/` and verified with test suites (`lib/calculators/__tests__/`):

1. **In-Hand Salary Calculator (`lib/calculators/salary.ts`)**:
   - Implements **FY 2026-27 Union Budget** New Tax Regime (Section 115BAC).
   - Standard Deduction: **₹75,000** for salaried employees.
   - Section 87A Tax Rebate for taxable income up to ₹7,00,000 (effective **₹0 tax up to ₹7,75,000** gross salary).
   - Accurate PF (Provident Fund at 12% of Basic), Professional Tax (state-tiered), and 4% Health & Education Cess.
2. **Gold & Jewelry Bill Calculator (`lib/calculators/gold.ts`)**:
   - Purity standards: 24K (99.9%), 22K (91.6% Hallmark 916), 18K (75.0%), and 14K (58.5%).
   - Accurate showroom billing formulas: `(Weight × Purity Rate) + Making Charges + 3% Statutory GST`.
3. **Home Loan Prepayment Calculator (`lib/calculators/loan.ts`)**:
   - Monthly reducing balance amortization formula: $EMI = \frac{P \times r \times (1+r)^n}{(1+r)^n - 1}$.
   - Prepayment simulation: One extra EMI/year, regular monthly surplus, or lump sum annual prepayments.
4. **Commute Fuel vs EV Calculator (`lib/calculators/fuel.ts`)**:
   - Petrol/Diesel vs Electric cost per km calculation, annual fuel bills, carbon emissions, and break-even payback timelines.
5. **PM Surya Ghar Solar Rooftop Calculator (`lib/calculators/solar.ts`)**:
   - Central MNRE subsidy computation (up to ₹78,000 for systems $\ge$ 3 kW).
   - Daily solar unit generation, monthly bill reduction, and payback timeline (3–4 years).

---

## 🗄 Supabase Setup & SQL Schema

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** and execute the entire contents of `supabase/schema.sql`.
3. This creates:
   - `articles` table with `id`, `title`, `slug`, `summary`, `full_content`, `category`, `sources`, and `fts` (full-text search vector index).
   - `saved_calculations` table for bookmarking custom calculations.
   - **Row Level Security (RLS)** policies allowing public read access and verified community inserts.
4. Copy your **Project URL** and **Anon Public Key** from **Project Settings > API** into your `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

---

## ⚡ Cloudflare Pages Deployment

The application is configured out-of-the-box for **Cloudflare Pages**:

1. **SPA Routing**: `public/_redirects` ensures all paths (e.g. `/explainers/why-did-gold-prices-surge-today`, `/calculators/in-hand-salary`) serve `index.html` with HTTP `200`.
2. **Edge Security**: `public/_headers` enforces `X-Content-Type-Options`, `X-Frame-Options`, and `Cache-Control` for static Vite chunks.
3. **Build Settings in Cloudflare Pages**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Node.js Version**: `20`
4. For detailed step-by-step instructions, see [`CLOUDFLARE_PAGES.md`](./CLOUDFLARE_PAGES.md).

---

## 🔑 Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Recommended | Supabase Project URL (e.g., `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Recommended | Supabase Anonymous Public Key |
| `VITE_ADSENSE_CLIENT_ID` | Optional | Google AdSense Publisher ID (e.g., `ca-pub-XXXXXXXXXX`) |
| `GOLD_API_KEY` | Optional | API Key from goldapi.io for live spot gold/silver feeds |
| `GEMINI_API_KEY` | Optional | Server-side Gemini API key for automated drafting |

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone <repo-url>
cd bharatcalc

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start development server (Port 3000)
npm run dev

# 5. Build for production (Generates dist/ for Cloudflare Pages)
npm run build

# 6. Run type checks
npm run lint
```

---

## 📄 License & Disclaimer

- **Regulatory Compliance**: All tax rules, gold hallmark purities, and loan prepayment calculations adhere to guidelines issued by the **Income Tax Department of India**, **Reserve Bank of India (RBI)**, and **Bureau of Indian Standards (BIS)**.
- Calculations are for informational and financial planning purposes.
