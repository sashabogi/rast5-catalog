import { TechnicalDrawingViewer } from '@/components/TechnicalDrawingViewer'
import { Download, FileText } from 'lucide-react'

interface DocumentationSectionProps {
  keyingPdf: string | null
  technicalDrawingUrl: string | null
  connectorModel: string
  translations: {
    keyingTitle: string
    keyingDescription: string
    keyingNoAvailable: string
    drawingsTitle: string
    drawingsDescription: string
    drawingsComingSoon: string
    pdfDocument: string
  }
}

export function DocumentationSection({
  keyingPdf,
  technicalDrawingUrl,
  connectorModel,
  translations
}: DocumentationSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Keying Documentation */}
      {keyingPdf ? (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {translations.keyingTitle}
            </h3>
            <p className="text-sm text-blue-100 mt-1">
              {translations.keyingDescription}
            </p>
          </div>
          <div className="p-6">
            <a
              href={`https://rbbjnwebxrxzxvwgdykf.supabase.co/storage/v1/object/public/keying-pdfs/${keyingPdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all duration-300 group border border-blue-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-md border border-slate-200">
                  <FileText className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {keyingPdf}
                  </p>
                  <p className="text-sm text-slate-600">{translations.pdfDocument}</p>
                </div>
              </div>
              <Download className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8">
          <div className="text-center">
            <div className="p-3 bg-slate-100 rounded-full inline-flex mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-500 mb-2">{translations.keyingTitle}</h3>
            <p className="text-sm text-slate-500">
              {translations.keyingNoAvailable}
            </p>
          </div>
        </div>
      )}

      {/* Technical Drawings */}
      {technicalDrawingUrl ? (
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl border border-green-100 overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {translations.drawingsTitle}
            </h3>
            <p className="text-sm text-green-100 mt-1">
              {translations.drawingsDescription}
            </p>
          </div>
          <div className="p-6">
            <TechnicalDrawingViewer
              imageUrl={technicalDrawingUrl}
              connectorModel={connectorModel}
              description={translations.drawingsDescription}
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8">
          <div className="text-center">
            <div className="p-3 bg-slate-100 rounded-full inline-flex mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-500 mb-2">{translations.drawingsTitle}</h3>
            <p className="text-sm text-slate-500">
              {translations.drawingsComingSoon}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
