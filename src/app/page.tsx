'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  BookOpen, 
  Users, 
  Search, 
  Award, 
  DollarSign, 
  CheckCircle, 
  Calendar, 
  ChevronRight, 
  Star, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  Lock, 
  Clock, 
  FileText, 
  Moon, 
  Sun, 
  ArrowLeft,
  Upload,
  UserCheck,
  Check,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Bookmark,
  ChevronDown,
  TrendingDown,
  Layers,
  CheckCircle2,
  FileCheck,
  Menu,
  X
} from 'lucide-react'

// ==========================================
// MOCK DATA
// ==========================================

const EXAM_PREPS = [
  { name: 'Common Entrance', desc: 'Primary to secondary transition entry validation.' },
  { name: 'Junior WAEC / BECE', desc: 'Junior Secondary terminal state examinations.' },
  { name: 'LOYOLA Exam Prep', desc: 'Loyola Jesuit College & top secondary entrance bootcamps.' },
  { name: 'WAEC', desc: 'West African Senior School certification.' },
  { name: 'NECO', desc: 'National Examinations Council senior tests.' },
  { name: 'JAMB', desc: 'Joint Admissions tertiary matriculation entry.' },
  { name: 'IGCSE', desc: 'Cambridge International general secondary certs.' },
  { name: 'A Levels', desc: 'Advanced Level subject specialization prep.' },
  { name: 'SAT / ACT', desc: 'US university entry admission tests.' },
  { name: 'IELTS / TOEFL', desc: 'English language proficiency validation.' },
  { name: 'GRE / GMAT', desc: 'Graduate business and science entries.' }
]

const PROGRAMS = [
  {
    id: 'math-mastery',
    title: 'Mathematics Mastery Program',
    category: 'Subject Mastery',
    badge: 'Weekly Live Class',
    desc: 'A weekly live Mathematics program designed to help students build a strong foundation, strengthen problem-solving skills, and develop confidence in Mathematics. Suitable for Primary, Junior Secondary, and Senior Secondary students, and prepares learners for school examinations and competitive entrance exams.',
    schedule: 'Every Saturday',
    duration: '2 Hours per Class',
    fee: '₦10,000 per student',
    rawPrice: '₦10,000',
    popular: true,
    highlights: ['Primary, Junior & Senior Secondary', 'Problem-Solving Focus', 'Entrance & Exam Prep']
  },
  {
    id: 'english-mastery',
    title: 'English Mastery Program',
    category: 'Subject Mastery',
    badge: 'Weekly Live Class',
    desc: 'A weekly live English program designed to help students develop strong communication, reading, writing, grammar, vocabulary, and comprehension skills. Equips learners with the confidence and language proficiency needed to excel in school examinations and competitive entrance exams.',
    schedule: 'Every Saturday',
    duration: '2 Hours per Class',
    fee: '₦10,000 per student',
    rawPrice: '₦10,000',
    popular: false,
    highlights: ['Grammar & Composition', 'Vocabulary & Comprehension', 'Live Interactive Practice']
  },
  {
    id: 'common-entrance-loyola',
    title: 'Common Entrance & Loyola Preparation',
    category: 'Exam Prep',
    badge: 'Intensive Entrance Bootcamp',
    desc: 'An intensive preparation program for pupils seeking admission into Loyola Jesuit College and other top secondary schools. Covers Mathematics, English, Verbal Reasoning, Quantitative Reasoning, and interview preparation.',
    schedule: 'Flexible Weekly Sessions',
    duration: 'Monthly Intensive Track',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: true,
    highlights: ['Mathematics & English', 'Verbal & Quantitative Reasoning', 'Mock Interview Prep']
  },
  {
    id: 'waec-neco-jamb',
    title: 'WAEC, NECO & JAMB Preparation',
    category: 'Exam Prep',
    badge: 'National Examination Coaching',
    desc: 'Focused coaching that helps students master the examination syllabus, solve past questions, improve speed and accuracy, and maximize their scores.',
    schedule: 'Flexible Weekly Classes',
    duration: 'Monthly Intensive Track',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: false,
    highlights: ['Syllabus Mastery', 'Past Question Drills', 'Timed Exam Strategies']
  },
  {
    id: 'sat-math-prep',
    title: 'SAT Mathematics Preparation',
    category: 'International',
    badge: 'International Standards',
    desc: 'A specialized program that prepares students for the SAT Mathematics section using international standards, test strategies, and extensive practice.',
    schedule: 'Bi-Weekly / Weekend Sessions',
    duration: 'Monthly Preparation',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: true,
    highlights: ['SAT Test Strategies', 'Algebra & Advanced Math', 'Full-Length Mock Practice']
  },
  {
    id: 'ielts-prep',
    title: 'IELTS Preparation',
    category: 'International',
    badge: 'Language Proficiency',
    desc: 'Professional coaching for the IELTS examination, covering Listening, Reading, Writing, and Speaking with practical exercises and mock tests.',
    schedule: 'Flexible Timetable',
    duration: 'Monthly Coaching',
    fee: 'Starting from ₦100,000 per month',
    rawPrice: '₦100,000',
    popular: false,
    highlights: ['Listening & Reading Mastery', 'Writing & Essay Feedback', 'Live Speaking Sessions']
  },
  {
    id: 'one-on-one-tutoring',
    title: 'One-on-One Home & Online Tutoring',
    category: '1-on-1 & Bootcamps',
    badge: 'Personalized Tuition',
    desc: 'Personalized lessons tailored to each student’s learning needs, pace, and academic goals. Available both online and at home.',
    schedule: 'Customized Schedule',
    duration: 'Tailored Duration',
    fee: 'Available on request',
    rawPrice: 'Available on request',
    popular: false,
    highlights: ['Dedicated Vetted Educator', 'Home & Virtual Learning', 'Custom Pace & Materials']
  },
  {
    id: 'holiday-intensive',
    title: 'Holiday Intensive Program',
    category: '1-on-1 & Bootcamps',
    badge: 'Seasonal Bootcamp',
    desc: 'An engaging holiday learning program that strengthens students’ understanding of core subjects while preparing them for the next academic session.',
    schedule: 'Summer & Winter Breaks',
    duration: 'Full Session Bootcamp',
    fee: '₦100,000',
    rawPrice: '₦100,000',
    popular: false,
    highlights: ['Core Subject Reinforcement', 'Next Academic Term Prep', 'Interactive Projects']
  },
  {
    id: 'teacher-training',
    title: 'Teacher Training & Professional Development',
    category: 'Institutional',
    badge: 'Professional Development',
    desc: 'Training workshops for teachers on modern teaching strategies, classroom management, effective mathematics instruction, and educational technology.',
    schedule: 'Scheduled Workshops',
    duration: 'Module-based Training',
    fee: 'Available on request',
    rawPrice: 'Available on request',
    popular: false,
    highlights: ['Modern Pedagogy', 'Classroom Management', 'EdTech Tool Mastery']
  },
  {
    id: 'educational-consulting',
    title: 'Educational Consulting',
    category: 'Institutional',
    badge: 'Strategic Advisory',
    desc: 'Expert consulting services for parents, schools, and educational organizations on curriculum planning, academic improvement, staff development, and learning solutions.',
    schedule: 'By Appointment',
    duration: 'Consulting Engagement',
    fee: 'Available on request',
    rawPrice: 'Available on request',
    popular: false,
    highlights: ['Curriculum Design', 'Academic Performance Audit', 'Staff Development']
  }
]

