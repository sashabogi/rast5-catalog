#!/usr/bin/env node

/**
 * Fix MA Connector Classification
 *
 * This script:
 * 1. Adds MA terminals (6423, 6424, 6432) to the database
 * 2. Updates connector models to have -MA suffix
 * 3. Links MA connectors to MA terminals
 * 4. Uploads MA terminal and connector images/videos to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const MA_UPDATE_PATH = '/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/RAST 5 Series crimping/MA Update'

// MA Terminal definitions
const MA_TERMINALS = [
  { spec_number: '6423', terminal_type: 'MA' },
  { spec_number: '6424', terminal_type: 'MA' },
  { spec_number: '6432', terminal_type: 'MA' }
]

async function uploadFileToSupabase(localPath, storagePath, bucket = 'connector-assets') {
  try {
    const fileBuffer = fs.readFileSync(localPath)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: localPath.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
        upsert: true
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath)

    return publicUrl
  } catch (error) {
    console.error(`  ❌ Upload failed: ${error.message}`)
    return null
  }
}

async function fixMAConnectors() {
  console.log('🔧 Fixing MA Connector Classification\n')
  console.log('=' .repeat(80))

  // Step 1: Upload and add MA terminals
  console.log('\n📤 STEP 1: Adding MA Terminals\n')

  const maTerminalsPath = join(MA_UPDATE_PATH, 'MA-Terminals')

  for (const terminal of MA_TERMINALS) {
    console.log(`\nProcessing terminal ${terminal.spec_number}...`)

    // Check if terminal already exists
    const { data: existing } = await supabase
      .from('terminals')
      .select('spec_number')
      .eq('spec_number', terminal.spec_number)
      .single()

    if (existing) {
      console.log(`  ⏭️  Terminal ${terminal.spec_number} already exists, skipping`)
      continue
    }

    // Upload terminal image
    const imageFile = `${terminal.spec_number}.xx.jpg`
    const imagePath = join(maTerminalsPath, imageFile)

    if (fs.existsSync(imagePath)) {
      console.log(`  📤 Uploading image...`)
      const imageUrl = await uploadFileToSupabase(
        imagePath,
        `terminals/${terminal.spec_number}.jpg`
      )

      if (imageUrl) {
        // Insert terminal
        const { error } = await supabase
          .from('terminals')
          .insert({
            spec_number: terminal.spec_number,
            terminal_type: terminal.terminal_type,
            image_url: imageUrl
          })

        if (error) {
          console.error(`  ❌ Failed to insert terminal: ${error.message}`)
        } else {
          console.log(`  ✅ Terminal ${terminal.spec_number} added`)
        }
      }
    } else {
      console.log(`  ⚠️  Image not found: ${imagePath}`)
    }
  }

  // Step 2: Process MA connectors
  console.log('\n\n📤 STEP 2: Processing MA Connectors\n')
  console.log('=' .repeat(80))

  const xForTabPath = join(MA_UPDATE_PATH, 'X-For tab terminals')
  const connectorFolders = fs.readdirSync(xForTabPath)
    .filter(f => f.startsWith('X') && f.endsWith('-MA') && !f.startsWith('.'))

  for (const folder of connectorFolders) {
    console.log(`\n📦 ${folder}`)

    const folderPath = join(xForTabPath, folder)
    const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'))

    // Extract info from folder name
    const match = folder.match(/X(\d+)-(.+)-MA/)
    if (!match) {
      console.log('  ⚠️  Could not parse folder name')
      continue
    }

    const poleCount = match[1]
    const baseModel = match[2]
    const modelWithMA = `${baseModel}-MA`

    console.log(`  Model: ${modelWithMA}`)
    console.log(`  Pole Count: ${poleCount}`)

    // Check if connector exists
    const { data: existingConnector } = await supabase
      .from('connectors')
      .select('id, model')
      .eq('model', modelWithMA)
      .single()

    if (existingConnector) {
      console.log(`  ✅ Connector already exists with -MA suffix`)
      continue
    }

    // Check if connector exists WITHOUT -MA suffix
    const { data: baseConnector } = await supabase
      .from('connectors')
      .select('*')
      .eq('model', baseModel)
      .single()

    if (baseConnector) {
      console.log(`  🔄 Found base connector ${baseModel}, adding -MA suffix...`)

      // Upload images/videos for MA variant
      const jpgFile = files.find(f => f.endsWith('.jpg'))
      const mp4File = files.find(f => f.endsWith('.mp4'))

      let imageUrl = null
      let videoUrl = null

      if (jpgFile) {
        console.log(`  📤 Uploading image: ${jpgFile}`)
        imageUrl = await uploadFileToSupabase(
          join(folderPath, jpgFile),
          `connectors/${modelWithMA}.jpg`
        )
      }

      if (mp4File) {
        console.log(`  📤 Uploading video: ${mp4File}`)
        videoUrl = await uploadFileToSupabase(
          join(folderPath, mp4File),
          `connectors/${modelWithMA}.mp4`
        )
      }

      // Insert new connector with -MA suffix
      const { data: newConnector, error: insertError } = await supabase
        .from('connectors')
        .insert({
          model: modelWithMA,
          display_name: `${baseConnector.display_name} (MA Terminals)`,
          gender: baseConnector.gender,
          pole_count: baseConnector.pole_count,
          orientation: baseConnector.orientation,
          category: baseConnector.category,
          video_360_url: videoUrl || baseConnector.video_360_url,
          video_thumbnail_time: baseConnector.video_thumbnail_time
        })
        .select()
        .single()

      if (insertError) {
        console.error(`  ❌ Failed to insert: ${insertError.message}`)
        continue
      }

      console.log(`  ✅ Created connector: ${modelWithMA}`)

      // Link to MA terminals
      console.log(`  🔗 Linking to MA terminals...`)
      for (const terminal of MA_TERMINALS) {
        const { error: linkError } = await supabase
          .from('connector_terminals')
          .insert({
            connector_id: newConnector.id,
            terminal_spec: terminal.spec_number
          })

        if (linkError && !linkError.message.includes('duplicate')) {
          console.error(`  ⚠️  Failed to link ${terminal.spec_number}: ${linkError.message}`)
        }
      }
      console.log(`  ✅ Linked to MA terminals`)
    } else {
      console.log(`  ⚠️  Base connector ${baseModel} not found in database`)
      console.log(`  💡 You may need to add this connector manually`)
    }
  }

  console.log('\n\n' + '='.repeat(80))
  console.log('✅ MA Connector Fix Complete!')
  console.log('=' .repeat(80))
}

fixMAConnectors().catch(console.error)
