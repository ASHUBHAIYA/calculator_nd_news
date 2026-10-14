/**
 * SEO & Canonical URL Engine for BharatCalc
 * Production Domain: https://authorizetech.in
 * Base Path: /bharatcalc
 */

export const PRODUCTION_DOMAIN = 'https://authorizetech.in';
export const BASE_PATH = '/bharatcalc';

/**
 * Normalizes any route path or URL into an absolute canonical URL
 * using https://authorizetech.in/bharatcalc base path.
 *
 * Rules:
 * - Always starts with https://authorizetech.in/bharatcalc
 * - Trailing slashes are stripped consistently (e.g. /calculators/in-hand-salary)
 * - Empty string or '/' maps to 'https://authorizetech.in/bharatcalc'
 * - Strips any accidental leading origin or duplicate '/bharatcalc'
 */
export function buildCanonicalUrl(path: string = ''): string {
  if (!path || path.trim() === '' || path === '/' || path === '/bharatcalc' || path === '/bharatcalc/') {
    return `${PRODUCTION_DOMAIN}${BASE_PATH}`;
  }

  let cleanPath = path.trim();

  // Strip protocol and domain if an absolute URL was provided
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      const parsed = new URL(cleanPath);
      cleanPath = parsed.pathname;
    } catch {
      cleanPath = cleanPath.replace(/^https?:\/\/[^/]+/, '');
    }
  }

  // Strip leading /bharatcalc if already present
  if (cleanPath.startsWith('/bharatcalc/')) {
    cleanPath = cleanPath.slice('/bharatcalc'.length);
  } else if (cleanPath === '/bharatcalc') {
    return `${PRODUCTION_DOMAIN}${BASE_PATH}`;
  }

  // Ensure single leading slash and strip trailing slash
  cleanPath = cleanPath.replace(/^\/+/, '/').replace(/\/+$/, '');

  if (!cleanPath || cleanPath === '/') {
    return `${PRODUCTION_DOMAIN}${BASE_PATH}`;
  }

  return `${PRODUCTION_DOMAIN}${BASE_PATH}${cleanPath}`;
}
