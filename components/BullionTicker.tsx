import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import {
  MAJOR_CITY_RATES,
  BullionMarketRate,
} from '@/lib/calculators/gold';
import { formatINR } from '@/lib/formatters';

interface BullionTickerProps {
  onSelectRate?: (rate: BullionMarketRate) => void;
  compact?: boolean;
}

interface ServerBullionResponse {
  gold24KPer10g: number;
  gold22KPer10g: number;
  silver999PerKg: number;
  cities: Array<{
    city: string;
    state: string;
    gold24K: number;
    gold22K: number;
    silver1Kg: number;
  }>;
}

export const BullionTicker: React.FC<BullionTickerProps> = ({ onSelectRate, compact = false }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [serverData, setServerData] = useState<ServerBullionResponse | null>(null);

  const fetchRates = async (force: boolean = false) => {
    setIsRefreshing(true);
    try {
      const url = `/api/bullion-rates${force ? '?force=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data: ServerBullionResponse = await res.json();
        setServerData(data);
      }
    } catch (err) {
      console.warn('Could not fetch bullion rates, using local fallback:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const activeCityList = serverData?.cities && serverData.cities.length > 0 ? serverData.cities : MAJOR_CITY_RATES;
  const cityData =
    activeCityList.find((c) => c.city.toLowerCase() === selectedCity.toLowerCase()) ||
    activeCityList[0] ||
    MAJOR_CITY_RATES[0];

  const handleCardClick = (metal: 'gold' | 'silver', purity: string, rate: number, unit: string) => {
    if (onSelectRate) {
      onSelectRate({
        metal,
        title: `${metal === 'gold' ? 'Gold' : 'Silver'} ${purity}`,
        purity,
        rate,
        unit,
        change: 280,
        changePercent: 0.38,
        direction: 'up',
        source: 'Live Standard Market Rate',
      });
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-medium whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-bold">Gold 24K:</span>
          <span className="font-mono font-bold">{formatINR(cityData.gold24K)}/10g</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="font-bold">Silver 999:</span>
          <span className="font-mono font-bold">{formatINR(cityData.silver1Kg)}/kg</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Today&apos;s Gold &amp; Silver Rates
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden text-xs cursor-pointer"
              aria-label="Select City"
            >
              {activeCityList.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => fetchRates(true)}
            title="Refresh rates"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Benchmark Rate Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {/* 24K Gold */}
        <button
          type="button"
          onClick={() => handleCardClick('gold', '24K', cityData.gold24K, 'per 10g')}
          className={`text-left rounded-xl p-3 border transition-all ${
            onSelectRate
              ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400 hover:bg-amber-50/70 cursor-pointer shadow-2xs'
              : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Gold 24K (Pure)</span>
            <span className="text-[10px] text-slate-400 font-mono">10g</span>
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-black font-mono text-slate-900">
              {formatINR(cityData.gold24K)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            ₹{Math.round(cityData.gold24K / 10).toLocaleString('en-IN')}/g
          </div>
        </button>

        {/* 22K Gold */}
        <button
          type="button"
          onClick={() => handleCardClick('gold', '22K', cityData.gold22K, 'per 10g')}
          className={`text-left rounded-xl p-3 border transition-all ${
            onSelectRate
              ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400 hover:bg-amber-50/70 cursor-pointer shadow-2xs'
              : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Gold 22K (916)</span>
            <span className="text-[10px] text-slate-400 font-mono">10g</span>
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-black font-mono text-slate-900">
              {formatINR(cityData.gold22K)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            ₹{Math.round(cityData.gold22K / 10).toLocaleString('en-IN')}/g
          </div>
        </button>

        {/* Silver 999 1Kg */}
        <button
          type="button"
          onClick={() => handleCardClick('silver', '999', cityData.silver1Kg, 'per 1kg')}
          className={`text-left rounded-xl p-3 border transition-all ${
            onSelectRate
              ? 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100 cursor-pointer shadow-2xs'
              : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Silver 999 (Pure)</span>
            <span className="text-[10px] text-slate-400 font-mono">1 kg</span>
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-black font-mono text-slate-900">
              {formatINR(cityData.silver1Kg)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            ₹{Math.round(cityData.silver1Kg / 1000).toLocaleString('en-IN')}/g
          </div>
        </button>

        {/* Silver 925 Sterling per 10g */}
        <button
          type="button"
          onClick={() =>
            handleCardClick(
              'silver',
              '925',
              Math.round((cityData.silver1Kg / 100) * 0.925),
              'per 10g'
            )
          }
          className={`text-left rounded-xl p-3 border transition-all ${
            onSelectRate
              ? 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100 cursor-pointer shadow-2xs'
              : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Silver 925</span>
            <span className="text-[10px] text-slate-400 font-mono">10g</span>
          </div>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-black font-mono text-slate-900">
              {formatINR(Math.round((cityData.silver1Kg / 100) * 0.925))}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            ₹{(Math.round((cityData.silver1Kg / 1000) * 0.925 * 10) / 10).toFixed(1)}/g
          </div>
        </button>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>{selectedCity} rates • Click any card to apply to calculator</span>
        {!onSelectRate && (
          <Link
            to="/calculators/gold-jewelry-bill"
            className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            <span>Open Jewelry Calculator</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
