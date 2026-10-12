import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  RotateCcw,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
} from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';
import { getSupabaseStatus } from '@/lib/supabase';

interface SystemStatusTabProps {
  config: SiteFinancialConfig;
  onResetDefaults: () => Promise<void>;
  onRefreshConfig: () => Promise<void>;
  isResetting: boolean;
}

export const SystemStatusTab: React.FC<SystemStatusTabProps> = ({
  config,
  onResetDefaults,
  onRefreshConfig,
  isResetting,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const supabaseStatus = getSupabaseStatus();

  const handleExportBackup = () => {
    setIsExporting(true);
    try {
      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bharatcalc-config-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExecuteReset = async () => {
    await onResetDefaults();
    setResetConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Database & Cloud Sync Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Database &amp; Persistence Engine</h2>
              <p className="text-[11px] text-slate-500">
                Multi-tier PostgreSQL persistence with automatic local storage and server fallback.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                supabaseStatus.isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseStatus.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{supabaseStatus.isConfigured ? 'Supabase Connected' : 'Local Fallback Active'}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Persistence Mode
            </div>
            <div className="font-bold text-slate-900">
              {supabaseStatus.isConfigured ? 'Supabase Cloud (PostgreSQL)' : 'File-Backed Server Storage'}
            </div>
            <div className="text-[11px] text-slate-500">
              {supabaseStatus.isConfigured ? 'Direct Cloud Sync' : 'data/site-config.json & LocalStorage'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Config Version
            </div>
            <div className="font-mono font-bold text-slate-900">v{config.version || 1}</div>
            <div className="text-[11px] text-slate-500">
              Updated by {config.updatedBy || 'Admin'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Last Broadcast Timestamp
            </div>
            <div className="font-mono text-[11px] text-slate-800">
              {new Date(config.lastUpdated).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Backup & System Operations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          System Maintenance &amp; Backup Operations
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Configuration JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={onRefreshConfig}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reload Active Config from Server</span>
          </button>

          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all shadow-2xs cursor-pointer ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Rates to Statutory Standards</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-auto p-1 bg-red-50 rounded-xl border border-red-300">
              <span className="text-[11px] font-bold text-red-800 px-2">Confirm reset?</span>
              <button
                type="button"
                onClick={handleExecuteReset}
                disabled={isResetting}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset Now'}
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
