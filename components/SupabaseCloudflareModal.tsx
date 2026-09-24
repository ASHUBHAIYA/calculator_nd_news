import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  X,
  Code2,
  Terminal,
  ShieldCheck,
  Server,
  Layers,
} from 'lucide-react';
import { getSupabaseStatus } from '@/lib/supabase';

interface SupabaseCloudflareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseCloudflareModal: React.FC<SupabaseCloudflareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'supabase' | 'cloudflare'>('supabase');

  if (!isOpen) return null;

  const status = getSupabaseStatus();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleSqlSnippet = `-- Run this in your Supabase SQL Editor:
-- Table for articles
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  full_content TEXT NOT NULL,
  category TEXT NOT NULL,
  related_calculator TEXT NOT NULL DEFAULT 'none',
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to articles"
  ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public insert to articles"
  ON public.articles FOR INSERT WITH CHECK (true);`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Supabase & Cloudflare Pages Architecture</span>
              </h2>
              <p className="text-xs text-slate-500">
                Production-grade cloud persistence & edge distribution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'supabase'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Cloud Persistence</span>
            {status.isConfigured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'cloudflare'
                ? 'border-orange-500 text-orange-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloudflare Pages Deployment</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-800">
              Edge CDN
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {activeTab === 'supabase' ? (
            <div className="space-y-5">
              {/* Connection Status Card */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  status.isConfigured
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {status.isConfigured ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-sm">
                    {status.isConfigured
                      ? 'Supabase Connected & Active'
                      : 'Running in Local / Server Fallback Mode'}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {status.statusMessage}
                  </p>
                  {status.endpointUrl && (
                    <div className="text-[11px] font-mono mt-1 opacity-80 break-all">
                      Endpoint: {status.endpointUrl}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 1: Environment Variables */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Configure Supabase Environment Variables</span>
                </h3>
                <p className="text-slate-500">
                  Add your Supabase credentials into your environment or Cloudflare Pages Build Settings:
                </p>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1.5 relative">
                  <div className="text-slate-400"># Project Settings &gt; API &gt; Project URL &amp; anon public key</div>
                  <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                  <button
                    onClick={() =>
                      handleCopy(
                        'VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key',
                        'env'
                      )
                    }
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedKey === 'env' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Step 2: PostgreSQL Schema */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <span>2. Execute PostgreSQL Schema (`supabase/schema.sql`)</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(sampleSqlSnippet, 'sql')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'sql' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === 'sql' ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <p className="text-slate-500">
                  Open your <strong>Supabase Dashboard &gt; SQL Editor</strong> and run the script in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">supabase/schema.sql</code>. It creates the <code className="text-emerald-700">articles</code> and <code className="text-emerald-700">saved_calculations</code> tables with Row Level Security (RLS) enabled and pre-seeds authoritative explainers.
                </p>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] max-h-36 overflow-y-auto">
                  <pre>{sampleSqlSnippet}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Cloudflare Pages Deployment Overview */}
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-orange-900 space-y-1">
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-orange-600" />
                  <span>Optimized for Cloudflare Pages Global Edge CDN</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  The application is fully configured as a lightning-fast Single Page Application (SPA) with Cloudflare SPA redirect routing (<code className="bg-orange-100 px-1 py-0.5 rounded">public/_redirects</code>) and edge security headers (<code className="bg-orange-100 px-1 py-0.5 rounded">public/_headers</code>).
                </p>
              </div>

              {/* Cloudflare Build Settings Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Cloudflare Pages Build Configuration
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-600 bg-slate-50 w-44">
                          Framework preset
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-900">Vite</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-600 bg-slate-50">
                          Build command
                        </td>
                        <td className="px-4 py-2.5 font-mono text-emerald-700 font-bold">
                          npm run build
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-600 bg-slate-50">
                          Build output directory
                        </td>
                        <td className="px-4 py-2.5 font-mono text-emerald-700 font-bold">
                          dist
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-600 bg-slate-50">
                          Node.js Version
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-900">
                          20 or higher
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SPA Routing Verification */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>SPA Deep-Linking & Routing Rules</span>
                </h3>
                <p className="text-slate-500">
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">public/_redirects</code> ensures direct visits to deep URLs like <code className="text-emerald-700">/explainers/:slug</code> serve <code className="text-slate-800">index.html</code> with HTTP 200:
                </p>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px]">
                  /*&nbsp;&nbsp;&nbsp;&nbsp;/index.html&nbsp;&nbsp;&nbsp;200
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero mock dependencies • Full fallback resilience
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
