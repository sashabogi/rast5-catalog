import { AlertCircle } from 'lucide-react'

interface SpecialNotesProps {
  notes: string
  specialNoteTitle: string
}

export function SpecialNotes({ notes, specialNoteTitle }: SpecialNotesProps) {
  return (
    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl" data-aos="fade-up" data-aos-delay="200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-amber-900 text-sm mb-1">{specialNoteTitle}</p>
          <p className="text-sm text-amber-800 leading-relaxed">{notes}</p>
        </div>
      </div>
    </div>
  )
}
