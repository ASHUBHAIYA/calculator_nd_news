-- ==============================================================================
-- BHARATCALC SUPABASE PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 15+ & Supabase RLS
-- ==============================================================================

-- 1. Create enum for article categories
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'article_category') THEN
    CREATE TYPE article_category AS ENUM (
      'Gold & Commodities',
      'Tax & Salary',
      'Fuel & Energy',
      'Market Trends'
    );
  END IF;
END $$;

-- 2. Create the `articles` table for Trending Explainers
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  full_content TEXT NOT NULL,
  category TEXT NOT NULL,
  related_calculator TEXT NOT NULL DEFAULT 'none',
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  views_count INTEGER NOT NULL DEFAULT 0,
  upvotes_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes for lightning-fast queries & SEO crawlers
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);

-- Enable Full-Text Search on articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(full_content, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles USING gin(fts);

-- 3. Create the `saved_calculations` table for user calculations & plans
CREATE TABLE IF NOT EXISTS public.saved_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_type TEXT NOT NULL, -- 'salary', 'gold', 'home-loan', 'fuel', 'solar'
  title TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  results JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_calc_type ON public.saved_calculations(calculator_type);
CREATE INDEX IF NOT EXISTS idx_saved_calc_created ON public.saved_calculations(created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_calculations ENABLE ROW LEVEL SECURITY;

-- Articles Policies: Public read access
CREATE POLICY "Allow public read access to articles"
  ON public.articles
  FOR SELECT
  TO public
  USING (true);

-- Articles Policies: Public insert (allows community/author explainer publishing)
CREATE POLICY "Allow public insert to articles"
  ON public.articles
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Articles Policies: Public update (allows view count increments & article revisions)
CREATE POLICY "Allow public update to articles"
  ON public.articles
  FOR UPDATE
  TO public
  USING (true);

-- Saved Calculations Policies: Public read/write/delete
CREATE POLICY "Allow public read to saved_calculations"
  ON public.saved_calculations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to saved_calculations"
  ON public.saved_calculations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public delete to saved_calculations"
  ON public.saved_calculations
  FOR DELETE
  TO public
  USING (true);

-- ==============================================================================
-- 5. TRIGGER FOR UPDATED_AT TIMESTAMP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON public.articles;
CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. INITIAL SEED DATA (Run once to populate authoritative explainers)
-- ==============================================================================

INSERT INTO public.articles (title, slug, summary, full_content, category, related_calculator, sources, published_at, updated_at)
VALUES
(
  'Why Did Gold Prices Surge Today?',
  'why-did-gold-prices-surge-today',
  'Gold prices in India have experienced a steep uptick driven by MCX futures movements, heightened geopolitical tensions, US Federal Reserve interest rate expectations, and strong domestic wedding and festival bullion demand across major jewelry hubs.',
  '### Key Takeaways for Indian Gold Buyers

- **MCX Spot Momentum**: Domestic gold contracts on the Multi Commodity Exchange (MCX) have risen sharply in tandem with COMEX global spot price breakouts.
- **Geopolitical Safe-Haven Flow**: Escalations in global trade friction and currency volatility have triggered massive central bank bullion reserve acquisitions worldwide.
- **Rupee Dynamics**: The INR exchange rate against the US Dollar directly dictates landed costs because India imports over 90% of its pure bullion demand.
- **Showroom Pricing Protection**: Always calculate base 24K and 22K (Hallmark 916) bullion rates before entering a showroom to prevent hidden margins.

---

### What Is Driving the Current Bullion Rally?

Over recent trading sessions, retail gold prices across major Indian bullion centres (Mumbai, Zaveri Bazaar, Delhi Karol Bagh, Chennai, and Bengaluru) have registered a sharp upswing. To understand why physical gold is surging today, consumers must analyze three interlinked macro drivers:

#### 1. Central Bank Reserve Accumulation
Central banks across emerging economies have diversified their sovereign foreign reserves away from fiat currencies into physical gold bars. The Reserve Bank of India (RBI), along with the People''s Bank of China and central banks in Europe, has consistently expanded physical gold holdings, establishing a solid institutional floor under international spot prices.

#### 2. Federal Reserve Interest Rate Trajectory
Gold yields zero nominal interest or dividends. Consequently, when global sovereign bond yields and interest rates soften or when market participants price in rate cuts, the opportunity cost of holding non-yielding precious metals drops precipitously. Global hedge funds and bullion ETFs rapidly shift liquidity into physical spot contracts.

#### 3. Import Duty Realities Post-Budget 2024
While the Union Budget 2024 brought welcome relief by reducing Customs Import Duty from 15% to 6% (5% Basic Customs Duty + 1% AIDC), international spot price rallies have now outpaced that statutory tax relief.',
  'Gold & Commodities',
  'gold',
  '[{"label":"India Bullion and Jewellers Association (IBJA) Benchmark","url":"https://ibja.co"},{"label":"Multi Commodity Exchange of India (MCX) Bullion Index","url":"https://www.mcxindia.com"},{"label":"World Gold Council Central Bank Demand Report","url":"https://www.gold.org"}]'::jsonb,
  '2026-09-22T09:30:00.000Z',
  '2026-09-23T14:15:00.000Z'
),
(
  'New Tax Regime FY 2025-26: How the ₹75,000 Standard Deduction Impacts Your In-Hand Paycheck',
  'new-tax-regime-fy-2025-26-standard-deduction-in-hand-salary',
  'Salaried employees in FY 2025-26 benefit from an increased standard deduction of ₹75,000 under Section 115BAC, wider tax slabs, and Section 87A rebate. Explore detailed slab breakdowns, zero tax thresholds up to ₹7.75 Lakhs, and take-home salary calculations.',
  '### Overview: Why FY 2025-26 Is More Favourable for Salaried Class

Under the statutory provisions of the Finance Act governing **Financial Year 2025-26 (Assessment Year 2026-27)**, the New Tax Regime (Section 115BAC) serves as the default income tax regime. Substantial amendments were introduced to ease middle-class tax liabilities:

- **Enhanced Standard Deduction**: Hiked from ₹50,000 to **₹75,000** exclusively for salaried individuals and pensioners.
- **Effective Zero-Tax Income Threshold**: Anyone earning a gross salary up to **₹7,75,000** pays **₹0 income tax**, combining the ₹75,000 deduction with the ₹25,000 tax rebate under Section 87A.
- **Expanded Lower Slabs**: The 5% slab spans ₹3,00,000 to ₹7,00,000, and the 10% slab covers ₹7,00,000 to ₹10,00,000, creating direct annual tax savings of up to ₹17,500.',
  'Tax & Salary',
  'salary',
  '[{"label":"Income Tax Department (Section 115BAC)","url":"https://www.incometax.gov.in"},{"label":"Ministry of Finance Union Budget Highlights","url":"https://finmin.nic.in"}]'::jsonb,
  '2026-09-20T11:00:00.000Z',
  '2026-09-23T12:00:00.000Z'
),
(
  'Silver 999 vs 925: Understanding Hallmark Purity and Showroom Billing Secrets',
  'silver-999-vs-925-hallmark-purity-and-billing',
  'Before purchasing silver coins, bars, or sterling jewelry, understand the vital difference between 999 Fine Silver and 925 Sterling Silver. Learn how BIS hallmarking works, how making charges are computed, and how to verify the 3% statutory GST on invoices.',
  '### The Silver Bullion Boom in India

Silver has emerged as both a high-performing investment asset and an industrial commodity driven by solar photovoltaic cell manufacturing, electric vehicle batteries, and high-conductivity electronics. When buying silver articles in India, consumers encounter different purity standards and billing mechanisms.

---

### Understanding Silver Purity Grades (BIS Standards)

The Bureau of Indian Standards (BIS) officially recognizes four purity classifications for silver:
1. **999 Fine Silver (99.9% Pure)**: Ideal for coins, bullion bars, and religious pooja idols.
2. **925 Sterling Silver (92.5% Pure)**: Alloyed with copper for mechanical strength in designer ornaments and cutlery.',
  'Gold & Commodities',
  'silver',
  '[{"label":"Bureau of Indian Standards (BIS)","url":"https://www.bis.gov.in"},{"label":"Goods and Services Tax (GST) Council","url":"https://www.gst.gov.in"}]'::jsonb,
  '2026-09-18T10:00:00.000Z',
  '2026-09-21T08:30:00.000Z'
),
(
  'Petrol vs EV Commuting in India: Daily Running Costs and Break-Even Mileage in 2026',
  'petrol-vs-ev-commuting-india-daily-cost-break-even-2026',
  'With urban metro petrol prices stabilizing around ₹100–₹105 per litre and residential electricity tariffs at ₹7–₹9 per unit, EV running costs are roughly 70% to 85% lower per kilometre. Analyze break-even timelines, battery replacement reserves, and monthly commuter savings.',
  '### The Indian Commuter''s Dilemma: Petrol or Electric?

Fuel expenses represent one of the largest recurring discretionary drains on middle-class household budgets. In major metropolitan corridors (Delhi-NCR, Mumbai, Bengaluru, Hyderabad, and Pune), daily round-trip work commutes typically range from 25 km to 60 km.

Running an electric car costs approximately ₹0.88 to ₹1.10 per kilometre on home solar/DISCOM charging compared to ₹7.50+ per kilometre on petrol.',
  'Fuel & Energy',
  'petrol',
  '[{"label":"PPAC Daily Fuel Bulletin","url":"https://www.ppac.gov.in"},{"label":"Bureau of Energy Efficiency","url":"https://beeindia.gov.in"}]'::jsonb,
  '2026-09-15T08:00:00.000Z',
  '2026-09-22T16:00:00.000Z'
),
(
  'RBI Floating Rate Mortgage Rules: How 1 Extra EMI Cuts 8 Years Off Your Home Loan',
  'rbi-floating-rate-mortgage-rules-extra-emi-strategy',
  'Because long-term bank home loans front-load interest in the first decade, regular EMIs barely touch your principal. Discover how RBI foreclosure guidelines empower individual borrowers to prepay with zero penalties, cutting 20-year tenures down to 12 years.',
  '### The Compounding Math of Indian Mortgages

When a borrower takes a ₹50,00,000 home loan at 8.5% interest for 20 years, total interest exceeds the principal. Paying 1 extra EMI every year directly pays down the principal balance, reducing loan tenure by up to 5 years and saving over ₹13 Lakhs in compound interest.',
  'Market Trends',
  'none',
  '[{"label":"Reserve Bank of India Master Prepayment Circular","url":"https://www.rbi.org.in"},{"label":"National Housing Bank","url":"https://nhb.org.in"}]'::jsonb,
  '2026-09-12T14:00:00.000Z',
  '2026-09-20T10:00:00.000Z'
)
ON CONFLICT (slug) DO NOTHING;
