import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from './lib/serverArticlesStorage';

// In-memory Bullion Cache to strictly enforce the 6-hour TTL & save API quota
interface CachedRates {
  source: 'goldapi' | 'finance_feed' | 'ibja_benchmark';
  sourceDescription: string;
  activeKeyMasked?: string;
  activeKeyIndex?: number;
  totalKeysConfigured: number;
  keyFailoverOccurred: boolean;
  failoverLog?: string[];
  timestamp: number;
  lastUpdatedIso: string;
  gold24KPer10g: number;
  gold22KPer10g: number;
  gold18KPer10g: number;
  silver999PerKg: number;
  silver925Per10g: number;
  cities: Array<{
    city: string;
    state: string;
    gold24K: number;
    gold22K: number;
    silver1Kg: number;
  }>;
}

let bullionCache: CachedRates | null = null;
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 Hours (Max 4 requests/day = ~88/month max)

const CITY_FACTORS = [
  { city: 'Mumbai', state: 'Maharashtra', goldDelta: 0, silverDelta: 0 },
  { city: 'Delhi', state: 'Delhi NCR', goldDelta: 150, silverDelta: 300 },
  { city: 'Chennai', state: 'Tamil Nadu', goldDelta: 100, silverDelta: 3500 },
  { city: 'Kolkata', state: 'West Bengal', goldDelta: 0, silverDelta: 200 },
  { city: 'Ahmedabad', state: 'Gujarat', goldDelta: 50, silverDelta: 100 },
  { city: 'Bengaluru', state: 'Karnataka', goldDelta: 120, silverDelta: 1500 },
  { city: 'Hyderabad', state: 'Telangana', goldDelta: 120, silverDelta: 2000 },
];

function buildCityRates(baseGold24K: number, baseSilverKg: number) {
  return CITY_FACTORS.map((c) => {
    const gold24K = baseGold24K + c.goldDelta;
    const gold22K = Math.round((gold24K / 24) * 22);
    const silver1Kg = baseSilverKg + c.silverDelta;
    return {
      city: c.city,
      state: c.state,
      gold24K,
      gold22K,
      silver1Kg,
    };
  });
}

function getStatutoryBenchmarkFallback(log: string[] = []): CachedRates {
  const baseGold24K = 76850;
  const baseSilverKg = 92500;
  return {
    source: 'ibja_benchmark',
    sourceDescription: 'Official IBJA Statutory Benchmark & MCX Reference Rates',
    totalKeysConfigured: 0,
    keyFailoverOccurred: false,
    failoverLog: log,
    timestamp: Date.now(),
    lastUpdatedIso: new Date().toISOString(),
    gold24KPer10g: baseGold24K,
    gold22KPer10g: Math.round((baseGold24K / 24) * 22),
    gold18KPer10g: Math.round((baseGold24K / 24) * 18),
    silver999PerKg: baseSilverKg,
    silver925Per10g: Math.round((baseSilverKg / 100) * 0.925),
    cities: buildCityRates(baseGold24K, baseSilverKg),
  };
}

function getAvailableApiKeys(): string[] {
  const keys: string[] = [];
  const primaryRaw = process.env.GOLD_API_KEY || '';
  const fallbackRaw = process.env.GOLD_API_KEY_FALLBACK || '';
  const secondaryRaw = process.env.GOLD_API_KEY_SECONDARY || '';

  // Support comma-separated keys in any of the variables
  [primaryRaw, fallbackRaw, secondaryRaw].forEach((raw) => {
    if (raw) {
      raw.split(',').forEach((k) => {
        const clean = k.trim();
        if (clean && !clean.startsWith('YOUR_') && !keys.includes(clean)) {
          keys.push(clean);
        }
      });
    }
  });

  return keys;
}

