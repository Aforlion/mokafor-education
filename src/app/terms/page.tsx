import React from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Metadata } from 'next'
import { FileText, ArrowLeft, RefreshCw, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service & Refund Policy | Mokafor Global Education',
  description: 'Mokafor Global Education terms of service, payment refund policy, cancellation rules, and tutoring terms.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-3.5 py-1 text-indigo-400 text-xs font-bold">
            <FileText className="w-4 h-4" /> Service Governance & Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service & Refund Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: {new Date().getFullYear()} Mokafor Global Education</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Service Scope</h2>
            <p>
              Mokafor Global Education provides live 1-on-1 tutoring, recorded video courses, entrance bootcamp prep (Loyola, Junior WAEC, SAT, IGCSE), and educational consulting. By enrolling or booking a service, parents and learners agree to adhere to these operational terms.
            </p>
          </section>

          <section id="refunds" className="space-y-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" /> 2. Refund & Cancellation Policy
            </h2>
            <p>
              <strong>Recorded Video Courses:</strong> Due to the instant delivery of digital video streams, course purchases are non-refundable once video content is accessed.
            </p>
            <p>
              <strong>1-on-1 Tutoring Packages:</strong> Unused tutoring sessions may be refunded within 7 days of purchase minus administrative processing fees. Session rescheduling requires at least 24 hours prior notice to your assigned educator.
            </p>
          </section>

          <section id="safeguarding" className="space-y-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Shield className="w-5 h-5" /> 3. Safeguarding & Code of Conduct
            </h2>
            <p>
              All educators, parents, and students must maintain a respectful, safe academic environment. Harassment, unauthorized recording, or unethical behavior during live sessions will result in immediate termination of service without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. For questions or support, contact <a href="mailto:support@mokafor.com" className="text-emerald-400 underline">support@mokafor.com</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
