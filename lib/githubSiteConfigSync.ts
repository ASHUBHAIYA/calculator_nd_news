/**
 * Helper to update site configuration and commit directly to GitHub repository
 * (data/site-config.json and public/data/site-config.json) without any Node backend.
 */

import { SiteFinancialConfig, DEFAULT_BENCHMARKS, syncTickerBenchmarks } from './siteConfig';
import {
  commitFileToGithub,
  getStoredGitHubConfig,
  decodeBase64Utf8,
  GitHubCommitResult,
} from './githubClient';

export interface SyncConfigToGithubOptions {
  updates: Partial<SiteFinancialConfig>;
  commitMessage: string;
}

/**
 * Loads current site-config.json from GitHub (or local cache), applies partial updates,
 * recalculates any synced benchmarks, and commits back to GitHub.
 */
export async function syncConfigToGithub(
  options: SyncConfigToGithubOptions
): Promise<GitHubCommitResult> {
  const { updates, commitMessage } = options;
  const config = getStoredGitHubConfig();
  const token = config.token.trim();

  if (!token) {
    return {
      success: false,
      isNoToken: true,
      message: 'Please enter and save your GitHub Personal Access Token first.',
    };
  }

  const path = 'data/site-config.json';
  const getUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${encodeURIComponent(config.branch)}`;

  try {
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
          console.warn('Could not parse existing site-config from GitHub:', parseErr);
        }
      }
    } else if (getRes.status === 401) {
      return {
        success: false,
        error: 'Unauthorized (401)',
        message: 'Invalid GitHub Personal Access Token (HTTP 401). Please check token permissions in GitHub.',
      };
    } else if (getRes.status === 404) {
      currentSha = undefined;
    } else {
      const errJson = await getRes.json().catch(() => ({}));
      return {
        success: false,
        error: `GitHub HTTP ${getRes.status}`,
        message: errJson.message || `Failed to fetch ${path} from GitHub (${getRes.status}).`,
      };
    }

    // Merge configurations
    const mergedBullion = { ...existingConfig.bullion, ...(updates.bullion || {}) };
    const mergedTax = { ...existingConfig.taxAndSalary, ...(updates.taxAndSalary || {}) };
    const mergedLoan = { ...existingConfig.homeLoan, ...(updates.homeLoan || {}) };
    const mergedFuel = { ...existingConfig.fuelAndEv, ...(updates.fuelAndEv || {}) };
    const mergedSolar = { ...existingConfig.solarRooftop, ...(updates.solarRooftop || {}) };

    const baseBenchmarks =
      updates.liveTickerBenchmarks || existingConfig.liveTickerBenchmarks || DEFAULT_BENCHMARKS;
    const syncedBenchmarks = syncTickerBenchmarks(
      baseBenchmarks,
      mergedBullion,
      mergedTax,
      mergedLoan,
      mergedSolar
    );

    const mergedFullConfig = {
      ...existingConfig,
      ...updates,
      version: (existingConfig.version || 1) + 1,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin Portal (GitHub Direct Sync)',
      bullion: mergedBullion,
      taxAndSalary: mergedTax,
      homeLoan: mergedLoan,
      fuelAndEv: mergedFuel,
      solarRooftop: mergedSolar,
      liveTickerBenchmarks: syncedBenchmarks,
    };

    const jsonString = JSON.stringify(mergedFullConfig, null, 2);

    // Commit to data/site-config.json
    const result = await commitFileToGithub({
      path: 'data/site-config.json',
      contentString: jsonString,
      commitMessage,
      token,
      owner: config.owner,
      repo: config.repo,
      branch: config.branch,
    });

    if (!result.success) {
      return result;
    }

    // Also mirror to public/data/site-config.json for static asset requests
    commitFileToGithub({
      path: 'public/data/site-config.json',
      contentString: jsonString,
      commitMessage: `chore: mirror public/data/site-config.json [admin]`,
      token,
      owner: config.owner,
      repo: config.repo,
      branch: config.branch,
    }).catch(() => {});

    return {
      success: true,
      commitSha: result.commitSha,
      commitUrl: result.commitUrl,
      message: 'Changes committed to GitHub! Cloudflare deployment started (~60s).',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name || 'NetworkError',
      message: `Failed to commit to GitHub: ${err.message || 'Please check your connection.'}`,
    };
  }
}
