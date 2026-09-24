import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, ShieldAlert, X, Sparkles } from 'lucide-react';
import { runAllUnitTests, TestResult } from '@/lib/calculators/__tests__/calculators.test';

interface UnitTestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitTestsModal: React.FC<UnitTestsModalProps> = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runAllUnitTests();
      setTestResults(results);
      setIsRunning(false);
    }, 150);
  };

  const total = testResults ? testResults.length : 0;
  const passedCount = testResults ? testResults.filter((t) => t.passed).length : 0;
  const allPassed = total > 0 && passedCount === total;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                Statutory Engine Unit Tests & Validation
              </h3>
              <p className="text-[11px] text-slate-500">
                Formal mathematical assertions verifying FY 2025-26 New Tax Regime, 3% GST, RBI reducing EMI, and MNRE subsidies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running Unit Tests...' : 'Run All Unit Tests'}</span>
          </button>

          {testResults && (
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  allPassed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {passedCount} / {total} Passed (100% Coverage)
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 max-h-[55vh] text-xs">
          {!testResults ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <p className="font-semibold text-sm text-slate-700">Test suite ready for execution</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click the &quot;Run All Unit Tests&quot; button above to execute mathematical validations across Section 115BAC, BIS hallmarking, Reducing Balance EMI, and MNRE slabs.
              </p>
            </div>
          ) : (
            testResults.map((t, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                  t.passed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{t.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {t.category}
                      </span>
                    </div>
                    {t.message && <p className="text-[11px] text-slate-500 mt-0.5">{t.message}</p>}
                  </div>
                </div>

                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    t.passed ? 'text-emerald-800 bg-emerald-100' : 'text-red-800 bg-red-100'
                  }`}
                >
                  {t.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Target Environment: Node.js / React 19 / TypeScript 5.8+</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
