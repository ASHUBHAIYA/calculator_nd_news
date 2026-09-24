import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calculator,
  IndianRupee,
  Coins,
  Home,
  Fuel,
  Sun,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  onOpenComplianceModal?: (tab: 'about' | 'privacy' | 'terms' | 'disclaimer') => void;
}

export const FINANCIAL_TOOLS = [
  {
    name: 'In-Hand Salary Calculator',
    shortName: 'Salary',
    path: '/calculators/in-hand-salary',
    icon: IndianRupee,
    desc: 'FY 2025-26 New Tax Regime, ₹75k standard deduction & Sec 87A rebate.',
    tag: 'FY 2025-26',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    name: 'Home Loan Prepayment',
    shortName: 'Home Loan',
    path: '/calculators/home-loan-prepayment',
    icon: Home,
    desc: 'Amortization engine to save lakhs in interest and cut loan tenure.',
    tag: 'Tenure Saver',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];

export const COMMODITY_UTILITY_TOOLS = [
  {
    name: 'Gold & Silver Jewelry Bill',
    shortName: 'Gold & Silver',
    path: '/calculators/gold-jewelry-bill',
    icon: Coins,
    desc: 'Verify 22K/18K gold & 925 silver, making charges, 3% GST & BIS hallmarks.',
    tag: '3% GST + Hallmark',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    name: 'Commute Fuel Spend',
    shortName: 'Fuel Spend',
    path: '/calculators/commute-fuel',
    icon: Fuel,
    desc: 'Compare Petrol, Diesel, CNG, and EV monthly commuting expenses.',
    tag: '26-Day Spend',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'PM Surya Ghar Solar Rooftop',
    shortName: 'Solar Subsidy',
    path: '/calculators/solar-rooftop',
    icon: Sun,
    desc: 'Official national rooftop subsidy calculator up to ₹78,000.',
    tag: 'PM Subsidy',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
];

export const NAV_LINKS = [...FINANCIAL_TOOLS, ...COMMODITY_UTILITY_TOOLS];

export const Navbar: React.FC<NavbarProps> = ({ onOpenComplianceModal }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Synced live bullion rates for navbar ticker pill
  const [navGold24K, setNavGold24K] = useState<number>(76850);
  const [navSilverKg, setNavSilverKg] = useState<number>(92500);

  useEffect(() => {
    fetch('/api/bullion-rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.gold24KPer10g && data?.silver999PerKg) {
          setNavGold24K(data.gold24KPer10g);
          setNavSilverKg(data.silver999PerKg);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isCalculatorActive = location.pathname.startsWith('/calculators/');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            id="navbar-brand-link"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                  Bharat<span className="text-emerald-600">Calc</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                  IN
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 -mt-1 hidden sm:inline">
                Statutory & Consumer Engines
              </span>
            </div>
          </Link>

          {/* Clean Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {/* Calculators Mega Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="btn-nav-calculators-menu"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isCalculatorActive || dropdownOpen
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Calculators</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Desktop Mega Menu Card */}
              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-[540px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 animate-in fade-in-50 zoom-in-95 z-50"
                  role="menu"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Column 1: Financial & Tax */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-slate-100 mb-2">
                        Tax & Loans
                      </div>
                      <div className="space-y-1">
                        {FINANCIAL_TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          const isActive = location.pathname === tool.path;
                          return (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                                isActive ? 'bg-emerald-50/80 border border-emerald-200/60' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${tool.bgColor} ${tool.color} shrink-0 mt-0.5`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                  <span>{tool.name}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                                  {tool.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: Commodities & Utilities */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-slate-100 mb-2">
                        Bullion & Energy
                      </div>
                      <div className="space-y-1">
                        {COMMODITY_UTILITY_TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          const isActive = location.pathname === tool.path;
                          return (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                                isActive ? 'bg-amber-50/80 border border-amber-200/60' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${tool.bgColor} ${tool.color} shrink-0 mt-0.5`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                  <span>{tool.name}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                                  {tool.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] px-1 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      All calculators calibrated for FY 2025-26
                    </span>
                    <Link
                      to="/"
                      className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      <span>View All Tools</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Popular Shortcuts */}
            <Link
              to="/calculators/in-hand-salary"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/calculators/in-hand-salary'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Salary
            </Link>

            <Link
              to="/calculators/gold-jewelry-bill"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                location.pathname === '/calculators/gold-jewelry-bill'
                  ? 'bg-amber-50 text-amber-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Gold & Silver</span>
            </Link>

            <Link
              to="/calculators/home-loan-prepayment"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/calculators/home-loan-prepayment'
                  ? 'bg-blue-50 text-blue-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home Loan
            </Link>

            <Link
              to="/explainers"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/explainers')
                  ? 'bg-purple-50 text-purple-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              <span>Explainers</span>
              <span className="text-[9px] px-1 py-0.2 bg-purple-100 text-purple-800 rounded font-bold">
                New
              </span>
            </Link>

            <button
              onClick={() => onOpenComplianceModal?.('about')}
              id="btn-nav-standards"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Statutory Rules</span>
            </button>
          </nav>

          {/* Right Action / Compact Live Bullion Ticker Pill */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/calculators/gold-jewelry-bill"
              title={`Live Bullion Benchmark: Gold ₹${(navGold24K / 1000).toFixed(1)}k/10g, Silver ₹${(navSilverKg / 1000).toFixed(1)}k/kg`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs hover:bg-amber-100/70 transition-colors group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold">Gold: ₹{(navGold24K / 1000).toFixed(1)}k</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-bold">Silver: ₹{(navSilverKg / 1000).toFixed(1)}k</span>
              <TrendingUp className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/calculators/in-hand-salary"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calculate CTC</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {/* Mobile Live Ticker Bar */}
          <Link
            to="/calculators/gold-jewelry-bill"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs mb-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">Live Bullion:</span>
              <span>Gold ₹76.8k / 10g</span>
              <span>•</span>
              <span>Silver ₹92.5k / kg</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </Link>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 pt-1 pb-1">
            Financial & Utility Calculators
          </div>
          <Link
            to="/explainers"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith('/explainers')
                ? 'bg-purple-50 text-purple-800 font-semibold border border-purple-200'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Trending Explainers</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              New Hub
            </span>
          </Link>
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${link.bgColor} ${link.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{link.name}</span>
                </div>
                {link.tag && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {link.tag}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenComplianceModal?.('about');
              }}
              className="text-xs text-center py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Statutory Rules
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenComplianceModal?.('privacy');
              }}
              className="text-xs text-center py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

