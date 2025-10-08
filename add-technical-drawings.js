#!/usr/bin/env node

/**
 * Add Technical Drawing Support
 *
 * This script:
 * 1. Adds technical_drawing_url column to connectors table
 * 2. Uploads all JPG technical drawings from connector folders
 * 3. Updates connector records with technical drawing URLs
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

const BASE_PATH = '/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/RAST 5 Series crimping'

async function uploadFileToSupabase(localPath, storagePath, bucket = 'connector-videos') {
  try {
    const fileBuffer = fs.readFileSync(localPath)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
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

async function addTechnicalDrawings() {
  console.log('📐 Adding Technical Drawing Support\n')
  console.log('='.repeat(80))

  // Step 1: Add column to database (if it doesn't exist)
  console.log('\n📊 STEP 1: Checking database schema...\n')

  // We can't directly check if column exists via Supabase JS client,
  // so we'll just try to update a record with the field and see if it works
  // First, get one connector to test with
  const { data: testConnector } = await supabase
    .from('connectors')
    .select('id')
    .limit(1)
    .single()

  if (!testConnector) {
    console.error('❌ No connectors found in database')
    process.exit(1)
  }

  // Try to update with technical_drawing_url field
  const { error: schemaError } = await supabase
    .from('connectors')
    .update({ technical_drawing_url: null })
    .eq('id', testConnector.id)

  if (schemaError) {
    if (schemaError.message.includes('column') && schemaError.message.includes('does not exist')) {
      console.log('⚠️  Column "technical_drawing_url" does not exist')
      console.log('Please add it to your Supabase table using SQL:')
      console.log('\nALTER TABLE connectors ADD COLUMN technical_drawing_url TEXT;')
      console.log('\nAfter adding the column, run this script again.')
      process.exit(1)
    } else {
      console.error('❌ Database error:', schemaError.message)
      process.exit(1)
    }
  }

  console.log('✅ Database schema is ready')

  // Step 2: Process all connector folders
  console.log('\n\n📤 STEP 2: Processing Connector Technical Drawings\n')
  console.log('='.repeat(80))

  const categories = [
    'X-For socket terminals',
    'X-For tab terminals',
    'X-Printed circuit board headers'
  ]

  let totalProcessed = 0
  let totalUploaded = 0
  let totalUpdated = 0

  for (const category of categories) {
    const categoryPath = join(BASE_PATH, category)

    if (!fs.existsSync(categoryPath)) {
      console.log(`⏭️  Skipping ${category} (directory not found)`)
      continue
    }

    console.log(`\n📁 Processing: ${category}\n`)

    const connectorFolders = fs.readdirSync(categoryPath)
      .filter(f => {
        const fullPath = join(categoryPath, f)
        return fs.statSync(fullPath).isDirectory() && !f.startsWith('.')
      })

    for (const folder of connectorFolders) {
      const folderPath = join(categoryPath, folder)
      const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'))

      // Find JPG file (technical drawing)
      const jpgFile = files.find(f => f.toLowerCase().endsWith('.jpg'))

      if (!jpgFile) {
        console.log(`⏭️  ${folder} - No JPG found`)
        continue
      }

      totalProcessed++

      // Extract model name from folder
      // Folder patterns: X##-MODEL-SUFFIX
      // Database stores full model WITH pole count prefix: X##-MODEL (without suffix)
      const match = folder.match(/^(X\d+-.+)-(FR|VR|VS|VT|FT|MA|PC)$/)
      const model = match ? match[1] : folder  // Keep full X##-MODEL
      const terminalSuffix = match ? match[2] : null

      console.log(`\n📦 ${folder}`)
      console.log(`   JPG: ${jpgFile}`)
      console.log(`   Model: ${model}`)
      console.log(`   Terminal Suffix: ${terminalSuffix}`)

      // Find connector in database by model and terminal suffix
      const { data: connector } = await supabase
        .from('connectors')
        .select('id, model')
        .eq('model', model)
        .eq('terminal_suffix', terminalSuffix)
        .single()

      if (!connector) {
        console.log(`   ⚠️  Connector not found in database`)
        continue
      }

      // Upload technical drawing
      console.log(`   📤 Uploading technical drawing...`)
      const drawingUrl = await uploadFileToSupabase(
        join(folderPath, jpgFile),
        `technical-drawings/${model}.jpg`
      )

      if (!drawingUrl) {
        console.log(`   ❌ Upload failed`)
        continue
      }

      totalUploaded++
      console.log(`   ✅ Uploaded: ${drawingUrl}`)

      // Update connector record
      const { error: updateError } = await supabase
        .from('connectors')
        .update({ technical_drawing_url: drawingUrl })
        .eq('id', connector.id)

      if (updateError) {
        console.error(`   ❌ Failed to update database: ${updateError.message}`)
      } else {
        totalUpdated++
        console.log(`   ✅ Database updated`)
      }
    }
  }

  console.log('\n\n' + '='.repeat(80))
  console.log('📊 Summary:')
  console.log(`   Processed: ${totalProcessed} connectors`)
  console.log(`   Uploaded: ${totalUploaded} technical drawings`)
  console.log(`   Updated: ${totalUpdated} database records`)
  console.log('='.repeat(80))
  console.log('\n✅ Technical Drawing Support Added!')
}

addTechnicalDrawings().catch(console.error)
