import React from 'react';
import { SeoHead } from '@/components/SeoHead';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'October 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="Privacy Policy – BharatCalc (AdSense & Cookie Disclosures)"
        description="Official Privacy Policy for BharatCalc. Detailed disclosures regarding 100% client-side calculations, Google AdSense cookies, Web Beacons, GDPR, and CCPA compliance."
        canonicalPath="/privacy-policy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy' },
        ]}
      />

      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy & Cookie Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Last Updated: <strong>{lastUpdated}</strong> • Effective Date: January 1, 2026
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">1. Introduction &amp; Commitment to Privacy</h2>
          <p>
            At <strong>BharatCalc</strong> (accessible at https://authorizetech.in/bharatcalc and associated subdomains), the privacy of our visitors is of paramount importance. This Privacy Policy outlines the types of personal information received, collected, and how it is used.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">2. Zero Server Storage of Financial Data</h2>
          <p>
            BharatCalc operates on a strict <strong>100% Client-Side Processing Architecture</strong>. When you input your Cost to Company (CTC), salary breakdown, loan amounts, jewelry gram weight, or electricity consumption:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>All calculations are performed entirely within your web browser using local JavaScript.</li>
            <li>No confidential salary, bank, or personal financial data is transmitted to, stored on, or logged by our backend servers.</li>
            <li>We do not mandate user registration, phone number collection, or account sign-ups to use any calculation engines.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">3. Google AdSense, DoubleClick DART Cookies &amp; Third-Party Advertising</h2>
          <p>
            Google is a third-party vendor on our site. Google uses cookies, known as DART cookies, to serve ads to our site visitors based on their visit to our site and other sites on the internet.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline font-semibold"
              >
                Google Ads Settings
              </a>{' '}
              or by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline font-semibold"
              >
                www.aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">4. Log Files &amp; Web Analytics</h2>
          <p>
            Like many other Web sites, BharatCalc uses standard web server log files. The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze aggregate trends, administer the site, track user movement around the site, and gather broad demographic information. IP addresses and other such information are not linked to any personally identifiable information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">5. GDPR &amp; CCPA Compliance Rights</h2>
          <p>
            If you are a resident of the European Economic Area (EEA) or California (CCPA), you have specific data protection rights regarding your personal information, including the right to request access, rectification, erasure, or restriction of processing. To exercise any statutory data protection rights, please contact our Grievance Officer at <strong>contact@authorizetech.in</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">6. Grievance Redressal &amp; Contact</h2>
          <p>
            For any questions or concerns regarding our privacy practices, you can contact:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
            <div>Grievance Desk: BharatCalc Compliance Division</div>
            <div>Email: contact@authorizetech.in</div>
            <div>Website: https://authorizetech.in/bharatcalc</div>
          </div>
        </section>
      </div>
    </div>
  );
};
