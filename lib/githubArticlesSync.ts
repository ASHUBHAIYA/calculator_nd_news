/**
 * GitHub Articles CMS Service
 * Allows creating, editing, and deleting Explainer articles directly via the GitHub REST API
 * committing changes to `data/articles.json` for Cloudflare Pages static hosting.
 */

import { Article } from './types/article';
import { INITIAL_ARTICLES } from './articlesData';
import {
  commitFileToGithub,
  getStoredGitHubConfig,
  decodeBase64Utf8,
  GitHubCommitResult,
} from './githubClient';
import {
  getCachedArticles,
  setCachedArticles,
  sortArticlesLatestFirst,
} from './articlesStorage';

const ARTICLES_FILE_PATH = 'data/articles.json';
const PUBLIC_ARTICLES_FILE_PATH = 'public/data/articles.json';

/**
 * Loads current articles from GitHub REST API (or fallback to static data/articles.json or INITIAL_ARTICLES)
 */
export async function fetchArticlesFromGitHub(): Promise<{
  articles: Article[];
  source: 'github' | 'static' | 'cache' | 'seed';
}> {
  const localCached = getCachedArticles();
  const config = getStoredGitHubConfig();
  const token = config.token.trim();

  if (token) {
    try {
      const getUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${ARTICLES_FILE_PATH}?ref=${encodeURIComponent(config.branch)}`;
      const res = await fetch(getUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          const decoded = decodeBase64Utf8(data.content);
          const parsed = JSON.parse(decoded);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sorted = sortArticlesLatestFirst(parsed);
            setCachedArticles(sorted);
            return { articles: sorted, source: 'github' };
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch articles from GitHub, falling back to static/cache:', err);
    }
  }

  // Check local cache
  if (localCached && localCached.length > 0) {
    return { articles: sortArticlesLatestFirst(localCached), source: 'cache' };
  }

  // Fallback: fetch bundled static file
  try {
    const staticRes = await fetch('/data/articles.json');
    if (staticRes.ok) {
      const parsed = await staticRes.json();
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sorted = sortArticlesLatestFirst(parsed);
        setCachedArticles(sorted);
        return { articles: sorted, source: 'static' };
      }
    }
  } catch {
    // Static fetch failed
  }

  // In-memory seed
  return { articles: sortArticlesLatestFirst(INITIAL_ARTICLES), source: 'seed' };
}

/**
 * Commits the entire articles list to data/articles.json and public/data/articles.json in GitHub
 */
export async function commitArticlesToGitHub(
  articles: Article[],
  commitMessage: string
): Promise<GitHubCommitResult> {
  // Always update local cache so the change is instantly reflected across the site
  const sortedArticles = sortArticlesLatestFirst(articles);
  setCachedArticles(sortedArticles);

  const config = getStoredGitHubConfig();

  if (!config.token.trim()) {
    return {
      success: false,
      isNoToken: true,
      message: 'Please enter and save your GitHub Personal Access Token first.',
    };
  }

  const jsonString = JSON.stringify(sortedArticles, null, 2);

  const res = await commitFileToGithub({
    path: ARTICLES_FILE_PATH,
    contentString: jsonString,
    commitMessage,
    token: config.token,
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
  });

  // Also sync public/data/articles.json for static hosting
  if (res.success) {
    try {
      await commitFileToGithub({
        path: PUBLIC_ARTICLES_FILE_PATH,
        contentString: jsonString,
        commitMessage: `${commitMessage} (sync public/data)`,
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch,
      });
    } catch (e) {
      console.warn('Could not mirror articles to public/data/articles.json:', e);
    }
  }

  return res;
}
