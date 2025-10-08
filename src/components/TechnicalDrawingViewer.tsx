'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface TechnicalDrawingViewerProps {
  imageUrl: string
  connectorModel: string
  description?: string
}

export function TechnicalDrawingViewer({ imageUrl, connectorModel, description }: TechnicalDrawingViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Drawing Preview - Clickable */}
      <button
        onClick={() => setIsOpen(true)}
        className="block group w-full"
      >
        <div className="bg-white rounded-xl overflow-hidden border-2 border-slate-200 hover:border-green-400 transition-all duration-300">
          <div className="relative bg-white p-4">
            <img
              src={imageUrl}
              alt={`Technical Drawing - ${connectorModel}`}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-full">
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Full Size
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Full Screen Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[90vw] h-[95vh] p-0 overflow-hidden" showCloseButton={false}>
          <div className="relative bg-black w-full h-full">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Technical Drawing - Full size container */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pb-32">
              <img
                src={imageUrl}
                alt={`Technical Drawing - ${connectorModel}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Drawing Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <DialogTitle className="text-white text-xl mb-1">
                Technical Drawing
              </DialogTitle>
              <p className="text-gray-300 text-sm">
                {connectorModel}
              </p>
              {description && (
                <p className="text-gray-400 text-xs mt-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
