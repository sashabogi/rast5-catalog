import { supabase } from '@/lib/supabase/client'
import { Connector } from '@/types/database'
import { Video360Player } from '@/components/Video360Player'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, AlertCircle } from 'lucide-react'
import { notFound } from 'next/navigation'

interface ConnectorPageProps {
  params: Promise<{ id: string }>
}

export default async function ConnectorPage({ params }: ConnectorPageProps) {
  const { id } = await params

  // Fetch connector from Supabase
  const { data: connector, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !connector) {
    notFound()
  }

  const typedConnector = connector as Connector

  const genderColor =
    typedConnector.gender === 'Female' ? 'bg-blue-500' :
    typedConnector.gender === 'Male' ? 'bg-orange-500' :
    'bg-green-500'

  // Fetch terminals for this connector
  const { data: terminals } = await supabase
    .from('terminals')
    .select('*')
    .eq('terminal_type', typedConnector.terminal_suffix)

  // Fetch mating connectors
  const { data: matingConnectors } = typedConnector.mates_with && typedConnector.mates_with.length > 0
    ? await supabase
        .from('connectors')
        .select('id, model, display_name, gender, pole_count, orientation, video_360_url')
        .in('id', typedConnector.mates_with)
    : { data: null }

  // Fetch assembly variants
  const { data: assemblyVariantConnectors } = typedConnector.assembly_variants && typedConnector.assembly_variants.length > 0
    ? await supabase
        .from('connectors')
        .select('id, model, display_name, gender, pole_count, orientation, video_360_url')
        .in('id', typedConnector.assembly_variants)
    : { data: null }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{typedConnector.model}</h1>
        <p className="text-xl text-gray-600">
          {typedConnector.display_name || `${typedConnector.pole_count}-Pole ${typedConnector.gender} Connector`}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Section */}
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video">
                <video
                  src={typedConnector.video_360_url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                Specifications
              </CardTitle>
              <p className="text-sm text-gray-600">Technical details</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {typedConnector.is_special_version && (
                <div className="mb-4">
                  <Badge variant="destructive">Special Version</Badge>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Model</span>
                  <span className="font-semibold">{typedConnector.model}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Series</span>
                  <span className="font-semibold">CS</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Number</span>
                  <span className="font-semibold">{typedConnector.model.match(/\d{3,4}/)?.[0] || 'N/A'}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Terminal Type</span>
                  <span className="font-semibold">
                    {typedConnector.connector_type === 'R' || typedConnector.connector_type === 'S'
                      ? 'Socket (Female)'
                      : typedConnector.connector_type === 'T'
                        ? 'Tab (Male)'
                        : 'PCB'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Orientation</span>
                  <span className="font-semibold">{typedConnector.orientation || 'N/A'}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Category</span>
                  <span className="font-semibold">{typedConnector.category}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Subcategory</span>
                  <span className="font-semibold">{typedConnector.mounting_type || typedConnector.orientation || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminal Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Required Terminals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {typedConnector.terminal_description || `Requires ${typedConnector.terminal_suffix} terminals`}
              </p>

              {terminals && terminals.length > 0 ? (
                <div className="space-y-2">
                  {terminals.map((terminal) => (
                    <div key={terminal.spec_number} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      {terminal.image_url && (
                        <img
                          src={terminal.image_url}
                          alt={terminal.spec_number}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                      <div>
                        <p className="font-medium">{terminal.spec_number}</p>
                        <p className="text-xs text-gray-600">{terminal.terminal_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <p>Terminal specifications: {typedConnector.terminal_specs?.join(', ') || 'Contact for details'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keying Documentation */}
          {typedConnector.keying_pdf && (
            <Card>
              <CardHeader>
                <CardTitle>Keying Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`https://rbbjnwebxrxzxvwgdykf.supabase.co/storage/v1/object/public/keying-pdfs/${typedConnector.keying_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>{typedConnector.keying_pdf}</span>
                </a>
              </CardContent>
            </Card>
          )}

          {/* Compatible Connectors (Mating Partners) */}
          {matingConnectors && matingConnectors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Compatible Connectors</CardTitle>
                <p className="text-sm text-gray-600">Direct mating partners</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {matingConnectors.map((mate) => (
                    <a
                      key={mate.id}
                      href={`/connector/${mate.id}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="w-20 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                        <video
                          src={mate.video_360_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-blue-600">{mate.model}</p>
                        <p className="text-sm text-gray-600">{mate.display_name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={mate.gender === 'Female' ? 'bg-blue-500' : 'bg-orange-500'}>
                            {mate.gender}
                          </Badge>
                          <Badge variant="outline">{mate.pole_count}-Pole</Badge>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assembly Variants */}
          {assemblyVariantConnectors && assemblyVariantConnectors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Assembly Variants</CardTitle>
                <p className="text-sm text-gray-600">Alternative orientations/configurations</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {assemblyVariantConnectors.map((variant) => (
                    <a
                      key={variant.id}
                      href={`/connector/${variant.id}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="w-20 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                        <video
                          src={variant.video_360_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-blue-600">{variant.model}</p>
                        <p className="text-sm text-gray-600">{variant.display_name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{variant.orientation}</Badge>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Notes */}
          {typedConnector.special_notes && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-900">Special Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800">{typedConnector.special_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
