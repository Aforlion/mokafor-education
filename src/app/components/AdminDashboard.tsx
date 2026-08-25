'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Star, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCw, 
  Check, 
  X, 
  ChevronRight, 
  ExternalLink,
  Lock,
  UserCheck,
  CreditCard,
  Layers,
  AlertCircle
} from 'lucide-react'

interface AdminStats {
  totalRevenue: string
  rawTotalRevenue: number
  activeStudents: number
  verifiedTutors: number
  pendingAssessments: number
  totalPrograms: number
  totalTransactions: number
}

interface ProgramItem {
  id: string
  slug: string
  title: string
  category: string
  badge: string
  desc: string
  schedule: string
  duration: string
  fee: string
  rawPrice: string
  popular: boolean
  highlights: string[]
}

interface TutorItem {
  id: string
  profileId: string
  name: string
  email: string
  phone: string
  avatar: string
  bio: string
  subjects: string[]
  levels: string[]
  curricula: string[]
  hourlyRate: number
  fee: string
  rating: number
  totalReviews: number
  verified: boolean
  status: string
}

interface AssessmentItem {
  id: string
  parentName: string
  parentEmail: string
  parentPhone: string
  studentName: string
  grade: string
  curriculum: string
  tutorName: string
  scheduledAt: string
  meetingLink: string
  notes: string
  status: string
}

interface TransactionItem {
  id: string
  reference: string
  parentName: string
  parentEmail: string
  studentName: string
  amount: string
  rawAmount: number
  type: string
  description: string
  status: string
  createdAt: string
}

interface UserItem {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar: string
  createdAt: string
  totalSpent: number
  wardCount: number
  isTutorVerified: boolean
  tutorStatus: string
}

