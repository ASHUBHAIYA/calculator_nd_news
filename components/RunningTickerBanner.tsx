import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Coins, IndianRupee, Home, Sun, Fuel } from 'lucide-react';
import { useSiteConfig, formatBenchmarkINR } from '@/lib/siteConfig';

export const RunningTickerBanner: React.FC = () => {
  const { config } = useSiteConfig();

  const gold24K = config.bullion?.gold24KPer10g || 76850;
  const gold22K = config.bullion?.gold22KPer10g || Math.round((gold24K / 24) * 22);
  const silver999 = config.bullion?.silver999PerKg || 92500;
  const silver925 = config.bullion?.silver925Per10g || 856;
  const stdDeduction = config.taxAndSalary?.standardDeduction || 75000;
  const solarSubsidy = config.solarRooftop?.subsidy3KwPlus || 78000;
  const epfRate = config.taxAndSalary?.epfStatutoryRate || 8.25;
  const loanMin = config.homeLoan?.primeRateMin || 8.4;
  const loanMax = config.homeLoan?.primeRateMax || 8.65;

  const getCityRate = (cityName: string, fallbackDelta: number = 0) => {
    const found = config.bullion?.cities?.find((c) => c.city.toLowerCase() === cityName.toLowerCase());
    return found ? found.gold24K : gold24K + fallbackDelta;
  };

  const tickerItems = [
    {
      id: 't-gold24',
      label: 'Gold 24K (Pure / 10g)',
      value: formatBenchmarkINR(gold24K),
      delta: 'Spot Reference',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-gold22',
      label: 'Gold 22K (Hallmark 916 / 10g)',
      value: formatBenchmarkINR(gold22K),
      delta: 'Jewelry Benchmark',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-silver999',
      label: 'Silver 999 (Pure / 1kg)',
      value: formatBenchmarkINR(silver999),
      delta: 'Spot MCX',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-silver925',
      label: 'Silver 925 (Sterling / 10g)',
      value: `₹${silver925.toLocaleString('en-IN')}`,
      delta: 'Hallmarked',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-tax-deduction',
      label: 'Standard Deduction FY 2025-26',
      value: formatBenchmarkINR(stdDeduction),
      delta: 'Sec 115BAC',
      isBullion: false,
      href: '/calculators/in-hand-salary',
      icon: IndianRupee,
    },
    {
      id: 't-solar',
      label: 'PM Surya Ghar 3kW Subsidy',
      value: formatBenchmarkINR(solarSubsidy),
      delta: 'Direct DBT',
      isBullion: false,
      href: '/calculators/solar-rooftop',
      icon: Sun,
    },
    {
      id: 't-epf',
      label: 'EPFO Statutory Interest',
      value: `${epfRate}% p.a.`,
      delta: 'Govt Notified',
      isBullion: false,
      href: '/calculators/in-hand-salary',
      icon: IndianRupee,
    },
    {
      id: 't-home-loan',
      label: 'Home Loan Prime Rate',
      value: `${loanMin}% – ${loanMax}%`,
      delta: 'RBI Steady',
      isBullion: false,
      href: '/calculators/home-loan-prepayment',
      icon: Home,
    },
    {
      id: 't-mumbai',
      label: 'Mumbai Gold 24K',
      value: formatBenchmarkINR(getCityRate('Mumbai', 0)),
      delta: 'Maharashtra',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-delhi',
      label: 'Delhi NCR Gold 24K',
      value: formatBenchmarkINR(getCityRate('Delhi', 150)),
      delta: 'North India',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-chennai',
      label: 'Chennai Gold 24K',
      value: formatBenchmarkINR(getCityRate('Chennai', 100)),
      delta: 'South India',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
    {
      id: 't-bengaluru',
      label: 'Bengaluru Gold 24K',
      value: formatBenchmarkINR(getCityRate('Bengaluru', 120)),
      delta: 'Karnataka',
      isBullion: true,
      href: '/calculators/gold-jewelry-bill',
      icon: Coins,
    },
  ];

  // We duplicate the array to guarantee seamless infinite marquee loop with zero gaps
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div
      aria-label="Live Bullion and Statutory Benchmark Running Ticker"
      className="w-full bg-slate-950 text-slate-200 border-b border-slate-800/90 overflow-hidden relative select-none py-2"
    >
      <div className="flex items-center">
        {/* Fixed Left Badge */}
        <div className="shrink-0 z-10 flex items-center gap-1.5 px-3 py-1 bg-slate-900 border-r border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-md pl-4 pr-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">LIVE BENCHMARKS</span>
          <span className="sm:hidden">LIVE</span>
        </div>

        {/* Scrolling Track (Running Banner from Right to Left) */}
        <div className="flex-1 overflow-hidden relative group">
          {/* Subtle Left and Right Vignette Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-1 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-1 pointer-events-none" />

          <div className="animate-marquee hover:[animation-play-state:paused] flex items-center gap-4 cursor-pointer">
            {duplicatedItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={`${item.id}-${index}`}
                  to={item.href}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all shrink-0 text-xs text-slate-300 hover:text-white"
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      item.isBullion ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  />
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">{item.label}:</span>
                  <span className="font-bold text-white font-mono whitespace-nowrap">
                    {item.value}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md whitespace-nowrap ${
                      item.isBullion
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                    }`}
                  >
                    {item.delta}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
