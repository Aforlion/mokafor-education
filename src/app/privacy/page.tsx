import React from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Metadata } from 'next'
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection | Mokafor Global Education',
  description: 'Mokafor Global Education privacy policy, NDPR compliance, data protection measures, and safeguarding guidelines.',
}

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3.5 py-1 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Data Protection & NDPR Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy & Safeguarding Guidelines</h1>
          <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              Mokafor Global Education collects necessary personal information to provide academic placement, video course access, and live tutoring services. This includes student names, grade levels, parent contact details, email addresses, and Paystack transaction metadata.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. How We Use Your Data</h2>
            <p>
              Your data is strictly used for course enrollment delivery, consultation scheduling, administrative notifications, and processing secure payments through Paystack. We do not sell or rent personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Child Protection & Student Safety</h2>
            <p>
              All vetted tutors on Mokafor Global Education undergo mandatory degree verification and background checks. Live 1-on-1 virtual sessions may be logged for academic quality assurance and safeguarding compliance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Payment Security</h2>
            <p>
              All online payments are processed through Paystack using PCI-DSS compliant tokenization. Card numbers and banking credentials never touch our web servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Contact Data Officer</h2>
            <p>
              For privacy inquiries or data removal requests, email our Privacy Team at{' '}
              <a href="mailto:support@mokafor.com" className="text-emerald-400 underline">support@mokafor.com</a> or WhatsApp <a href="https://wa.me/2349078013408" className="text-emerald-400 underline">+234 907 801 3408</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
