'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sun, Moon, Menu, X, ChevronRight, Sparkles } from 'lucide-react'

interface NavbarProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
  onOpenConsultation?: () => void
}

export default function Navbar({ activeTab = 'home', setActiveTab, onOpenConsultation }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Sync theme with document
    const savedTheme = document.documentElement.getAttribute('data-theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleNavClick = (tabKey: string) => {
    setIsMobileMenuOpen(false)
    if (pathname === '/') {
      if (setActiveTab) setActiveTab(tabKey)
    } else {
      router.push(`/?tab=${tabKey}`)
    }
  }

  const handleConsultationClick = () => {
    setIsMobileMenuOpen(false)
    if (onOpenConsultation) {
      onOpenConsultation()
    } else {
      router.push('/?consultation=open')
    }
  }

  const isCoursesActive = pathname === '/courses' || pathname.startsWith('/courses')

  return (
    <header className="glass sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center shadow-md transition-all duration-300 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-4 cursor-pointer">
        <div className="h-12 md:h-14 flex items-center">
          {theme === 'light' ? (
            <img src="/logo.png" alt="Mokafor Logo" className="h-10 md:h-12 object-contain" />
          ) : (
            <img src="/logo_dark.png" alt="Mokafor Logo" className="h-10 md:h-12 object-contain" />
          )}
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 font-semibold text-sm justify-center text-slate-700 dark:text-slate-200">
        <button 
          onClick={() => handleNavClick('home')} 
          className={`hover:text-emerald-500 transition-colors ${!isCoursesActive && activeTab === 'home' && pathname === '/' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => handleNavClick('about')} 
          className={`hover:text-emerald-500 transition-colors ${!isCoursesActive && activeTab === 'about' && pathname === '/' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`}
        >
          About Us
        </button>
        <button 
          onClick={() => handleNavClick('programs')} 
          className={`hover:text-emerald-500 transition-colors ${!isCoursesActive && activeTab === 'programs' && pathname === '/' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`}
        >
          Programmes
        </button>
        <Link 
          href="/tutors" 
          className={`hover:text-emerald-500 transition-colors ${pathname === '/tutors' || (!isCoursesActive && activeTab === 'tutors' && pathname === '/') ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`}
        >
          Find a Tutor
        </Link>
        <Link 
          href="/courses" 
          className={`hover:text-emerald-500 transition-colors ${isCoursesActive ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`}
        >
          Courses
        </Link>
        <button 
          onClick={() => handleNavClick('faq')} 
          className={`hover:text-emerald-500 transition-colors ${!isCoursesActive && activeTab === 'faq' && pathname === '/' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`}
        >
          FAQ
        </button>
      </nav>

      {/* Action Triggers */}
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button 
          onClick={handleConsultationClick}
          className="hidden sm:inline-flex btn btn-accent btn-sm font-bold shadow-md gap-1.5"
        >
          <Sparkles size={14} /> Book Consultation
        </button>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
        >
          {isMobileMenuOpen ? <X size={20} className="text-emerald-500" /> : <Menu size={20} className="text-slate-800 dark:text-slate-200" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 top-[73px] bottom-0 z-40 bg-slate-950/60 backdrop-blur-md transition-all animate-fade-in flex flex-col justify-start"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="glass w-full max-h-[85vh] overflow-y-auto py-6 px-8 flex flex-col gap-3 border-b border-emerald-500/20 shadow-2xl bg-white/95 dark:bg-slate-900/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs uppercase tracking-widest font-black text-emerald-500">Navigation Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 py-2">
              <button 
                className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${!isCoursesActive && activeTab === 'home' && pathname === '/' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} 
                onClick={() => handleNavClick('home')}
              >
                <span>Home</span>
                <ChevronRight size={16} className={!isCoursesActive && activeTab === 'home' && pathname === '/' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button 
                className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${!isCoursesActive && activeTab === 'about' && pathname === '/' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} 
                onClick={() => handleNavClick('about')}
              >
                <span>About Us</span>
                <ChevronRight size={16} className={!isCoursesActive && activeTab === 'about' && pathname === '/' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button 
                className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${!isCoursesActive && activeTab === 'programs' && pathname === '/' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} 
                onClick={() => handleNavClick('programs')}
              >
                <span>Programmes</span>
                <ChevronRight size={16} className={!isCoursesActive && activeTab === 'programs' && pathname === '/' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <Link 
                href="/tutors"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${pathname === '/tutors' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
              >
                <span>Find a Tutor</span>
                <ChevronRight size={16} className={pathname === '/tutors' ? 'opacity-100' : 'opacity-40'} />
              </Link>

              <Link 
                href="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${isCoursesActive ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
              >
                <span>Recorded Video Courses</span>
                <ChevronRight size={16} className={isCoursesActive ? 'opacity-100' : 'opacity-40'} />
              </Link>

              <button 
                className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${!isCoursesActive && activeTab === 'faq' && pathname === '/' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} 
                onClick={() => handleNavClick('faq')}
              >
                <span>FAQ</span>
                <ChevronRight size={16} className={!isCoursesActive && activeTab === 'faq' && pathname === '/' ? 'opacity-100' : 'opacity-40'} />
              </button>
            </nav>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-3">
              <button 
                onClick={handleConsultationClick} 
                className="btn btn-accent w-full justify-center font-bold py-3 shadow-lg"
              >
                Book Placement Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
