#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkMAConnectors() {
  console.log('🔍 Checking MA Connectors in Database\n')

  // Get all connectors with terminal_suffix = 'MA'
  const { data: maConnectors, error } = await supabase
    .from('connectors')
    .select('id, model, terminal_suffix, category')
    .eq('terminal_suffix', 'MA')
    .order('model')

  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }

  console.log(`Found ${maConnectors.length} MA connectors:\n`)
  maConnectors.forEach(c => {
    console.log(`${c.id}`)
    console.log(`  Model: ${c.model}`)
    console.log(`  Terminal Suffix: ${c.terminal_suffix}`)
    console.log(`  Category: ${c.category}`)
    console.log()
  })

  // Also check all connectors to see the pattern
  console.log('\n' + '='.repeat(60))
  console.log('Sample of all connectors:\n')

  const { data: sample } = await supabase
    .from('connectors')
    .select('id, model, terminal_suffix')
    .limit(10)

  sample.forEach(c => {
    console.log(`${c.id}: model="${c.model}", suffix="${c.terminal_suffix}"`)
  })
}

checkMAConnectors().catch(console.error)
