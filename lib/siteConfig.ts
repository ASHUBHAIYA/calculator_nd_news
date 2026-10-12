import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { computeAllIndianCityRates, ALL_INDIAN_STATE_CITIES } from './indianCitiesBullion';
import bundledSiteConfigJson from '../data/site-config.json';

export interface BenchmarkCardConfig {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  category: string;
}

export interface CityBullionRateConfig {
  city: string;
  state: string;
  gold24K: number;
  gold22K: number;
  silver1Kg: number;
}

export interface SiteFinancialConfig {
  version: number;
  lastUpdated: string;
  updatedBy?: string;

  // 1. Bullion & Precious Metals (Rates in INR)
  bullion: {
    gold24KPer10g: number; // e.g. 76850
    gold22KPer10g: number; // e.g. 70450
    gold18KPer10g: number; // e.g. 57640
    silver999PerKg: number; // e.g. 92500
    silver925Per10g: number; // e.g. 856
    makingChargeDefaultPercent: number; // 12%
    makingChargeDefaultPerGram: number; // ₹650/g
    goldHallmarkingFee: number; // ₹53.10
    silverHallmarkingFee: number; // ₹41.30
    gstPercentage: number; // 3.0%
    cities: CityBullionRateConfig[];
  };

  // 2. Tax & Salary Engine (FY 2025-26 Union Budget)
  taxAndSalary: {
    standardDeduction: number; // ₹75,000
    sec87aRebateLimit: number; // ₹7,00,000 taxable limit
    epfStatutoryRate: number; // 8.25% p.a.
    employerPfRate: number; // 12.0%
    healthEducationCess: number; // 4.0%
    professionalTaxDefault: number; // ₹200/month
  };

  // 3. Home Loan & Mortgage Rates
  homeLoan: {
    primeRateMin: number; // 8.40%
    primeRateMax: number; // 8.65%
    defaultInterestRate: number; // 8.50%
    defaultTenureYears: number; // 20 years
  };

  // 4. Commute Fuel & EV Tariffs
  fuelAndEv: {
    petrolPricePerLitre: number; // ₹104.20
    dieselPricePerLitre: number; // ₹92.80
    cngPricePerKg: number; // ₹78.50
    evHomeKwhRate: number; // ₹7.50
    evCommercialKwhRate: number; // ₹14.00
    petrolAvgMileageKmpl: number; // 15.0 km/l
    dieselAvgMileageKmpl: number; // 18.0 km/l
    evAvgEfficiencyKmPerKwh: number; // 7.0 km/kWh
  };

  // 5. PM Surya Ghar Solar Rooftop Scheme
  solarRooftop: {
    benchmarkCostPerKw: number; // ₹60,000
    subsidy1Kw: number; // ₹30,000
    subsidy2Kw: number; // ₹60,000
    subsidy3KwPlus: number; // ₹78,000
    dailyUnitsGeneratedPerKw: number; // 4.2 units/day
  };

  // 6. Homepage Live Ticker Benchmark Cards (The 7 hero cards)
  liveTickerBenchmarks: BenchmarkCardConfig[];
}

export const DEFAULT_CITY_RATES: CityBullionRateConfig[] = computeAllIndianCityRates(76850, 92500);

export const DEFAULT_BENCHMARKS: BenchmarkCardConfig[] = [
  {
    id: 'gold-24k',
    label: 'Gold 24K (per 10g)',
    value: '₹76,850',
    delta: 'Live Spot',
    isPositive: true,
    category: 'Bullion (MCX / IBJA)',
  },
  {
    id: 'gold-22k',
    label: 'Gold 22K (Hallmark 916)',
    value: '₹70,450',
    delta: 'Live Spot',
    isPositive: true,
    category: 'Jewelry Benchmark',
  },
  {
    id: 'silver-999',
    label: 'Silver 999 (per 1kg)',
    value: '₹92,500',
    delta: 'Live Spot',
    isPositive: true,
    category: 'MCX Spot Bullion',
  },
  {
    id: 'repo-rate',
    label: 'Home Loan Prime Rate',
    value: '8.40% – 8.65%',
    delta: 'RBI Steady',
    isPositive: true,
    category: 'Monetary Policy',
  },
  {
    id: 'std-deduction',
    label: 'Standard Deduction (FY 2025-26)',
    value: '₹75,000',
    delta: 'Sec 115BAC',
    isPositive: true,
    category: 'FY 2025-26',
  },
  {
    id: 'surya-ghar',
    label: 'PM Surya Ghar Subsidy (3kW)',
    value: '₹78,000',
    delta: 'Direct DBT',
    isPositive: true,
    category: 'Central Scheme',
  },
  {
    id: 'epf-rate',
    label: 'EPF Statutory Rate',
    value: '8.25% p.a.',
    delta: 'Compounded',
    isPositive: true,
    category: 'EPFO India',
  },
];

