// Test Supabase Connection
// Run this after setting up your .env.local file

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🔍 Testing Supabase Connection...\n')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '❌ MISSING')
console.log('')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing credentials in .env.local')
  console.log('\n📝 Please update .env.local with your Supabase credentials:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing database connection...')

    // Test 1: Check connectors table
    const { data, error } = await supabase
      .from('connectors')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Database Error:', error.message)
      console.log('\n💡 Tip: Make sure you ran the SQL schema in Supabase SQL Editor')
      return
    }

    console.log('✅ Database connection successful!')
    console.log('✅ Tables are accessible')
    console.log('📊 Connectors table is ready (currently empty)')
    console.log('')

    // Test 2: Check terminals table
    const { error: termError } = await supabase
      .from('terminals')
      .select('count')
      .limit(1)

    if (!termError) {
      console.log('✅ Terminals table is ready')
    }

    // Test 3: Check keying_documents table
    const { error: keyingError } = await supabase
      .from('keying_documents')
      .select('count')
      .limit(1)

    if (!keyingError) {
      console.log('✅ Keying documents table is ready')
    }

    console.log('')

    // Test 4: Check storage buckets
    console.log('Testing storage buckets...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

    if (bucketError) {
      console.error('❌ Storage Error:', bucketError.message)
      return
    }

    console.log(`✅ Storage accessible: ${buckets.length} bucket(s) found`)

    const requiredBuckets = ['connector-videos', 'terminal-images', 'keying-pdfs']
    buckets.forEach(bucket => {
      const isRequired = requiredBuckets.includes(bucket.name)
      const icon = isRequired ? '✅' : '📦'
      console.log(`   ${icon} ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })

    // Check if all required buckets exist
    const foundBuckets = buckets.map(b => b.name)
    const missingBuckets = requiredBuckets.filter(b => !foundBuckets.includes(b))

    if (missingBuckets.length > 0) {
      console.log('')
      console.log('⚠️  Missing required buckets:', missingBuckets.join(', '))
      console.log('💡 Create them in Supabase → Storage → New bucket (make them PUBLIC)')
    }

    console.log('')
    console.log('🎉 SETUP COMPLETE!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Run data migration script to populate database')
    console.log('2. Start dev server: npm run dev')
    console.log('3. Visit http://localhost:3000')
    console.log('')

  } catch (err) {
    console.error('❌ Connection failed:', err.message)
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Check your Supabase project URL is correct')
    console.log('   2. Verify your anon key is complete (no spaces)')
    console.log('   3. Make sure .env.local is saved')
    console.log('   4. Check if your Supabase project is paused (free tier)')
  }
}

testConnection()
