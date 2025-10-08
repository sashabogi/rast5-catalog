#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function deleteOldFTConnectors() {
  console.log('🗑️  Deleting old FT connectors from X-For tab terminals category...\n')
  
  // Delete connectors that:
  // - Are in "X-For tab terminals" category
  // - Have terminal_suffix = 'FT'
  const { data, error } = await supabase
    .from('connectors')
    .delete()
    .eq('category', 'X-For tab terminals')
    .eq('terminal_suffix', 'FT')
    .select()
  
  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
  
  console.log(`✅ Deleted ${data.length} old FT connectors:`)
  data.forEach(c => console.log(`   - ${c.id}`))
}

deleteOldFTConnectors().catch(console.error)
