'use client'

import { useEffect, useRef } from 'react'
import 'video.js/dist/video-js.css'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const videojs = require('video.js').default || require('video.js')

interface Video360PlayerProps {
  videoUrl: string
  autoRotate?: boolean
  showControls?: boolean
  className?: string
}

export function Video360Player({
  videoUrl,
  autoRotate = false,
  showControls = true,
  className = ''
}: Video360PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current

      // Initialize Video.js player
      const player = videojs(videoElement, {
        controls: showControls,
        autoplay: 'muted', // Autoplay muted to show video immediately
        preload: 'auto',
        fluid: true,
        responsive: true,
        loop: true,
        muted: true
      })

      playerRef.current = player

      // Play the video
      player.ready(() => {
        player.play().catch(() => {
          // Autoplay failed, that's ok
        })
      })
    }
  }, [showControls, autoRotate])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
          muted
          loop
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded pointer-events-none z-10">
          360° Product Video
        </div>
      )}
    </div>
  )
}
