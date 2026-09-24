import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { RootLayout } from '@/app/layout';
import { HomePage } from '@/app/page';
import { InHandSalaryPage } from '@/app/calculators/in-hand-salary/page';
import { GoldJewelryBillPage } from '@/app/calculators/gold-jewelry-bill/page';
import { HomeLoanPrepaymentPage } from '@/app/calculators/home-loan-prepayment/page';
import { CommuteFuelPage } from '@/app/calculators/commute-fuel/page';
import { SolarRooftopPage } from '@/app/calculators/solar-rooftop/page';
import { ExplainersIndexPage } from '@/app/explainers/ExplainersIndexPage';
import { ExplainerDetailPage } from '@/app/explainers/ExplainerDetailPage';
import { UnitTestsModal } from '@/components/UnitTestsModal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * Automatically scrolls window to top upon navigating to any route
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  const [testsModalOpen, setTestsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RootLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculators/in-hand-salary" element={<InHandSalaryPage />} />
          <Route path="/calculators/gold-jewelry-bill" element={<GoldJewelryBillPage />} />
          <Route path="/calculators/home-loan-prepayment" element={<HomeLoanPrepaymentPage />} />
          <Route path="/calculators/commute-fuel" element={<CommuteFuelPage />} />
          <Route path="/calculators/solar-rooftop" element={<SolarRooftopPage />} />
          <Route path="/explainers" element={<ExplainersIndexPage />} />
          <Route path="/explainers/:slug" element={<ExplainerDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Floating Developer & Statutory Verification Badge */}
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setTestsModalOpen(true)}
            id="btn-statutory-unit-tests"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold shadow-lg backdrop-blur-xs border border-slate-700 transition-all hover:scale-105 active:scale-95"
            title="Inspect Mathematical Engine Unit Tests"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Verify Slabs & Math</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded font-mono font-bold border border-emerald-800">
              11 Tests
            </span>
          </button>
        </div>

        {/* Diagnostic Unit Tests Suite Modal */}
        <UnitTestsModal
          isOpen={testsModalOpen}
          onClose={() => setTestsModalOpen(false)}
        />
      </RootLayout>
    </BrowserRouter>
  );
}
