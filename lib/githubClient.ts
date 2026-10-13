/**
 * GitHub API Client for Direct Admin Sync
 * Provides persistent storage using the GitHub repository as the primary database
 * for static hosts like Cloudflare Pages (no Node/Express backend required).
 */

export interface GitHubSyncConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface GitHubCommitResult {
  success: boolean;
  message: string;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
  isNoToken?: boolean;
}

export interface CommitFileOptions {
  path: string;
  contentString: string;
  commitMessage: string;
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
}

export const DEFAULT_GITHUB_OWNER = 'ASHUBHAIYA';
export const DEFAULT_GITHUB_REPO = 'calculator_nd_news';
export const DEFAULT_GITHUB_BRANCH = 'main';

// Primary token key used across the entire admin panel
export const GITHUB_PAT_KEY = 'bharatcalc_github_pat';
// Legacy token key for backward compatibility
const LEGACY_GITHUB_TOKEN_KEY = 'bharatcalc_github_token';

export const GITHUB_OWNER_KEY = 'bharatcalc_github_owner';
export const GITHUB_REPO_KEY = 'bharatcalc_github_repo';
export const GITHUB_BRANCH_KEY = 'bharatcalc_github_branch';

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

  const token =
    localStorage.getItem(GITHUB_PAT_KEY) ||
    localStorage.getItem(LEGACY_GITHUB_TOKEN_KEY) ||
    '';
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
    const trimmed = config.token.trim();
    if (trimmed) {
      localStorage.setItem(GITHUB_PAT_KEY, trimmed);
      localStorage.setItem(LEGACY_GITHUB_TOKEN_KEY, trimmed);
    } else {
      localStorage.removeItem(GITHUB_PAT_KEY);
      localStorage.removeItem(LEGACY_GITHUB_TOKEN_KEY);
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

  // Dispatch custom event so all admin components update their token status in real-time
  try {
    window.dispatchEvent(new CustomEvent('bharatcalc_github_config_changed', { detail: config }));
  } catch {
    // Ignore in non-browser environments
  }
}

/**
 * Encodes string to UTF-8 Base64 (browser-compatible with full UTF-8 character support)
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
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Tests GitHub connection with the provided credentials
 */
export async function testGitHubConnection(config?: Partial<GitHubSyncConfig>): Promise<{
  success: boolean;
  message: string;
  repoDetails?: any;
}> {
  const current = getStoredGitHubConfig();
  const token = (config?.token ?? current.token).trim();
  const owner = (config?.owner ?? current.owner).trim() || DEFAULT_GITHUB_OWNER;
  const repo = (config?.repo ?? current.repo).trim() || DEFAULT_GITHUB_REPO;
  const branch = (config?.branch ?? current.branch).trim() || DEFAULT_GITHUB_BRANCH;

  if (!token) {
    return {
      success: false,
      message: 'No GitHub Personal Access Token provided. Please enter your PAT.',
    };
  }

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });

    if (repoRes.status === 401) {
      return {
        success: false,
        message: 'Invalid GitHub token (HTTP 401 Unauthorized). Please verify token scopes and expiration.',
      };
    }
    if (repoRes.status === 404) {
      return {
        success: false,
        message: `Repository ${owner}/${repo} not found (HTTP 404). Check owner, repo name, or token repository access.`,
      };
    }
    if (!repoRes.ok) {
      const err = await repoRes.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || `GitHub returned error HTTP ${repoRes.status}`,
      };
    }

    const branchRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        cache: 'no-store',
      }
    );

    if (!branchRes.ok) {
      return {
        success: false,
        message: `Branch '${branch}' was not found in ${owner}/${repo}. Please verify branch name.`,
      };
    }

    const repoData = await repoRes.json();
    return {
      success: true,
      message: `Successfully authenticated! Connected to ${repoData.full_name} on branch '${branch}'.`,
      repoDetails: {
        fullName: repoData.full_name,
        isPrivate: repoData.private,
        defaultBranch: repoData.default_branch,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error connecting to GitHub: ${err.message || 'Check your internet connection.'}`,
    };
  }
}

/**
 * General reusable GitHub commit helper
 * 1. GET current file sha from GitHub REST API
 * 2. Encodes contentString to UTF-8 Base64
 * 3. PUT updated file to GitHub contents API
 * 4. Returns structured commit result
 */
export async function commitFileToGithub(options: CommitFileOptions): Promise<GitHubCommitResult> {
  const stored = getStoredGitHubConfig();
  const token = (options.token ?? stored.token).trim();
  const owner = (options.owner ?? stored.owner).trim() || DEFAULT_GITHUB_OWNER;
  const repo = (options.repo ?? stored.repo).trim() || DEFAULT_GITHUB_REPO;
  const branch = (options.branch ?? stored.branch).trim() || DEFAULT_GITHUB_BRANCH;
  const path = options.path.replace(/^\/+/, ''); // Strip leading slash

  if (!token) {
    return {
      success: false,
      isNoToken: true,
      message: 'Please enter and save your GitHub Personal Access Token first.',
    };
  }

  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;

  try {
    // 1. Retrieve current file's SHA
    const getRes = await fetch(getUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });

    let currentSha: string | undefined;

    if (getRes.ok) {
      const fileData = await getRes.json();
      currentSha = fileData.sha;
    } else if (getRes.status === 401) {
      return {
        success: false,
        error: 'Unauthorized (401)',
        message: 'Invalid GitHub Personal Access Token (HTTP 401). Please check token scopes and expiration.',
      };
    } else if (getRes.status === 404) {
      // File does not exist yet; will create new file
      currentSha = undefined;
    } else {
      const errJson = await getRes.json().catch(() => ({}));
      return {
        success: false,
        error: `GitHub HTTP ${getRes.status}`,
        message: errJson.message || `Failed to fetch ${path} from GitHub (${getRes.status}).`,
      };
    }

    // 2. Base64 UTF-8 encode content
    const encodedContent = encodeBase64Utf8(options.contentString);

    // 3. Commit to GitHub via PUT
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const putPayload: any = {
      message: options.commitMessage,
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
          message: 'GitHub branch conflict (HTTP 409). Another commit was made in the meantime. Please try saving again.',
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

    return {
      success: true,
      commitSha,
      commitUrl,
      message: 'Changes committed to GitHub! Cloudflare deployment started (~60s).',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name || 'NetworkError',
      message: `Failed to connect to GitHub API: ${err.message || 'Please check your connection.'}`,
    };
  }
}
