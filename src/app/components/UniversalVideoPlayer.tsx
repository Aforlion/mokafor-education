'use client'

import React from 'react'
import { Sparkles, Video, Play, AlertCircle } from 'lucide-react'

interface UniversalVideoPlayerProps {
  videoUrl: string
  title: string
  isSnippet?: boolean
  posterUrl?: string
  autoPlay?: boolean
}

export default function UniversalVideoPlayer({
  videoUrl,
  title,
  isSnippet = false,
  posterUrl,
  autoPlay = true
}: UniversalVideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 opacity-60 mb-2" />
        <h4 className="text-base font-bold text-white">Video Source Unavailable</h4>
        <p className="text-xs text-slate-400 mt-1">Please select another lesson video from the course syllabus.</p>
      </div>
    )
  }

  // Parse YouTube URLs to embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
      if (url.includes('youtube.com/embed/')) {
        return url
      }
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1])
        const videoId = urlParams.get('v')
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`
      }
    } catch (e) {
      console.error('Error parsing YouTube URL:', e)
    }
    return null
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl)

  // Default fallback sample video if URL is generic test string
  const effectiveVideoUrl = videoUrl.startsWith('http')
    ? videoUrl
    : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group">
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        {isSnippet ? (
          <span className="bg-amber-500/90 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> FREE TEASER SNIPPET
          </span>
        ) : (
          <span className="bg-indigo-600/90 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg backdrop-blur-md flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" /> FULL HD LESSON
          </span>
        )}
      </div>

      {/* Video Content */}
      <div className="aspect-video bg-black relative flex items-center justify-center">
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        ) : (
          <video
            src={effectiveVideoUrl}
            controls
            autoPlay={autoPlay}
            poster={posterUrl}
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
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 ml-2">Mokafor Video Player</span>
      </div>
    </div>
  )
}
