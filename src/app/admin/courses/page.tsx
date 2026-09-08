'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Video,
  Plus,
  Tag,
  Link as LinkIcon,
  BarChart2,
  Copy,
  CheckCircle,
  Eye,
  Edit,
  Trash,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Lock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  X,
  Save,
  Trash2
} from 'lucide-react'

interface VideoItem {
  id: string
  title: string
  description?: string
  videoUrl: string
  snippetUrl?: string
  price?: number
  durationSeconds: number
  isSnippet: boolean
}

interface ModuleItem {
  id: string
  title: string
  description?: string
  videos: VideoItem[]
}

interface CourseItem {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  thumbnailUrl?: string
  level: string
  category: string
  price: number
  discountPrice?: number | null
  discountPercent?: number | null
  order?: number
  isPublished: boolean
  featured: boolean
  modules: ModuleItem[]
  _count?: { enrollments: number }
}

interface ShortLinkItem {
  id: string
  code: string
  targetUrl: string
  campaign?: string
  clicks: number
  createdAt: string
  course?: { title: string; slug: string }
}

export default function AdminCoursesPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'modules' | 'shortlinks'>('courses')
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [shortLinks, setShortLinks] = useState<ShortLinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form states for creation
  const [newCourse, setNewCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnailUrl: '',
    level: 'WAEC',
    category: 'Mathematics',
    discountPercent: '20',
    featured: true
  })

  const [newModule, setNewModule] = useState({
    courseId: '',
    title: '',
    description: ''
  })

  const [newVideo, setNewVideo] = useState({
    moduleId: '',
    title: '',
    description: '',
    videoUrl: '',
    snippetUrl: '',
    price: '2000',
    durationMinutes: '15',
    isSnippet: true
  })

  const [newShortLink, setNewShortLink] = useState({
    code: '',
    courseId: '',
    targetUrl: '/courses',
    campaign: 'WhatsApp Broadcast'
  })

  // Editing state modals
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null)
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)

  // Superadmin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [authenticating, setAuthenticating] = useState<boolean>(false)

  // Uploading state
  const [uploadingImage, setUploadingImage] = useState<boolean>(false)

  const handleImageUpload = async (file: File, isEditMode: boolean = false) => {
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (data.success && data.url) {
        if (isEditMode && editingCourse) {
          setEditingCourse(prev => prev ? { ...prev, thumbnailUrl: data.url } : null)
        } else {
          setNewCourse(prev => ({ ...prev, thumbnailUrl: data.url }))
        }
      } else {
        alert(data.error || 'Failed to upload thumbnail image')
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Failed to upload image.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleReorderCourse = async (courseId: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder_courses', courseId, direction })
      })
      const data = await res.json()
      if (data.success) {
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to reorder course')
      }
    } catch (err) {
      console.error('Error reordering course:', err)
    }
  }

  useEffect(() => {
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
    fetchAdminData()
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
        fetchAdminData()
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify your email and password.')
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication server.')
    } finally {
      setAuthenticating(false)
    }
  }

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [coursesRes, shortlinksRes] = await Promise.all([
        fetch('/api/admin/courses'),
        fetch('/api/admin/shortlinks')
      ])

      const coursesData = await coursesRes.json()
      const shortlinksData = await shortlinksRes.json()

      if (coursesData.success) {
        setCourses(coursesData.courses)
        if (coursesData.courses.length > 0 && !newModule.courseId) {
          setNewModule(prev => ({ ...prev, courseId: coursesData.courses[0].id }))
        }
      }

      if (shortlinksData.success) {
        setShortLinks(shortlinksData.shortLinks)
      }
    } catch (err) {
      console.error('Failed to load admin courses data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create Course handler
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      })
      const data = await res.json()
      if (data.success) {
        alert('Course created successfully!')
        setNewCourse({
          title: '',
          subtitle: '',
          description: '',
          thumbnailUrl: '',
          level: 'WAEC',
          category: 'Mathematics',
          discountPercent: '20',
          featured: true
        })
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to create course')
      }
    } catch (err) {
      console.error('Error creating course:', err)
    }
  }

  // Update Course handler
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_course',
          courseId: editingCourse.id,
          title: editingCourse.title,
          subtitle: editingCourse.subtitle,
          description: editingCourse.description,
          category: editingCourse.category,
          level: editingCourse.level,
          discountPercent: editingCourse.discountPercent !== null && editingCourse.discountPercent !== undefined && (editingCourse.discountPercent as any) !== '' ? Number(editingCourse.discountPercent) : 0,
          thumbnailUrl: editingCourse.thumbnailUrl,
          isPublished: editingCourse.isPublished,
          featured: editingCourse.featured
        })
      })
      const data = await res.json()
      if (data.success) {
        alert('Course updated successfully!')
        setEditingCourse(null)
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to update course')
      }
    } catch (err) {
      console.error('Error updating course:', err)
    }
  }

  // Delete Course handler
  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete course "${title}"? This will also remove all its modules and video lessons.`)) return
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_course', courseId })
      })
      const data = await res.json()
      if (data.success) {
        alert('Course deleted!')
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to delete course')
      }
    } catch (err) {
      console.error('Error deleting course:', err)
    }
  }

  // Create Module handler
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_module',
          ...newModule
        })
      })
      const data = await res.json()
      if (data.success) {
        alert('Module added!')
        setNewModule(prev => ({ ...prev, title: '', description: '' }))
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to create module')
      }
    } catch (err) {
      console.error('Error creating module:', err)
    }
  }

  // Update Module handler
  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingModule) return
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_module',
          moduleId: editingModule.id,
          title: editingModule.title,
          description: editingModule.description
        })
      })
      const data = await res.json()
      if (data.success) {
        alert('Module updated!')
        setEditingModule(null)
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to update module')
      }
    } catch (err) {
      console.error('Error updating module:', err)
    }
  }

  // Delete Module handler
  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete module "${title}"?`)) return
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_module', moduleId })
      })
      const data = await res.json()
      if (data.success) {
        alert('Module deleted!')
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to delete module')
      }
    } catch (err) {
      console.error('Error deleting module:', err)
    }
  }

  // Create Video handler
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_video',
          moduleId: newVideo.moduleId,
          title: newVideo.title,
          description: newVideo.description,
          videoUrl: newVideo.videoUrl,
          snippetUrl: newVideo.snippetUrl || null,
          price: Number(newVideo.price || 2000),
          durationSeconds: Number(newVideo.durationMinutes) * 60,
          isSnippet: newVideo.isSnippet
        })
      })
      const data = await res.json()
      if (data.success) {
        alert('Video lesson added successfully!')
        setNewVideo({
          moduleId: '',
          title: '',
          description: '',
          videoUrl: '',
          snippetUrl: '',
          price: '2000',
          durationMinutes: '15',
          isSnippet: true
        })
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to create video lesson')
      }
    } catch (err) {
      console.error('Error creating video:', err)
    }
  }

  // Update Video handler
  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_video',
          videoId: editingVideo.id,
          title: editingVideo.title,
          description: editingVideo.description,
          videoUrl: editingVideo.videoUrl,
          snippetUrl: editingVideo.snippetUrl || null,
          price: Number(editingVideo.price || 2000),
          durationSeconds: editingVideo.durationSeconds,
          isSnippet: editingVideo.isSnippet
        })
      })
      const data = await res.json()
      if (data.success) {
        alert('Video lesson updated!')
        setEditingVideo(null)
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to update video lesson')
      }
    } catch (err) {
      console.error('Error updating video:', err)
    }
  }

  // Delete Video handler
  const handleDeleteVideo = async (videoId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete video lesson "${title}"?`)) return
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_video', videoId })
      })
      const data = await res.json()
      if (data.success) {
        alert('Video lesson deleted!')
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to delete video')
      }
    } catch (err) {
      console.error('Error deleting video:', err)
    }
  }

  // Create Shortlink handler
  const handleCreateShortlink = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/shortlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShortLink)
      })
      const data = await res.json()
      if (data.success) {
        alert(`Shortlink generated! mokafor.com/s/${data.shortLink.code}`)
        setNewShortLink({
          code: '',
          courseId: '',
          targetUrl: '/courses',
          campaign: 'WhatsApp Broadcast'
        })
        fetchAdminData()
      } else {
        alert(data.error || 'Failed to generate shortlink')
      }
    } catch (err) {
      console.error('Error creating shortlink:', err)
    }
  }

  const copyShortlinkToClipboard = (code: string) => {
    const fullUrl = `${window.location.origin}/s/${code}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const totalClicks = shortLinks.reduce((acc: number, curr: ShortLinkItem) => acc + curr.clicks, 0)
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto py-12">
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center shadow-md">
                <ShieldCheck size={36} />
              </div>
              <h2 className="text-2xl font-black text-white">Executive Portal Authentication</h2>
              <p className="text-xs text-slate-400 font-medium">Log in with your Superadmin credentials to access Video Courses & Marketing Shortlinks.</p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 uppercase text-[10px]">Superadmin Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="Enter admin email..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 uppercase text-[10px]">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authenticating}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm justify-center shadow-lg shadow-emerald-500/20 gap-2 rounded-xl transition-all cursor-pointer flex items-center"
              >
                {authenticating ? 'Verifying Credentials...' : 'Sign In as Superadmin'} <ChevronRight size={16} />
              </button>
            </form>

            <div className="text-center pt-2">
              <Link href="/admin" className="text-xs text-slate-400 hover:text-emerald-400 font-bold inline-flex items-center gap-1.5">
                <ArrowLeft size={14} /> Return to Main Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Title */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticated: {adminUser?.email || 'Executive Superadmin'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Video Courses & Shortlink Marketing Manager
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Manage recorded video series, edit lesson details & prices, upload teaser snippets, and track ad campaign shortlinks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2 border border-slate-700"
              >
                <ArrowLeft size={14} />
                <span>Executive Dashboard</span>
              </Link>
              <Link
                href="/courses"
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Catalog ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'modules'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Modules & Video Lessons</span>
            </button>

            <button
              onClick={() => setActiveTab('shortlinks')}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'shortlinks'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Marketing Shortlinks ({shortLinks.length})</span>
            </button>
          </div>

          {/* Tab 1: Course Catalog */}
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Create New Course Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" /> Create Recorded Video Course
                </h3>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WAEC Mathematics Complete Series"
                      value={newCourse.title}
                      onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subtitle / Short Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Comprehensive recorded video lectures with past question drills."
                      value={newCourse.subtitle}
                      onChange={e => setNewCourse({ ...newCourse, subtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subject / Program</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mathematics, English, Exam Prep"
                        value={newCourse.category}
                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Level</label>
                      <select
                        value={newCourse.level}
                        onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Primary">Primary</option>
                        <option value="JSCE">JSCE / BECE</option>
                        <option value="WAEC">WAEC</option>
                        <option value="IGCSE">IGCSE</option>
                        <option value="JAMB">JAMB</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Discount Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 20 for 20% discount"
                      value={newCourse.discountPercent}
                      onChange={e => setNewCourse({ ...newCourse, discountPercent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Course price is automatically calculated as the sum of its video lessons.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Course Thumbnail Picture</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-2 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-3 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0], false)
                            }
                          }}
                        />
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400">
                          {uploadingImage ? 'Uploading Image...' : 'Click to Upload Thumbnail Image'}
                        </span>
                      </label>

                      {newCourse.thumbnailUrl && (
                        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                          <img src={newCourse.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 text-[10px] bg-slate-900/80 text-emerald-400 px-2 py-0.5 rounded font-bold">Preview Ready</span>
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Or paste image URL (https://...)"
                        value={newCourse.thumbnailUrl}
                        onChange={e => setNewCourse({ ...newCourse, thumbnailUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Provide details on what students will learn..."
                      value={newCourse.description}
                      onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    Publish Course to Storefront
                  </button>
                </form>
              </div>

              {/* Course List Table */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Active Video Courses</span>
                  <span className="text-xs text-slate-400">{courses.length} courses total</span>
                </h3>

                <div className="space-y-4">
                  {courses.map((c, index) => {
                    const totalVids = c.modules.reduce((acc: number, m: ModuleItem) => acc + m.videos.length, 0)
                    const calculatedBasePrice = c.modules.reduce((sum, m) => sum + m.videos.reduce((vSum, v) => vSum + (v.price || 0), 0), 0)
                    const discountPercent = c.discountPercent ?? 0
                    const calculatedDiscountPrice = discountPercent > 0 ? Math.round(calculatedBasePrice * (1 - discountPercent / 100)) : calculatedBasePrice

                    return (
                      <div
                        key={c.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                            alt={c.title}
                            className="w-20 h-16 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                                {c.level}
                              </span>
                              <span className="text-xs text-slate-400">{c.category}</span>
                            </div>
                            <h4 className="font-bold text-white text-base mt-1">{c.title}</h4>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                              <span>{c.modules.length} Modules</span>
                              <span>•</span>
                              <span>{totalVids} Video Lessons</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-1 mr-1">
                            <button
                              onClick={() => handleReorderCourse(c.id, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Move Course Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorderCourse(c.id, 'down')}
                              disabled={index === courses.length - 1}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Move Course Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right mr-2">
                            <div className="text-lg font-black text-amber-400">
                              {formatNaira(calculatedDiscountPrice)}
                            </div>
                            {discountPercent > 0 && calculatedBasePrice > 0 && (
                              <div className="text-xs text-slate-500 line-through">
                                {formatNaira(calculatedBasePrice)} ({discountPercent}% OFF)
                              </div>
                            )}
                          </div>

                          {/* Edit Course Trigger */}
                          <button
                            onClick={() => setEditingCourse(c)}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors flex items-center gap-1 text-xs font-bold"
                            title="Edit Course Details"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Course Trigger */}
                          <button
                            onClick={() => handleDeleteCourse(c.id, c.title)}
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <Link
                            href={`/courses/${c.slug}`}
                            target="_blank"
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Preview Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Modules & Video Lessons */}
          {activeTab === 'modules' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Module Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" /> Step 1: Create Course Module / Series
                  </h3>
                  <form onSubmit={handleCreateModule} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Parent Course</label>
                      <select
                        required
                        value={newModule.courseId}
                        onChange={e => setNewModule({ ...newModule, courseId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Module Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Module 1: Quadratic Equations & Formula"
                        value={newModule.title}
                        onChange={e => setNewModule({ ...newModule, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        placeholder="Brief description of module contents..."
                        value={newModule.description}
                        onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                      Save Module
                    </button>
                  </form>
                </div>

                {/* Create Video Lesson Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" /> Step 2: Add Video Lesson & Price
                  </h3>
                  <form onSubmit={handleCreateVideo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Module</label>
                      <select
                        required
                        value={newVideo.moduleId}
                        onChange={e => setNewVideo({ ...newVideo, moduleId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- Choose Module --</option>
                        {courses.flatMap(c =>
                          c.modules.map(m => (
                            <option key={m.id} value={m.id}>
                              [{c.title.slice(0, 20)}...] {m.title}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Lesson Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lesson 1.1: Derivation of the Quadratic Formula"
                        value={newVideo.title}
                        onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Lesson Price (₦)</label>
                        <input
                          type="number"
                          required
                          placeholder="2000"
                          value={newVideo.price}
                          onChange={e => setNewVideo({ ...newVideo, price: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Duration (Minutes)</label>
                        <input
                          type="number"
                          value={newVideo.durationMinutes}
                          onChange={e => setNewVideo({ ...newVideo, durationMinutes: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Video Stream URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/..."
                        value={newVideo.videoUrl}
                        onChange={e => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Dedicated Snippet URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="Leave empty to use 50-second cutoff preview..."
                        value={newVideo.snippetUrl}
                        onChange={e => setNewVideo({ ...newVideo, snippetUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-amber-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newVideo.isSnippet}
                          onChange={e => setNewVideo({ ...newVideo, isSnippet: e.target.checked })}
                          className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
                        />
                        <span className="text-xs font-bold text-amber-400">Enable 50s Teaser Preview</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      Add Video Lesson
                    </button>
                  </form>
                </div>
              </div>

              {/* Hierarchy Tree of Courses, Modules, and Lessons */}
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Curriculum Tree (Edit & Delete Modules & Lessons)</span>
                </h3>

                <div className="space-y-6">
                  {courses.map(c => (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Course</span>
                          <h4 className="text-lg font-bold text-white">{c.title}</h4>
                        </div>
                        <button
                          onClick={() => setEditingCourse(c)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Course
                        </button>
                      </div>

                      <div className="space-y-4 pl-2 sm:pl-4">
                        {c.modules.map(m => (
                          <div key={m.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-400" />
                                <span className="font-bold text-white text-sm">{m.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingModule(m)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold flex items-center gap-1"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteModule(m.id, m.title)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Videos under this module */}
                            <div className="space-y-2">
                              {m.videos.map(v => (
                                <div key={v.id} className="bg-slate-900 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <Video className="w-4 h-4 text-amber-400 shrink-0" />
                                    <div>
                                      <span className="text-xs font-bold text-white block">{v.title}</span>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-[11px] font-bold text-amber-400">
                                          ₦{(v.price || 2000).toLocaleString()}
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                          {Math.round(v.durationSeconds / 60)} mins
                                        </span>
                                        {v.isSnippet && (
                                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                                            50s Teaser
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setEditingVideo(v)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1"
                                      title="Edit Video Lesson Details & Price"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVideo(v.id, v.title)}
                                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                                      title="Delete Video Lesson"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Marketing Shortlinks & Analytics */}
          {activeTab === 'shortlinks' && (
            <div className="space-y-8">
              {/* Analytics Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Shortlinks</span>
                    <div className="text-3xl font-black text-white mt-1">{shortLinks.length}</div>
                  </div>
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <LinkIcon className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Link Clicks</span>
                    <div className="text-3xl font-black text-emerald-400 mt-1">{totalClicks}</div>
                  </div>
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Ad Channel</span>
                    <div className="text-xl font-bold text-amber-400 mt-1">WhatsApp & Meta Ads</div>
                  </div>
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shortlink Generator Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-400" /> Create Marketing Shortlink
                  </h3>
                  <form onSubmit={handleCreateShortlink} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-100 uppercase tracking-wider mb-1.5">Custom Short Code / Alias</label>
                      <div className="flex items-center">
                        <span className="bg-slate-800 border border-r-0 border-slate-600 text-slate-100 font-mono font-bold text-xs px-3.5 py-2.5 rounded-l-xl shrink-0">
                          mokafor.com/s/
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. waec2026"
                          value={newShortLink.code}
                          onChange={e => setNewShortLink({ ...newShortLink, code: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-600 rounded-r-xl px-3.5 py-2.5 text-sm text-amber-300 font-bold placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-100 uppercase tracking-wider mb-1.5">Destination Target URL</label>
                      <input
                        type="text"
                        required
                        placeholder="/courses/waec-mathematics-complete-series"
                        value={newShortLink.targetUrl}
                        onChange={e => setNewShortLink({ ...newShortLink, targetUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-100 uppercase tracking-wider mb-1.5">Campaign Tag / Platform</label>
                      <select
                        value={newShortLink.campaign}
                        onChange={e => setNewShortLink({ ...newShortLink, campaign: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-400"
                      >
                        <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                        <option value="Facebook Ad">Facebook Ad</option>
                        <option value="Instagram Bio">Instagram Bio</option>
                        <option value="Email Newsletter">Email Newsletter</option>
                        <option value="Flyer QR Code">Flyer QR Code</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      Generate Shortlink
                    </button>
                  </form>
                </div>

                {/* Shortlinks Table */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center justify-between">
                    <span>Active Campaign Shortlinks</span>
                    <span className="text-xs text-slate-400">{shortLinks.length} active links</span>
                  </h3>

                  <div className="space-y-3">
                    {shortLinks.map(link => (
                      <div
                        key={link.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-amber-400 text-base">
                              /s/{link.code}
                            </span>
                            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              {link.campaign}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            Target: {link.targetUrl}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-extrabold text-emerald-400">{link.clicks}</div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Clicks</span>
                          </div>

                          <button
                            onClick={() => copyShortlinkToClipboard(link.code)}
                            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            {copiedCode === link.code ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" /> Edit Course Details
              </h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingCourse.subtitle || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Subject / Program</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={editingCourse.category}
                    onChange={e => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Primary">Primary</option>
                    <option value="JSCE">JSCE / BECE</option>
                    <option value="WAEC">WAEC</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="JAMB">JAMB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Discount Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingCourse.discountPercent ?? 0}
                  onChange={e => setEditingCourse({ ...editingCourse, discountPercent: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Course price is calculated dynamically from video lessons.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Course Thumbnail Picture</label>
                <div className="space-y-2">
                  <label className="flex items-center justify-center gap-2 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-3 text-center cursor-pointer transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0], true)
                        }
                      }}
                    />
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400">
                      {uploadingImage ? 'Uploading Image...' : 'Click to Upload New Image File'}
                    </span>
                  </label>

                  {editingCourse.thumbnailUrl && (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={editingCourse.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 text-[10px] bg-slate-900/80 text-emerald-400 px-2 py-0.5 rounded font-bold">Preview Ready</span>
                    </div>
                  )}

                  <input
                    type="text"
                    value={editingCourse.thumbnailUrl || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, thumbnailUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                    placeholder="Or paste image URL..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse.isPublished}
                    onChange={e => setEditingCourse({ ...editingCourse, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="font-bold text-slate-200">Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse.featured}
                    onChange={e => setEditingCourse({ ...editingCourse, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="font-bold text-amber-400">Featured Course</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Course Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODULE MODAL */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" /> Edit Module
              </h3>
              <button onClick={() => setEditingModule(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateModule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={editingModule.title}
                  onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={editingModule.description || ''}
                  onChange={e => setEditingModule({ ...editingModule, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Module Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VIDEO LESSON MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" /> Edit Video Lesson Details & Price
              </h3>
              <button onClick={() => setEditingVideo(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateVideo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Lesson Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={editingVideo.price || 2000}
                    onChange={e => setEditingVideo({ ...editingVideo, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={editingVideo.durationSeconds}
                    onChange={e => setEditingVideo({ ...editingVideo, durationSeconds: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Full Video Stream URL</label>
                <input
                  type="text"
                  required
                  value={editingVideo.videoUrl}
                  onChange={e => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Dedicated Snippet URL (Optional)</label>
                <input
                  type="text"
                  value={editingVideo.snippetUrl || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, snippetUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVideo.isSnippet}
                    onChange={e => setEditingVideo({ ...editingVideo, isSnippet: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="font-bold text-amber-400">Enable 50s Teaser Preview</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Lesson Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
