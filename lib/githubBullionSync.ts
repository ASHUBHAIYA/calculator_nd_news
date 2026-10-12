/**
 * GitHub Bullion Sync Service
 * Allows the admin to save bullion (gold and silver) rates directly to GitHub
 * as the persistent data store for static hosts like Cloudflare Pages.
 */

import { SiteFinancialConfig, DEFAULT_BENCHMARKS, syncTickerBenchmarks } from './siteConfig';
import { computeAllIndianCityRates } from './indianCitiesBullion';

export interface GitHubSyncConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface GitHubSyncResult {
  success: boolean;
  message: string;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
  isNoToken?: boolean;
}

export const DEFAULT_GITHUB_OWNER = 'ASHUBHAIYA';
export const DEFAULT_GITHUB_REPO = 'calculator_nd_news';
export const DEFAULT_GITHUB_BRANCH = 'main';

const GITHUB_TOKEN_KEY = 'bharatcalc_github_token';
const GITHUB_OWNER_KEY = 'bharatcalc_github_owner';
const GITHUB_REPO_KEY = 'bharatcalc_github_repo';
const GITHUB_BRANCH_KEY = 'bharatcalc_github_branch';

/**
 * Retrieves the stored GitHub configuration from LocalStorage
 */
export function getStoredGitHubConfig(): GitHubSyncConfig {
  if (typeof window === 'undefined') {
    return {
      token: '',
      owner: DEFAULT_GITHUB_OWNER,
      repo: DEFAULT_GITHUB_REPO,
      branch: DEFAULT_GITHUB_BRANCH,
    };
  }

  const token = localStorage.getItem(GITHUB_TOKEN_KEY) || '';
  const owner = localStorage.getItem(GITHUB_OWNER_KEY) || DEFAULT_GITHUB_OWNER;
  const repo = localStorage.getItem(GITHUB_REPO_KEY) || DEFAULT_GITHUB_REPO;
  const branch = localStorage.getItem(GITHUB_BRANCH_KEY) || DEFAULT_GITHUB_BRANCH;

  return { token, owner, repo, branch };
}

/**
 * Persists the GitHub configuration safely in LocalStorage
 */
export function saveStoredGitHubConfig(config: Partial<GitHubSyncConfig>): void {
  if (typeof window === 'undefined') return;

  if (config.token !== undefined) {
    if (config.token.trim()) {
      localStorage.setItem(GITHUB_TOKEN_KEY, config.token.trim());
    } else {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
    }
  }

  if (config.owner !== undefined) {
    localStorage.setItem(GITHUB_OWNER_KEY, config.owner.trim() || DEFAULT_GITHUB_OWNER);
  }

  if (config.repo !== undefined) {
    localStorage.setItem(GITHUB_REPO_KEY, config.repo.trim() || DEFAULT_GITHUB_REPO);
  }

  if (config.branch !== undefined) {
    localStorage.setItem(GITHUB_BRANCH_KEY, config.branch.trim() || DEFAULT_GITHUB_BRANCH);
  }
}

/**
 * Encodes string to UTF-8 Base64 (browser-compatible)
 */
export function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes UTF-8 Base64 to string (handles whitespace/newlines from GitHub API)
 */
