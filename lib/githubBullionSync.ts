/**
 * GitHub Bullion Sync Service
 * Allows the admin to save bullion (gold and silver) rates directly to GitHub
 * as the persistent data store for static hosts like Cloudflare Pages.
 * Re-exports common utilities from githubClient for backwards compatibility.
 */

import { SiteFinancialConfig, DEFAULT_BENCHMARKS, syncTickerBenchmarks } from './siteConfig';
import { computeAllIndianCityRates } from './indianCitiesBullion';
import {
  getStoredGitHubConfig,
  saveStoredGitHubConfig,
  encodeBase64Utf8,
  decodeBase64Utf8,
  testGitHubConnection,
  commitFileToGithub,
  DEFAULT_GITHUB_OWNER,
  DEFAULT_GITHUB_REPO,
  DEFAULT_GITHUB_BRANCH,
  GitHubSyncConfig,
  GitHubCommitResult as GitHubSyncResult,
} from './githubClient';

export type { GitHubSyncConfig, GitHubSyncResult };
export {
  getStoredGitHubConfig,
  saveStoredGitHubConfig,
  encodeBase64Utf8,
  decodeBase64Utf8,
  testGitHubConnection,
  DEFAULT_GITHUB_OWNER,
  DEFAULT_GITHUB_REPO,
  DEFAULT_GITHUB_BRANCH,
};

/**
 * Commits updated bullion rates directly to data/site-config.json and public/data/site-config.json on GitHub
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

  if (!token) {
    return {
      success: false,
      isNoToken: true,
      message:
        'Please enter and save your GitHub Personal Access Token first. Rates will only persist in your local preview.',
    };
  }

  const filePath = 'data/site-config.json';
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;

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
          console.warn('Could not parse existing site-config from GitHub, using default structure', parseErr);
        }
      }
    } else if (getRes.status === 401) {
      return {
        success: false,
        error: 'Unauthorized (401)',
        message: 'Invalid GitHub Personal Access Token (HTTP 401). Please check token scopes in GitHub settings.',
      };
    } else if (getRes.status === 404) {
      currentSha = undefined;
    } else {
      const errJson = await getRes.json().catch(() => ({}));
      return {
        success: false,
        error: `GitHub HTTP ${getRes.status}`,
        message: errJson.message || `Failed to fetch ${filePath} from GitHub (${getRes.status}).`,
      };
    }

    const currentBullion = existingConfig.bullion || {};
    const updatedBullion = {
      ...currentBullion,
      ...bullionData,
    };

    if (updatedBullion.gold24KPer10g && !bullionData.gold22KPer10g) {
      updatedBullion.gold22KPer10g = Math.round((updatedBullion.gold24KPer10g / 24) * 22);
      updatedBullion.gold18KPer10g = Math.round((updatedBullion.gold24KPer10g / 24) * 18);
    }
    if (updatedBullion.silver999PerKg && !bullionData.silver925Per10g) {
      updatedBullion.silver925Per10g = Math.round((updatedBullion.silver999PerKg / 100) * 0.925);
    }

    if (updatedBullion.gold24KPer10g && updatedBullion.silver999PerKg) {
      updatedBullion.cities = computeAllIndianCityRates(
        updatedBullion.gold24KPer10g,
        updatedBullion.silver999PerKg
      );
    }

    const currentBenchmarks = existingConfig.liveTickerBenchmarks || DEFAULT_BENCHMARKS;
    const syncedBenchmarks = syncTickerBenchmarks(
      currentBenchmarks,
      updatedBullion,
      existingConfig.taxAndSalary,
      existingConfig.homeLoan,
      existingConfig.solarRooftop
    );

    const updatedConfig = {
      ...existingConfig,
      version: (existingConfig.version || 1) + 1,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin Portal (GitHub Direct Sync)',
      bullion: updatedBullion,
      liveTickerBenchmarks: syncedBenchmarks,
    };

    const jsonString = JSON.stringify(updatedConfig, null, 2);
    const commitMessage = `chore(rates): update bullion rates [admin] (${new Date().toLocaleDateString('en-IN')})`;

    // Commit to data/site-config.json
    const commitResult = await commitFileToGithub({
      path: 'data/site-config.json',
      contentString: jsonString,
      commitMessage,
      token,
      owner,
      repo,
      branch,
    });

    if (!commitResult.success) {
      return commitResult;
    }

    // Also commit to public/data/site-config.json so static site fetches stay synced immediately
    commitFileToGithub({
      path: 'public/data/site-config.json',
      contentString: jsonString,
      commitMessage: `chore(rates): mirror public/data/site-config.json [admin]`,
      token,
      owner,
      repo,
      branch,
    }).catch(() => {});

    return {
      success: true,
      commitSha: commitResult.commitSha,
      commitUrl: commitResult.commitUrl,
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