const bundled = (bundledSiteConfigJson || {}) as any;

export const DEFAULT_SITE_CONFIG: SiteFinancialConfig = {
  version: bundled.version || 1,
  lastUpdated: bundled.lastUpdated || new Date().toISOString(),
  updatedBy: bundled.updatedBy || 'System Statutory Benchmark',
  bullion: {
    gold24KPer10g: Number(bundled.bullion?.gold24KPer10g) || 76850,
    gold22KPer10g: Number(bundled.bullion?.gold22KPer10g) || 70450,
    gold18KPer10g: Number(bundled.bullion?.gold18KPer10g) || 57640,
    silver999PerKg: Number(bundled.bullion?.silver999PerKg) || 92500,
    silver925Per10g: Number(bundled.bullion?.silver925Per10g) || 856,
    makingChargeDefaultPercent: Number(bundled.bullion?.makingChargeDefaultPercent) || 12,
    makingChargeDefaultPerGram: Number(bundled.bullion?.makingChargeDefaultPerGram) || 650,
    goldHallmarkingFee: Number(bundled.bullion?.goldHallmarkingFee) || 53.1,
    silverHallmarkingFee: Number(bundled.bullion?.silverHallmarkingFee) || 41.3,
    gstPercentage: Number(bundled.bullion?.gstPercentage) || 3.0,
    cities:
      Array.isArray(bundled.bullion?.cities) && bundled.bullion.cities.length > 0
        ? (bundled.bullion.cities as CityBullionRateConfig[])
        : DEFAULT_CITY_RATES,
  },
  taxAndSalary: {
    standardDeduction: Number(bundled.taxAndSalary?.standardDeduction) || 75000,
    sec87aRebateLimit: Number(bundled.taxAndSalary?.sec87aRebateLimit) || 700000,
    epfStatutoryRate: Number(bundled.taxAndSalary?.epfStatutoryRate) || 8.25,
    employerPfRate: Number(bundled.taxAndSalary?.employerPfRate) || 12.0,
    healthEducationCess: Number(bundled.taxAndSalary?.healthEducationCess) || 4.0,
    professionalTaxDefault: Number(bundled.taxAndSalary?.professionalTaxDefault) || 200,
  },
  homeLoan: {
    primeRateMin: Number(bundled.homeLoan?.primeRateMin) || 8.4,
    primeRateMax: Number(bundled.homeLoan?.primeRateMax) || 8.65,
    defaultInterestRate: Number(bundled.homeLoan?.defaultInterestRate) || 8.5,
    defaultTenureYears: Number(bundled.homeLoan?.defaultTenureYears) || 20,
  },
  fuelAndEv: {
    petrolPricePerLitre: Number(bundled.fuelAndEv?.petrolPricePerLitre) || 104.2,
    dieselPricePerLitre: Number(bundled.fuelAndEv?.dieselPricePerLitre) || 92.8,
    cngPricePerKg: Number(bundled.fuelAndEv?.cngPricePerKg) || 78.5,
    evHomeKwhRate: Number(bundled.fuelAndEv?.evHomeKwhRate) || 7.5,
    evCommercialKwhRate: Number(bundled.fuelAndEv?.evCommercialKwhRate) || 14.0,
    petrolAvgMileageKmpl: Number(bundled.fuelAndEv?.petrolAvgMileageKmpl) || 15.0,
    dieselAvgMileageKmpl: Number(bundled.fuelAndEv?.dieselAvgMileageKmpl) || 18.0,
    evAvgEfficiencyKmPerKwh: Number(bundled.fuelAndEv?.evAvgEfficiencyKmPerKwh) || 7.0,
  },
  solarRooftop: {
    benchmarkCostPerKw: Number(bundled.solarRooftop?.benchmarkCostPerKw) || 60000,
    subsidy1Kw: Number(bundled.solarRooftop?.subsidy1Kw) || 30000,
    subsidy2Kw: Number(bundled.solarRooftop?.subsidy2Kw) || 60000,
    subsidy3KwPlus: Number(bundled.solarRooftop?.subsidy3KwPlus) || 78000,
    dailyUnitsGeneratedPerKw: Number(bundled.solarRooftop?.dailyUnitsGeneratedPerKw) || 4.2,
  },
  liveTickerBenchmarks:
    Array.isArray(bundled.liveTickerBenchmarks) && bundled.liveTickerBenchmarks.length > 0
      ? (bundled.liveTickerBenchmarks as BenchmarkCardConfig[])
      : DEFAULT_BENCHMARKS,
};

const SITE_CONFIG_STORAGE_KEY = 'bharatcalc_site_config_v1';