const TUTORS = [
  { id: '1', name: 'Dr. Jane Adebayo', subject: 'Mathematics', grade: 'Senior Secondary', curriculum: 'IGCSE', availability: 'Weekdays', language: 'English', rating: 4.9, rate: '₦12,500/hr', bio: 'Ph.D. in Applied Mathematics. 10+ years experience preparing students for A-Levels & IGCSE.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Mark Okafor', subject: 'Mathematics', grade: 'Junior Secondary', curriculum: 'WAEC', availability: 'Weekends', language: 'English', rating: 5.0, rate: '₦15,000/hr', bio: 'Founder & Chief Educator. Math Specialist & Consultant passionate about simplifying complex equations.', avatar: '/founder.jpg' },
  { id: '3', name: 'Sarah Jenkins', subject: 'English Language', grade: 'Senior Secondary', curriculum: 'SAT', availability: 'Weekdays', language: 'English', rating: 4.8, rate: '₦10,000/hr', bio: 'Experienced English Literature teacher. Specializes in IELTS, TOEFL & SAT prep.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Chinedu Eze', subject: 'Physics', grade: 'Senior Secondary', curriculum: 'JAMB', availability: 'Weekends', language: 'English', rating: 4.9, rate: '₦8,500/hr', bio: 'M.Sc. in Physics. Expert tutor for JAMB, WAEC & NECO exam preparations.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' }
]

