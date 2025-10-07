# 📋 Supabase Setup Checklist

Use this checklist to track your progress through the Supabase setup.

---

## ✅ Step-by-Step Checklist

### 1️⃣ Create Supabase Project (5 minutes)
- [ ] Go to https://supabase.com
- [ ] Sign up / Sign in
- [ ] Create new project named `rast5-catalog`
- [ ] Set database password (save it!)
- [ ] Choose region closest to you
- [ ] Wait for project to initialize (~2 minutes)

### 2️⃣ Get API Credentials (2 minutes)
- [ ] Click ⚙️ Settings → API
- [ ] Copy Project URL: `https://xxxxx.supabase.co`
- [ ] Copy Anon/Public Key: `eyJhbGc...` (very long string)
- [ ] Save both in a safe place

### 3️⃣ Create Storage Buckets (5 minutes)
- [ ] Click 🗂️ Storage in sidebar
- [ ] Create bucket: `connector-videos` (PUBLIC ✅)
- [ ] Create bucket: `terminal-images` (PUBLIC ✅)
- [ ] Create bucket: `keying-pdfs` (PUBLIC ✅)

### 4️⃣ Create Database Tables (3 minutes)
- [ ] Click 🔧 SQL Editor
- [ ] Click "New query"
- [ ] Open `supabase-setup.sql` file
- [ ] Copy ALL contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" (or Cmd/Ctrl + Enter)
- [ ] Verify success message appears

### 5️⃣ Configure Environment Variables (2 minutes)
- [ ] Open `.env.local` in rast5-catalog folder
- [ ] Replace Project URL with your actual URL
- [ ] Replace Anon Key with your actual key
- [ ] Save the file

### 6️⃣ Test Connection (3 minutes)
- [ ] Open terminal in rast5-catalog folder
- [ ] Run: `node test-connection.js`
- [ ] Verify "✅ SETUP COMPLETE!" appears
- [ ] Check that 3 buckets are listed

---

## 🎯 Expected Results

After completing all steps, you should see:

```
🔍 Testing Supabase Connection...

📍 URL: https://xxxxx.supabase.co
🔑 Key: eyJhbGciOiJIUzI1NiIs...

Testing database connection...
✅ Database connection successful!
✅ Tables are accessible
📊 Connectors table is ready (currently empty)

✅ Terminals table is ready
✅ Keying documents table is ready

Testing storage buckets...
✅ Storage accessible: 3 bucket(s) found
   ✅ connector-videos (public)
   ✅ terminal-images (public)
   ✅ keying-pdfs (public)

🎉 SETUP COMPLETE!
```

---

## 🆘 Troubleshooting

### ❌ "Invalid API Key"
- Copy the entire anon key again (it's VERY long)
- Make sure no spaces before/after in .env.local
- Restart terminal and try again

### ❌ "Tables not found"
- Go to SQL Editor in Supabase
- Re-run the supabase-setup.sql
- Check for error messages in SQL Editor

### ❌ "Buckets not showing"
- Make sure they're created as PUBLIC
- Refresh Storage page
- Create them again if needed

### ❌ "Cannot connect"
- Check project URL is exact match
- Verify anon key is complete
- Make sure .env.local is saved
- Check if project is paused (free tier)

---

## 📝 Important Files

- `SUPABASE-SETUP-GUIDE.md` - Detailed step-by-step guide
- `supabase-setup.sql` - Database schema (run this in SQL Editor)
- `test-connection.js` - Connection test script (run after setup)
- `.env.local` - Environment variables (update with your credentials)

---

## ✅ Verification

Once setup is complete:

**In Supabase Dashboard:**
- [ ] 3 tables visible (connectors, terminals, keying_documents)
- [ ] 3 storage buckets (all public)
- [ ] RLS policies enabled

**In Terminal:**
- [ ] `node test-connection.js` shows success
- [ ] All checks pass (✅)

**Ready for Next Phase:**
- [ ] Database schema created
- [ ] Storage configured
- [ ] Environment variables set
- [ ] Connection tested

---

## 🚀 What's Next?

After completing this checklist:

1. **Data Migration** - Run script to populate database from RAST 5 folder
2. **Build Catalog** - Create connector listing page
3. **Detail Pages** - Individual connector pages
4. **Deploy** - Push to Vercel

---

**Current Status**: Setup Phase
**Time Required**: ~20 minutes total
**Difficulty**: Easy (follow the steps!)

---

## 📞 Need Help?

If stuck:
1. Check SUPABASE-SETUP-GUIDE.md for detailed instructions
2. Review error messages carefully
3. Verify credentials are exact
4. Check Supabase status: https://status.supabase.com

---

**🎉 Let's get started! Begin with Step 1 above.**