/**
 * Loads current site configuration from LocalStorage or Default
 */
export function getLocalSiteConfig(): SiteFinancialConfig {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          bullion: { ...DEFAULT_SITE_CONFIG.bullion, ...(parsed.bullion || {}) },
          taxAndSalary: { ...DEFAULT_SITE_CONFIG.taxAndSalary, ...(parsed.taxAndSalary || {}) },
          homeLoan: { ...DEFAULT_SITE_CONFIG.homeLoan, ...(parsed.homeLoan || {}) },
          fuelAndEv: { ...DEFAULT_SITE_CONFIG.fuelAndEv, ...(parsed.fuelAndEv || {}) },
          solarRooftop: { ...DEFAULT_SITE_CONFIG.solarRooftop, ...(parsed.solarRooftop || {}) },
          liveTickerBenchmarks:
            Array.isArray(parsed.liveTickerBenchmarks) && parsed.liveTickerBenchmarks.length > 0
              ? parsed.liveTickerBenchmarks
              : DEFAULT_BENCHMARKS,
        };
      }
    }
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
  return DEFAULT_SITE_CONFIG;
}

export function formatBenchmarkINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function syncTickerBenchmarks(
  currentBenchmarks: BenchmarkCardConfig[],
  bullion?: Partial<SiteFinancialConfig['bullion']>,
  taxAndSalary?: Partial<SiteFinancialConfig['taxAndSalary']>,
  homeLoan?: Partial<SiteFinancialConfig['homeLoan']>,
  solarRooftop?: Partial<SiteFinancialConfig['solarRooftop']>
): BenchmarkCardConfig[] {
  return currentBenchmarks.map((card) => {
    if (card.id === 'gold-24k' && bullion?.gold24KPer10g) {
      return { ...card, value: formatBenchmarkINR(bullion.gold24KPer10g) };
    }
    if (card.id === 'gold-22k' && (bullion?.gold22KPer10g || bullion?.gold24KPer10g)) {
      const val = bullion.gold22KPer10g || Math.round((bullion.gold24KPer10g! / 24) * 22);
      return { ...card, value: formatBenchmarkINR(val) };
    }
    if (card.id === 'silver-999' && bullion?.silver999PerKg) {
      return { ...card, value: formatBenchmarkINR(bullion.silver999PerKg) };
    }
    if (card.id === 'std-deduction' && taxAndSalary?.standardDeduction) {
      return { ...card, value: formatBenchmarkINR(taxAndSalary.standardDeduction) };
    }
    if (card.id === 'surya-ghar' && solarRooftop?.subsidy3KwPlus) {
      return { ...card, value: formatBenchmarkINR(solarRooftop.subsidy3KwPlus) };
    }
    if (card.id === 'epf-rate' && taxAndSalary?.epfStatutoryRate) {
      return { ...card, value: `${taxAndSalary.epfStatutoryRate}% p.a.` };
    }
    if (card.id === 'repo-rate' && (homeLoan?.primeRateMin || homeLoan?.primeRateMax)) {
      const min = homeLoan.primeRateMin || 8.4;
      const max = homeLoan.primeRateMax || 8.65;
      return { ...card, value: `${min}% – ${max}%` };
    }
    return card;
  });
}

/**
 * Saves site configuration to LocalStorage, Server API, and Supabase (if connected)
 */
