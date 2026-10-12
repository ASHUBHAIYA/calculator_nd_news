import fs from 'fs';
import path from 'path';
import { SiteFinancialConfig, DEFAULT_SITE_CONFIG, syncTickerBenchmarks, DEFAULT_BENCHMARKS } from './siteConfig';
import { computeAllIndianCityRates } from './indianCitiesBullion';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'site-config.json');

let inMemoryConfig: SiteFinancialConfig | null = null;

export function getStoredSiteConfig(): SiteFinancialConfig {
  if (inMemoryConfig) {
    return inMemoryConfig;
  }

  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const raw = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      inMemoryConfig = JSON.parse(raw);
      return inMemoryConfig!;
    }
  } catch (err) {
    console.warn('Error reading site config from disk, returning default:', err);
  }

  inMemoryConfig = DEFAULT_SITE_CONFIG;
  return inMemoryConfig;
}

export function updateStoredSiteConfig(
  newConfig: Partial<SiteFinancialConfig>,
  updatedBy: string = 'Admin API'
): SiteFinancialConfig {
  const current = getStoredSiteConfig();

  const mergedBullion = { ...current.bullion, ...(newConfig.bullion || {}) };
  if (newConfig.bullion?.gold24KPer10g && !newConfig.bullion?.gold22KPer10g) {
    mergedBullion.gold22KPer10g = Math.round((newConfig.bullion.gold24KPer10g / 24) * 22);
    mergedBullion.gold18KPer10g = Math.round((newConfig.bullion.gold24KPer10g / 24) * 18);
  }
  if (newConfig.bullion?.silver999PerKg && !newConfig.bullion?.silver925Per10g) {
    mergedBullion.silver925Per10g = Math.round((newConfig.bullion.silver999PerKg / 100) * 0.925);
  }
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

  inMemoryConfig = merged;

  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write site-config.json:', err);
  }

  return merged;
}
