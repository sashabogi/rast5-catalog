import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, FileText } from 'lucide-react'

interface ProductActionsProps {
  translations: {
    readyToOrder: string
    contactUs: string
    addToProject: string
    requestQuote: string
    comingSoon: string
  }
}

export function ProductActions({ translations }: ProductActionsProps) {
  return (
    <div className="text-center" data-aos="fade-up">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        {translations.readyToOrder}
      </h2>
      <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
        {translations.contactUs}
      </p>

      <div className="max-w-md mx-auto space-y-4">
        <Button
          className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
          disabled
        >
          <ShoppingCart className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
          {translations.addToProject}
          <Badge className="ml-3 bg-white/20 backdrop-blur text-white border-white/30 font-semibold">
            {translations.comingSoon}
          </Badge>
        </Button>
        <Button
          variant="outline"
          className="w-full h-14 text-lg font-bold border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          size="lg"
          disabled
        >
          <FileText className="mr-3 h-5 w-5 text-slate-600 group-hover:text-blue-600" />
          <span className="text-slate-700 group-hover:text-blue-600">{translations.requestQuote}</span>
        </Button>
      </div>
    </div>
  )
}
