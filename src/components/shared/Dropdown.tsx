'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

type DropdownProps = {
  children: ReactNode
  title: string
  className?: string
}

export function Dropdown({ children, title, className = '' }: DropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  return (
    <div
      className={`group relative ${className}`}
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <button
        className="flex items-center text-slate-700 hover:text-blue-600 transition-colors font-medium text-base px-4 py-2 rounded-lg relative group"
        aria-expanded={dropdownOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
        <span
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200 ${
            dropdownOpen ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </button>

      {/* Dropdown menu - no gap between button and menu */}
      {dropdownOpen && (
        <ul className="absolute top-full left-0 pt-2 w-64 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-2">
            {children}
          </div>
        </ul>
      )}
    </div>
  )
}
