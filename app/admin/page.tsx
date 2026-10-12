import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  ExternalLink,
  BookOpen,
  Coins,
  TrendingUp,
  IndianRupee,
  Home,
  Fuel,
  Sun,
  Database,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { ExplainersTab } from '@/components/admin/ExplainersTab';
import { ExplainerEditorModal } from '@/components/admin/ExplainerEditorModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { BullionRatesTab } from '@/components/admin/BullionRatesTab';
import { LiveTickerTab } from '@/components/admin/LiveTickerTab';
import { TaxSalaryTab } from '@/components/admin/TaxSalaryTab';
import { LoanMortgageTab } from '@/components/admin/LoanMortgageTab';
import { FuelEnergyTab } from '@/components/admin/FuelEnergyTab';
import { SolarSubsidyTab } from '@/components/admin/SolarSubsidyTab';
import { SystemStatusTab } from '@/components/admin/SystemStatusTab';
import { isAdminAuthenticated, clearAdminSession } from '@/lib/adminAuth';
import { useSiteConfig } from '@/lib/siteConfig';
import {
  fetchArticles,
  insertArticle,
  updateArticleInSupabase,
  deleteArticleFromSupabase,
} from '@/lib/supabase';
import { Article } from '@/lib/types/article';

type AdminTab =
  | 'explainers'
  | 'bullion'
  | 'ticker'
  | 'tax'
  | 'loan'
  | 'fuel'
  | 'solar'
  | 'system';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<AdminTab>('explainers');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [isSavingArticle, setIsSavingArticle] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isResettingConfig, setIsResettingConfig] = useState(false);

  const { config, updateConfig, resetToDefaults, refreshConfig } = useSiteConfig();

  // Load articles
  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      const { articles: list } = await fetchArticles();
      setArticles(list);
    } catch (err) {
      console.warn('Error loading articles in admin:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  // Article handlers
  const handleOpenCreateArticle = () => {
    setArticleToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setArticleToEdit(art);
    setIsEditorOpen(true);
  };

  const handleOpenDeleteArticle = (art: Article) => {
    setArticleToDelete(art);
    setIsDeleteModalOpen(true);
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    setIsSavingArticle(true);
    try {
      if (articleToEdit) {
        const updated = await updateArticleInSupabase(
          articleToEdit.id || articleToEdit.slug,
          articleData
        );
        setArticles((prev) =>
          prev.map((a) =>
            a.id === updated.id || a.slug === articleToEdit.slug ? updated : a
          )
        );
      } else {
        const created = await insertArticle(articleData);
        setArticles((prev) => [created, ...prev]);
      }
      setIsEditorOpen(false);
      setArticleToEdit(null);
    } catch (err: any) {
      alert(err.message || 'Error saving article');
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleConfirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeletingArticle(true);
    try {
      await deleteArticleFromSupabase(articleToDelete.id || articleToDelete.slug);
      setArticles((prev) =>
        prev.filter((a) => a.id !== articleToDelete.id && a.slug !== articleToDelete.slug)
      );
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting article');
    } finally {
      setIsDeletingArticle(false);
    }
  };

  // Config handlers
  const handleSaveBullion = async (newBullion: any) => {
    setIsSavingConfig(true);
    try {
      await updateConfig({ bullion: newBullion });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveLiveTicker = async (newBenchmarks: any) => {
    setIsSavingConfig(true);
    try {
      await updateConfig({ liveTickerBenchmarks: newBenchmarks });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveTax = async (newTax: any) => {
    setIsSavingConfig(true);
    try {
      await updateConfig({ taxAndSalary: newTax });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveLoan = async (newLoan: any) => {
    setIsSavingConfig(true);
    try {
      await updateConfig({ homeLoan: newLoan });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveFuel = async (newFuel: any) => {
    setIsSavingConfig(true);
    try {
      await updateConfig({ fuelAndEv: newFuel });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveSolar = async (newSolar: any) => {
    setIsSavingConfig(true);
    try {
      await updateConfig({ solarRooftop: newSolar });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsResettingConfig(true);
    try {
      await resetToDefaults();
    } finally {
      setIsResettingConfig(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <SeoHead
          title="Admin Login | BharatCalc"
          description="Administrative control console for BharatCalc."
          canonicalPath="/admin"
        />
        <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  const TABS: Array<{ id: AdminTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'explainers', label: 'Explainers CMS', icon: BookOpen },
    { id: 'bullion', label: 'Gold & Silver Rates', icon: Coins },
    { id: 'ticker', label: 'Live Ticker Cards', icon: TrendingUp },
    { id: 'tax', label: 'Tax & Salary Slabs', icon: IndianRupee },
    { id: 'loan', label: 'Home Loan & Mortgages', icon: Home },
    { id: 'fuel', label: 'Fuel & EV Tariffs', icon: Fuel },
    { id: 'solar', label: 'PM Surya Ghar Solar', icon: Sun },
    { id: 'system', label: 'Database & Sync', icon: Database },
  ];

  return (
    <div className="w-full pb-16 min-h-screen bg-slate-50/50">
      <SeoHead
        title="Admin Control Center | BharatCalc"
        description="Manage financial explainers, live bullion spot rates, and site constants."
        canonicalPath="/admin"
      />

      {/* Admin Top Header Bar */}
      <section className="bg-slate-950 text-white border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-display text-white">
                    BharatCalc Administration Hub
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SUPERADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage live articles, bullion tickers, tax rules, and site configuration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/40 text-red-200 text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'explainers' && (
          <ExplainersTab
            articles={articles}
            onOpenCreate={handleOpenCreateArticle}
            onOpenEdit={handleOpenEditArticle}
            onOpenDelete={handleOpenDeleteArticle}
            loading={loadingArticles}
          />
        )}

        {activeTab === 'bullion' && (
          <BullionRatesTab
            config={config}
            onSave={handleSaveBullion}
            isSaving={isSavingConfig}
          />
        )}

        {activeTab === 'ticker' && (
          <LiveTickerTab
            config={config}
            onSave={handleSaveLiveTicker}
            isSaving={isSavingConfig}
          />
        )}

        {activeTab === 'tax' && (
          <TaxSalaryTab
            config={config}
            onSave={handleSaveTax}
            isSaving={isSavingConfig}
          />
        )}

        {activeTab === 'loan' && (
          <LoanMortgageTab
            config={config}
            onSave={handleSaveLoan}
            isSaving={isSavingConfig}
          />
        )}

        {activeTab === 'fuel' && (
          <FuelEnergyTab
            config={config}
            onSave={handleSaveFuel}
            isSaving={isSavingConfig}
          />
        )}

        {activeTab === 'solar' && (
          <SolarSubsidyTab
            config={config}
            onSave={handleSaveSolar}
            isSaving={isSavingConfig}
          />
        )}

        {activeTab === 'system' && (
          <SystemStatusTab
            config={config}
            onResetDefaults={handleResetDefaults}
            onRefreshConfig={refreshConfig}
            isResetting={isResettingConfig}
          />
        )}
      </main>

      {/* Authoring / Editing Modal */}
      <ExplainerEditorModal
        isOpen={isEditorOpen}
        articleToEdit={articleToEdit}
        onClose={() => {
          setIsEditorOpen(false);
          setArticleToEdit(null);
        }}
        onSave={handleSaveArticle}
        isSaving={isSavingArticle}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        article={articleToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setArticleToDelete(null);
        }}
        onConfirm={handleConfirmDeleteArticle}
        isDeleting={isDeletingArticle}
      />
    </div>
  );
};
