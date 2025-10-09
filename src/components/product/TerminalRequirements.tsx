import { TerminalGallery } from '@/components/TerminalGallery'
import { AlertCircle } from 'lucide-react'

interface Terminal {
  spec_number: string
  terminal_type: string
  image_url: string | null
}

interface TerminalRequirementsProps {
  terminals: Terminal[] | null
  terminalSuffix: string
  terminalDescription: string | null
  terminalSpecs: string[] | null
  translations: {
    title: string
    requires: string
    specifications: string
    contactForDetails: string
  }
}

export function TerminalRequirements({
  terminals,
  terminalSuffix,
  terminalDescription,
  terminalSpecs,
  translations
}: TerminalRequirementsProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4">
        <h3 className="text-xl font-bold text-white">{translations.title}</h3>
        <p className="text-sm text-orange-100 mt-1">
          {terminalDescription || translations.requires.replace('{terminalSuffix}', terminalSuffix)}
        </p>
      </div>
      <div className="p-6">
        {terminals && terminals.length > 0 ? (
          <TerminalGallery terminals={terminals} />
        ) : (
          <div className="text-center py-8">
            <div className="p-4 bg-orange-100 rounded-full inline-flex mb-4">
              <AlertCircle className="h-12 w-12 text-orange-600" />
            </div>
            <p className="font-bold text-slate-900 mb-2">{translations.specifications}</p>
            <p className="text-sm text-slate-600">
              {terminalSpecs?.join(', ') || translations.contactForDetails}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
