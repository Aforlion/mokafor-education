'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Search,
  Star,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Award,
  Phone,
  Mail
} from 'lucide-react'

interface Tutor {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  reviews: number
  hourlyRate: string
  subjects: string[]
  curricula: string[]
  bio: string
  verified: boolean
}

export default function TutorsPage() {
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedCurriculum, setSelectedCurriculum] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const tutors: Tutor[] = [
    {
      id: 't-mark-okafor',
      name: 'Mark Okafor',
      title: 'Founder & Chief Educator',
      avatar: '/founder.jpg',
      rating: 5.0,
      reviews: 12,
      hourlyRate: '₦30,000 / hr',
      subjects: ['Mathematics', 'Further Mathematics', 'Quantitative Reasoning'],
      curricula: ['Loyola Jesuit', 'Junior WAEC', 'WAEC', 'IGCSE', 'JAMB', 'SAT'],
      bio: 'Master Educator with 12+ years experience. Specialist in Loyola Entrance bootcamps, Junior WAEC excellence, and simplifying complex algebraic equations.',
      verified: true,
    },
    {
      id: 't-jane-alabi',
      name: 'Jane Alabi',
      title: 'Senior Mathematics & Physics Tutor',
      avatar: '/tutors/jane_alabi.png',
      rating: 4.9,
      reviews: 8,
      hourlyRate: '₦20,000 / hr',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      curricula: ['Loyola Jesuit', 'Junior WAEC', 'IGCSE', 'WAEC', 'A Levels'],
      bio: 'Loyola Entrance & Junior WAEC Specialist. 10+ years experience guiding pupils through competitive entrance mock drills and IGCSE Physics mastery.',
      verified: true,
    },
    {
      id: 't-victor-elendu',
      name: 'Victor Elendu',
      title: 'English Language & SAT Specialist',
      avatar: '/tutors/victor_elendu.png',
      rating: 4.8,
      reviews: 6,
      hourlyRate: '₦20,000 / hr',
      subjects: ['English Language', 'Verbal Reasoning', 'Literature in English'],
      curricula: ['Loyola Jesuit', 'Junior WAEC', 'SAT', 'IELTS', 'WAEC'],
      bio: 'Expert in Verbal Reasoning, IELTS, TOEFL, SAT Reading & Writing, and WAEC English Literature mastery.',
      verified: true,
    },
  ]

  const filteredTutors = tutors.filter(tutor => {
    const matchesSubject = selectedSubject === 'All' || tutor.subjects.includes(selectedSubject)
    const matchesCurriculum = selectedCurriculum === 'All' || tutor.curricula.includes(selectedCurriculum)
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSubject && matchesCurriculum && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-indigo-800/50 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-1.5 text-emerald-300 text-sm font-medium backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Background & Degree Vetted Educators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Find a <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">Vetted Academic Tutor</span> for Your Child
          </h1>

          <p className="text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Personalized 1-on-1 online and home tutoring tailored to your student's learning goals, curriculum (WAEC, Loyola, IGCSE, SAT), and pace.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tutor name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" /> Subject:
            </span>
            {['All', 'Mathematics', 'Physics', 'English Language'].map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedSubject === subject
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tutor Roster Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutors.map(tutor => (
            <div
              key={tutor.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {tutor.name}
                      </h3>
                      {tutor.verified && (
                        <span title="100% Vetted Educator">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">{tutor.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{tutor.rating.toFixed(1)}</span>
                      <span className="text-slate-500 font-normal">({tutor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {tutor.bio}
                </p>

                {/* Subjects Badges */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Subjects Taught</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.subjects.map(s => (
                      <span key={s} className="bg-slate-800 text-slate-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-700/60">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Rate</span>
                  <span className="text-base font-extrabold text-white">{tutor.hourlyRate}</span>
                </div>
                <button
                  onClick={() => setIsConsultationOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Book Placement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
