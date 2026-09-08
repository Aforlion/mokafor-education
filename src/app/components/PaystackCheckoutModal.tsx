'use client'

import React, { useState } from 'react'
import {
  X,
  Lock,
  Unlock,
  CheckCircle,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen
} from 'lucide-react'

interface PaystackCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle: string
  courseId: string
  videoId?: string
  videoTitle?: string
  lessonPrice?: number
  fullCoursePrice: number
  discountPrice?: number | null
  onSuccess: (type: 'lesson' | 'course', id: string) => void
}

export default function PaystackCheckoutModal({
  isOpen,
  onClose,
  courseTitle,
  courseId,
  videoId,
  videoTitle,
  lessonPrice = 2000,
  fullCoursePrice,
  discountPrice,
  onSuccess
}: PaystackCheckoutModalProps) {
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedTier, setSelectedTier] = useState<'lesson' | 'course'>(videoId ? 'lesson' : 'course')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const effectiveCoursePrice = discountPrice && discountPrice < fullCoursePrice ? discountPrice : fullCoursePrice
  const activeAmount = selectedTier === 'lesson' ? lessonPrice : effectiveCoursePrice

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
  }

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !parentName) {
      setErrorMsg('Please enter your name and valid email address.')
      return
    }

    try {
      setSubmitting(true)
      setErrorMsg(null)

      // 1. Initialize Paystack Transaction via API
      const planTitle = selectedTier === 'lesson'
        ? `Lesson Unlock: ${videoTitle || 'Video Lesson'} (${courseTitle})`
        : `Full Course Bundle: ${courseTitle}`

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parentName,
          email,
          amount: activeAmount,
          plan: planTitle,
          studentName: parentName,
          grade: 'General'
        })
      })

      const data = await res.json()

      if (data.success && data.paystackUrl) {
        // Record database enrollment
        await fetch('/api/payments/checkout-course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            videoId: selectedTier === 'lesson' ? videoId : undefined,
            userId: email.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            userEmail: email,
            paystackReference: data.reference,
            amount: activeAmount
          })
        }).catch(err => console.error('Enrollment notice:', err))

        // Open Paystack Payment Page
        window.open(data.paystackUrl, '_blank')

        // Trigger success callback locally
        onSuccess(selectedTier, selectedTier === 'lesson' ? (videoId || '') : courseId)
        onClose()
      } else {
        // Fallback checkout if Paystack API fails or is testing
        const checkoutRes = await fetch('/api/payments/checkout-course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            videoId: selectedTier === 'lesson' ? videoId : undefined,
            userId: email.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            userEmail: email,
            amount: activeAmount
          })
        })
        const checkoutData = await checkoutRes.json()
        if (checkoutData.success) {
          onSuccess(selectedTier, selectedTier === 'lesson' ? (videoId || '') : courseId)
          onClose()
        } else {
          setErrorMsg(checkoutData.error || 'Unable to process checkout. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMsg('Failed to connect to payment gateway. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Paystack Secure Checkout</h3>
              <p className="text-xs text-slate-400">Instant Access & Automatic Unlock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePaystackCheckout} className="p-6 space-y-6">
          {/* User Details */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">1. Your Contact Details</label>
            <input
              type="text"
              required
              placeholder="Parent / Student Full Name"
              value={parentName}
              onChange={e => setParentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <input
              type="email"
              required
              placeholder="Email Address (for receipt & access)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Tier Selection Radio Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">2. Select Access Tier</label>

            {/* Option A: Single Lesson */}
            {videoId && (
              <div
                onClick={() => setSelectedTier('lesson')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedTier === 'lesson'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Unlock Single Lesson Only</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{videoTitle || 'This video lesson'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-amber-400">{formatNaira(lessonPrice)}</span>
                  <span className="block text-[10px] text-slate-500">Single Lesson</span>
                </div>
              </div>
            )}

            {/* Option B: Full Course Bundle */}
            <div
              onClick={() => setSelectedTier('course')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedTier === 'course'
                  ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Unlock Full Course Bundle</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30">
                    BEST VALUE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Unlocks ALL modules & video lessons in {courseTitle}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-black text-emerald-400">{formatNaira(effectiveCoursePrice)}</span>
                {discountPrice && (
                  <span className="block text-[10px] text-slate-500 line-through">{formatNaira(fullCoursePrice)}</span>
                )}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Initializing Paystack...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Pay {formatNaira(activeAmount)} with Paystack</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Secured by Paystack 256-bit SSL Payment Gateway</span>
          </p>
        </form>
      </div>
    </div>
  )
}
