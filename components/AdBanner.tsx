import React, { useEffect, useRef } from 'react';

export type AdBannerFormat = 'leaderboard' | 'rectangle' | 'in-feed' | 'sticky-rail' | 'responsive';

interface AdBannerProps {
  format?: AdBannerFormat;
  slotId?: string;
  className?: string;
  label?: string;
  showPlaceholderInDev?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

/**
 * AdSense-Compliant Banner Container
 * Features:
 * - Reads VITE_ADSENSE_CLIENT_ID from environment
 * - If client ID is set, injects and triggers live Google AdSense ad units
 * - If unconfigured or in production, hides dummy placeholder text to prevent Google AdSense "Under Construction / Placeholder" rejection
 * - Maintains strict 32px vertical safe harbor separation to prevent accidental-click policy penalties
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'responsive',
  slotId = 'bharatcalc-auto-slot',
  className = '',
  label = 'ADVERTISEMENT',
  showPlaceholderInDev = false,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (clientId) {
      // Ensure official Google AdSense script tag is injected into head
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      if (adRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {
          // Ignore adsbygoogle duplicate push errors
        }
      }
    }
  }, [clientId]);

  // If no AdSense publisher ID is configured and developer preview is not explicitly requested,
  // we do not render dummy placeholder boxes so the site is clean and ready for Google AdSense site review.
  if (!clientId && !showPlaceholderInDev) {
    return null;
  }

  // Dimensional styling based on format
  const getFormatStyles = () => {
    switch (format) {
      case 'leaderboard':
        return 'min-h-[90px] max-w-[728px] w-full';
      case 'rectangle':
        return 'min-h-[250px] w-full max-w-[300px] sm:max-w-[336px]';
      case 'in-feed':
        return 'min-h-[120px] w-full max-w-3xl';
      case 'sticky-rail':
        return 'min-h-[600px] w-[160px] sm:w-[300px]';
      case 'responsive':
      default:
        return 'min-h-[100px] w-full';
    }
  };

  return (
    <aside
      id={`ad-container-${slotId}`}
      aria-label="Advertisement"
      role="complementary"
      className={`my-8 px-2 flex flex-col items-center justify-center transition-all ${className}`}
      style={{
        marginTop: '32px',
        marginBottom: '32px',
      }}
    >
      {/* Compliance Label: Google AdSense requires explicit label distinguishable from editorial content */}
      <div className="flex items-center justify-center gap-2 mb-1.5 w-full">
        <span className="h-[1px] bg-slate-200 flex-1 max-w-[80px]" aria-hidden="true" />
        <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 select-none">
          {label}
        </span>
        <span className="h-[1px] bg-slate-200 flex-1 max-w-[80px]" aria-hidden="true" />
      </div>

      {clientId ? (
        // Real Live Google AdSense Unit
        <div className={`flex justify-center items-center overflow-hidden ${getFormatStyles()}`}>
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format={format === 'leaderboard' ? 'horizontal' : format === 'rectangle' ? 'rectangle' : 'auto'}
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        // Only visible if showPlaceholderInDev is manually enabled
        <div
          className={`bg-slate-50/80 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center overflow-hidden ${getFormatStyles()}`}
        >
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-1">
            <span className="text-xs font-semibold text-slate-500">Ad Placement Slot ({slotId})</span>
            <span className="text-[11px] text-slate-400">Configure VITE_ADSENSE_CLIENT_ID to serve real ads</span>
          </div>
        </div>
      )}
    </aside>
  );
};

