'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Video, Lock, AlertCircle, RefreshCw } from 'lucide-react'

interface UniversalVideoPlayerProps {
  videoUrl: string
  title: string
  isSnippet?: boolean
  snippetUrl?: string | null
  posterUrl?: string
  autoPlay?: boolean
  lessonPrice?: number
  onUnlockClick?: () => void
}

export default function UniversalVideoPlayer({
  videoUrl,
  title,
  isSnippet = false,
  snippetUrl,
  posterUrl,
  autoPlay = false,
  lessonPrice = 2000,
  onUnlockClick
}: UniversalVideoPlayerProps) {
  const [previewEnded, setPreviewEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Use dedicated snippet URL if available; otherwise use main videoUrl with 50s cutoff
  const activeVideoSource = isSnippet && snippetUrl ? snippetUrl : videoUrl
  const isCapped50s = isSnippet && !snippetUrl

  if (!videoUrl && !snippetUrl) {
    return (
      <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 opacity-60 mb-2" />
        <h4 className="text-base font-bold text-white">Video Source Unavailable</h4>
        <p className="text-xs text-slate-400 mt-1">Please select another lesson video from the course syllabus.</p>
      </div>
    )
  }

  // Parse YouTube URLs to embed URL with end=50 for capped snippet mode
  const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
      let embed = ''
      if (url.includes('youtube.com/embed/')) {
        embed = url
      } else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1])
        const videoId = urlParams.get('v')
        if (videoId) embed = `https://www.youtube.com/embed/${videoId}`
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) embed = `https://www.youtube.com/embed/${videoId}`
      }

      if (embed) {
        const params = new URLSearchParams()
        params.set('autoplay', autoPlay ? '1' : '0')
        params.set('rel', '0')
        if (isCapped50s) {
          params.set('start', '0')
          params.set('end', '50')
        }
        return `${embed}?${params.toString()}`
      }
    } catch (e) {
      console.error('Error parsing YouTube URL:', e)
    }
    return null
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(activeVideoSource)

  // Default fallback sample video if URL is non-http test string
  const effectiveVideoUrl = activeVideoSource.startsWith('http')
    ? activeVideoSource
    : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (isCapped50s && e.currentTarget.currentTime >= 50) {
      e.currentTarget.pause()
      setPreviewEnded(true)
    }
  }

  const handleReplayPreview = () => {
    setPreviewEnded(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group">
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        {isSnippet ? (
          <span className="bg-amber-500/90 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> FREE 50s PREVIEW TEASER
          </span>
        ) : (
          <span className="bg-indigo-600/90 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg backdrop-blur-md flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" /> FULL HD LESSON
          </span>
        )}
      </div>

      {/* Video Content Container */}
      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
        {previewEnded ? (
          /* Glassmorphic 50s Cutoff Overlay */
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="p-3.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-3 animate-bounce">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-white">50-Second Preview Ended</h4>
            <p className="text-xs text-slate-300 max-w-sm mt-1 mb-5">
              Enjoying this topic? Unlock the complete video lesson and full HD series to keep watching!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {onUnlockClick && (
                <button
                  onClick={onUnlockClick}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock Lesson (₦{lessonPrice.toLocaleString()})</span>
                </button>
              )}
              <button
                onClick={handleReplayPreview}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replay 50s Preview
              </button>
            </div>
          </div>
        ) : youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            src={effectiveVideoUrl}
            controls
            autoPlay={autoPlay}
            poster={posterUrl}
            onTimeUpdate={handleTimeUpdate}
            controlsList="nodownload"
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video playback.
          </video>
        )}
      </div>

      {/* Footer Title Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between">
        <h4 className="text-sm font-bold text-white line-clamp-1">{title}</h4>
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 ml-2">Mokafor Universal Player</span>
      </div>
    </div>
  )
}