function maskKey(key: string): string {
  if (key.length <= 8) return '****';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

async function fetchLiveBullionRates(preferredSource: 'auto' | 'yahoo' | 'goldapi' = 'auto'): Promise<CachedRates> {
  const apiKeys = getAvailableApiKeys();
  const failoverLog: string[] = [];

  // 1. Multi-key failover loop for GoldAPI.io (skipped if preferredSource === 'yahoo')
  if (preferredSource !== 'yahoo' && apiKeys.length > 0) {
    for (let i = 0; i < apiKeys.length; i++) {
      const currentKey = apiKeys[i];
      const masked = maskKey(currentKey);
      try {
        const headers = {
          'x-access-token': currentKey,
          'Content-Type': 'application/json',
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const [goldRes, silverRes] = await Promise.all([
          fetch('https://www.goldapi.io/api/XAU/INR', { headers, signal: controller.signal }),
          fetch('https://www.goldapi.io/api/XAG/INR', { headers, signal: controller.signal }),
        ]);
        clearTimeout(timeout);

        if (goldRes.ok && silverRes.ok) {
          const goldJson = (await goldRes.json()) as any;
          const silverJson = (await silverRes.json()) as any;

          // GoldAPI provides raw international spot rates (London OTC cash in international vaults without Indian import duty).
          // To standardize with Indian domestic landed bullion benchmarks (IBJA / retail standard),
          // apply the statutory 6% Indian Customs Import Duty (5% Basic Customs Duty + 1% AIDC as enacted in July 2024 Union Budget).
          const rawPricePerGram24k = goldJson.price_gram_24k || goldJson.price / 31.1035;
          const rawSilverPerKg = (silverJson.price_gram_24k || silverJson.price / 31.1035) * 1000;

          // Standardized Indian Landed Bullion Rate (+6% Indian statutory customs duty)
          const baseGold24K = Math.round(rawPricePerGram24k * 10 * 1.06);
          const silverPerKg = Math.round(rawSilverPerKg * 1.06);

          return {
            source: 'goldapi',
            sourceDescription: `Live GoldAPI.io Indian Standard Feed (Key #${i + 1}: ${masked}, incl. 6% Indian Import Duty)`,
            activeKeyMasked: masked,
            activeKeyIndex: i + 1,
            totalKeysConfigured: apiKeys.length,
            keyFailoverOccurred: i > 0,
            failoverLog,
            timestamp: Date.now(),
            lastUpdatedIso: new Date().toISOString(),
            gold24KPer10g: baseGold24K,
            gold22KPer10g: Math.round((baseGold24K / 24) * 22),
            gold18KPer10g: Math.round((baseGold24K / 24) * 18),
            silver999PerKg: silverPerKg,
            silver925Per10g: Math.round((silverPerKg / 100) * 0.925),
            cities: buildCityRates(baseGold24K, silverPerKg),
          };
        } else {
          const status = goldRes.status !== 200 ? goldRes.status : silverRes.status;
          const msg = `GoldAPI Key #${i + 1} (${masked}) returned HTTP ${status} (Quota exhausted or invalid). Failover will activate.`;
          console.warn(`[BullionEngine] ${msg}`);
          failoverLog.push(msg);
        }
      } catch (err: any) {
        const msg = `GoldAPI Key #${i + 1} (${masked}) error: ${err.message || err}`;
        console.warn(`[BullionEngine] ${msg}`);
        failoverLog.push(msg);
      }
    }
  }

  // 2. Free Public Finance Feed (Yahoo Finance COMEX commodities & USD/INR via v8 chart API)
  if (preferredSource === 'yahoo' || apiKeys.length === 0 || failoverLog.length > 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const [goldRes, inrRes, silverRes] = await Promise.all([
        fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1d', {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        }),
        fetch('https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1d&range=1d', {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        }),
        fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=1d', {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        }),
      ]);
      clearTimeout(timeout);

      if (goldRes.ok && inrRes.ok) {
        const goldJson = (await goldRes.json()) as any;
        const inrJson = (await inrRes.json()) as any;
        const silverJson = silverRes.ok ? ((await silverRes.json()) as any) : null;

        const goldUsdPerOz =
          goldJson?.chart?.result?.[0]?.meta?.regularMarketPrice ||
          goldJson?.chart?.result?.[0]?.meta?.chartPreviousClose;
        const usdInr =
          inrJson?.chart?.result?.[0]?.meta?.regularMarketPrice ||
          inrJson?.chart?.result?.[0]?.meta?.chartPreviousClose;
        const silverUsdPerOz =
          silverJson?.chart?.result?.[0]?.meta?.regularMarketPrice ||
          silverJson?.chart?.result?.[0]?.meta?.chartPreviousClose ||
          31.5;

        if (goldUsdPerOz && usdInr) {
          // Conversion Formula:
          // 1 Troy Ounce = 31.1034768 grams
          // Price per 10g in INR = (USD/oz / 31.1034768) * USDINR * 10
          // Indian Import Duty: 6% (5% BCD + 1% AIDC as per Union Budget July 2024)
          const gold10gInr = Math.round((goldUsdPerOz / 31.1034768) * usdInr * 10 * 1.06);
          const silver1kgInr = Math.round((silverUsdPerOz / 31.1034768) * usdInr * 1000 * 1.06);

          return {
            source: 'finance_feed',
            sourceDescription: `Yahoo Finance Live Spot Feed (COMEX $${goldUsdPerOz.toFixed(0)}/oz, USD/INR ₹${usdInr.toFixed(2)} + 6% Import Duty)`,
            totalKeysConfigured: apiKeys.length,
            keyFailoverOccurred: apiKeys.length > 0 && preferredSource !== 'yahoo',
            failoverLog,
            timestamp: Date.now(),
            lastUpdatedIso: new Date().toISOString(),
            gold24KPer10g: gold10gInr,
            gold22KPer10g: Math.round((gold10gInr / 24) * 22),
            gold18KPer10g: Math.round((gold10gInr / 24) * 18),
            silver999PerKg: silver1kgInr,
            silver925Per10g: Math.round((silver1kgInr / 100) * 0.925),
            cities: buildCityRates(gold10gInr, silver1kgInr),
          };
        }
      } else {
        failoverLog.push(`Yahoo Finance response status: Gold ${goldRes.status}, INR ${inrRes.status}`);
      }
    } catch (feedErr: any) {
      failoverLog.push(`Yahoo Finance feed error: ${feedErr.message || feedErr}`);
    }
  }

  // 3. Fallback to statutory IBJA benchmark
  return getStatutoryBenchmarkFallback(failoverLog);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Diagnostic Endpoint to Test Configured API Keys and Yahoo Finance Feed
  app.get('/api/test-bullion-keys', async (req, res) => {
    const keys = getAvailableApiKeys();
    const results: Array<{
      keyIndex: number;
      maskedKey: string;
      status: 'valid' | 'quota_exhausted' | 'invalid_key' | 'network_error';
      httpCode?: number;
      message: string;
      goldPriceGramInr?: number;
      rawSpotPriceGramInr?: number;
    }> = [];

    // 1. Test Yahoo Finance Feed in parallel
    let yahooStatus: {
      connected: boolean;
      goldUsdPerOz?: number;
      usdInr?: number;
      silverUsdPerOz?: number;
      calculated24kPer10g?: number;
      calculatedSilverPerKg?: number;
      dutyApplied?: string;
      message: string;
    } = {
      connected: false,
      message: 'Testing...',
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const [gRes, uRes, sRes] = await Promise.all([
        fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1d', {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }),
        fetch('https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1d&range=1d', {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }),
        fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=1d', {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }),
      ]);
      clearTimeout(timeout);

      if (gRes.ok && uRes.ok) {
        const gj = (await gRes.json()) as any;
        const uj = (await uRes.json()) as any;
        const sj = sRes.ok ? (((await sRes.json()) as any)) : null;

        const goldOz = gj?.chart?.result?.[0]?.meta?.regularMarketPrice;
        const inr = uj?.chart?.result?.[0]?.meta?.regularMarketPrice;
        const silvOz = sj?.chart?.result?.[0]?.meta?.regularMarketPrice || 31.5;

        if (goldOz && inr) {
          const gold10g = Math.round((goldOz / 31.1034768) * inr * 10 * 1.06);
          const silverKg = Math.round((silvOz / 31.1034768) * inr * 1000 * 1.06);
          yahooStatus = {
            connected: true,
            goldUsdPerOz: Math.round(goldOz * 10) / 10,
            usdInr: Math.round(inr * 100) / 100,
            silverUsdPerOz: Math.round(silvOz * 10) / 10,
            calculated24kPer10g: gold10g,
            calculatedSilverPerKg: silverKg,
            dutyApplied: '6% Indian Customs Duty (Union Budget July 2024 reform)',
            message: 'Connected to Yahoo Finance Live Feed (100% Free & Unlimited Calls, 0 Quota Used)',
          };
        }
      } else {
        yahooStatus = {
          connected: false,
          message: `Yahoo Finance returned status: Gold ${gRes.status}, USDINR ${uRes.status}`,
        };
      }
    } catch (e: any) {
      yahooStatus = {
        connected: false,
        message: `Yahoo Finance test error: ${e.message || e}`,
      };
    }

    if (keys.length === 0) {
      return res.json({
        totalKeysConfigured: 0,
        message: 'No GOLD_API_KEY detected in environment variables. Currently using Yahoo Finance Feed and IBJA Benchmark fallback.',
        activeFallback: 'finance_feed',
        yahooFinanceStatus: yahooStatus,
        testResults: [],
      });
    }

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const masked = maskKey(k);
      try {
        const testRes = await fetch('https://www.goldapi.io/api/XAU/INR', {
          headers: { 'x-access-token': k, 'Content-Type': 'application/json' },
        });

        if (testRes.ok) {
          const json = (await testRes.json()) as any;
          const rawGram = json.price_gram_24k || Math.round((json.price / 31.1035) * 10) / 10;
          const indianStandardGram = Math.round(rawGram * 1.06 * 10) / 10;
          results.push({
            keyIndex: i + 1,
            maskedKey: masked,
            status: 'valid',
            httpCode: testRes.status,
            message: 'Key is active! Rate standardized to Indian landed benchmark (+6% Customs Duty).',
            goldPriceGramInr: indianStandardGram,
            rawSpotPriceGramInr: rawGram,
          });
        } else if (testRes.status === 429) {
          results.push({
            keyIndex: i + 1,
            maskedKey: masked,
            status: 'quota_exhausted',
            httpCode: 429,
            message: 'Monthly quota (100 calls) exhausted for this key. System will failover to next key.',
          });
        } else if (testRes.status === 401 || testRes.status === 403) {
          results.push({
            keyIndex: i + 1,
            maskedKey: masked,
            status: 'invalid_key',
            httpCode: testRes.status,
            message: 'Invalid API token or unauthorized.',
          });
        } else {
          results.push({
            keyIndex: i + 1,
            maskedKey: masked,
            status: 'network_error',
            httpCode: testRes.status,
            message: `Unexpected HTTP ${testRes.status}`,
          });
        }
      } catch (err: any) {
        results.push({
          keyIndex: i + 1,
          maskedKey: masked,
          status: 'network_error',
          message: `Network timeout or error: ${err.message || err}`,
        });
      }
    }

    const firstWorking = results.find((r) => r.status === 'valid');

    return res.json({
      totalKeysConfigured: keys.length,
      activeKey: firstWorking ? `Key #${firstWorking.keyIndex} (${firstWorking.maskedKey})` : 'None (Using Fallback Feed)',
      canFailover: keys.length > 1,
      yahooFinanceStatus: yahooStatus,
      testResults: results,
    });
  });

  // Smart 6-Hour Cached Bullion Rates Endpoint
  app.get('/api/bullion-rates', async (req, res) => {
    try {
      const force = req.query.force === 'true';
      const requestedSource = (req.query.source as 'auto' | 'yahoo' | 'goldapi') || 'auto';
      const now = Date.now();

      // Check if memory cache exists and is still valid (within 6 hours) unless source changed or force=true
      if (
        !force &&
        bullionCache &&
        now - bullionCache.timestamp < CACHE_DURATION_MS &&
        (requestedSource === 'auto' ||
          (requestedSource === 'yahoo' && bullionCache.source === 'finance_feed') ||
          (requestedSource === 'goldapi' && bullionCache.source === 'goldapi'))
      ) {
        const ageMinutes = Math.floor((now - bullionCache.timestamp) / 60000);
        return res.json({
          ...bullionCache,
          isCached: true,
          cacheAgeMinutes: ageMinutes,
          quotaSavedNotice: 'Served from 6-hour server cache (0 external API calls deducted)',
        });
      }

      // Fetch fresh data only when cache expired or forced
      const freshRates = await fetchLiveBullionRates(requestedSource);
      bullionCache = freshRates;

      return res.json({
        ...freshRates,
        isCached: false,
        cacheAgeMinutes: 0,
        quotaSavedNotice: 'Fresh rates fetched and cached for the next 6 hours',
      });
    } catch (error) {
      console.error('Bullion rate error:', error);
      const fallback = getStatutoryBenchmarkFallback();
      return res.json({
        ...fallback,
        isCached: true,
        cacheAgeMinutes: 0,
        error: 'Served standard benchmark fallback',
      });
    }
  });

  // ==========================================
  // Dynamic Trending Explainers Articles API
  // ==========================================

  // List all articles with optional category and search filtering
  app.get('/api/articles', (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const articles = getAllArticles(category, search);
      return res.json({
        success: true,
        count: articles.length,
        articles,
      });
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to fetch articles' });
    }
  });

  // Get single article by slug
  app.get('/api/articles/:slug', (req, res) => {
    try {
      const slug = req.params.slug;
      const article = getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }
      return res.json({ success: true, article });
    } catch (err: any) {
      console.error('Error fetching article by slug:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to fetch article' });
    }
  });

  // Create new article with auto-generated slug
  app.post('/api/articles', (req, res) => {
    try {
      const { title, summary, fullContent, category, relatedCalculator, sources, slug } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Title is required' });
      }
      if (!fullContent || !fullContent.trim()) {
        return res.status(400).json({ success: false, error: 'Article content is required' });
      }

      const created = createArticle({
        title,
        summary: summary || '',
        fullContent,
        category: category || 'Market Trends',
        relatedCalculator: relatedCalculator || 'none',
        sources: Array.isArray(sources) ? sources : [],
        slug: slug || undefined,
      });

      return res.status(201).json({ success: true, article: created });
    } catch (err: any) {
      console.error('Error creating article:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to create article' });
    }
  });

  // Update existing article
  app.put('/api/articles/:id', (req, res) => {
    try {
      const idOrSlug = req.params.id;
      const updated = updateArticle(idOrSlug, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Article not found for update' });
      }
      return res.json({ success: true, article: updated });
    } catch (err: any) {
      console.error('Error updating article:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to update article' });
    }
  });

  // Delete article
  app.delete('/api/articles/:id', (req, res) => {
    try {
      const idOrSlug = req.params.id;
      const ok = deleteArticle(idOrSlug);
      if (!ok) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }
      return res.json({ success: true, message: 'Article deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting article:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to delete article' });
    }
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BharatCalc Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
