#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Path to MA Update folder
const MA_UPDATE_PATH = '/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/RAST 5 Series crimping/MA Update'

async function analyzeMAConnectors() {
  console.log('🔍 Analyzing MA Connector Data...\n')

  // 1. Read MA Update folder structure
  console.log('📁 Reading MA Update folder structure...')
  const xForTabTerminalsPath = join(MA_UPDATE_PATH, 'X-For tab terminals')
  const connectorFolders = fs.readdirSync(xForTabTerminalsPath)
    .filter(f => f.startsWith('X') && f.endsWith('-MA') && !f.startsWith('.'))

  console.log(`Found ${connectorFolders.length} MA connector folders:\n`)

  const maConnectorData = []

  for (const folder of connectorFolders) {
    const folderPath = join(xForTabTerminalsPath, folder)
    const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'))

    // Extract model number from folder name (e.g., X02-63N634-MA -> 63N634)
    const match = folder.match(/X\d+-(.+)-MA/)
    const modelNumber = match ? match[1] : null

    const hasJpg = files.some(f => f.endsWith('.jpg'))
    const hasVideo = files.some(f => f.endsWith('.mp4'))

    maConnectorData.push({
      folder,
      modelNumber,
      hasJpg,
      hasVideo,
      files
    })

    console.log(`  ${folder}:`)
    console.log(`    Model: ${modelNumber || 'UNKNOWN'}`)
    console.log(`    JPG: ${hasJpg ? '✅' : '❌'}`)
    console.log(`    Video: ${hasVideo ? '✅' : '❌'}`)
  }

  console.log('\n')

  // 2. Query database for these connectors
  console.log('🔎 Querying database for MA connectors...\n')

  const modelNumbers = maConnectorData.map(d => d.modelNumber).filter(Boolean)

  const { data: dbConnectors, error } = await supabase
    .from('connectors')
    .select('id, model, gender, pole_count, category, video_360_url')
    .in('model', modelNumbers)

  if (error) {
    console.error('❌ Database error:', error.message)
    return
  }

  console.log(`Found ${dbConnectors.length} connectors in database matching MA models:\n`)

  // 3. Compare and analyze
  console.log('📊 COMPARISON ANALYSIS:\n')
  console.log('=' .repeat(80))

  for (const maData of maConnectorData) {
    const dbMatch = dbConnectors.find(c => c.model === maData.modelNumber)

    console.log(`\n${maData.folder}`)
    console.log(`  Model Number: ${maData.modelNumber || 'UNKNOWN'}`)
    console.log(`  Files in MA Update: ${maData.files.join(', ')}`)

    if (dbMatch) {
      console.log(`  ✅ FOUND IN DATABASE:`)
      console.log(`     ID: ${dbMatch.id}`)
      console.log(`     Gender: ${dbMatch.gender || 'NULL'}`)
      console.log(`     Pole Count: ${dbMatch.pole_count || 'NULL'}`)
      console.log(`     Category: ${dbMatch.category || 'NULL'}`)
      console.log(`     Has 360° Video: ${dbMatch.video_360_url ? '✅' : '❌'}`)
    } else {
      console.log(`  ❌ NOT FOUND IN DATABASE`)
    }
  }

  // 4. Read MA Terminals
  console.log('\n\n')
  console.log('=' .repeat(80))
  console.log('🔧 MA TERMINALS FOLDER:\n')

  const maTerminalsPath = join(MA_UPDATE_PATH, 'MA-Terminals')
  const terminalFiles = fs.readdirSync(maTerminalsPath).filter(f => !f.startsWith('.'))

  console.log(`Found ${terminalFiles.length} terminal images:`)
  for (const file of terminalFiles) {
    const specNumber = file.replace('.jpg', '').replace('.xx', '')
    console.log(`  ${file} -> Spec: ${specNumber}`)
  }

  // Query database for these terminals
  const terminalSpecs = terminalFiles.map(f => f.replace('.jpg', '').replace('.xx', ''))

  const { data: dbTerminals, error: termError } = await supabase
    .from('terminals')
    .select('spec_number, terminal_type, image_url')
    .in('spec_number', terminalSpecs)

  if (termError) {
    console.error('❌ Database error:', termError.message)
  } else {
    console.log(`\nFound ${dbTerminals.length} terminals in database:\n`)
    for (const term of dbTerminals) {
      console.log(`  ${term.spec_number}: ${term.terminal_type}`)
      console.log(`    Has Image: ${term.image_url ? '✅' : '❌'}`)
    }
  }

  // 5. Summary
  console.log('\n\n')
  console.log('=' .repeat(80))
  console.log('📋 SUMMARY:\n')
  console.log(`MA Connector Folders: ${maConnectorData.length}`)
  console.log(`Connectors in DB: ${dbConnectors.length}`)
  console.log(`Missing from DB: ${maConnectorData.length - dbConnectors.length}`)
  console.log(`MA Terminal Images: ${terminalFiles.length}`)
  console.log(`Terminals in DB: ${dbTerminals?.length || 0}`)

  console.log('\n')
  console.log('=' .repeat(80))
  console.log('🔑 KEY INSIGHTS:\n')

  console.log('1. FOLDER NAMING PATTERN:')
  console.log('   - MA connectors have "-MA" suffix (e.g., X02-63N634-MA)')
  console.log('   - This indicates they use MA-specific terminals')
  console.log('')

  console.log('2. FILE STRUCTURE:')
  console.log('   - Each connector folder has: JPG image + 360° video')
  console.log('   - MA-Terminals folder has terminal images (6423.xx.jpg, 6424.xx.jpg, 6432.xx.jpg)')
  console.log('')

  console.log('3. DATABASE IMPLICATIONS:')
  console.log('   - MA connectors might need special_version flag set to TRUE')
  console.log('   - MA terminals (6423, 6424, 6432) are the terminals used by MA connectors')
  console.log('   - Need to establish connector-terminal relationships for MA variants')
  console.log('')

  console.log('4. WHAT NEEDS TO BE DONE:')
  console.log('   ✓ Upload MA terminal images to Supabase Storage')
  console.log('   ✓ Upload MA connector images and videos to Supabase Storage')
  console.log('   ✓ Update connectors table: mark MA connectors as special_version=true')
  console.log('   ✓ Update connector_terminals relationship table')
  console.log('   ✓ Ensure terminal images are linked correctly')
  console.log('')

  console.log('=' .repeat(80))
}

analyzeMAConnectors().catch(console.error)
