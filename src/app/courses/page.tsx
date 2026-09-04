'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Play,
  Lock,
  Tag,
  Clock,
  BookOpen,
  CheckCircle,
  Video,
  Sparkles,
  Share2,
  Copy,
  ChevronRight,
  X,
  Filter,
  DollarSign,
  Award
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')

  // Snippet Modal state
  const [activeSnippet, setActiveSnippet] = useState<{
    videoTitle: string
    videoUrl: string
    courseTitle: string
    courseSlug: string
    discountPrice?: number | null
    price: number
  } | null>(null)

  // Quick Purchase Modal State
  const [buyingCourse, setBuyingCourse] = useState<CourseItem | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  // Fallback sample courses if DB is empty or loading initial seed
  const sampleCourses: CourseItem[] = [
    {
      id: 'c-waec-math-series',
      slug: 'waec-mathematics-complete-series',
      title: 'WAEC & WASSCE Mathematics Complete Masterclass',
      subtitle: 'Comprehensive recorded video series covering Algebra, Trigonometry, Geometry & Past Questions.',
      description: 'Master WAEC Mathematics with step-by-step video solutions, past question breakdowns, and exam techniques taught by Mark Okafor.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
      level: 'WAEC',
      category: 'Mathematics',
      price: 25000,
      discountPrice: 17500,
      isPublished: true,
      featured: true,
      modules: [
        {
          id: 'm1',
          title: 'Module 1: Quadratic Equations & Matrices',
          videos: [
            {
              id: 'v1',
              title: 'Teaser: Solving Quadratic Equations in 3 Seconds',
              description: 'Watch this free sample snippet showing quick trick methods for WAEC quadratic questions.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              snippetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              durationSeconds: 180,
              isSnippet: true
            },
            {
              id: 'v2',
              title: 'Lesson 1.2: Matrix Determinants & Inverses',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              durationSeconds: 1200,
              isSnippet: false
            }
          ]
        },
        {
          id: 'm2',
          title: 'Module 2: Trigonometry & Bearings',
          videos: [
            {
              id: 'v3',
              title: 'Teaser: 3D Bearings & Elevation Explained',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              snippetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              durationSeconds: 240,
              isSnippet: true
            }
          ]
        }
      ]
    },
    {
      id: 'c-igcse-physics-series',
      slug: 'igcse-physics-recorded-series',
      title: 'IGCSE & O-Level Physics Video Series',
      subtitle: 'Complete recorded video lectures for Mechanics, Waves, Electricity & Thermal Physics.',
      description: 'Clear visual demonstrations and mathematical derivations formatted for Cambridge IGCSE exam excellence.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
      level: 'IGCSE',
      category: 'Sciences',
      price: 30000,
      discountPrice: 19900,
      isPublished: true,
      featured: true,
      modules: [
        {
          id: 'm-phys-1',
          title: 'Module 1: Force, Motion & Energy',
          videos: [
            {
              id: 'v-phys-snippet',
              title: 'Teaser: Newton\'s Laws & Vector Calculations',
              description: 'Watch a 2-minute free preview snippet on resolving forces.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              snippetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              durationSeconds: 150,
              isSnippet: true
            }
          ]
        }
      ]
    },
    {
      id: 'c-primary-math-foundation',
      slug: 'primary-mathematics-foundation',
      title: 'Primary & Loyola Common Entrance Math Series',
      subtitle: 'Fun, engaging video lessons to build early mathematical confidence for entrance exams.',
      description: 'Covers fractions, percentages, quantitative reasoning, and word problems step-by-step.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      level: 'Primary',
      category: 'Mathematics',
      price: 18000,
      discountPrice: 12500,
      isPublished: true,
      featured: false,
      modules: [
        {
          id: 'm-prim-1',
          title: 'Module 1: Quantitative Reasoning Fast-Track',
          videos: [
            {
              id: 'v-prim-snippet',
              title: 'Teaser: Crack Common Entrance Pattern Puzzles',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4',
              snippetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4',
              durationSeconds: 120,
              isSnippet: true
            }
          ]
        }
      ]
    }
  ]

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/courses')
      const data = await res.json()
      if (data.success && data.courses && data.courses.length > 0) {
        setCourses(data.courses)
      } else {
        setCourses(sampleCourses)
      }
    } catch (err) {
      console.error('Failed to load courses from API, fallback to sample data:', err)
      setCourses(sampleCourses)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel
    return matchesCategory && matchesLevel
  })

  // Format currency
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
  }

  // Calculate discount percentage
  const getDiscountPercent = (price: number, discountPrice?: number | null) => {
    if (!discountPrice || discountPrice >= price) return null
    const diff = price - discountPrice
    return Math.round((diff / price) * 100)
  }

  // Handle Mock Purchase
  const handlePurchaseSubmit = async () => {
    if (!buyingCourse) return
    try {
      setPurchasing(true)
      const res = await fetch('/api/payments/checkout-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: buyingCourse.id,
          userId: 'parent-demo-user',
          userEmail: 'client@mokafor.com',
          amount: buyingCourse.discountPrice || buyingCourse.price
        })
      })
      const data = await res.json()
      if (data.success) {
        setPurchaseSuccess(true)
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Navbar />

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-indigo-800/50 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 mb-6 text-indigo-300 text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mokafor Video Masterclasses & Recorded Series</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Learn at Your Own Pace with <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">Recorded Video Courses</span>
          </h1>
          <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Gain instant access to top-rated recorded video series, complete with past question drills, step-by-step derivations, and free teaser snippets to preview before buying.
          </p>

          {/* Guarantee Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-200/90 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Lifetime Video Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400" />
              <span>Free Teaser Snippets Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Expert Teacher Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" /> Subject:
            </span>
            {['All', 'Mathematics', 'Sciences', 'Exam Mastery'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 mr-2">
              Level:
            </span>
            {['All', 'Primary', 'JSCE', 'WAEC', 'IGCSE', 'JAMB'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedLevel === lvl
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-400">Loading video courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No courses found</h3>
            <p className="text-slate-500 text-sm mt-1">Try selecting a different filter category or level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => {
              const discountPercent = getDiscountPercent(course.price, course.discountPrice)
              const totalVideos = course.modules.reduce((acc: number, m: ModuleItem) => acc + m.videos.length, 0)
              const snippetVideo = course.modules
                .flatMap(m => m.videos)
                .find(v => v.isSnippet || v.snippetUrl)

              return (
                <div
                  key={course.id}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col group"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video bg-slate-800 overflow-hidden">
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                    {/* Level & Category Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-700/60">
                        {course.level}
                      </span>
                      <span className="bg-indigo-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-md">
                        {course.category}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {discountPercent && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 animate-pulse">
                        <Tag className="w-3.5 h-3.5" />
                        <span>SAVE {discountPercent}%</span>
                      </div>
                    )}

                    {/* Free Snippet Teaser Button Overlay */}
                    {snippetVideo && (
                      <button
                        onClick={() =>
                          setActiveSnippet({
                            videoTitle: snippetVideo.title,
                            videoUrl: snippetVideo.snippetUrl || snippetVideo.videoUrl,
                            courseTitle: course.title,
                            courseSlug: course.slug,
                            discountPrice: course.discountPrice,
                            price: course.price
                          })
                        }
                        className="absolute inset-0 m-auto w-14 h-14 bg-amber-500/90 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform cursor-pointer"
                        title="Watch Free Teaser Snippet"
                      >
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </button>
                    )}

                    {snippetVideo && (
                      <div className="absolute bottom-3 left-3 bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Free Snippet Preview Available</span>
                      </div>
                    )}
                  </div>

                  {/* Course Details Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      {course.subtitle && (
                        <p className="mt-2 text-slate-400 text-sm line-clamp-2 leading-relaxed">
                          {course.subtitle}
                        </p>
                      )}

                      {/* Course Stats */}
                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                          {course.modules.length} Modules / Series
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-emerald-400" />
                          {totalVideos} Video Lessons
                        </span>
                      </div>
                    </div>

                    {/* Pricing & CTA Section */}
                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                      {/* Pricing Display */}
                      <div>
                        {course.discountPrice ? (
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-amber-400">
                                {formatNaira(course.discountPrice)}
                              </span>
                              <span className="text-sm font-semibold text-slate-500 line-through">
                                {formatNaira(course.price)}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                              Special Discount Price
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-2xl font-black text-white">
                              {formatNaira(course.price)}
                            </span>
                            <span className="block text-[10px] text-slate-400">One-time payment</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {snippetVideo && (
                          <button
                            onClick={() =>
                              setActiveSnippet({
                                videoTitle: snippetVideo.title,
                                videoUrl: snippetVideo.snippetUrl || snippetVideo.videoUrl,
                                courseTitle: course.title,
                                courseSlug: course.slug,
                                discountPrice: course.discountPrice,
                                price: course.price
                              })
                            }
                            className="p-2.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors"
                            title="Watch Free Sample Snippet"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                        )}
                        <Link
                          href={`/courses/${course.slug}`}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1"
                        >
                          <span>View Course</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Free Teaser Snippet Modal */}
      {activeSnippet && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md mb-1 border border-amber-400/20">
                  <Sparkles className="w-3.5 h-3.5" /> Free Preview Snippet
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {activeSnippet.videoTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">From course: {activeSnippet.courseTitle}</p>
              </div>
              <button
                onClick={() => setActiveSnippet(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black relative">
              <video
                src={activeSnippet.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              ></video>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-6 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">Like what you see in this snippet?</div>
                  <div className="text-xs text-slate-400">Unlock full series & all recorded lessons.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-right hidden sm:block">
                  <div className="text-lg font-black text-amber-400">
                    {formatNaira(activeSnippet.discountPrice || activeSnippet.price)}
                  </div>
                  {activeSnippet.discountPrice && (
                    <div className="text-xs text-slate-500 line-through">
                      {formatNaira(activeSnippet.price)}
                    </div>
                  )}
                </div>
                <Link
                  href={`/courses/${activeSnippet.courseSlug}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-2"
                >
                  <span>Enroll & Unlock Full Course</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