export default function AdminDashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'tutors' | 'assessments' | 'transactions' | 'users'>('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  
  // Superadmin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [authenticating, setAuthenticating] = useState<boolean>(false)

  // Datasets
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [tutors, setTutors] = useState<TutorItem[]>([])
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])

  // Search & Filter States
  const [programCategory, setProgramCategory] = useState('All')
  const [tutorStatusFilter, setTutorStatusFilter] = useState('All')
  const [assessmentStatusFilter, setAssessmentStatusFilter] = useState('All')
  const [txSearchQuery, setTxSearchQuery] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('All')

  // Modals & Forms State
  const [showProgramModal, setShowProgramModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null)
  const [programForm, setProgramForm] = useState({
    title: '',
    category: 'Exam Prep',
    badge: 'Intensive Bootcamp',
    desc: '',
    schedule: 'Flexible Weekly Classes',
    duration: 'Monthly Intensive Track',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: false,
    highlights: 'Syllabus Mastery, Past Question Drills, Timed Exam Strategies'
  })

  const [showTutorModal, setShowTutorModal] = useState(false)
  const [tutorForm, setTutorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: 'Mathematics, Physics',
    levels: 'Senior Secondary',
    curricula: 'WAEC, IGCSE',
    hourlyRate: '15000',
    bio: ''
  })

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load Dashboard Data
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, progRes, tutRes, assRes, txRes, usrRes] = await Promise.all([
        fetch('/api/admin/stats').then(res => res.json()),
        fetch('/api/admin/programs').then(res => res.json()),
        fetch('/api/admin/tutors').then(res => res.json()),
        fetch('/api/admin/assessments').then(res => res.json()),
        fetch('/api/admin/transactions').then(res => res.json()),
        fetch('/api/admin/users').then(res => res.json())
      ])

      if (statsRes.stats) setStats(statsRes.stats)
      if (Array.isArray(progRes)) setPrograms(progRes)
      if (Array.isArray(tutRes)) setTutors(tutRes)
      if (Array.isArray(assRes)) setAssessments(assRes)
      if (Array.isArray(txRes)) setTransactions(txRes)
      if (Array.isArray(usrRes)) setUsers(usrRes)
    } catch (err) {
      console.error('Failed to load admin data:', err)
      triggerToast('Error connecting to backend database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check existing session
    const saved = localStorage.getItem('mokafor_admin_session')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.email) {
          setIsAuthenticated(true)
          setAdminUser(parsed)
        }
      } catch (e) {}
    }
    fetchDashboardData()
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthenticating(true)
    setLoginError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setIsAuthenticated(true)
        setAdminUser(data.user)
        localStorage.setItem('mokafor_admin_session', JSON.stringify(data.user))
        triggerToast('Welcome back, Superadmin!')
        fetchDashboardData()
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify your email and password.')
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication server.')
    } finally {
      setAuthenticating(false)
    }
  }

  const handleAdminLogout = () => {
    setIsAuthenticated(false)
    setAdminUser(null)
    localStorage.removeItem('mokafor_admin_session')
    triggerToast('Logged out of Superadmin session.')
  }

  // Program Handlers
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...programForm,
        highlights: programForm.highlights.split(',').map(s => s.trim()).filter(Boolean)
      }

      if (editingProgram) {
        const res = await fetch('/api/admin/programs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProgram.id, ...payload })
        })
        if (res.ok) {
          triggerToast('Programme updated successfully!')
          setShowProgramModal(false)
          setEditingProgram(null)
          fetchDashboardData()
        }
      } else {
        const res = await fetch('/api/admin/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          triggerToast('New Programme published!')
          setShowProgramModal(false)
          fetchDashboardData()
        }
      }
    } catch (err) {
      triggerToast('Failed to save programme.')
    }
  }

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme?')) return
    try {
      const res = await fetch(`/api/admin/programs?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        triggerToast('Programme deleted.')
        fetchDashboardData()
      }
    } catch (err) {
      triggerToast('Failed to delete programme.')
    }
  }

  // Tutor Handlers
  const handleToggleTutorStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      const res = await fetch('/api/admin/tutors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      })
      if (res.ok) {
        triggerToast(`Tutor status changed to ${nextStatus}.`)
        fetchDashboardData()
      }
    } catch (err) {
      triggerToast('Failed to update tutor status.')
    }
  }

  const handleToggleTutorVerified = async (id: string, currentVerified: boolean) => {
    try {
      const res = await fetch('/api/admin/tutors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verified: !currentVerified })
      })
      if (res.ok) {
        triggerToast(`Tutor verification updated!`)
        fetchDashboardData()
      }
    } catch (err) {
      triggerToast('Failed to update verification.')
    }
  }

  const handleCreateTutor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...tutorForm,
        subjects: tutorForm.subjects.split(',').map(s => s.trim()).filter(Boolean),
        levels: tutorForm.levels.split(',').map(s => s.trim()).filter(Boolean),
        curricula: tutorForm.curricula.split(',').map(s => s.trim()).filter(Boolean),
        hourlyRate: parseInt(tutorForm.hourlyRate) || 15000
      }
      const res = await fetch('/api/admin/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        triggerToast('New Vetted Tutor profile created!')
        setShowTutorModal(false)
        fetchDashboardData()
      }
    } catch (err) {
      triggerToast('Failed to create tutor.')
    }
  }

  // Assessment Status Handler
  const handleUpdateAssessmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/assessments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) {
        triggerToast(`Consultation marked as ${status}.`)
        fetchDashboardData()
      }
    } catch (err) {
      triggerToast('Failed to update consultation.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-bounce">
          <CheckCircle size={18} />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* SUPERADMIN LOGIN MODAL SCREEN */}
      {!isAuthenticated && (
        <div className="max-w-md mx-auto py-8">
          <div className="glow-card p-8 md:p-10 rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
            <div className="mesh-bg opacity-20"></div>

            <div className="text-center space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center shadow-md">
                <ShieldCheck size={36} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Superadmin Authentication</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enter your credentials to access the Mokafor Executive Portal.</p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 relative z-10">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5 text-xs relative z-10">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Superadmin Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="Enter admin email..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={authenticating}
                className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white w-full py-3.5 font-extrabold text-sm justify-center shadow-lg shadow-emerald-500/20 gap-2 rounded-xl border-none transition-all"
              >
                {authenticating ? 'Verifying Credentials...' : 'Sign In as Superadmin'} <ChevronRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC DASHBOARD WHEN AUTHENTICATED */}
      {isAuthenticated && (
        <>
          {/* Admin Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="mesh-bg opacity-30"></div>
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
                <ShieldCheck size={13} /> Authenticated: {adminUser?.name || 'Super Admin'} ({adminUser?.email || 'aforlion007@gmail.com'})
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                Mokafor Global Executive Portal
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-xl">
                Real-time control center for educational programs, vetted tutors, academic placement consultations, Paystack transactions, and platform users.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button 
                onClick={fetchDashboardData} 
                disabled={loading}
                className="btn btn-outline btn-sm border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 font-bold"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Database
              </button>
              <button 
                onClick={handleAdminLogout}
                className="btn btn-outline btn-sm border-rose-900/60 text-rose-400 hover:bg-rose-950/40 gap-1.5 font-bold"
              >
                Sign Out
              </button>
              <button 
                onClick={() => {
                  setEditingProgram(null)
                  setProgramForm({
                    title: '',
                    category: 'Exam Prep',
                    badge: 'Intensive Bootcamp',
                    desc: '',
                    schedule: 'Flexible Weekly Classes',
                    duration: 'Monthly Intensive Track',
                    fee: '₦100,000 per month',
                    rawPrice: '₦100,000',
                    popular: false,
                    highlights: 'Syllabus Mastery, Past Question Drills, Timed Exam Strategies'
                  })
                  setShowProgramModal(true)
                }}
                className="btn btn-primary btn-sm gap-2 font-bold shadow-lg"
              >
                <Plus size={14} /> New Programme
              </button>
            </div>
          </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {[
          { id: 'overview', label: '📊 Overview & KPIs' },
          { id: 'programs', label: '📚 Programmes (' + programs.length + ')' },
          { id: 'tutors', label: '👨‍🏫 Tutor Network (' + tutors.length + ')' },
          { id: 'assessments', label: '📅 Consultations (' + assessments.length + ')' },
          { id: 'transactions', label: '💳 Revenue Ledger (' + transactions.length + ')' },
          { id: 'users', label: '👥 User Directory (' + users.length + ')' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: OVERVIEW & KPIS ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Bento KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Platform Revenue</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <DollarSign size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.totalRevenue || '₦1,480,000'}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <ArrowUpRight size={14} /> +18.4% this month (Paystack)
                </p>
              </div>
            </div>

            <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Learners</span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.activeStudents || 18} Students</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Enrolled in live & private tracks</p>
              </div>
            </div>

            <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Vetted Tutor Staff</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <UserCheck size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.verifiedTutors || 6} Certified</h3>
                <p className="text-[11px] text-amber-400 font-semibold mt-1">100% Degree & Background Verified</p>
              </div>
            </div>

            <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Placement Bookings</span>
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                  <Calendar size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.pendingAssessments || 3} Consultations</h3>
                <p className="text-[11px] text-teal-400 font-semibold mt-1">Scheduled placement reviews</p>
              </div>
            </div>
          </div>

          {/* Quick Action Operations & Recent Transactions Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Quick Actions Panel */}
            <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-6">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" /> Executive Quick Actions
              </h3>

              <div className="space-y-3">
                <button onClick={() => setActiveTab('programs')} className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left transition-all flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-2.5"><BookOpen size={16} className="text-emerald-400" /> Edit Educational Programmes</span>
                  <ChevronRight size={16} className="text-slate-500" />
                </button>
                <button onClick={() => setActiveTab('tutors')} className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left transition-all flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-2.5"><UserCheck size={16} className="text-indigo-400" /> Review Educator Verification</span>
                  <ChevronRight size={16} className="text-slate-500" />
                </button>
                <button onClick={() => setActiveTab('assessments')} className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left transition-all flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-2.5"><Calendar size={16} className="text-amber-400" /> Manage Placement Requests</span>
                  <ChevronRight size={16} className="text-slate-500" />
                </button>
                <button onClick={() => setActiveTab('transactions')} className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left transition-all flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-2.5"><CreditCard size={16} className="text-teal-400" /> View Paystack Revenue Logs</span>
                  <ChevronRight size={16} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Recent Activity Ledger */}
            <div className="lg:col-span-2 glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-white">Recent Payment Transactions</h3>
                <button onClick={() => setActiveTab('transactions')} className="text-xs font-bold text-emerald-400 hover:underline">
                  View full ledger →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Parent Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {transactions.slice(0, 5).map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-300">{tx.reference}</td>
                        <td className="py-3 font-semibold text-white">{tx.parentName}</td>
                        <td className="py-3 font-extrabold text-emerald-400">{tx.amount}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 2: PROGRAMMES MANAGEMENT ==================== */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Exam Prep', 'Subject Mastery', 'International', '1-on-1 & Bootcamps', 'Institutional'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setProgramCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${programCategory === cat ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setEditingProgram(null)
                setProgramForm({
                  title: '',
                  category: 'Exam Prep',
                  badge: 'Intensive Bootcamp',
                  desc: '',
                  schedule: 'Flexible Weekly Classes',
                  duration: 'Monthly Intensive Track',
                  fee: '₦100,000 per month',
                  rawPrice: '₦100,000',
                  popular: false,
                  highlights: 'Syllabus Mastery, Past Question Drills, Timed Exam Strategies'
                })
                setShowProgramModal(true)
              }}
              className="btn btn-primary btn-sm gap-2 font-bold"
            >
              <Plus size={14} /> Add Programme
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs
              .filter(p => programCategory === 'All' || p.category === programCategory)
              .map(p => (
                <div key={p.id} className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {p.category}
                      </span>
                      <span className="text-sm font-black text-emerald-400">{p.fee}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-white">{p.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.desc}</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300">
                      <p><span className="text-slate-500 font-bold">Schedule:</span> {p.schedule}</p>
                      <p><span className="text-slate-500 font-bold">Duration:</span> {p.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setEditingProgram(p)
                        setProgramForm({
                          title: p.title,
                          category: p.category,
                          badge: p.badge,
                          desc: p.desc,
                          schedule: p.schedule,
                          duration: p.duration,
                          fee: p.fee,
                          rawPrice: p.rawPrice,
                          popular: p.popular,
                          highlights: p.highlights.join(', ')
                        })
                        setShowProgramModal(true)
                      }}
                      className="btn btn-outline btn-sm flex-1 text-xs font-bold border-slate-700 hover:bg-slate-800 gap-1.5"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(p.id)}
                      className="btn btn-outline btn-sm text-rose-400 border-rose-950 hover:bg-rose-950/40 gap-1.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: TUTOR NETWORK ==================== */}
      {activeTab === 'tutors' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['All', 'active', 'suspended'].map(st => (
                <button
                  key={st}
                  onClick={() => setTutorStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${tutorStatusFilter === st ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button onClick={() => setShowTutorModal(true)} className="btn btn-primary btn-sm gap-2 font-bold">
              <Plus size={14} /> Add Educator
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors
              .filter(t => tutorStatusFilter === 'All' || t.status === tutorStatusFilter)
              .map(t => (
                <div key={t.id} className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                      <div>
                        <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                          {t.name}
                          {t.verified && <ShieldCheck size={16} className="text-emerald-400" />}
                        </h3>
                        <p className="text-xs text-slate-400">{t.email}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{t.bio}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {t.subjects.map(subj => (
                        <span key={subj} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {subj}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <span className="text-slate-400 font-medium">Hourly Rate:</span>
                      <span className="font-extrabold text-emerald-400">{t.fee}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleToggleTutorStatus(t.id, t.status)}
                      className={`btn btn-sm flex-1 font-bold text-xs ${t.status === 'active' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
                    >
                      {t.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleToggleTutorVerified(t.id, t.verified)}
                      className="btn btn-outline btn-sm text-xs font-bold border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      {t.verified ? 'Unverify' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: PLACEMENT CONSULTATIONS ==================== */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['All', 'scheduled', 'completed', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setAssessmentStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${assessmentStatusFilter === st ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="pb-3">Parent & Contact</th>
                  <th className="pb-3">Student & Grade</th>
                  <th className="pb-3">Scheduled Date</th>
                  <th className="pb-3">Assigned Educator</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assessments
                  .filter(a => assessmentStatusFilter === 'All' || a.status === assessmentStatusFilter)
                  .map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-white">{b.parentName}</p>
                        <p className="text-[10px] text-slate-400">{b.parentEmail}</p>
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-slate-200">{b.studentName}</p>
                        <p className="text-[10px] text-slate-400">{b.grade} ({b.curriculum})</p>
                      </td>
                      <td className="py-4 font-mono text-slate-300">
                        {new Date(b.scheduledAt).toLocaleString()}
                      </td>
                      <td className="py-4 font-bold text-emerald-400">{b.tutorName}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : b.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {b.status === 'scheduled' && (
                          <button
                            onClick={() => handleUpdateAssessmentStatus(b.id, 'completed')}
                            className="btn btn-outline btn-sm text-[11px] font-bold text-emerald-400 border-emerald-950 hover:bg-emerald-950/40"
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.meetingLink && (
                          <a href={b.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm text-[11px] font-bold inline-flex items-center gap-1">
                            Join Call <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: REVENUE LEDGER ==================== */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search reference, parent name or email..."
                value={txSearchQuery}
                onChange={e => setTxSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="pb-3">Paystack Ref</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions
                  .filter(tx => 
                    tx.reference.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
                    tx.parentName.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
                    tx.parentEmail.toLowerCase().includes(txSearchQuery.toLowerCase())
                  )
                  .map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 font-mono font-bold text-slate-300">{tx.reference}</td>
                      <td className="py-4">
                        <p className="font-bold text-white">{tx.parentName}</p>
                        <p className="text-[10px] text-slate-400">{tx.parentEmail}</p>
                      </td>
                      <td className="py-4 text-slate-300 font-medium">{tx.description}</td>
                      <td className="py-4 font-extrabold text-emerald-400">{tx.amount}</td>
                      <td className="py-4 text-slate-400 font-mono">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: USER DIRECTORY ==================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['All', 'parent', 'tutor', 'student'].map(r => (
              <button
                key={r}
                onClick={() => setUserRoleFilter(r)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${userRoleFilter === r ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {r}s
              </button>
            ))}
          </div>

          <div className="glow-card p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="pb-3">User Profile</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Wards / Status</th>
                  <th className="pb-3">Total Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users
                  .filter(u => userRoleFilter === 'All' || u.role === userRoleFilter)
                  .map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                        <span className="font-bold text-white">{u.name}</span>
                      </td>
                      <td className="py-4 text-slate-300">
                        <p>{u.email}</p>
                        <p className="text-[10px] text-slate-400">{u.phone}</p>
                      </td>
                      <td className="py-4 font-bold capitalize text-indigo-400">{u.role}</td>
                      <td className="py-4 font-medium text-slate-300">
                        {u.role === 'parent' ? `${u.wardCount} Ward(s)` : u.tutorStatus}
                      </td>
                      <td className="py-4 font-extrabold text-emerald-400">
                        ₦{u.totalSpent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== CREATE / EDIT PROGRAMME MODAL ==================== */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">
                {editingProgram ? 'Edit Educational Programme' : 'Publish New Educational Programme'}
              </h3>
              <button onClick={() => setShowProgramModal(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase text-[10px]">Programme Title</label>
                <input
                  type="text"
                  required
                  value={programForm.title}
                  onChange={e => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="e.g. Physics & Chemistry Mastery"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Category</label>
                  <select
                    value={programForm.category}
                    onChange={e => setProgramForm({ ...programForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Subject Mastery">Subject Mastery</option>
                    <option value="International">International</option>
                    <option value="1-on-1 & Bootcamps">1-on-1 & Bootcamps</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Badge Text</label>
                  <input
                    type="text"
                    value={programForm.badge}
                    onChange={e => setProgramForm({ ...programForm, badge: e.target.value })}
                    placeholder="e.g. Weekly Live Class"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase text-[10px]">Description</label>
                <textarea
                  rows={3}
                  required
                  value={programForm.desc}
                  onChange={e => setProgramForm({ ...programForm, desc: e.target.value })}
                  placeholder="Detailed description of the program objectives..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Fee Display Text</label>
                  <input
                    type="text"
                    required
                    value={programForm.fee}
                    onChange={e => setProgramForm({ ...programForm, fee: e.target.value })}
                    placeholder="e.g. ₦100,000 per month"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Schedule</label>
                  <input
                    type="text"
                    value={programForm.schedule}
                    onChange={e => setProgramForm({ ...programForm, schedule: e.target.value })}
                    placeholder="e.g. Every Saturday"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase text-[10px]">Highlights (Comma separated)</label>
                <input
                  type="text"
                  value={programForm.highlights}
                  onChange={e => setProgramForm({ ...programForm, highlights: e.target.value })}
                  placeholder="Syllabus Mastery, Past Question Drills, Mock Interview Prep"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={programForm.popular}
                  onChange={e => setProgramForm({ ...programForm, popular: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="popularCheck" className="text-xs text-slate-300 font-bold">
                  Mark as Popular Choice Badge
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="btn btn-outline btn-sm border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm font-bold px-6">
                  {editingProgram ? 'Save Changes' : 'Publish Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE TUTOR MODAL ==================== */}
      {showTutorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Add Vetted Educator</h3>
              <button onClick={() => setShowTutorModal(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTutor} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">First Name</label>
                  <input
                    type="text"
                    required
                    value={tutorForm.firstName}
                    onChange={e => setTutorForm({ ...tutorForm, firstName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Last Name</label>
                  <input
                    type="text"
                    required
                    value={tutorForm.lastName}
                    onChange={e => setTutorForm({ ...tutorForm, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={tutorForm.email}
                    onChange={e => setTutorForm({ ...tutorForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Hourly Rate (₦)</label>
                  <input
                    type="number"
                    required
                    value={tutorForm.hourlyRate}
                    onChange={e => setTutorForm({ ...tutorForm, hourlyRate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase text-[10px]">Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={tutorForm.subjects}
                  onChange={e => setTutorForm({ ...tutorForm, subjects: e.target.value })}
                  placeholder="Mathematics, Physics, Chemistry"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase text-[10px]">Bio & Credentials</label>
                <textarea
                  rows={3}
                  value={tutorForm.bio}
                  onChange={e => setTutorForm({ ...tutorForm, bio: e.target.value })}
                  placeholder="Degrees, teaching experience, and specializations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTutorModal(false)}
                  className="btn btn-outline btn-sm border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm font-bold px-6">
                  Add Educator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* END AUTHENTICATED BLOCK */}
        </>
      )}

    </div>
  )
}
