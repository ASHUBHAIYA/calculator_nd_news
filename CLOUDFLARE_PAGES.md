# BharatCalc — Cloudflare Pages & Supabase Deployment Architecture

This application is engineered for deployment on **Cloudflare Pages** backed by a **Supabase PostgreSQL** database with client-side edge direct querying, Row-Level Security (RLS), and zero-server latency.

---

## 1. Quick Architecture Overview

```
                                    +--------------------------------+
                                    |    Cloudflare Global Edge      |
                                    |   (Cloudflare Pages CDN)       |
                                    +--------------------------------+
                                           /                 \
                     Static Assets (JS/CSS/HTML)      SPA Routing (_redirects)
                                         /                     \
+------------------------------------+          +------------------------------------+
|  Client Browser (React 19 + Vite)  | -------->|  Supabase Cloud (PostgreSQL 15+)   |
|   - Real-time Bullion Calculators  | (Direct) |   - articles (Trending Explainers) |
|   - FY 2025-26 Tax & Loan Engines  |          |   - saved_calculations             |
|   - SEO Meta & Schema.org JSON-LD  |          |   - Row Level Security (RLS)       |
+------------------------------------+          +------------------------------------+
```

- **Cloudflare Pages**: Delivers static HTML, assets, and handles client-side dynamic routing via `_redirects` (`/* /index.html 200`).
- **Supabase**: Handles persistence for articles and user calculations directly over Supabase PostgREST with standard Anon Public Key and RLS.
- **Resilient Fallback**: If Supabase is not linked yet, the app gracefully operates using local storage and in-memory caches, guaranteeing zero downtime.

---

## 2. Cloudflare Pages Deployment Guide

### Option A: Via Cloudflare Dashboard (GitHub / GitLab)
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Compute (Workers) > Workers & Pages > Create application > Pages**.
2. Connect your Git repository.
3. In **Build Settings**, configure:
   - **Framework preset**: `Vite` (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
   - `NODE_VERSION`: `20`
5. Click **Save and Deploy**.

### Option B: Via Wrangler CLI
```bash
# Install Wrangler
npm install -g wrangler

# Build the production Vite bundle
npm run build

# Deploy directly to Cloudflare Pages
npx wrangler pages deploy dist --project-name=bharatcalc
```

---

## 3. Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open the file `supabase/schema.sql` located in this repository, paste its entire contents into the SQL editor, and click **Run**.
4. The schema will:
   - Create the `articles` and `saved_calculations` tables.
   - Configure performance indexes and full-text search (`tsvector`).
   - Enable **Row Level Security (RLS)** allowing public read and secure writes.
   - Pre-seed authoritative explainers for Gold, Silver, Tax, Commute Fuel, and Home Loans.
5. Copy your **Project URL** and **anon public key** from **Project Settings > API** into your `.env` or Cloudflare Pages environment variables.

---

## 4. Key Production Files for Cloudflare Pages

| File | Purpose |
| :--- | :--- |
| `public/_redirects` | Rewrites all routes to `/index.html` with status 200 for client-side routing. |
| `public/_headers` | Configures security headers (CSP, X-Frame-Options) and immutable asset caching. |
| `public/robots.txt` | Directs search crawlers to the sitemap. |
| `public/sitemap.xml` | XML sitemap covering all calculators and dynamic explainers for SEO. |
| `supabase/schema.sql`| Production PostgreSQL schema with RLS and seed data. |
| `lib/supabase.ts` | Supabase client with offline/fallback resilience. |
