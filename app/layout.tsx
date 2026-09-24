import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ComplianceModal, ComplianceTab } from '@/components/ComplianceModal';

export const metadata = {
  title: 'BharatCalc – Indian Financial & Utility Calculators',
  description:
    'Modern, high-performance financial and utility calculators for India: In-Hand Salary (FY 2025-26), Gold Jewelry Invoice, Home Loan Prepayment, Fuel Spend, and PM Surya Ghar Solar Subsidy.',
  keywords: [
    'BharatCalc',
    'In-Hand Salary Calculator',
    'New Tax Regime FY 2025-26',
    'Gold GST Calculator',
    'Home Loan Prepayment',
    'PM Surya Ghar Solar Subsidy',
    'Indian Rupee Calculator',
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [activeComplianceTab, setActiveComplianceTab] = useState<ComplianceTab>('about');

  const handleOpenCompliance = (tab: ComplianceTab) => {
    setActiveComplianceTab(tab);
    setComplianceModalOpen(true);
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans">
      {/* Sticky Header */}
      <Navbar onOpenComplianceModal={handleOpenCompliance} />

      {/* Main Page Body */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {/* Compliance & Regulatory Footer */}
      <Footer onOpenComplianceModal={handleOpenCompliance} />

      {/* Regulatory Compliance & Legal Modal */}
      <ComplianceModal
        isOpen={complianceModalOpen}
        activeTab={activeComplianceTab}
        onClose={() => setComplianceModalOpen(false)}
        onSelectTab={setActiveComplianceTab}
      />
    </div>
  );
};

export default RootLayout;
