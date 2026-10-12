import React, { useState } from 'react';
import { SeoHead } from '@/components/SeoHead';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjectType: 'Feedback / Suggestion',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate instant local submission acknowledgement
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="Contact Us & Grievance Desk – BharatCalc"
        description="Get in touch with the BharatCalc editorial and engineering team for calculator feedback, statutory bug reports, partnerships, or grievance inquiries."
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact Us', path: '/contact' },
        ]}
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span>Editorial & Technical Helpdesk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          Contact Bharat<span className="text-emerald-600">Calc</span>
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Have a question regarding our calculation engines, noticed a new Union Budget tax notification, or have feedback? Reach out to our editorial and engineering desk below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Contact Form */}
        <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting BharatCalc. Our editorial and technical team reviews all inquiries within 24 to 48 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subjectType: 'Feedback / Suggestion', message: '' });
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Send an Inquiry</h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subjectType}
                  onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm bg-white font-medium"
                >
                  <option value="Feedback / Suggestion">General Feedback / Calculator Feature Request</option>
                  <option value="Mathematical Bug Report">Statutory / Mathematical Accuracy Bug Report</option>
                  <option value="Editorial Inquiry">Editorial & Content Suggestion</option>
                  <option value="Advertising & Partnerships">Advertising & Partnerships Inquiry</option>
                  <option value="Privacy / Grievance">Privacy & Grievance Redressal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question or suggestions with full details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Official Correspondence Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Official Correspondence
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <div className="font-semibold text-slate-900">General & Editorial Inquiries:</div>
                <div className="font-mono text-emerald-700 mt-0.5">editorial@bharatcalc.in</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Technical & Statutory Desk:</div>
                <div className="font-mono text-emerald-700 mt-0.5">support@bharatcalc.in</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Grievance & Privacy Officer:</div>
                <div className="font-mono text-emerald-700 mt-0.5">grievance@bharatcalc.in</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Response SLA
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our engineering and editorial teams respond to all genuine bug reports and feedback within <strong>24 to 48 business hours</strong> (Monday through Friday, 9:30 AM to 6:30 PM IST).
            </p>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/70 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Zero Spam Guarantee</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Your email address is strictly used to reply to your inquiry. We never send unsolicited marketing emails, newsletters, or share contact information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
