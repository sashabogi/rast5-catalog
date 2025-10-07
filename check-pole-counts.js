#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkPoleCounts() {
  const { data, error } = await supabase
    .from('connectors')
    .select('id, model, pole_count')
    .order('pole_count')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('\nConnectors in database:')
  console.log('ID | Model | Pole Count')
  console.log('-'.repeat(50))

  data.forEach(connector => {
    console.log(`${connector.id.padEnd(25)} | ${connector.model.padEnd(15)} | ${connector.pole_count}`)
  })
}

checkPoleCounts()
