# Supabase Setup Guide - Step by Step

Follow these steps to set up your Supabase database for the RAST 5 Connector Catalog.

---

## 📋 Prerequisites

- [ ] Web browser
- [ ] Email address for Supabase account
- [ ] 15-20 minutes

---

## Step 1: Create Supabase Account & Project (5 minutes)

### 1.1 Go to Supabase
Open your browser and go to: **https://supabase.com**

### 1.2 Sign Up / Sign In
- Click "Start your project" or "Sign In"
- Sign up with GitHub, Google, or Email
- Verify your email if needed

### 1.3 Create New Organization (if needed)
- Click "New organization"
- Name it: `RAST5` (or your company name)
- Choose Free plan (perfect to start)

### 1.4 Create New Project
- Click "New project"
- **Name**: `rast5-catalog`
- **Database Password**: Create a strong password and **SAVE IT**
  - Example: `R@st5Cat@log2024!SecurePass`
  - ⚠️ **IMPORTANT**: Copy this to a safe place!
- **Region**: Choose closest to your users
  - US East (Ohio) for East Coast
  - US West (Oregon) for West Coast
  - Europe (Frankfurt) for EU
- Click "Create new project"
- ⏱️ Wait ~2 minutes for setup to complete

---

## Step 2: Get Your API Credentials (2 minutes)

### 2.1 Navigate to Settings
- In your project, click **⚙️ Settings** (bottom left)
- Click **API** in the sidebar

### 2.2 Copy Your Credentials
You'll need TWO values:

**1. Project URL**
```
https://xxxxxxxxxxxxx.supabase.co
```
- Copy this entire URL
- Paste it somewhere safe

**2. Anon/Public Key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```
- This is a LONG string (starts with `eyJ`)
- Copy the entire key
- Paste it somewhere safe

✅ **Checkpoint**: You should now have:
- [ ] Project URL
- [ ] Anon Key

---

## Step 3: Create Storage Buckets (5 minutes)

### 3.1 Navigate to Storage
- Click **🗂️ Storage** in the left sidebar

### 3.2 Create Bucket #1: connector-videos
- Click "New bucket"
- **Name**: `connector-videos`
- **Public bucket**: ✅ **YES** (toggle ON)
- Click "Create bucket"

### 3.3 Create Bucket #2: terminal-images
- Click "New bucket"
- **Name**: `terminal-images`
- **Public bucket**: ✅ **YES** (toggle ON)
- Click "Create bucket"

### 3.4 Create Bucket #3: keying-pdfs
- Click "New bucket"
- **Name**: `keying-pdfs`
- **Public bucket**: ✅ **YES** (toggle ON)
- Click "Create bucket"

✅ **Checkpoint**: You should see 3 buckets:
- [ ] connector-videos (public)
- [ ] terminal-images (public)
- [ ] keying-pdfs (public)

---

## Step 4: Create Database Tables (3 minutes)

### 4.1 Navigate to SQL Editor
- Click **🔧 SQL Editor** in the left sidebar
- Click "New query" button

### 4.2 Copy the Schema SQL
- Open the file: `supabase-setup.sql` (in this folder)
- Copy ALL the contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)

### 4.3 Paste and Run
- Paste into the SQL Editor
- Click "Run" button (bottom right, or Cmd/Ctrl + Enter)
- ⏱️ Wait 2-3 seconds

### 4.4 Verify Success
You should see output like:
```
✅ Database schema created successfully!
📊 Tables: connectors, terminals, keying_documents
🔒 RLS policies enabled for public read access
⚡ Indexes created for optimal performance
```

✅ **Checkpoint**: Verify tables were created:
- Click **🗄️ Database** → **Tables** in sidebar
- You should see:
  - [ ] connectors
  - [ ] terminals
  - [ ] keying_documents

---

## Step 5: Configure Environment Variables (2 minutes)

### 5.1 Navigate to Your Project
Open terminal and go to your project:
```bash
cd "/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/rast5-catalog"
```

### 5.2 Update .env.local File
Open `.env.local` and replace the placeholder values:

**Before:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**After** (use YOUR actual values):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

⚠️ **Important**:
- Use the EXACT values you copied in Step 2
- Don't add quotes around the values
- Make sure there are no extra spaces

### 5.3 Save the File
- Save `.env.local`
- ✅ Environment variables are now configured

---

## Step 6: Test the Connection (3 minutes)

### 6.1 Create Test Script
Create a new file to test the connection:

```bash
# In your rast5-catalog folder
touch test-connection.js
```

Paste this code:
```javascript
// test-connection.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Check connectors table
    const { data, error } = await supabase
      .from('connectors')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    console.log('✅ Connection successful!')
    console.log('✅ Tables are accessible')
    console.log('📊 Connectors table is ready (currently empty)')

    // Test 2: Check storage
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log(`✅ Storage buckets: ${buckets.length} found`)
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })

  } catch (err) {
    console.error('❌ Connection failed:', err.message)
  }
}

