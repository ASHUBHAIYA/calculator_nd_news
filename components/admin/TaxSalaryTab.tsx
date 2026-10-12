import React, { useState } from 'react';
import { IndianRupee, Check } from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';

interface TaxSalaryTabProps {
  config: SiteFinancialConfig;
  onSave: (newTaxConfig: SiteFinancialConfig['taxAndSalary']) => Promise<void>;
  isSaving: boolean;
}

export const TaxSalaryTab: React.FC<TaxSalaryTabProps> = ({ config, onSave, isSaving }) => {
  const [stdDeduction, setStdDeduction] = useState(config.taxAndSalary.standardDeduction);
  const [sec87aLimit, setSec87aLimit] = useState(config.taxAndSalary.sec87aRebateLimit);
  const [epfRate, setEpfRate] = useState(config.taxAndSalary.epfStatutoryRate);
  const [employerPfRate, setEmployerPfRate] = useState(config.taxAndSalary.employerPfRate);
  const [cess, setCess] = useState(config.taxAndSalary.healthEducationCess);
  const [profTax, setProfTax] = useState(config.taxAndSalary.professionalTaxDefault);
  const [successMsg, setSuccessMsg] = useState(false);

  React.useEffect(() => {
    if (config.taxAndSalary) {
      setStdDeduction(config.taxAndSalary.standardDeduction);
      setSec87aLimit(config.taxAndSalary.sec87aRebateLimit);
      setEpfRate(config.taxAndSalary.epfStatutoryRate);
      setEmployerPfRate(config.taxAndSalary.employerPfRate);
      setCess(config.taxAndSalary.healthEducationCess);
      setProfTax(config.taxAndSalary.professionalTaxDefault);
    }
  }, [config.taxAndSalary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      standardDeduction: Number(stdDeduction),
      sec87aRebateLimit: Number(sec87aLimit),
      epfStatutoryRate: Number(epfRate),
      employerPfRate: Number(employerPfRate),
      healthEducationCess: Number(cess),
      professionalTaxDefault: Number(profTax),
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Income Tax &amp; Salary Engine Defaults</h2>
              <p className="text-[11px] text-slate-500">
                FY 2025-26 New Tax Regime (Sec 115BAC), EPFO statutory compounding rates, and deduction rules.
              </p>
            </div>
          </div>
          {successMsg && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Tax Rules!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Standard Deduction (Salaried) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={stdDeduction}
                onChange={(e) => setStdDeduction(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Union Budget FY 2025-26</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Section 87A Full Rebate Limit *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={sec87aLimit}
                onChange={(e) => setSec87aLimit(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Zero Tax up to ₹{((sec87aLimit + stdDeduction) / 100000).toFixed(2)} Lakhs gross
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              EPFO Statutory Annual Interest *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={epfRate}
                onChange={(e) => setEpfRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                % p.a.
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Official CBT Gazette rate</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Employer PF Contribution Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={employerPfRate}
                onChange={(e) => setEmployerPfRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                % of Basic
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Health &amp; Education Cess
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={cess}
                onChange={(e) => setCess(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                % on Tax
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Professional Tax (Monthly)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={profTax}
                onChange={(e) => setProfTax(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Standard ₹2,500/year cap</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Tax Rules...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Tax &amp; Salary Rules</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
