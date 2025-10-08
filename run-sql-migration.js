#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

async function runMigration() {
  console.log('🗄️  Running SQL Migration: Add technical_drawing_url column\n')

  const sql = `ALTER TABLE connectors ADD COLUMN IF NOT EXISTS technical_drawing_url TEXT;`

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

  if (error) {
    // If the RPC doesn't exist, we'll need to use a different approach
    console.log('⚠️  Cannot execute SQL directly via Supabase client')
    console.log('Please run the following SQL in your Supabase SQL Editor:\n')
    console.log(sql)
    console.log('\nOr go to: Dashboard → SQL Editor → New Query')
    process.exit(1)
  }

  console.log('✅ Column added successfully!')
}

runMigration().catch(console.error)
