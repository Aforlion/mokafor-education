import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Home, Search, BookOpen, GraduationCap, ArrowLeft, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found (404) | Mokafor Global Education',
  description: 'The requested page could not be found. Navigate back to Mokafor Global Education home or explore our video courses.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Bar */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo_dark.png" alt="Mokafor Logo" className="h-10 object-contain" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4 text-emerald-400" />
          <span>Return Home</span>
        </Link>
      </header>

      {/* Hero Content */}
      <main className="max-w-3xl mx-auto px-6 text-center my-auto py-16 z-10 space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-emerald-400 mb-2 animate-bounce">
          <span className="text-4xl font-extrabold tracking-widest font-mono">404</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on track!
        </p>

        {/* Action Button Grid */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
          <Link
            href="/courses"
            className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Browse Video Courses</span>
          </Link>
          <Link
            href="/tutors"
            className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Find a Vetted Tutor</span>
          </Link>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-900 z-10">
        <p>© {new Date().getFullYear()} Mokafor Global Education. Need help? Contact <a href="mailto:support@mokafor.com" className="text-emerald-400 underline">support@mokafor.com</a></p>
      </footer>
    </div>
  )
}
