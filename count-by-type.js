const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function countByType() {
  const { data, error } = await supabase
    .from('connectors')
    .select('gender, connector_type, category')

  if (error) {
    console.error('Error:', error)
    return
  }

  const female = data.filter(c => c.gender === 'Female').length
  const male = data.filter(c => c.gender === 'Male').length
  const pcb = data.filter(c => c.gender === 'PCB Header').length

  console.log(`\nConnector Breakdown:`)
  console.log(`Female Socket Housing: ${female}`)
  console.log(`Male Tab Connectors: ${male}`)
  console.log(`PCB Headers: ${pcb}`)
  console.log(`Total: ${data.length}`)
}

countByType()
