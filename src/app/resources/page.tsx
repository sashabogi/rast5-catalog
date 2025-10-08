import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, FileText, HelpCircle, Cable } from 'lucide-react'

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Resources & Documentation</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <FileText className="h-10 w-10 text-blue-600 mb-2" />
            <CardTitle>Keying Documentation</CardTitle>
            <CardDescription>
              Download pole-specific keying guides that show compatible connector pairings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Available for 2-12 pole connectors, including special versions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Book className="h-10 w-10 text-orange-600 mb-2" />
            <CardTitle>Terminal Components Guide</CardTitle>
            <CardDescription>
              Learn about the terminal components that go inside connectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Understanding FR, FT, VR, VT, VS, and PC terminal types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <HelpCircle className="h-10 w-10 text-green-600 mb-2" />
            <CardTitle>How to Choose</CardTitle>
            <CardDescription>
              Interactive guide to help you select the right connector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Based on pole count, gender, orientation, and application
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Cable className="h-10 w-10 text-purple-600 mb-2" />
            <CardTitle>Installation Guide</CardTitle>
            <CardDescription>
              Step-by-step instructions for crimping and assembly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Best practices for reliable electrical connections
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What is a RAST 5 connector?</h3>
            <p className="text-gray-600 text-sm">
              RAST 5 is a standard for modular electrical connectors used in various applications,
              featuring different pole counts and mounting options.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How do I know which terminals to use?</h3>
            <p className="text-gray-600 text-sm">
              Each connector page shows the required terminal components based on the terminal suffix
              (FR, FT, VR, VT, VS, or PC).
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What does keying mean?</h3>
            <p className="text-gray-600 text-sm">
              Keying prevents incorrect mating of connectors. Only connectors with matching pole counts
              and compatible keying codes can be connected together.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