testConnection()
```

### 6.2 Install dotenv
```bash
npm install dotenv
```

### 6.3 Run the Test
```bash
node test-connection.js
```

### 6.4 Expected Output
You should see:
```
Testing Supabase connection...
URL: https://xxxxx.supabase.co
Key: eyJhbGciOiJIUzI1NiIs...
✅ Connection successful!
✅ Tables are accessible
📊 Connectors table is ready (currently empty)
✅ Storage buckets: 3 found
   - connector-videos (public)
   - terminal-images (public)
   - keying-pdfs (public)
```

✅ **Checkpoint**: Connection test passed
- [ ] Connection successful
- [ ] Tables accessible
- [ ] Buckets listed

---

## Step 7: Verify in Supabase Dashboard (2 minutes)

### 7.1 Check Table Structure
- Go to Supabase → **🗄️ Database** → **Tables**
- Click on **connectors** table
- You should see columns like: id, model, category, pole_count, etc.

### 7.2 Check Storage
- Go to **🗂️ Storage**
- You should see 3 buckets (all empty for now)

### 7.3 Check Policies
- Go to **🗄️ Database** → **Policies**
- You should see:
  - "Allow public read access on connectors"
  - "Allow public read access on terminals"
  - "Allow public read access on keying_documents"

---

## ✅ Setup Complete!

You've successfully:
- ✅ Created Supabase project
- ✅ Got API credentials
- ✅ Created 3 storage buckets
- ✅ Created database tables (connectors, terminals, keying_documents)
- ✅ Configured environment variables
- ✅ Tested the connection

---

## 📊 Current Status

**Database**: Ready and waiting for data
- 3 tables created with proper indexes
- Row-level security enabled
- Public read access configured

**Storage**: 3 buckets ready
- connector-videos (for 360° videos)
- terminal-images (for terminal component images)
- keying-pdfs (for documentation)

**Next Steps**:
1. ✅ Run data migration script (to populate from RAST 5 folder)
2. ✅ Build catalog page (to display connectors)
3. ✅ Create detail pages (for individual connectors)

---

## 🆘 Troubleshooting

### Issue: "Invalid API Key"
- Double-check you copied the ENTIRE anon key (it's very long)
- Make sure there are no spaces before/after in .env.local
- Try copying the key again from Supabase

### Issue: "Cannot connect to database"
- Check your project URL is correct
- Make sure your project is not paused (free tier pauses after inactivity)
- Restart your dev server: `npm run dev`

### Issue: "Tables not found"
- Go back to SQL Editor
- Re-run the schema SQL
- Check for any error messages

### Issue: "Buckets not showing"
- Make sure you created them as PUBLIC
- Try refreshing the Storage page
- Create them again if needed

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify all credentials are correct
3. Make sure .env.local is saved
4. Restart your terminal/dev server
5. Check Supabase status: https://status.supabase.com

---

**🎉 Congratulations! Your database is ready!**

Next: Run the data migration script to populate it with your RAST 5 connectors.
