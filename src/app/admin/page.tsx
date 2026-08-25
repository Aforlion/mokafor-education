'use client'

import React, { useState, useEffect } from 'react'
import AdminDashboard from '../components/AdminDashboard'
import Link from 'next/link'
import { Sun, Moon, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function AdminPage() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative z-10">
      {/* Background Mesh Gradient */}
      <div className="mesh-bg"></div>

      {/* Admin Header */}
      <header className="glass sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-10 md:h-12 flex items-center">
            {theme === 'light' ? (
              <img src="/logo.png" alt="Mokafor Logo" className="h-8 md:h-10 object-contain" />
            ) : (
              <img src="/logo_dark.png" alt="Mokafor Logo" className="h-8 md:h-10 object-contain" />
            )}
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
            <ShieldCheck size={13} /> Executive Portal (/admin)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link 
            href="/" 
            className="btn btn-outline btn-sm gap-2 font-bold text-xs"
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-grow w-full mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
        <AdminDashboard />
      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Mokafor Global Executive Management System. Restricted Access.
      </footer>
    </div>
  )
}