export async function saveSiteConfig(
  newConfig: Partial<SiteFinancialConfig>,
  updatedBy: string = 'Admin'
): Promise<SiteFinancialConfig> {
  const current = getLocalSiteConfig();

  const mergedBullion = { ...current.bullion, ...(newConfig.bullion || {}) };
  if (newConfig.bullion?.gold24KPer10g && !newConfig.bullion?.gold22KPer10g) {
    mergedBullion.gold22KPer10g = Math.round((newConfig.bullion.gold24KPer10g / 24) * 22);
    mergedBullion.gold18KPer10g = Math.round((newConfig.bullion.gold24KPer10g / 24) * 18);
  }
  if (newConfig.bullion?.silver999PerKg && !newConfig.bullion?.silver925Per10g) {
    mergedBullion.silver925Per10g = Math.round((newConfig.bullion.silver999PerKg / 100) * 0.925);
  }
  // Automatically recompute all Indian cities across all states from the single base spot price!
  if (mergedBullion.gold24KPer10g && mergedBullion.silver999PerKg) {
    mergedBullion.cities = computeAllIndianCityRates(
      mergedBullion.gold24KPer10g,
      mergedBullion.silver999PerKg
    );
  }
  const mergedTax = { ...current.taxAndSalary, ...(newConfig.taxAndSalary || {}) };
  const mergedLoan = { ...current.homeLoan, ...(newConfig.homeLoan || {}) };
  const mergedFuel = { ...current.fuelAndEv, ...(newConfig.fuelAndEv || {}) };
  const mergedSolar = { ...current.solarRooftop, ...(newConfig.solarRooftop || {}) };

  // If explicit new ticker benchmarks provided, use them; otherwise auto-sync benchmarks with updated rates!
  const baseBenchmarks = newConfig.liveTickerBenchmarks || current.liveTickerBenchmarks || DEFAULT_BENCHMARKS;
  const syncedBenchmarks = syncTickerBenchmarks(
    baseBenchmarks,
    mergedBullion,
    mergedTax,
    mergedLoan,
    mergedSolar
  );

  const merged: SiteFinancialConfig = {
    ...current,
    ...newConfig,
    version: (current.version || 1) + 1,
    lastUpdated: new Date().toISOString(),
    updatedBy,
    bullion: mergedBullion,
    taxAndSalary: mergedTax,
    homeLoan: mergedLoan,
    fuelAndEv: mergedFuel,
    solarRooftop: mergedSolar,
    liveTickerBenchmarks: syncedBenchmarks,
  };

  // 1. LocalStorage (if in browser)
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(merged));
    }
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // 2. Dispatch custom event for same-tab reactivity (if in browser)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('site_config_updated', { detail: merged }));
  }

  // 3. Supabase Cloud Sync (if connected)
  if (supabase) {
    try {
      await supabase
        .from('site_config')
        .upsert(
          {
            id: 'global_config',
            config_data: merged,
            updated_at: merged.lastUpdated,
            updated_by: updatedBy,
          },
          { onConflict: 'id' }
        );
    } catch (err) {
      console.warn('Supabase site_config upsert warning:', err);
    }
  }

  // 4. Server API Fallback
  try {
    const res = await fetch('/api/site-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.config) {
        localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(json.config));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('site_config_updated', { detail: json.config }));
        }
        return json.config;
      }
    }
  } catch (err) {
    console.warn('Server API save error:', err);
  }

  return merged;
}

/**
 * Resets site configuration back to statutory defaults
 */
export async function resetSiteConfigToDefaults(): Promise<SiteFinancialConfig> {
  return saveSiteConfig(DEFAULT_SITE_CONFIG, 'Reset to Statutory Defaults');
}

/**
 * Reactive React Hook for components across the application
 */
export function useSiteConfig(): {
  config: SiteFinancialConfig;
  updateConfig: (newConfig: Partial<SiteFinancialConfig>) => Promise<SiteFinancialConfig>;
  resetToDefaults: () => Promise<SiteFinancialConfig>;
  refreshConfig: () => Promise<void>;
  loading: boolean;
} {
  const [config, setConfig] = useState<SiteFinancialConfig>(getLocalSiteConfig());
  const [loading, setLoading] = useState(false);

  const refreshConfig = async () => {
    setLoading(true);
    // Try Supabase first
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('config_data')
          .eq('id', 'global_config')
          .single();

        if (!error && data?.config_data) {
          const loaded = data.config_data as SiteFinancialConfig;
          setConfig(loaded);
          localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(loaded));
          setLoading(false);
          return;
        }
      } catch {}
    }

    // Try Backend API
    try {
      const res = await fetch('/api/site-config');
      if (res.ok) {
        const json = await res.json();
        if (json?.config) {
          setConfig(json.config);
          localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(json.config));
          setLoading(false);
          return;
        }
      }
    } catch {}
 
    // Try bundled static /data/site-config.json (for static hosts like Cloudflare Pages)
    try {
      const staticRes = await fetch('/data/site-config.json');
      if (staticRes.ok) {
        const staticJson = await staticRes.json();
        if (staticJson?.bullion?.gold24KPer10g) {
          const local = getLocalSiteConfig();
          const chosen =
            local.lastUpdated && new Date(local.lastUpdated) > new Date(staticJson.lastUpdated || 0)
              ? local
              : { ...DEFAULT_SITE_CONFIG, ...staticJson };
          setConfig(chosen);
          localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(chosen));
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fall back to local storage
    setConfig(getLocalSiteConfig());
    setLoading(false);
  };

  useEffect(() => {
    refreshConfig();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteFinancialConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getLocalSiteConfig());
      }
    };

    window.addEventListener('site_config_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('site_config_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    config,
    updateConfig: async (newCfg: Partial<SiteFinancialConfig>) => {
      const saved = await saveSiteConfig(newCfg, 'Admin Portal');
      setConfig(saved);
      return saved;
    },
    resetToDefaults: async () => {
      const reset = await resetSiteConfigToDefaults();
      setConfig(reset);
      return reset;
    },
    refreshConfig,
    loading,
  };
}