export function decodeBase64Utf8(base64: string): string {
  const clean = base64.replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Tests connection to the GitHub repository and checks file read/write permissions
 */
export async function testGitHubConnection(
  customConfig?: Partial<GitHubSyncConfig>
): Promise<{ success: boolean; message: string; repoFullName?: string }> {
  const stored = getStoredGitHubConfig();
  const token = (customConfig?.token ?? stored.token).trim();
  const owner = (customConfig?.owner ?? stored.owner).trim() || DEFAULT_GITHUB_OWNER;
  const repo = (customConfig?.repo ?? stored.repo).trim() || DEFAULT_GITHUB_REPO;
  const branch = (customConfig?.branch ?? stored.branch).trim() || DEFAULT_GITHUB_BRANCH;

  if (!token) {
    return {
      success: false,
      message: 'GitHub Personal Access Token is required to test connection.',
    };
  }

  try {
    // 1. Check repo access
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (repoRes.status === 401) {
      return { success: false, message: 'Invalid GitHub Personal Access Token (401 Unauthorized).' };
    }
    if (repoRes.status === 404) {
      return {
        success: false,
        message: `Repository "${owner}/${repo}" was not found. Please verify the owner and repo name.`,
      };
    }
    if (!repoRes.ok) {
      const err = await repoRes.json().catch(() => ({}));
      return {
        success: false,
        message: `GitHub API error (${repoRes.status}): ${err.message || repoRes.statusText}`,
      };
    }

    const repoData = await repoRes.json();

    // 2. Check branch exists
    const branchRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (branchRes.status === 404) {
      return {
        success: false,
        message: `Branch "${branch}" not found in ${owner}/${repo}. Check branch name.`,
      };
    }

    return {
      success: true,
      message: `Successfully connected to ${repoData.full_name} on branch "${branch}". Write access verified!`,
      repoFullName: repoData.full_name,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error connecting to GitHub: ${err.message || 'Check your internet connection'}`,
    };
  }
}

/**
 * Saves bullion rates directly to GitHub in data/site-config.json
 * Fetches current SHA, updates bullion rates & lastUpdated, and commits via GitHub Contents API.
 */
export async function saveRatesToGitHub(
  bullionData: Partial<SiteFinancialConfig['bullion']>,
  customConfig?: Partial<GitHubSyncConfig>
): Promise<GitHubSyncResult> {
  const stored = getStoredGitHubConfig();
  const token = (customConfig?.token ?? stored.token).trim();
  const owner = (customConfig?.owner ?? stored.owner).trim() || DEFAULT_GITHUB_OWNER;
  const repo = (customConfig?.repo ?? stored.repo).trim() || DEFAULT_GITHUB_REPO;
  const branch = (customConfig?.branch ?? stored.branch).trim() || DEFAULT_GITHUB_BRANCH;

  // Fallback: If no token provided, return notice so caller can use local preview
  if (!token) {
    return {
      success: false,
      isNoToken: true,
      message:
        'No GitHub Access Token configured. Rates will only persist in your local preview and will not update GitHub or trigger Cloudflare Pages deployments.',
    };
  }

  const filePath = 'data/site-config.json';
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;

  try {
    // Step a: Fetch existing data/site-config.json to get current SHA and content
    const getRes = await fetch(getUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });

    let currentSha: string | undefined;
    let existingConfig: any = {};

    if (getRes.ok) {
      const fileData = await getRes.json();
      currentSha = fileData.sha;
      if (fileData.content) {
        try {
          const decoded = decodeBase64Utf8(fileData.content);
          existingConfig = JSON.parse(decoded);
        } catch (parseErr) {
          console.warn('Could not parse existing site-config from GitHub, using default structure', parseErr);
        }
      }
    } else if (getRes.status === 401) {
      return {
        success: false,
        error: 'Unauthorized (401)',
        message: 'Invalid GitHub Personal Access Token. Please check token permissions in GitHub settings.',
      };
    } else if (getRes.status === 404) {
      // File does not exist yet; we will create it without SHA
      currentSha = undefined;
    } else {
      const errJson = await getRes.json().catch(() => ({}));
      return {
        success: false,
        error: `GitHub HTTP ${getRes.status}`,
        message: errJson.message || `Failed to fetch ${filePath} from GitHub (${getRes.status}).`,
      };
    }

    // Step b: Parse and update the bullion object with the new prices & ISO lastUpdated
    const currentBullion = existingConfig.bullion || {};
    const updatedBullion = {
      ...currentBullion,
      ...bullionData,
    };

    // Calculate derived purities if not explicitly given
    if (updatedBullion.gold24KPer10g && !updatedBullion.gold22KPer10g) {
      updatedBullion.gold22KPer10g = Math.round((updatedBullion.gold24KPer10g / 24) * 22);
    }
    if (updatedBullion.gold24KPer10g && !updatedBullion.gold18KPer10g) {
      updatedBullion.gold18KPer10g = Math.round((updatedBullion.gold24KPer10g / 24) * 18);
    }
    if (updatedBullion.silver999PerKg && !updatedBullion.silver925Per10g) {
      updatedBullion.silver925Per10g = Math.round((updatedBullion.silver999PerKg / 100) * 0.925);
    }

    // Sync cities if available
    if (updatedBullion.gold24KPer10g && updatedBullion.silver999PerKg && (!updatedBullion.cities || updatedBullion.cities.length === 0)) {
      updatedBullion.cities = computeAllIndianCityRates(
        Number(updatedBullion.gold24KPer10g),
        Number(updatedBullion.silver999PerKg)
      );
    }

    const isoTimestamp = new Date().toISOString();

    const updatedConfig: SiteFinancialConfig = {
      version: (existingConfig.version || 1) + 1,
      lastUpdated: isoTimestamp,
      updatedBy: 'Admin Portal (GitHub Sync)',
      ...existingConfig,
      bullion: updatedBullion,
    };

    // Auto sync live ticker benchmark cards if present
    const baseBenchmarks = updatedConfig.liveTickerBenchmarks || DEFAULT_BENCHMARKS;
    updatedConfig.liveTickerBenchmarks = syncTickerBenchmarks(
      baseBenchmarks,
      updatedBullion,
      updatedConfig.taxAndSalary,
      updatedConfig.homeLoan,
      updatedConfig.solarRooftop
    );

    // Format formatted JSON string
    const jsonString = JSON.stringify(updatedConfig, null, 2);
    const encodedContent = encodeBase64Utf8(jsonString);

    // Step c: Commit the updated JSON file back using PUT contents API
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const commitMessage = `chore(rates): update bullion rates [admin] (${new Date().toLocaleDateString('en-IN')})`;

    const putPayload: any = {
      message: commitMessage,
      content: encodedContent,
      branch,
    };
    if (currentSha) {
      putPayload.sha = currentSha;
    }

    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(putPayload),
    });

    if (!putRes.ok) {
      const putErr = await putRes.json().catch(() => ({}));
      if (putRes.status === 409) {
        return {
          success: false,
          error: 'Conflict (409)',
          message: 'GitHub branch conflict. Another commit was made in the meantime. Please try saving again.',
        };
      }
      return {
        success: false,
        error: `GitHub HTTP ${putRes.status}`,
        message: putErr.message || `Failed to commit to GitHub (${putRes.status}). Check PAT repository permissions.`,
      };
    }

    const putData = await putRes.json();
    const commitSha = putData?.commit?.sha?.substring(0, 7) || 'latest';
    const commitUrl = putData?.commit?.html_url;

    // Step d: Return success with Cloudflare Pages auto-deploy note
    return {
      success: true,
      commitSha,
      commitUrl,
      message: 'Rates saved to GitHub! Cloudflare Pages is now auto-deploying the new rates (takes ~60s).',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name || 'NetworkError',
      message: `Failed to connect to GitHub API: ${err.message || 'Please check your connection.'}`,
    };
  }
}
