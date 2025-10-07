#!/usr/bin/env node

// RAST 5 Data Migration Script
// Populates Supabase database from RAST 5 Series crimping folder

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs').promises
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Supabase client with service role (admin access for migrations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Path to RAST 5 folder
const RAST5_FOLDER = path.join(__dirname, '..', 'RAST 5 Series crimping')

// Terminal suffix to terminal specs mapping
const TERMINAL_MAPPING = {
  'FR': ['5333.xx', '5335.xx'],
  'VR': ['5333.xx', '5335.xx'],
  'VS': ['5333.xx', '5335.xx'],
  'FT': ['6423.xx', '6424.xx', '6432.xx'],
  'VT': ['6423.xx', '6424.xx', '6432.xx'],
  'PC': [] // PCB headers don't require separate terminals
}

// Category mapping
const CATEGORY_MAPPING = {
  'X-For socket terminals': 'X-For socket terminals',
  'X-For tab terminals': 'X-For tab terminals',
  'X-Printed circuit board headers': 'X-Printed circuit board headers'
}

// Stats tracking
const stats = {
  connectors: 0,
  terminals: 0,
  keyingDocs: 0,
  videos: 0,
  images: 0,
  pdfs: 0,
  errors: []
}

console.log('\n🚀 RAST 5 Data Migration Starting...\n')

// Helper: Parse connector ID from folder name
function parseConnectorId(folderName) {
  // Format: X01-CS-R502KxxPF-FR or X04-63N433.5-FR (special) or X01-CS-R502KnnPM-FT or X01-CS-R502KnnPCB-PC
  const match = folderName.match(/^(X\d+-[^-]+(?:-[^-]+)*)-([A-Z]{2,3})$/)
  if (!match) return null

  return {
    id: folderName,
    baseModel: match[1],
    terminalSuffix: match[2],
    isSpecial: match[1].includes('63N')
  }
}

// Helper: Parse model details
function parseModel(model, isSpecial = false, terminalSuffix = null) {
  // Handle 63N special connectors (e.g., X04-63N433.5, X04-63N035-FT)
  if (isSpecial) {
    // Extract pole count from X prefix (X04 = 4 poles, X03 = 3 poles, X02 = 2 poles)
    const xMatch = model.match(/X(\d+)/)
    const poleCount = xMatch ? parseInt(xMatch[1]) : null

    // Determine gender based on terminal suffix
    let gender = 'Female'
    let connectorType = 'R'

    if (terminalSuffix === 'FT' || terminalSuffix === 'VT') {
      gender = 'Male'
      connectorType = 'T'
    }

    return {
      poleCount,
      connectorType,
      gender,
      orientation: model.includes('V') ? 'Vertical' : 'Horizontal'
    }
  }

  // Handle PCB headers (e.g., CS-R502KnnPCB)
  if (model.includes('PCB') || terminalSuffix === 'PC') {
    const poleMatch = model.match(/(\d{3,4})/)
    if (!poleMatch) return null

    const poleCode = poleMatch[1]
    const poleCount = poleCode.startsWith('50') ? parseInt(poleCode[2]) : parseInt(poleCode.slice(1))

    return {
      poleCount,
      connectorType: 'PCB',
      gender: 'PCB Header',
      orientation: 'Horizontal'
    }
  }

  // Handle tab terminal housings (e.g., CS-R502KnnPM)
  if (model.includes('KnnPM') || terminalSuffix === 'FT') {
    const poleMatch = model.match(/(\d{3,4})/)
    if (!poleMatch) return null

    const poleCode = poleMatch[1]
    const poleCount = poleCode.startsWith('50') ? parseInt(poleCode[2]) : parseInt(poleCode.slice(1))

    return {
      poleCount,
      connectorType: 'T',
      gender: 'Male',
      orientation: 'Horizontal'
    }
  }

  // Standard connectors (e.g., CS-R502KxxPF -> 2 poles, CS-R510KxxPF -> 10 poles)
  const poleMatch = model.match(/(\d{3,4})/)
  if (!poleMatch) return null

  const poleCode = poleMatch[1]
  // For codes starting with 50 (502-509), pole count is 3rd digit
  // For codes starting with 51 (510, 512), pole count is last 2 digits (10, 12)
  const poleCount = poleCode.startsWith('50') ? parseInt(poleCode[2]) : parseInt(poleCode.slice(1))

  // Extract connector type (R, T, S)
  const typeMatch = model.match(/CS-([RTS])/)
  const connectorType = typeMatch ? typeMatch[1] : null

  // Determine gender
  let gender = 'Unknown'
  if (connectorType === 'R' || connectorType === 'S') gender = 'Female'
  if (connectorType === 'T') gender = 'Male'

  // Determine orientation
  const orientation = model.includes('V') ? 'Vertical' : 'Horizontal'

  return {
    poleCount,
    connectorType,
    gender,
    orientation
  }
}

// Helper: Upload file to Supabase storage
async function uploadFile(filePath, bucket, remotePath) {
  try {
    const fileBuffer = await fs.readFile(filePath)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(remotePath, fileBuffer, {
        contentType: getContentType(filePath),
        upsert: true
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(remotePath)

    return urlData.publicUrl
  } catch (error) {
    stats.errors.push(`Upload failed: ${remotePath} - ${error.message}`)
    return null
  }
}

// Helper: Get content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const types = {
    '.mp4': 'video/mp4',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf'
  }
  return types[ext] || 'application/octet-stream'
}

// Step 1: Migrate Terminals
async function migrateTerminals() {
  console.log('📦 Migrating terminal components...\n')

  const terminalFolders = [
    'FT-Terminals',
    path.join('X-For socket terminals', 'FR-Terminals'),
    path.join('X-For socket terminals', 'VR-Terminals'),
    path.join('X-For socket terminals', 'VS-Terminals'),
    path.join('X-For socket terminals', 'VT-Terminals'),
    'PC-Terminals'
  ]

  for (const folder of terminalFolders) {
    const folderPath = path.join(RAST5_FOLDER, folder)
    try {
      const files = await fs.readdir(folderPath)

      for (const file of files) {
        if (file.startsWith('.')) continue
        if (!file.endsWith('.jpg') && !file.endsWith('.jpeg')) continue

        const specNumber = file.replace(/\.(jpg|jpeg)$/i, '')
        const terminalType = path.basename(folder).replace('-Terminals', '')

        // Upload image
        const filePath = path.join(folderPath, file)
        const imageUrl = await uploadFile(filePath, 'terminal-images', file)

        if (imageUrl) {
          stats.images++

          // Insert terminal record
          const { error } = await supabase
            .from('terminals')
            .upsert({
              spec_number: specNumber,
              terminal_type: terminalType,
              gender: terminalType.includes('F') && !terminalType.includes('FT') ? 'Female' : 'Male',
              description: `${terminalType} terminal component`,
              image_url: imageUrl,
              used_in_suffix: [terminalType]
            }, { onConflict: 'spec_number' })

          if (!error) {
            stats.terminals++
            console.log(`  ✅ ${specNumber}`)
          }
        }
      }
    } catch (error) {
      stats.errors.push(`Terminal folder ${folder}: ${error.message}`)
    }
  }

  console.log(`\n✅ Migrated ${stats.terminals} terminals\n`)
}

// Step 2: Migrate Keying Documents
async function migrateKeyingDocs() {
  console.log('📄 Migrating keying documentation...\n')

  const keyingPath = path.join(RAST5_FOLDER, 'RAST 5 - Keying')

  try {
    const files = await fs.readdir(keyingPath)

    for (const file of files) {
      if (!file.endsWith('.pdf') && !file.endsWith('.PDF')) continue

      // Parse pole count from filename
      const poleMatch = file.match(/(\d+)-Pole/)
      const poleCount = poleMatch ? parseInt(poleMatch[1]) : null

      if (!poleCount) continue

      // Determine document type
      const docType = file.includes('Special') ? 'Special Versions' : 'Standard'

      // Upload PDF
      const filePath = path.join(keyingPath, file)
      const pdfUrl = await uploadFile(filePath, 'keying-pdfs', file)

      if (pdfUrl) {
        stats.pdfs++

        // Insert keying document record
        const { error } = await supabase
          .from('keying_documents')
          .insert({
            pole_count: poleCount,
            document_type: docType,
            filename: file,
            file_url: pdfUrl,
            description: `${poleCount}-Pole RAST 5 keying documentation`
          })

        if (!error) {
          stats.keyingDocs++
          console.log(`  ✅ ${file}`)
        }
      }
    }
  } catch (error) {
    stats.errors.push(`Keying docs: ${error.message}`)
  }

  console.log(`\n✅ Migrated ${stats.keyingDocs} keying documents\n`)
}

// Step 3: Migrate Connectors
async function migrateConnectors() {
  console.log('🔌 Migrating connectors...\n')

  const categories = [
    'X-For socket terminals',
    'X-For tab terminals',
    'X-Printed circuit board headers'
  ]

  for (const category of categories) {
    const categoryPath = path.join(RAST5_FOLDER, category)

    try {
      const items = await fs.readdir(categoryPath)

      for (const item of items) {
        // Skip terminal folders
        if (item.includes('Terminals')) continue
        if (item.startsWith('.')) continue

        const itemPath = path.join(categoryPath, item)
        const itemStat = await fs.stat(itemPath)

        if (!itemStat.isDirectory()) continue

        // Check if this is a connector folder (ends with terminal suffix)
        const parsed = parseConnectorId(item)
        if (parsed) {
          // This is a connector folder directly in the category
          await processConnector(item, itemPath, category, category)
        } else {
          // This is a subfolder, read connectors within it
          const connectorFolders = await fs.readdir(itemPath)

          for (const connectorFolder of connectorFolders) {
            if (connectorFolder.startsWith('.')) continue

            const connectorPath = path.join(itemPath, connectorFolder)
            const connectorStat = await fs.stat(connectorPath)

            if (!connectorStat.isDirectory()) continue

            await processConnector(connectorFolder, connectorPath, category, item)
          }
        }
      }
    } catch (error) {
      stats.errors.push(`Category ${category}: ${error.message}`)
    }
  }

  console.log(`\n✅ Migrated ${stats.connectors} connectors\n`)
}

// Helper function to process a single connector
async function processConnector(connectorFolder, connectorPath, category, subfolder) {
  // Parse connector ID
  const parsed = parseConnectorId(connectorFolder)
  if (!parsed) return

  // Read files in connector folder
  const files = await fs.readdir(connectorPath)

  // Find video file
  const videoFile = files.find(f => f.endsWith('.mp4'))
  if (!videoFile) {
    stats.errors.push(`No video found for ${connectorFolder}`)
    return
  }

  // Upload video
  const videoPath = path.join(connectorPath, videoFile)
  const videoUrl = await uploadFile(videoPath, 'connector-videos', `${parsed.baseModel}.mp4`)

  if (!videoUrl) return

  stats.videos++

  // Parse model details
  const modelDetails = parseModel(parsed.baseModel, parsed.isSpecial, parsed.terminalSuffix)
  if (!modelDetails) return

  // Build display name
  let displayName = `${modelDetails.poleCount}-Pole ${modelDetails.gender} Connector`
  if (modelDetails.gender === 'PCB Header') {
    displayName = `${modelDetails.poleCount}-Pole PCB Header`
  }

  // Build terminal description
  let terminalDescription = `Requires ${parsed.terminalSuffix} terminals`
  if (parsed.terminalSuffix === 'PC') {
    terminalDescription = 'PCB mount connector - no separate terminals required'
  }

  // Build connector record
  const connector = {
    id: parsed.id,
    model: parsed.baseModel,
    display_name: displayName,
    category: category,
    pole_count: modelDetails.poleCount,
    connector_type: modelDetails.connectorType,
    gender: modelDetails.gender,
    orientation: modelDetails.orientation,
    mounting_type: subfolder,
    terminal_suffix: parsed.terminalSuffix,
    terminal_specs: TERMINAL_MAPPING[parsed.terminalSuffix] || [],
    terminal_description: terminalDescription,
    video_360_url: videoUrl,
    video_thumbnail_time: 0,
    keying_pdf: `${modelDetails.poleCount}-Pole - RAST 5 - Keying.pdf`,
    is_special_version: parsed.isSpecial,
    special_notes: parsed.isSpecial ? 'Special configuration connector - Contact for specifications' : null
  }

  // Insert connector
  const { error } = await supabase
    .from('connectors')
    .upsert(connector, { onConflict: 'id' })

  if (!error) {
    stats.connectors++
    console.log(`  ✅ ${connector.id}`)
  } else {
    stats.errors.push(`Insert failed for ${connector.id}: ${error.message}`)
  }
}

// Step 4: Calculate and update connector relationships
async function calculateRelationships() {
  console.log('🔗 Calculating connector relationships...\n')

  // Fetch all connectors
  const { data: allConnectors, error } = await supabase
    .from('connectors')
    .select('*')

  if (error || !allConnectors) {
    console.error('Failed to fetch connectors:', error)
    return
  }

  for (const connector of allConnectors) {
    const matesWith = []
    const assemblyVariants = []

    // Find mating partners (opposite gender, same pole count)
    for (const other of allConnectors) {
      if (other.id === connector.id) continue

      // Mating logic: Same pole count + opposite gender
      if (other.pole_count === connector.pole_count) {
        // Female (R/S) mates with Male (T)
        if ((connector.connector_type === 'R' || connector.connector_type === 'S') && other.connector_type === 'T') {
          matesWith.push(other.id)
        } else if (connector.connector_type === 'T' && (other.connector_type === 'R' || other.connector_type === 'S')) {
          matesWith.push(other.id)
        }
      }
    }

    // Find assembly variants (same gender, same pole count, different orientation/mounting)
    for (const other of allConnectors) {
      if (other.id === connector.id) continue

      // Same pole count and compatible gender (R and S are both female sockets)
      if (other.pole_count === connector.pole_count) {
        // R and S types are assembly variants of each other
        if ((connector.connector_type === 'R' && other.connector_type === 'S') ||
            (connector.connector_type === 'S' && other.connector_type === 'R')) {
          assemblyVariants.push(other.id)
        }
        // Same connector type but different orientation
        else if (connector.connector_type === other.connector_type &&
                 connector.orientation !== other.orientation) {
          assemblyVariants.push(other.id)
        }
      }
    }

    // Update connector with relationships
    const { error: updateError } = await supabase
      .from('connectors')
      .update({
        mates_with: matesWith.length > 0 ? matesWith : null,
        assembly_variants: assemblyVariants.length > 0 ? assemblyVariants : null
      })
      .eq('id', connector.id)

    if (!updateError) {
      console.log(`  ✅ ${connector.id}: ${matesWith.length} mates, ${assemblyVariants.length} variants`)
    }
  }

  console.log('\n✅ Relationships calculated\n')
}

// Main migration
async function migrate() {
  const startTime = Date.now()

  try {
    // Check if folder exists
    await fs.access(RAST5_FOLDER)
    console.log(`📁 Found RAST 5 folder: ${RAST5_FOLDER}\n`)
  } catch {
    console.error(`❌ RAST 5 folder not found: ${RAST5_FOLDER}`)
    process.exit(1)
  }

  // Run migrations
  await migrateTerminals()
  await migrateKeyingDocs()
  await migrateConnectors()
  await calculateRelationships()

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log('\n' + '='.repeat(50))
  console.log('🎉 MIGRATION COMPLETE!')
  console.log('='.repeat(50))
  console.log(`\n📊 Summary:`)
  console.log(`   Connectors: ${stats.connectors}`)
  console.log(`   Terminals: ${stats.terminals}`)
  console.log(`   Keying Docs: ${stats.keyingDocs}`)
  console.log(`   Videos: ${stats.videos}`)
  console.log(`   Images: ${stats.images}`)
  console.log(`   PDFs: ${stats.pdfs}`)
  console.log(`   Errors: ${stats.errors.length}`)
  console.log(`   Duration: ${duration}s`)

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors encountered:`)
    stats.errors.slice(0, 10).forEach(err => console.log(`   - ${err}`))
    if (stats.errors.length > 10) {
      console.log(`   ... and ${stats.errors.length - 10} more`)
    }
  }

  console.log(`\n✅ Next steps:`)
  console.log(`   1. npm run dev`)
  console.log(`   2. Visit http://localhost:3000/catalog`)
  console.log(`   3. Browse your connectors!\n`)
}

// Run migration
migrate().catch(error => {
  console.error('\n❌ Migration failed:', error)
  process.exit(1)
})
