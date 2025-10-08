'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-sine',
      once: true,
      offset: 50,
      disable: 'phone', // Disable on mobile for performance
    })
  }, [])

  return null
}