const COURSES = [
  { 
    id: 'math-foundation', 
    title: 'Algebra & Calculus Essentials', 
    tutor: 'Dr. Jane Adebayo', 
    lessons: [
      { id: 'l1', title: 'Linear Equations & Graphs', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'Introduction to Calculus & Derivatives', video: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: {
      question: 'What is the derivative of x² with respect to x?',
      options: ['x', '2x', 'x²', '2'],
      answer: '2x'
    }
  },
  { 
    id: 'sat-prep', 
    title: 'Mastering the SAT Reading & Writing', 
    tutor: 'Sarah Jenkins', 
    lessons: [
      { id: 's1', title: 'Evidence-Based Reading Strategies', video: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ],
    quiz: {
      question: 'Which word is a synonym for "ephemeral"?',
      options: ['Permanent', 'Short-lived', 'Brilliant', 'Spacious'],
      answer: 'Short-lived'
    }
  }
]

const FAQS = [
  { q: 'How do you vet your tutors?', a: 'All tutors go through a rigorous multi-stage screening process including background checks, qualification verification, teaching demonstrations, and pedagogy interviews.' },
  { q: 'What curricula do you support?', a: 'We support National (WAEC/NECO/BECE), British (IGCSE/GCSE/A Levels), American (SAT/ACT), and international language qualifications (IELTS/TOEFL).' },
  { q: 'How are payments handled?', a: 'Payments are processed securely via Paystack. You can choose a recurring subscription or pay one-off for packages.' },
  { q: 'Can I request a change of tutor?', a: 'Yes. If a student-tutor match is not optimal, we will provide a replacement assessment at no additional cost.' }
]

// ==========================================
// PORTAL & MAIN LOGIC
// ==========================================

export default function MokaforPlatform() {
  const [activeTab, setActiveTab] = useState('home')
  const [theme, setTheme] = useState('light')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Dynamic API Database States
  const [dbTutors, setDbTutors] = useState<any[]>([])
  const [portalData, setPortalData] = useState<any>(null)
  const [loadingTutors, setLoadingTutors] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  
  // Find Tutor Filters
  const [searchSubject, setSearchSubject] = useState('')
  const [searchGrade, setSearchGrade] = useState('')
  const [searchCurriculum, setSearchCurriculum] = useState('')

  // Program Category Filter
  const [programCategory, setProgramCategory] = useState('All')

  // Course State
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0])
  const [currentLesson, setCurrentLesson] = useState(COURSES[0].lessons[0])
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  // Payment State
  const [paymentPlan, setPaymentPlan] = useState('monthly-8')
  const [billingDetails, setBillingDetails] = useState({ name: '', email: '', amount: '₦96,000' })
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [receiptNumber, setReceiptNumber] = useState('')

  // Free Assessment State
  const [assessmentForm, setAssessmentForm] = useState({ parentName: '', studentName: '', grade: '', curriculum: '', date: '', time: '' })
  const [assessmentBooked, setAssessmentBooked] = useState(false)

  // Become Tutor State
  const [tutorForm, setTutorForm] = useState({ name: '', email: '', subject: '', experience: '', cvUploaded: false })
  const [tutorApplied, setTutorApplied] = useState(false)

  // Portal State
  const [portalRole, setPortalRole] = useState('student')
  const [homeworkStatus, setHomeworkStatus] = useState('Pending')
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  // Fetch Tutors from DB
  useEffect(() => {
    async function loadTutors() {
      setLoadingTutors(true)
      try {
        const query = new URLSearchParams()
        if (searchSubject) query.set('subject', searchSubject)
        if (searchGrade) query.set('grade', searchGrade)
        if (searchCurriculum) query.set('curriculum', searchCurriculum)

        const res = await fetch(`/api/tutors?${query.toString()}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setDbTutors(data)
        }
      } catch (err) {
        console.error('Failed to load tutors:', err)
      } finally {
        setLoadingTutors(false)
      }
    }
    loadTutors()
  }, [searchSubject, searchGrade, searchCurriculum])

  // Fetch Portal Metrics from DB
  useEffect(() => {
    async function loadPortalData() {
      setLoadingPortal(true)
      try {
        const res = await fetch(`/api/portals?role=${portalRole}`)
        const data = await res.json()
        if (!data.error) {
          setPortalData(data)
        }
      } catch (err) {
        console.error('Failed to load portal data:', err)
      } finally {
        setLoadingPortal(false)
      }
    }
    loadPortalData()
  }, [portalRole, homeworkStatus])

  // Mouse Glow Effect Coordinator
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  const selectCourse = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId) || COURSES[0]
    setSelectedCourse(course)
    setCurrentLesson(course.lessons[0])
    setQuizAnswer('')
    setQuizSubmitted(false)
    setQuizPassed(false)
  }

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    if (quizAnswer === selectedCourse.quiz.answer) {
      setQuizPassed(true)
    } else {
      setQuizPassed(false)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!billingDetails.name || !billingDetails.email) return
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: billingDetails.name,
          email: billingDetails.email,
          amount: billingDetails.amount,
          plan: paymentPlan
        })
      })
      const data = await res.json()
      if (data.success) {
        setReceiptNumber(data.reference)
        setPaymentSuccess(true)
      }
    } catch (err) {
      console.error('Checkout failed:', err)
    }
  }

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentForm)
      })
      const data = await res.json()
      if (data.success) {
        setAssessmentBooked(true)
      }
    } catch (err) {
      console.error('Assessment scheduling failed:', err)
    }
  }

  const handleHomeworkSubmit = async () => {
    if (!uploadedFile || !portalData?.assignment?.id) return
    try {
      const res = await fetch('/api/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: portalData.assignment.id,
          fileName: uploadedFile
        })
      })
      const data = await res.json()
      if (data.success) {
        setHomeworkStatus('Submitted')
      }
    } catch (err) {
      console.error('Homework upload failed:', err)
    }
  }

  const handlePlanChange = (plan: string) => {
    setPaymentPlan(plan)
    let price = '₦96,000'
    if (plan === 'monthly-4') price = '₦52,000'
    if (plan === 'termly') price = '₦270,000'
    setBillingDetails(prev => ({ ...prev, amount: price }))
  }

  const downloadReceipt = () => {
    const content = `
Mokafor Global Education Receipt
---------------------------------------
Receipt Number: ${receiptNumber}
Date: ${new Date().toLocaleDateString()}
Client Name: ${billingDetails.name}
Email: ${billingDetails.email}
Plan Purchased: ${paymentPlan.toUpperCase()}
Amount Paid: ${billingDetails.amount}
Status: SUCCESSFUL (Processed via Paystack Mock)
---------------------------------------
Thank you for choosing Mokafor Global Education!
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${receiptNumber}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      
      {/* Background Mesh Gradients */}
      <div className="mesh-bg"></div>

      {/* ==================== STUNNING NAVBAR ==================== */}
      <header className="glass sticky top-0 z-50 transition-all border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center shadow-lg">
        {/* Branding (Conspicuous Logo) */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}>
          <div className="h-14 md:h-20 flex items-center">
            {theme === 'light' ? (
              <img src="/logo.png" alt="Mokafor Logo" className="h-12 md:h-16 object-contain" />
            ) : (
              <img src="/logo_dark.png" alt="Mokafor Logo" className="h-12 md:h-16 object-contain" />
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm justify-center text-slate-700 dark:text-slate-200">
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'home' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'about' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('about')}>About Us</button>
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'programs' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('programs')}>Programmes</button>
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'tutors' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('tutors')}>Find a Tutor</button>
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'courses' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('courses')}>Courses</button>
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'payments' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('payments')}>Payments</button>
          <button className={`hover:text-emerald-500 transition-colors ${activeTab === 'faq' ? 'text-emerald-500 font-bold border-b-2 border-emerald-500 pb-1' : ''}`} onClick={() => setActiveTab('faq')}>FAQ</button>
        </nav>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-colors">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button onClick={() => setActiveTab('portals')} className="hidden sm:inline-flex btn btn-outline btn-sm hover:border-emerald-500 gap-2 font-bold">
            <Lock size={13} className="text-emerald-500" /> Portal
          </button>
          {/* Hamburger Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={20} className="text-emerald-500" /> : <Menu size={20} className="text-slate-800 dark:text-slate-200" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bottom-0 z-40 bg-slate-950/60 backdrop-blur-md transition-all animate-fade-in flex flex-col justify-start" onClick={() => setIsMobileMenuOpen(false)}>
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
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'home' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}>
                <span>Home</span>
                <ChevronRight size={16} className={activeTab === 'home' ? 'opacity-100' : 'opacity-40'} />
              </button>
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'about' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}>
                <span>About Us</span>
                <ChevronRight size={16} className={activeTab === 'about' ? 'opacity-100' : 'opacity-40'} />
              </button>
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'programs' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('programs'); setIsMobileMenuOpen(false); }}>
                <span>Programmes</span>
                <ChevronRight size={16} className={activeTab === 'programs' ? 'opacity-100' : 'opacity-40'} />
              </button>
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'tutors' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('tutors'); setIsMobileMenuOpen(false); }}>
                <span>Find a Tutor</span>
                <ChevronRight size={16} className={activeTab === 'tutors' ? 'opacity-100' : 'opacity-40'} />
              </button>
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'courses' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('courses'); setIsMobileMenuOpen(false); }}>
                <span>Courses</span>
                <ChevronRight size={16} className={activeTab === 'courses' ? 'opacity-100' : 'opacity-40'} />
              </button>
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'payments' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('payments'); setIsMobileMenuOpen(false); }}>
                <span>Payments</span>
                <ChevronRight size={16} className={activeTab === 'payments' ? 'opacity-100' : 'opacity-40'} />
              </button>
              <button className={`text-left py-3 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeTab === 'faq' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`} onClick={() => { setActiveTab('faq'); setIsMobileMenuOpen(false); }}>
                <span>FAQ</span>
                <ChevronRight size={16} className={activeTab === 'faq' ? 'opacity-100' : 'opacity-40'} />
              </button>
            </nav>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-3">
              <button onClick={() => { setActiveTab('portals'); setIsMobileMenuOpen(false); }} className="btn btn-outline w-full justify-center gap-2 font-bold py-3">
                <Lock size={14} className="text-emerald-500" /> Student & Parent Portal
              </button>
              <button onClick={() => { setActiveTab('assessment'); setIsMobileMenuOpen(false); }} className="btn btn-accent w-full justify-center font-bold py-3 shadow-lg">
                Book Placement Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CORE VIEWS ==================== */}
      <main className="flex-grow w-full mx-auto max-w-7xl px-6 py-10 md:py-16">

        {/* ==================== PAGE: HOME ==================== */}
        {activeTab === 'home' && (
          <section className="space-y-24 page-container">
            
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center gap-16 py-4">
              <div className="flex-grow max-w-xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  <Sparkles size={12} className="animate-spin-slow" /> Global Education Specialists
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                  Building Strong <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500">Foundations.</span><br />
                  Creating Exceptional <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500">Learners.</span>
                </h1>
                
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  Unlock your full potential with verified private tutors, specialized examination preparation bootcamps, and structured self-paced courses mapped to British, American, and National curricula.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button onClick={() => setActiveTab('tutors')} className="btn btn-primary gap-2 text-sm font-bold shadow-lg">
                    Find Your Tutor <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setActiveTab('assessment')} className="btn btn-outline text-sm font-bold border-slate-300 dark:border-slate-800">
                    Book Placement Consultation
                  </button>
                </div>
              </div>

              {/* Spatial Bento-Like Visual Banner */}
              <div className="w-full lg:w-96 flex-shrink-0 animate-float">
                <div className="glow-card p-6 md:p-8 space-y-6 border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 backdrop-blur-md rounded-[32px] shadow-2xl" onMouseMove={handleMouseMove}>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 text-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                      <GraduationCap size={28} />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">MOKAFOR ACADEMY</p>
                      <h4 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white">Academic Excellence</h4>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">WAEC / JAMB Pass Rate</span>
                      <span className="font-extrabold text-emerald-500">99.4%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">British IGCSE Scoring A*</span>
                      <span className="font-extrabold text-emerald-500">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Junior WAEC / BECE Pass Rate</span>
                      <span className="font-extrabold text-emerald-500">98.8%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">LOYOLA Exam Prep Success</span>
                      <span className="font-extrabold text-emerald-500">96.5%</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/5 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80" /></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden"><img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50&auto=format&fit=crop&q=80" /></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 overflow-hidden"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80" /></div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5"><Star size={10} className="fill-emerald-500 text-emerald-500" /> <span className="text-[10px] font-black text-slate-800 dark:text-white">4.9 / 5.0</span></div>
                      <p className="text-[8px] text-slate-500 font-medium">From 1000+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 3-STEP MARKETING CONVERSION FUNNEL ==================== */}
            <div className="space-y-12 py-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Pathway to Mastery</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Our structured funnel is designed to take students from diagnostic testing to complete academic success.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="glow-card p-8 rounded-3xl border space-y-4" onMouseMove={handleMouseMove}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-lg shadow-sm border border-emerald-500/10">01</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Map Academic Goals</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
                    Book a free dynamic placement assessment to map your child's learning strengths, curricular speed, and specific subject target goals.
                  </p>
                  <button onClick={() => setActiveTab('assessment')} className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
                    Book assessment now <ChevronRight size={14} />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="glow-card p-8 rounded-3xl border space-y-4" onMouseMove={handleMouseMove}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-lg shadow-sm border border-emerald-500/10">02</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Get Paired with Tutors</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-455 leading-relaxed">
                    Get paired with our vetted educators who possess verified degrees and have successfully coached pupils across local & international curricula.
                  </p>
                  <button onClick={() => setActiveTab('tutors')} className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
                    Meet vetted tutors <ChevronRight size={14} />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="glow-card p-8 rounded-3xl border space-y-4" onMouseMove={handleMouseMove}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-lg shadow-sm border border-emerald-500/10">03</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Track Real-Time Success</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-460 leading-relaxed">
                    Track class schedules, download detailed monthly progress reports, grades, and homework assignments via our Parent & Student Portals.
                  </p>
                  <button onClick={() => setActiveTab('portals')} className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
                    Access Portal previews <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bento Grid: Programmes */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Educational Programmes</h2>
                <p className="text-xs text-slate-500">Flexible structures for learners of all ages, curricula, and learning targets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bento-card md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-emerald-500 bg-emerald-500/10 px-3.5 py-1 rounded-full">Subject Mastery</span>
                      <span className="text-[9px] uppercase font-bold text-slate-500">Every Saturday</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Mathematics & English Mastery</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Weekly live Saturday classes (2 hours per class) designed to build strong foundations, strengthen problem-solving, and boost academic confidence. Just ₦10,000 per student.</p>
                  </div>
                  <button onClick={() => { setProgramCategory('Subject Mastery'); setActiveTab('programs'); }} className="btn btn-outline btn-sm self-start mt-6">Explore Mastery Programs <ChevronRight size={14} /></button>
                </div>

                <div className="bento-card flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-indigo-500 bg-indigo-500/10 px-3.5 py-1 rounded-full">Exam Bootcamps</span>
                    <h3 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">Loyola, WAEC & JAMB Prep</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Intensive entrance & terminal examination coaching. Covers verbal/quantitative reasoning, syllabus drills, and mock tests from ₦100,000/mo.</p>
                  </div>
                  <button onClick={() => { setProgramCategory('Exam Prep'); setActiveTab('programs'); }} className="text-emerald-500 font-bold text-xs mt-6 inline-flex items-center gap-1 hover:underline">View Exam Prep <ChevronRight size={14} /></button>
                </div>

                <div className="bento-card flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-emerald-500 bg-emerald-500/10 px-3.5 py-1 rounded-full">International</span>
                    <h3 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">SAT & IELTS Preparation</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Specialized coaching aligned with global standards, covering SAT Math strategies and IELTS Listening, Reading, Writing & Speaking from ₦100,000/mo.</p>
                  </div>
                  <button onClick={() => { setProgramCategory('International'); setActiveTab('programs'); }} className="text-emerald-500 font-bold text-xs mt-6 inline-flex items-center gap-1 hover:underline">View International Prep <ChevronRight size={14} /></button>
                </div>

                <div className="bento-card md:col-span-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-indigo-500 bg-indigo-500/10 px-3.5 py-1 rounded-full">Personalized & Institutional</span>
                    <h3 className="text-2xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">1-on-1 Tutoring & Educational Consulting</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Tailored home/online private tutoring for individual learners, plus professional teacher training workshops and institutional consulting for schools and parents.</p>
                  </div>
                  <button onClick={() => { setProgramCategory('All'); setActiveTab('programs'); }} className="btn btn-outline btn-sm self-start mt-6">View All 10 Programs <ChevronRight size={14} /></button>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Verified Testimonials</h2>
                <p className="text-xs text-slate-500">Real performance outcomes submitted by our active client community.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="glow-card p-6 md:p-8 space-y-4" onMouseMove={handleMouseMove}>
                  <div className="flex gap-1 text-emerald-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-current" />)}
                  </div>
                  <p className="text-xs italic text-slate-600 dark:text-slate-350 leading-relaxed">
                    "My son Toby scored straight A*s in IGCSE Mathematics and Physics. The tutor was incredibly thorough and always provided homework reviews. Absolutely recommend Mokafor!"
                  </p>
                  <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950 dark:text-white">Mrs. Amadi O.</h4>
                      <p className="text-[10px] text-slate-500">Parent of Toby | Lekki, Lagos</p>
                    </div>
                  </div>
                </div>

                <div className="glow-card p-6 md:p-8 space-y-4" onMouseMove={handleMouseMove}>
                  <div className="flex gap-1 text-emerald-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-current" />)}
                  </div>
                  <p className="text-xs italic text-slate-600 dark:text-slate-350 leading-relaxed">
                    "Preparing for my SAT reading and writing exam felt overwhelming, but working with Sarah Jenkins was a game-changer. I scored 1540 on my first trial!"
                  </p>
                  <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950 dark:text-white">Kenechi E.</h4>
                      <p className="text-[10px] text-slate-500">Student | Ikeja, Lagos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== PAGE: ABOUT US ==================== */}
        {activeTab === 'about' && (
          <section className="space-y-20 page-container">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
                <Sparkles size={12} /> World-Class Education Company
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">About Mokafor Global Education</h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-base md:text-lg">
                Empowering learners. Transforming futures.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto">
                Dedicated to delivering world-class learning experiences, personalized tutoring, and internationally recognized academic programs for learners across the globe.
              </p>
            </div>

            {/* Core Overview & Stats */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Who We Are</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  Mokafor Global Education is a world-class education company dedicated to providing exceptional learning experiences for students across the globe. We believe education has the power to transform lives, unlock opportunities, and shape future leaders.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  Our services include personalized tutoring, improvement classes, exam preparation, online learning, teacher development, educational consulting, and academic support for learners of all ages and abilities.
                </p>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-3xl md:text-4xl font-black text-emerald-500">10k+</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Pupils Vetted</p>
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-4xl font-black text-emerald-500">99.4%</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Exams Cleared</p>
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-4xl font-black text-emerald-500">250+</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Educators Active</p>
                  </div>
                </div>
              </div>

              {/* Core Principles Bento Card */}
              <div className="glow-card p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md space-y-6 shadow-xl" onMouseMove={handleMouseMove}>
                <h4 className="text-lg font-extrabold text-emerald-500 flex items-center gap-2">
                  <ShieldCheck size={22} /> Core Values & Principles
                </h4>
                <div className="space-y-5 text-xs">
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Excellence</h5>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We pursue the highest standards in teaching, learning, and service delivery.</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Integrity</h5>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We act with honesty, professionalism, accountability, and transparency.</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Student-Centred Learning</h5>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Every learner is unique. We tailor our approach to meet individual needs and learning speeds.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meet the Founder & CEO - Mark Okafor */}
            <div className="glow-card border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[36px] p-8 md:p-12 space-y-8 shadow-2xl" onMouseMove={handleMouseMove}>
              <div className="flex flex-col md:flex-row gap-8 items-center border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 border-4 border-emerald-500 shadow-2xl">
                  <img src="/founder.jpg" alt="Mark Okafor" className="w-full h-full object-cover object-top" />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">Executive Leadership</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Mark Okafor</h3>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">Founder & Chief Executive Officer</p>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="grid md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Mark Okafor is an accomplished educator, mathematics specialist, educational consultant, and visionary leader committed to transforming education through innovation and excellence.
                  </p>
                  <p>
                    Driven by a passion for helping learners unlock their full potential, he founded Mokafor Global Education to provide students around the world with access to exceptional teachers, personalized learning, and internationally recognised academic programmes.
                  </p>
                </div>
                <div className="space-y-4">
                  <p>
                    Under his leadership, Mokafor Global Education continues to expand its impact by delivering high-quality education, supporting families, empowering teachers, and preparing learners for success in an increasingly interconnected world.
                  </p>
                  <p className="italic border-l-2 border-emerald-500 pl-4 py-1 text-slate-700 dark:text-slate-200 font-medium">
                    "His vision is to build a globally respected education company that inspires excellence, develops future leaders, and makes quality education accessible to every learner, everywhere."
                  </p>
                </div>
              </div>
            </div>

            {/* Mokafor Global Improvement Programme (MGIP) Showcase */}
            <div className="glow-card border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-slate-900/5 to-indigo-500/5 rounded-[36px] p-8 md:p-12 space-y-8 shadow-xl" onMouseMove={handleMouseMove}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[11px] border border-emerald-500/30 uppercase tracking-wider">
                    <Sparkles size={12} /> Flagship Support Programme
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Mokafor Global Improvement Programme (MGIP)</h3>
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    Helping Every Child Reach Their Full Academic Potential
                  </p>
                </div>
                <button onClick={() => setActiveTab('assessment')} className="btn btn-accent font-bold text-xs shadow-lg">
                  Book Placement Consultation <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/80 pt-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen size={16} className="text-emerald-500" /> Programme Overview
                  </h4>
                  <p>
                    The Mokafor Global Improvement Programme (MGIP) is a personalized online academic support programme designed for students around the world who want to improve their performance, build confidence, close learning gaps, and achieve excellence in school and examinations.
                  </p>
                  <p>
                    Whether your child is struggling in a particular subject, needs enrichment beyond the classroom, or is preparing for an important examination, our experienced teachers provide structured, engaging, and results-driven instruction tailored to each learner’s needs.
                  </p>
                </div>

                <div className="space-y-3 bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">Core MGIP Benefits</h4>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Close Learning Gaps:</span> Targeted remediation in core foundational topics.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Build Academic Confidence:</span> Interactive guidance that motivates independent learning.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Results-Driven Exam Readiness:</span> Past question mastery and test speed strategies.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Team Section */}
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500 bg-indigo-500/10 px-3.5 py-1 rounded-full">Our Team</span>
                <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Our Greatest Strength is Our People</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Powered by a diverse team of highly qualified, experienced, and passionate educators committed to helping every learner succeed.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="glow-card p-8 rounded-[28px] border space-y-4" onMouseMove={handleMouseMove}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Award size={26} />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Carefully Vetted Teachers</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our teachers are carefully selected for their subject expertise, professionalism, communication skills, and dedication to student achievement.
                  </p>
                </div>

                <div className="glow-card p-8 rounded-[28px] border space-y-4" onMouseMove={handleMouseMove}>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Layers size={26} />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Multi-Curricula Mastery</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Together, they bring experience across multiple curricula, grade levels, and examination systems, ensuring outstanding academic support.
                  </p>
                </div>

                <div className="glow-card p-8 rounded-[28px] border space-y-4" onMouseMove={handleMouseMove}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Users size={26} />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Multidisciplinary Support</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Beyond teaching, our academic advisors, curriculum specialists, technology professionals, and support staff work together for a seamless experience.
                  </p>
                </div>
              </div>

              {/* Motto Banner */}
              <div className="bg-slate-900 text-white rounded-[32px] p-8 md:p-12 text-center space-y-4 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="mesh-bg"></div>
                <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">United by One Purpose</p>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                  Empowering learners. Transforming futures.
                </h3>
              </div>
            </div>
          </section>
        )}

        {/* ==================== PAGE: PROGRAMMES ==================== */}
        {activeTab === 'programs' && (
          <section className="space-y-12 page-container">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
                Official Curriculum & Pricing
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Programs & Pricing</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Explore our official learning programs designed for primary, secondary, examination candidates, teachers, and institutions.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              {['All', 'Subject Mastery', 'Exam Prep', 'International', '1-on-1 & Bootcamps', 'Institutional'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setProgramCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${programCategory === cat ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Program Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {PROGRAMS
                .filter(p => programCategory === 'All' || p.category === programCategory)
                .map(p => (
                  <div 
                    key={p.id} 
                    className="glow-card p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-6"
                    onMouseMove={handleMouseMove}
                  >
                    <div className="space-y-4">
                      {/* Top Badges & Pricing Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            {p.badge}
                          </span>
                          {p.popular && (
                            <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                              <Sparkles size={10} /> Popular Choice
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-base md:text-lg font-black text-emerald-500">{p.fee}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{p.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mt-2">{p.desc}</p>
                      </div>

                      {/* Metadata Schedule & Duration */}
                      <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                          <Calendar size={13} className="text-emerald-500 shrink-0" />
                          <span>{p.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                          <Clock size={13} className="text-emerald-500 shrink-0" />
                          <span>{p.duration}</span>
                        </div>
                      </div>

                      {/* Highlights Checklist */}
                      <div className="space-y-1.5 pt-2">
                        {p.highlights.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => {
                          setPaymentPlan(p.id)
                          setBillingDetails(prev => ({ ...prev, amount: p.rawPrice === 'Available on request' ? '₦50,000' : p.rawPrice }))
                          setActiveTab('payments')
                        }} 
                        className="btn btn-accent btn-sm flex-1 font-bold shadow-md"
                      >
                        Enroll Now
                      </button>
                      <button 
                        onClick={() => {
                          setAssessmentForm(prev => ({ ...prev, curriculum: p.title }))
                          setActiveTab('assessment')
                        }} 
                        className="btn btn-outline btn-sm flex-1 font-bold"
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ==================== PAGE: FIND A TUTOR ==================== */}
        {activeTab === 'tutors' && (
          <section className="space-y-8 page-container">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold">Find a Tutor</h2>
              <p className="text-sm text-slate-500">Search and filter through our certified tutor network to match your learning goals.</p>
            </div>

            {/* Filters */}
            <div className="glass p-6 rounded-2xl grid sm:grid-cols-3 gap-6 border shadow-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mathematics, English"
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Grade Level</label>
                <select 
                  value={searchGrade}
                  onChange={(e) => setSearchGrade(e.target.value)}
                  className="form-input"
                >
                  <option value="">All Grade Levels</option>
                  <option value="Primary">Primary</option>
                  <option value="Junior Secondary">Junior Secondary</option>
                  <option value="Senior Secondary">Senior Secondary</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Curriculum</label>
                <select 
                  value={searchCurriculum}
                  onChange={(e) => setSearchCurriculum(e.target.value)}
                  className="form-input"
                >
                  <option value="">All Curricula</option>
                  <option value="WAEC">WAEC</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="SAT">SAT</option>
                  <option value="JAMB">JAMB</option>
                </select>
              </div>
            </div>

            {/* Tutor List */}
            <div className="space-y-6">
              {loadingTutors ? (
                <div className="text-center py-16 text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                  <p className="text-xs">Searching database...</p>
                </div>
              ) : dbTutors.length > 0 ? (
                dbTutors.map(t => (
                  <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">{t.name} <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Vetted Partner</span></h3>
                          <p className="text-xs text-slate-500 font-semibold">{t.subject} • {t.grade} ({t.curriculum} Curriculum)</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-xl text-xs font-bold">
                          <Star size={14} className="fill-current" /> {t.rating.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">{t.bio}</p>
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/85">
                        <span className="text-sm font-black text-emerald-500">{t.rate}</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setActiveTab('assessment'); setAssessmentForm(prev => ({ ...prev, tutorName: t.name } as any)) }} className="btn btn-outline btn-sm font-bold">Book Free Session</button>
                          <button onClick={() => { setActiveTab('payments'); setBillingDetails(prev => ({ ...prev, name: 'Parent Student', amount: t.rate.split('/')[0] })) }} className="btn btn-primary btn-sm font-bold">Pay Tuition</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-850 rounded-[28px] text-slate-500">
                  <Users size={48} className="mx-auto mb-4 text-slate-300" />
                  <p className="text-xs">No tutors matched your specific filters. Try expanding your search options.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ==================== PAGE: COURSES ==================== */}
        {activeTab === 'courses' && (
          <section className="space-y-8 page-container">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Online Courses</h2>
              <p className="text-sm text-slate-500">Self-paced digital classes featuring interactive video, quizzes, and digital certifications.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
                <h3 className="font-extrabold text-[10px] uppercase text-slate-400">Available Courses</h3>
                {COURSES.map(course => (
                  <button 
                    key={course.id}
                    onClick={() => selectCourse(course.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1.5 ${selectedCourse.id === course.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                  >
                    <span className="font-bold text-sm">{course.title}</span>
                    <span className="text-[10px] text-slate-500">Instructor: {course.tutor}</span>
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-grow space-y-6">
                <div className="bg-slate-950 aspect-video rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center relative shadow-lg">
                  <video src={currentLesson.video} controls className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                    Playing: {currentLesson.title}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Lesson Selector */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 shadow-sm">
                    <h3 className="font-bold text-sm">Course Syllabus</h3>
                    <div className="space-y-2">
                      {selectedCourse.lessons.map(lesson => (
                        <button 
                          key={lesson.id} 
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border text-xs font-bold flex justify-between items-center transition-colors ${currentLesson.id === lesson.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'}`}
                        >
                          {lesson.title}
                          <Clock size={14} className="text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quiz */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                    <h3 className="font-bold text-sm flex items-center gap-2"><Award size={18} className="text-emerald-500" /> Quiz & Certification</h3>
                    
                    {!quizSubmitted ? (
                      <div className="space-y-4">
                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{selectedCourse.quiz.question}</p>
                        <div className="space-y-2">
                          {selectedCourse.quiz.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 text-xs font-semibold cursor-pointer bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-colors">
                              <input 
                                type="radio" 
                                name="quiz-options" 
                                value={opt} 
                                checked={quizAnswer === opt}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="custom-radio"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <button onClick={handleQuizSubmit} className="btn btn-primary btn-sm w-full py-3">Submit Quiz</button>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center py-4">
                        {quizPassed ? (
                          <div className="space-y-4">
                            <CheckCircle size={44} className="mx-auto text-emerald-500" />
                            <div>
                              <h4 className="font-bold text-sm">Perfect Score! Passed</h4>
                              <p className="text-[10px] text-slate-500">Your digital certificate is generated successfully.</p>
                            </div>
                            <button 
                              onClick={() => {
                                const certContent = `Mokafor Certificate of Completion\n\nRecipient: Student\nCourse: ${selectedCourse.title}\nIssuer: Mokafor Global Education`
                                const blob = new Blob([certContent], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `certificate_${selectedCourse.id}.txt`
                                a.click()
                              }}
                              className="btn btn-accent btn-sm w-full py-3"
                            >
                              Download Certificate
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Award size={44} className="mx-auto text-rose-500" />
                            <div>
                              <h4 className="font-bold text-sm">Incorrect Answers</h4>
                              <p className="text-[10px] text-slate-500">Correct Answer: {selectedCourse.quiz.answer}</p>
                            </div>
                            <button onClick={() => { setQuizSubmitted(false); setQuizAnswer('') }} className="btn btn-outline btn-sm w-full py-3">Try Again</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== PAGE: PAYMENTS ==================== */}
        {activeTab === 'payments' && (
          <section className="space-y-8 page-container">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tuition Payments</h2>
              <p className="text-sm text-slate-500">Securely register, select pricing tiers, and process mock transactions via Paystack checkout.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2"><DollarSign className="text-emerald-500" /> Checkout Details</h3>
                
                {!paymentSuccess ? (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Select Programme Plan</label>
                      <select 
                        value={paymentPlan}
                        onChange={(e) => handlePlanChange(e.target.value)}
                        className="form-input"
                      >
                        <option value="monthly-4">Monthly Plan (4 sessions) - ₦52,000</option>
                        <option value="monthly-8">Monthly Plan (8 sessions) - ₦96,000</option>
                        <option value="termly">Termly Package (24 sessions) - ₦270,000</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. John Doe"
                        value={billingDetails.name}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. johndoe@gmail.com"
                        value={billingDetails.email}
                        onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                        className="form-input"
                      />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400">Total Price:</span>
                      <span className="text-xl font-black text-emerald-500">{billingDetails.amount}</span>
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-3.5 font-bold gap-2">
                      Initialize Paystack Mock Checkout <ArrowRight size={18} />
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-6 animate-fade-in">
                    <CheckCircle size={56} className="mx-auto text-emerald-500" />
                    <div>
                      <h4 className="font-bold text-xl">Payment Confirmed</h4>
                      <p className="text-xs text-slate-400 mt-1">Ref ID: {receiptNumber}</p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                      Your payment of <strong>{billingDetails.amount}</strong> was successfully captured via Paystack mock framework.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button onClick={downloadReceipt} className="btn btn-accent btn-sm flex-1 gap-2">
                        Download Receipt
                      </button>
                      <button onClick={() => { setPaymentSuccess(false); setBillingDetails({ name: '', email: '', amount: '₦96,000' }) }} className="btn btn-outline btn-sm flex-1">
                        New Transaction
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Cards */}
              <div className="space-y-6">
                <h3 className="font-extrabold text-[10px] uppercase text-slate-400">Pricing Packages</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-sm">4-Session Plan</h4>
                    <p className="text-xs text-slate-500">Best for midterm test prep.</p>
                  </div>
                  <span className="text-lg font-black text-slate-900 dark:text-white">₦52,000/mo</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 p-6 rounded-2xl flex justify-between items-center shadow-md relative">
                  <span className="absolute -top-3.5 left-6 bg-emerald-500 text-white text-[8px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full">Recommended</span>
                  <div>
                    <h4 className="font-bold text-sm">8-Session Plan</h4>
                    <p className="text-xs text-slate-500">Standard regular tutor mapping.</p>
                  </div>
                  <span className="text-lg font-black text-emerald-500">₦96,000/mo</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-sm">Termly Plan (24 sessions)</h4>
                    <p className="text-xs text-slate-500">Complete semester protection with 15% discount.</p>
                  </div>
                  <span className="text-lg font-black text-slate-900 dark:text-white">₦270,000/term</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== PAGE: FAQ ==================== */}
        {activeTab === 'faq' && (
          <section className="space-y-8 max-w-3xl mx-auto page-container">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500">Get answers to operational standards, policies, and tutor matchings.</p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">{faq.q}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-100 dark:bg-slate-900 p-8 rounded-3xl text-center space-y-4 border border-slate-200/50 dark:border-slate-800/80 animate-pulse">
              <h4 className="font-bold text-base">Have more questions?</h4>
              <p className="text-xs text-slate-500">Our customer support advisors are available on WhatsApp to assist you.</p>
              <a href="https://wa.me/2349078013408" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm px-6">Chat on WhatsApp</a>
            </div>
          </section>
        )}

        {/* ==================== PAGE: BOOK FREE ASSESSMENT ==================== */}
        {activeTab === 'assessment' && (
          <section className="max-w-xl mx-auto space-y-8 page-container">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold">Book Diagnostic</h2>
              <p className="text-sm text-slate-500">Schedule a placement and academic assessment consultation online.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              {!assessmentBooked ? (
                <form onSubmit={handleAssessmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Parent Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Parent Name"
                        value={assessmentForm.parentName}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, parentName: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Student Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Student Name"
                        value={assessmentForm.studentName}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, studentName: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Grade Level</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Primary 5, JSS2"
                        value={assessmentForm.grade}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, grade: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Curriculum</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. British, WAEC"
                        value={assessmentForm.curriculum}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, curriculum: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Date</label>
                      <input 
                        type="date" 
                        required
                        value={assessmentForm.date}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, date: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Time</label>
                      <input 
                        type="time" 
                        required
                        value={assessmentForm.time}
                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, time: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3.5 font-bold gap-2">Book Free Consultation <Calendar size={16} /></button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <CheckCircle size={56} className="mx-auto text-emerald-500" />
                  <div>
                    <h3 className="font-bold text-lg">Consultation Scheduled</h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1">Calendar Invite Sent</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                    A diagnostic link has been dispatched to assess <strong>{assessmentForm.studentName}</strong> on <strong>{assessmentForm.date}</strong> at <strong>{assessmentForm.time}</strong>.
                  </p>
                  <button onClick={() => { setAssessmentBooked(false); setAssessmentForm({ parentName: '', studentName: '', grade: '', curriculum: '', date: '', time: '' }) }} className="btn btn-outline btn-sm px-6">Book Another</button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ==================== PAGE: PORTALS ==================== */}
        {activeTab === 'portals' && (
          <section className="space-y-8 page-container">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Access Portals</h2>
              <p className="text-sm text-slate-500">Secure operational dashboards for Students, Parents, and Tutors.</p>
            </div>

            {/* Role Switcher */}
            <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 max-w-md mx-auto">
              <button 
                onClick={() => { setPortalRole('student'); setUploadedFile(null); setHomeworkStatus('Pending') }} 
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${portalRole === 'student' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}
              >
                Student
              </button>
              <button 
                onClick={() => { setPortalRole('parent'); setUploadedFile(null) }} 
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${portalRole === 'parent' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}
              >
                Parent
              </button>
              <button 
                onClick={() => { setPortalRole('tutor'); setUploadedFile(null) }} 
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${portalRole === 'tutor' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}
              >
                Tutor
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 min-h-[400px]">
              
              {/* STUDENT PORTAL */}
              {portalRole === 'student' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold">Welcome Back, {portalData?.name || 'Toby'}</h3>
                      <p className="text-xs text-slate-500">Grade: {portalData?.grade || 'JSS3'} | Curriculum: {portalData?.curriculum || 'WAEC'} Prep</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-3.5 py-1 rounded-full font-bold">Active Student</span>
                  </div>

                  {loadingPortal ? (
                    <div className="text-center py-12 text-slate-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                      <p className="text-[10px]">Updating portal...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance Rate</span>
                          <h4 className="text-3xl font-black text-emerald-500 mt-1">{portalData?.attendance || 94}%</h4>
                          <svg className="w-full h-8 mt-2 text-emerald-500" viewBox="0 0 100 20">
                            <path d="M0,15 Q25,5 50,12 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Progress</span>
                          <h4 className="text-3xl font-black text-emerald-500 mt-1">{portalData?.score || 85}%</h4>
                          <svg className="w-full h-8 mt-2 text-emerald-500" viewBox="0 0 100 20">
                            <path d="M0,18 Q30,10 60,8 T100,2" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Next Scheduled Lesson</span>
                          {portalData?.nextLesson ? (
                            <>
                              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                                {new Date(portalData.nextLesson.scheduledAt).toLocaleDateString()} at {new Date(portalData.nextLesson.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </h4>
                              <p className="text-[10px] text-slate-500 mt-1">Instructor: {portalData.nextLesson.tutor}</p>
                              {portalData.nextLesson.meetingLink && (
                                <a href={portalData.nextLesson.meetingLink} target="_blank" className="text-[10px] text-emerald-500 font-bold hover:underline block mt-1">Join Lesson Meeting</a>
                              )}
                            </>
                          ) : (
                            <h4 className="text-xs font-bold text-slate-500 mt-3">No sessions scheduled</h4>
                          )}
                        </div>
                      </div>

                      {/* Submission Form */}
                      {portalData?.assignment && (
                        <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                          <h4 className="font-bold text-sm">Upload Finished Homework</h4>
                          <p className="text-xs text-slate-500">Module: {portalData.assignment.title} (Due: {new Date(portalData.assignment.dueDate).toLocaleDateString()})</p>
                          
                          {homeworkStatus === 'Pending' ? (
                            <div className="space-y-4">
                              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-colors">
                                <Upload size={36} className="mx-auto text-slate-300 mb-2" />
                                <label className="text-xs font-bold text-emerald-500 cursor-pointer">
                                  Select local file
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        setUploadedFile(e.target.files[0].name)
                                      }
                                    }} 
                                  />
                                </label>
                                <p className="text-[9px] text-slate-400 mt-1">Accepts PDF, PNG up to 10MB</p>
                                {uploadedFile && <p className="text-xs font-bold text-emerald-500 mt-3">Selected File: {uploadedFile}</p>}
                              </div>
                              <button 
                                disabled={!uploadedFile}
                                onClick={handleHomeworkSubmit}
                                className="btn btn-primary btn-sm text-xs py-2 px-6 disabled:opacity-50"
                              >
                                Submit Work
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 p-4 rounded-xl text-xs font-bold">
                              <Check size={18} /> Assignment uploaded successfully. Awaiting grading.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* PARENT PORTAL */}
              {portalRole === 'parent' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold">Parent Portal</h3>
                      <p className="text-xs text-slate-500">Account: {portalData?.parentName || 'Mrs. Amadi Adebayo'} | Ward: {portalData?.wardName || 'Toby Adebayo'}</p>
                    </div>
                    <span className="bg-indigo-500/10 text-indigo-500 text-[10px] px-3.5 py-1 rounded-full font-bold">Billing Status: Active</span>
                  </div>

                  {loadingPortal ? (
                    <div className="text-center py-12 text-slate-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                      <p className="text-[10px]">Updating portal...</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-8">
                      {/* Performance details */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                        <h4 className="font-bold text-sm border-b pb-2">Academic Progress Updates</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Mathematics Score:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{portalData?.progress?.score || 85}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Latest Remarks:</span>
                            <span className="text-emerald-500 font-bold">"{portalData?.progress?.notes || 'Exceptional progress.'}"</span>
                          </div>
                        </div>
                      </div>

                      {/* Billing details */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                        <h4 className="font-bold text-sm border-b pb-2">Tuition & Invoice History</h4>
                        <div className="space-y-3 text-xs max-h-48 overflow-y-auto">
                          {portalData?.transactions && portalData.transactions.length > 0 ? (
                            portalData.transactions.map((tx: any, idx: number) => (
                              <div key={idx} className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">{tx.reference} ({new Date(tx.date).toLocaleDateString()}):</span>
                                <span className="font-bold text-slate-900 dark:text-white">{tx.amount} ({tx.status})</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-400">No payment logs recorded.</p>
                          )}
                        </div>
                        <button onClick={() => { setActiveTab('payments'); setPaymentSuccess(false) }} className="btn btn-outline btn-sm w-full text-xs mt-2">Modify Pricing / Pay Invoice</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TUTOR PORTAL */}
              {portalRole === 'tutor' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold">Tutor Workspace</h3>
                      <p className="text-xs text-slate-500">Instructor: {portalData?.tutorName || 'Mark Okafor'}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3.5 py-1 rounded-full font-bold">Verified Educator</span>
                  </div>

                  {loadingPortal ? (
                    <div className="text-center py-12 text-slate-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                      <p className="text-[10px]">Updating portal...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Pupils</span>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{portalData?.activeStudents || 4} Active</h4>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Earnings Balance</span>
                          <h4 className="text-3xl font-black text-emerald-500 mt-1">{portalData?.earnings || '₦420,000'}</h4>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Vetting Score</span>
                          <h4 className="text-3xl font-black text-emerald-500 mt-1">{portalData?.rating ? portalData.rating.toFixed(1) : '5.0'} / 5.0</h4>
                          <p className="text-[10px] text-slate-500 mt-1">{portalData?.reviewsCount || 22} Reviews</p>
                        </div>
                      </div>

                      {/* Sessions Agenda */}
                      <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                        <h4 className="font-bold text-xs uppercase text-slate-400">Scheduled Sessions</h4>
                        {portalData?.agenda && portalData.agenda.length > 0 ? (
                          portalData.agenda.map((ag: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl flex-wrap gap-3">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{ag.studentName} — {ag.subject}</p>
                                <p className="text-[10px] text-slate-500 mt-1">Scheduled: {new Date(ag.scheduledAt).toLocaleString()}</p>
                              </div>
                              {ag.meetingLink && (
                                <a href={ag.meetingLink} target="_blank" className="btn btn-accent btn-sm text-[10px]">Launch Google Meet</a>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 text-center py-4">No agendas mapped today.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 md:px-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="h-10 flex items-center">
              <img src="/logo_dark.png" alt="Mokafor Logo" className="h-9 object-contain" />
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Providing exceptional academic instruction, certified curricula (WAEC, SAT, IGCSE), and modern digital learning tools globally.
            </p>
            <p className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} Mokafor Global Education. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('about')} className="hover:text-emerald-500">About Us</button></li>
              <li><button onClick={() => setActiveTab('programs')} className="hover:text-emerald-500">Our Programmes</button></li>
              <li><button onClick={() => setActiveTab('tutors')} className="hover:text-emerald-500">Find a Tutor</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-emerald-500">Self-Paced Courses</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-emerald-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-500">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-emerald-500">Refund Policy</a></li>
              <li><a href="#" className="hover:text-emerald-500">Safeguarding & Child Protection</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-4">Contact & Location</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>3, Compassion road, Dagbana Estate, Jikwoyi, Abuja</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-500 shrink-0" />
                <a href="https://wa.me/2349078013408" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 font-bold transition-colors">
                  WhatsApp: +234 907 801 3408
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-500 shrink-0" />
                <span>support@mokafor.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-emerald-500 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
