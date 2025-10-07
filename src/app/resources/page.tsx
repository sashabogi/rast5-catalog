import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Book, FileText, HelpCircle, Cable, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <Book className="h-10 w-10 text-orange-600 mb-2" />
            <CardTitle>Terminal Components Guide</CardTitle>
            <CardDescription>
              Learn about the terminal components that go inside connectors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Understanding FR, FT, VR, VT, VS, and PC terminal types
            </p>
            <Link href="/resources/terminals">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                View Terminal Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <HelpCircle className="h-10 w-10 text-green-600 mb-2" />
            <CardTitle>Connector Selection Guide</CardTitle>
            <CardDescription>
              Interactive wizard to help you find the perfect connector
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Answer 5 simple questions about your application and get matched with the right connectors
            </p>
            <Link href="/resources/connector-guide">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Launch Selection Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <Cable className="h-10 w-10 text-purple-600 mb-2" />
            <CardTitle>Installation Guide</CardTitle>
            <CardDescription>
              Step-by-step instructions for crimping and assembly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Best practices for reliable electrical connections
            </p>
            <Link href="/resources/installation">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Installation Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
