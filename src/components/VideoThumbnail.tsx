'use client'

import { useRef, useEffect } from 'react'

interface VideoThumbnailProps {
  videoUrl: string
  time?: number
  className?: string
}

export function VideoThumbnail({
  videoUrl,
  time = 0,
  className = ''
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }, [time])

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={`w-full h-full object-cover ${className}`}
      muted
      playsInline
    />
  )
}
