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
  BookOpen
} from 'lucide-react'

interface VideoItem {
  id: string
  title: string
  description?: string
  videoUrl: string
  snippetUrl?: string
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

  // Form states
  const [newCourse, setNewCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnailUrl: '',
    level: 'WAEC',
    category: 'Mathematics',
    price: '20000',
    discountPrice: '14000',
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
    durationMinutes: '15',
    isSnippet: true
  })

  const [newShortLink, setNewShortLink] = useState({
    code: '',
    courseId: '',
    targetUrl: '/courses',
    campaign: 'WhatsApp Broadcast'
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

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
        if (coursesData.courses.length > 0) {
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
          price: '20000',
          discountPrice: '14000',
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
          snippetUrl: newVideo.snippetUrl || newVideo.videoUrl,
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Video className="w-4 h-4" /> Admin Operations Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Video Courses & Shortlink Marketing Manager
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage recorded video series, set regular and discount prices, upload teaser snippets, and track ad campaign shortlink clicks.
            </p>
          </div>

          <Link
            href="/courses"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
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
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subject</label>
                    <select
                      value={newCourse.category}
                      onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Exam Mastery">Exam Mastery</option>
                    </select>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Regular Price (₦)</label>
                    <input
                      type="number"
                      required
                      placeholder="25000"
                      value={newCourse.price}
                      onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Discount Price (₦)</label>
                    <input
                      type="number"
                      placeholder="17500"
                      value={newCourse.discountPrice}
                      onChange={e => setNewCourse({ ...newCourse, discountPrice: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Course Thumbnail Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newCourse.thumbnailUrl}
                    onChange={e => setNewCourse({ ...newCourse, thumbnailUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
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
                {courses.map(c => {
                  const totalVids = c.modules.reduce((acc: number, m: ModuleItem) => acc + m.videos.length, 0)

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

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                        <div className="text-right">
                          <div className="text-lg font-black text-amber-400">
                            {formatNaira(c.discountPrice || c.price)}
                          </div>
                          {c.discountPrice && (
                            <div className="text-xs text-slate-500 line-through">
                              {formatNaira(c.price)}
                            </div>
                          )}
                        </div>

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
                <Video className="w-5 h-5 text-amber-400" /> Step 2: Add Video Lesson & Teaser Snippet
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
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Free Teaser Snippet Video URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty to use main video as snippet..."
                    value={newVideo.snippetUrl}
                    onChange={e => setNewVideo({ ...newVideo, snippetUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-amber-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={newVideo.durationMinutes}
                      onChange={e => setNewVideo({ ...newVideo, durationMinutes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newVideo.isSnippet}
                        onChange={e => setNewVideo({ ...newVideo, isSnippet: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
                      />
                      <span className="text-xs font-bold text-amber-400">Allow Free Teaser Preview</span>
                    </label>
                  </div>
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
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Custom Short Code / Alias</label>
                    <div className="flex items-center">
                      <span className="bg-slate-950 border border-r-0 border-slate-800 text-slate-400 text-xs px-3 py-2.5 rounded-l-xl">
                        mokafor.com/s/
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. waec2026"
                        value={newShortLink.code}
                        onChange={e => setNewShortLink({ ...newShortLink, code: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-r-xl px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Destination Target URL</label>
                    <input
                      type="text"
                      required
                      placeholder="/courses/waec-mathematics-complete-series"
                      value={newShortLink.targetUrl}
                      onChange={e => setNewShortLink({ ...newShortLink, targetUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Campaign Tag / Platform</label>
                    <select
                      value={newShortLink.campaign}
                      onChange={e => setNewShortLink({ ...newShortLink, campaign: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
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
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
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
    </div>
  )
}
