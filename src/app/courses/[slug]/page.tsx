'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import UniversalVideoPlayer from '../../components/UniversalVideoPlayer'
import PaystackCheckoutModal from '../../components/PaystackCheckoutModal'
import { useParams } from 'next/navigation'
import {
  Play,
  Lock,
  Unlock,
  CheckCircle,
  Tag,
  Clock,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  Video,
  ShieldCheck,
  Zap,
  CreditCard
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

interface CourseDetail {
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
  isEnrolled?: boolean
}

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({})
  const [enrolledFullCourse, setEnrolledFullCourse] = useState(false)
  const [unlockedVideoIds, setUnlockedVideoIds] = useState<string[]>([])
  const [copiedLink, setCopiedLink] = useState(false)

  // Paystack Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutVideoTarget, setCheckoutVideoTarget] = useState<VideoItem | null>(null)

  useEffect(() => {
    if (slug) {
      fetchCourseDetail()
    }
  }, [slug])

  const fetchCourseDetail = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/courses/${slug}?userId=parent-demo-user`)
      const data = await res.json()
      if (data.success && data.course) {
        setCourse(data.course)
        setEnrolledFullCourse(data.course.isEnrolled || false)

        if (data.course.modules && data.course.modules.length > 0) {
          // Open first module
          setOpenModules({ [data.course.modules[0].id]: true })
          
          // Auto set active video to first snippet
          const firstSnippet = data.course.modules
            .flatMap((m: ModuleItem) => m.videos)
            .find((v: VideoItem) => v.isSnippet || v.snippetUrl)
          if (firstSnippet) {
            setActiveVideo(firstSnippet)
          } else if (data.course.modules[0].videos.length > 0) {
            setActiveVideo(data.course.modules[0].videos[0])
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch course detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = (id: string) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
  }

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const handleCheckoutSuccess = (type: 'lesson' | 'course', id: string) => {
    if (type === 'course') {
      setEnrolledFullCourse(true)
    } else {
      setUnlockedVideoIds(prev => [...prev, id])
    }
    fetchCourseDetail()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading course curriculum...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="text-slate-400 mt-2">The course you are looking for does not exist.</p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Video Courses
          </Link>
        </div>
      </div>
    )
  }

  const totalVideos = course.modules.reduce((acc: number, m: ModuleItem) => acc + m.videos.length, 0)
  const discountPercent = course.discountPrice && course.discountPrice < course.price
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      <Navbar />

      {/* Navigation Sticky Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>All Courses Catalog</span>
          </Link>

          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Course'}</span>
          </button>
        </div>
      </div>

      {/* Main Course Header Hero */}
      <div className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Course Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                {course.category}
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-md">
                {course.level} Level
              </span>
              {discountPercent && (
                <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-md flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> SAVE {discountPercent}% ON FULL BUNDLE
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-lg text-slate-300 leading-relaxed font-normal">
                {course.subtitle}
              </p>
            )}

            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{course.modules.length} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>{totalVideos} Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Lifetime Stream Access</span>
              </div>
            </div>
          </div>

          {/* Right Pricing Card (Dual-Tier Pricing) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-1">Dual Monetization Options</span>
              <h3 className="text-lg font-bold text-white">Unlock Single Lessons or Full Bundle</h3>
            </div>

            {/* Pricing Tiers Comparison */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Single Lesson Unlock</span>
                  <span className="text-[11px] text-slate-400">Pay only for the topic you need</span>
                </div>
                <span className="text-base font-black text-amber-400">₦2,000</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> Full Course Package
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold">Unlocks ALL {totalVideos} Video Lessons</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400">
                    {formatNaira(course.discountPrice || course.price)}
                  </span>
                  {discountPercent && (
                    <span className="block text-[10px] text-slate-500 line-through">
                      {formatNaira(course.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            {enrolledFullCourse ? (
              <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-white text-base">Full Course Unlocked!</h4>
                <p className="text-xs text-emerald-300 mt-1">All {totalVideos} video lessons are available below.</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCheckoutVideoTarget(null)
                  setIsCheckoutOpen(true)
                }}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>Unlock Full Course ({formatNaira(course.discountPrice || course.price)})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Syllabus Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Universal Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {activeVideo ? (
              <UniversalVideoPlayer
                videoUrl={activeVideo.videoUrl || activeVideo.snippetUrl || ''}
                title={activeVideo.title}
                isSnippet={activeVideo.isSnippet}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl aspect-video flex flex-col items-center justify-center p-8 text-center">
                <Play className="w-16 h-16 text-indigo-500 opacity-60 mb-4" />
                <h3 className="text-xl font-bold text-white">Select a Lesson Video to Stream</h3>
                <p className="text-sm text-slate-400 max-w-md mt-2">
                  Click any free teaser snippet or lesson from the syllabus on the right to start watching.
                </p>
              </div>
            )}
          </div>

          {/* Syllabus Accordion & Lesson Unlock Buttons */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Syllabus & Video Lessons</span>
              </span>
            </h3>

            <div className="space-y-3">
              {course.modules.map((module, mIdx) => {
                const isOpen = openModules[module.id] ?? true

                return (
                  <div
                    key={module.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                  >
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 text-left bg-slate-900/90 hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-semibold text-indigo-400 block uppercase">
                          Module {mIdx + 1}
                        </span>
                        <span className="font-bold text-white text-base">{module.title}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Lesson Items */}
                    {isOpen && (
                      <div className="divide-y divide-slate-800/60 border-t border-slate-800/60">
                        {module.videos.map((video, vIdx) => {
                          const isUnlocked = enrolledFullCourse || video.isSnippet || unlockedVideoIds.includes(video.id)
                          const isActive = activeVideo?.id === video.id

                          return (
                            <div
                              key={video.id}
                              className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                                isActive ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                              }`}
                            >
                              <div
                                onClick={() => {
                                  if (isUnlocked) setActiveVideo(video)
                                }}
                                className={`flex items-center gap-3 flex-1 ${isUnlocked ? 'cursor-pointer' : ''}`}
                              >
                                {isUnlocked ? (
                                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                                    <Play className="w-4 h-4 fill-current" />
                                  </div>
                                ) : (
                                  <div className="p-2 rounded-lg bg-slate-800 text-slate-500 shrink-0">
                                    <Lock className="w-4 h-4" />
                                  </div>
                                )}

                                <div>
                                  <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                    <span>{vIdx + 1}. {video.title}</span>
                                    {video.isSnippet && (
                                      <span className="bg-amber-400/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                        FREE PREVIEW
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-500 block mt-0.5">
                                    {Math.round(video.durationSeconds / 60)} mins
                                  </span>
                                </div>
                              </div>

                              <div>
                                {isUnlocked ? (
                                  <button
                                    onClick={() => setActiveVideo(video)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition-colors"
                                  >
                                    Watch
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setCheckoutVideoTarget(video)
                                      setIsCheckoutOpen(true)
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                                  >
                                    <Unlock className="w-3 h-3" />
                                    <span>Unlock ₦2,000</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Checkout Modal */}
      <PaystackCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        courseTitle={course.title}
        courseId={course.id}
        videoId={checkoutVideoTarget?.id}
        videoTitle={checkoutVideoTarget?.title}
        lessonPrice={2000}
        fullCoursePrice={course.price}
        discountPrice={course.discountPrice}
        onSuccess={handleCheckoutSuccess}
      />

      <Footer />
    </div>
  )
}
