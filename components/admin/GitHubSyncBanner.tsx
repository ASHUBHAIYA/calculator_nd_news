import React from 'react';
import { CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { GitHubCommitResult } from '@/lib/githubClient';

interface GitHubSyncBannerProps {
  status: {
    state: 'idle' | 'saving' | 'success' | 'error' | 'fallback';
    message?: string;
    commitSha?: string;
    commitUrl?: string;
    error?: string;
  };
}

export const GitHubSyncBanner: React.FC<GitHubSyncBannerProps> = ({ status }) => {
  if (status.state === 'idle') return null;

  if (status.state === 'saving') {
    return (
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-xs flex items-center gap-3 animate-fade-in shadow-2xs">
        <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
        <div className="flex-1 font-medium">
          {status.message || 'Committing directly to GitHub repository...'}
        </div>
      </div>
    );
  }

  if (status.state === 'success') {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="font-bold text-emerald-900">
            {status.message || 'Changes committed to GitHub! Cloudflare deployment started (~60s).'}
          </p>
          {status.commitSha && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-[11px] bg-emerald-100/80 px-2 py-0.5 rounded text-emerald-800 border border-emerald-300">
                commit: {status.commitSha}
              </span>
              {status.commitUrl && (
                <a
                  href={status.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status.state === 'fallback') {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="font-bold text-amber-900">
            Saved to Local Preview Only
          </p>
          <p className="text-amber-800 leading-relaxed">
            {status.message ||
              'Please enter and save your GitHub Personal Access Token in the top bar to commit changes globally and trigger Cloudflare Pages auto-deployment.'}
          </p>
        </div>
      </div>
    );
  }

  if (status.state === 'error') {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-950 text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="font-bold text-red-900">GitHub Sync Failed</p>
          <p className="text-red-800 leading-relaxed font-mono text-[11px]">
            {status.message || status.error || 'Failed to commit file to GitHub.'}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
