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
import { AboutPage } from '@/app/about/page';
import { ContactPage } from '@/app/contact/page';
import { FaqPage } from '@/app/faq/page';
import { GuidePage } from '@/app/guide/page';
import { PrivacyPolicyPage } from '@/app/privacy-policy/page';
import { TermsOfServicePage } from '@/app/terms-of-service/page';
import { DisclaimerPage } from '@/app/disclaimer/page';
import { AdminPage } from '@/app/admin/page';

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
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
