declare module 'videojs-vr' {
  import type videojs from 'video.js'

  interface VROptions {
    projection?: string
    debug?: boolean
    forceCardboard?: boolean
  }

  interface VRPlugin {
    (options?: VROptions): void
  }

  const vr: VRPlugin
  export default vr
}

declare module 'video.js' {
  interface VideoJsPlayer {
    vr(options?: {
      projection?: string
      debug?: boolean
      forceCardboard?: boolean
    }): void
  }
}
