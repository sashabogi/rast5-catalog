#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function verifyMAConnectors() {
  console.log('🔍 Verifying MA Connector Classification...\n')
  
  const { data: maConnectors, error } = await supabase
    .from('connectors')
    .select('id, model, gender, terminal_suffix, terminal_specs')
    .eq('terminal_suffix', 'MA')
    .order('id')
  
  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
  
  console.log(`Found ${maConnectors.length} MA connectors:\n`)
  
  maConnectors.forEach(c => {
    const genderIcon = c.gender === 'Male' ? '✅' : '❌'
    const terminalCheck = c.terminal_specs?.includes('6423.xx') ? '✅' : '❌'
    
    console.log(`${genderIcon} ${c.id}`)
    console.log(`   Model: ${c.model}`)
    console.log(`   Gender: ${c.gender}`)
    console.log(`   Terminal Suffix: ${c.terminal_suffix}`)
    console.log(`   ${terminalCheck} Terminals: ${c.terminal_specs?.join(', ') || 'None'}`)
    console.log()
  })
  
  // Summary
  const allMale = maConnectors.every(c => c.gender === 'Male')
  const allHaveMATerminals = maConnectors.every(c => 
    c.terminal_specs?.includes('6423.xx') && 
    c.terminal_specs?.includes('6424.xx') && 
    c.terminal_specs?.includes('6432.xx')
  )
  
  console.log('='.repeat(60))
  console.log('Summary:')
  console.log(`  Gender Classification: ${allMale ? '✅ All Male' : '❌ Some incorrect'}`)
  console.log(`  MA Terminal Linkage: ${allHaveMATerminals ? '✅ All linked correctly' : '❌ Some missing'}`)
  console.log('='.repeat(60))
}

verifyMAConnectors().catch(console.error)
