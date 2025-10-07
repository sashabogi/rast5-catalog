'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Terminal {
  spec_number: string
  terminal_type: string
  image_url: string | null
}

interface TerminalGalleryProps {
  terminals: Terminal[]
}

export function TerminalGallery({ terminals }: TerminalGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? terminals.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === terminals.length - 1 ? 0 : prev + 1))
  }

  const currentTerminal = terminals[currentIndex]

  return (
    <>
      {/* Terminal Cards */}
      <div className="space-y-3">
        {terminals.map((terminal, index) => (
          <button
            key={terminal.spec_number}
            onClick={() => openModal(index)}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group w-full text-left"
          >
            {terminal.image_url && (
              <div className="w-16 h-16 bg-white rounded border border-gray-200 p-2 group-hover:border-blue-300 transition-colors">
                <img
                  src={terminal.image_url}
                  alt={terminal.spec_number}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-grow">
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {terminal.spec_number}
              </p>
              <p className="text-sm text-gray-600">{terminal.terminal_type}</p>
            </div>
            <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative bg-black">
            {/* Close button is handled by DialogContent */}

            {/* Image */}
            <div className="flex items-center justify-center min-h-[400px] max-h-[80vh] p-8">
              {currentTerminal?.image_url && (
                <img
                  src={currentTerminal.image_url}
                  alt={currentTerminal.spec_number}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            {terminals.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Terminal Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <DialogTitle className="text-white text-xl mb-1">
                {currentTerminal?.spec_number}
              </DialogTitle>
              <p className="text-gray-300 text-sm">
                {currentTerminal?.terminal_type}
              </p>
              {terminals.length > 1 && (
                <p className="text-gray-400 text-xs mt-2">
                  {currentIndex + 1} / {terminals.length}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
