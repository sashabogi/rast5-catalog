# Quick Start: Technical Drawings

## ✅ What's Been Done

1. ✅ TypeScript interface updated with `technical_drawing_url` field
2. ✅ Connector detail page updated to display technical drawings
3. ✅ All 6 language translation files updated
4. ✅ Upload script created to process all connector technical drawings

---

## 🚀 What You Need to Do (3 Steps)

### Step 1: Add Database Column (Required)

Go to Supabase Dashboard → SQL Editor and paste:

```sql
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS technical_drawing_url TEXT;
```

Click "Run" ▶️

---

### Step 2: Upload Technical Drawings (Required)

Run this command in your terminal:

```bash
cd "/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/rast5-catalog"
node add-technical-drawings.js
```

This will:
- Scan all connector folders
- Find JPG technical drawings
- Upload them to Supabase Storage
- Update database records with URLs

**Expected time:** ~2-5 minutes depending on number of connectors

---

### Step 3: Test on Website (Verify)

1. Open your website
2. Navigate to any connector (e.g., X04-63N235-MA)
3. Click the "Documentation" tab
4. You should see the technical drawing displayed (no more "Coming Soon")

---

## 📁 File Locations

All implementation files are in your project root:

- `add-technical-drawing-column.sql` - SQL to run in Supabase
- `add-technical-drawings.js` - Upload script
- `TECHNICAL_DRAWINGS_IMPLEMENTATION.md` - Full documentation

---

## ❓ Quick FAQ

**Q: Do I need to restart the dev server?**
A: The UI updates will auto-reload after you save files.

**Q: What if some connectors don't have JPG files?**
A: They'll show "Coming Soon" - no errors.

**Q: Can I run the upload script multiple times?**
A: Yes! It uses `upsert: true` so it won't create duplicates.

**Q: Where are the images stored?**
A: Supabase Storage → `connector-assets` bucket → `technical-drawings/` folder

---

## 🎯 Summary

**Before:**
- Technical drawings: "Coming Soon" placeholder

**After:**
- Technical drawings: Full JPG image displayed
- Hover effect: "View Full Size" overlay
- Click: Opens full-size image in new tab

---

**Ready?** Start with Step 1 above! 🚀
