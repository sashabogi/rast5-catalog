# Technical Drawings Implementation Guide

**Date:** October 8, 2025
**Status:** ✅ Ready to Deploy

---

## 📋 Overview

This implementation adds technical drawing support to all connector detail pages. Each connector folder contains a JPG technical drawing file that will now be uploaded to Supabase and displayed on the website.

---

## ✅ What Has Been Completed

### 1. Database Schema Update
- **New Field:** `technical_drawing_url TEXT` added to `connectors` table
- **Purpose:** Stores the URL of the technical drawing JPG for each connector

### 2. TypeScript Interface Update
- **File:** `/src/types/database.ts`
- **Change:** Added `technical_drawing_url: string | null` to Connector interface

### 3. Connector Detail Page Update
- **File:** `/src/app/[locale]/connector/[id]/page.tsx`
- **Changes:**
  - Replaced "Coming Soon" placeholder with actual technical drawing display
  - Shows technical drawing image when available
  - Displays "View Full Size" overlay on hover
  - Opens technical drawing in new tab when clicked
  - Falls back to "Coming Soon" if no drawing is available

### 4. Translation Updates
- **Files:** All 6 language files (en, it, es, de, ru, pt)
- **New Keys:**
  - `ConnectorDetailPage.documentation.drawings.description`
  - `ConnectorDetailPage.documentation.drawings.viewFull`

### 5. Scripts Created

#### `add-technical-drawing-column.sql`
- SQL to add the new column to the database

#### `add-technical-drawings.js`
- Scans all connector folders
- Uploads JPG technical drawings to Supabase
- Updates connector records with technical drawing URLs

---

## 🚀 Deployment Steps

### Step 1: Add Database Column

Go to your Supabase Dashboard → SQL Editor and run:

```sql
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS technical_drawing_url TEXT;
```

**Verify:** Check that the column was added successfully in the Table Editor.

### Step 2: Upload Technical Drawings

Run the upload script:

```bash
cd "/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/rast5-catalog"
node add-technical-drawings.js
```

**Expected Output:**
```
📐 Adding Technical Drawing Support

📊 STEP 1: Checking database schema...
✅ Database schema is ready

📤 STEP 2: Processing Connector Technical Drawings

📁 Processing: X-For socket terminals
...

📁 Processing: X-For tab terminals
...

📁 Processing: X-Printed circuit board headers
...

📊 Summary:
   Processed: X connectors
   Uploaded: X technical drawings
   Updated: X database records

✅ Technical Drawing Support Added!
```

### Step 3: Verify on Website

1. Navigate to any connector detail page
2. Click the "Documentation" tab
3. You should see:
   - **Left card:** Keying Documentation (if available)
   - **Right card:** Technical Drawings (with JPG image)

---

## 📊 Technical Details

### Folder Structure

Each connector folder contains:
```
X04-63N235-MA/
├── 63N235-MA.jpg          ← Technical drawing (what we're adding)
└── video_20250318115052.mp4  ← 360° video (already uploaded)
```

### Upload Storage Path

Technical drawings are uploaded to:
- **Bucket:** `connector-assets`
- **Path:** `technical-drawings/{model}.jpg`
- **Example:** `technical-drawings/63N235-MA.jpg`

### Database Schema

```sql
connectors (
  id TEXT PRIMARY KEY,
  model TEXT UNIQUE NOT NULL,
  -- ... other fields ...
  technical_drawing_url TEXT,  -- NEW FIELD
  keying_pdf TEXT,
  -- ... other fields ...
)
```

---

## 🎨 UI Design

### Technical Drawing Card (When Available)

- **Header:** Green gradient background
- **Title:** "Technical Drawings"
- **Description:** "Detailed dimensional specifications and connector layout"
- **Image:** Full-width technical drawing JPG
- **Hover Effect:** Dark overlay with "View Full Size" button
- **Click:** Opens drawing in new tab

### Placeholder (When Not Available)

- **Dashed border card**
- **Title:** "Technical Drawings"
- **Message:** "Technical drawings coming soon"

---

## 🔍 Testing Checklist

- [ ] Database column added successfully
- [ ] Upload script runs without errors
- [ ] All connectors have technical_drawing_url populated
- [ ] Technical drawings display on connector pages
- [ ] Images load correctly in all browsers
- [ ] Hover effect works (shows "View Full Size")
- [ ] Click opens drawing in new tab
- [ ] Fallback message shows for connectors without drawings
- [ ] All 6 languages display correct translations
- [ ] Mobile responsive (drawing displays well on small screens)

---

## 📝 Example Connectors to Test

### Socket Connectors (Female)
- X02-63N234-FR
- X04-63N035-FR
- X06-63N436-FR

### Tab Connectors (Male) - NEW MA Classification
- X02-63N634-MA
- X04-63N235-MA
- X04-63N335W-MA

### PCB Headers
- X01-CS-R502KnnPCB
- X02-CS-R503KnnPCB
- X04-CS-R505KnnPCB

---

## 🐛 Troubleshooting

### Issue: "Column does not exist" error

**Solution:** Run the SQL migration:
```sql
ALTER TABLE connectors ADD COLUMN technical_drawing_url TEXT;
```

### Issue: Upload script can't find images

**Solution:** Verify folder structure:
```bash
ls "/Users/sashabogojevic/Documents/GitHub/UPDATED Rast 5/RAST 5 Series crimping/X-For tab terminals/X04-63N235-MA/"
```

Should show: `63N235-MA.jpg` and `video_20250318115052.mp4`

### Issue: Images don't display on website

**Solutions:**
1. Check Supabase Storage bucket permissions (should be public)
2. Verify URL in database: `SELECT model, technical_drawing_url FROM connectors LIMIT 5;`
3. Check browser console for CORS errors
4. Verify image uploaded to correct bucket: `connector-assets/technical-drawings/`

### Issue: Translations missing

**Solution:** Re-run translation update script:
```bash
node update-drawing-translations.js
```

---

## 📈 Expected Results

After deployment:

- **~250+ connector pages** will have technical drawings
- **Documentation tab** will show both:
  - Keying PDFs (for connectors that have them)
  - Technical drawings (for all connectors with JPG files)
- **No more "Coming Soon"** placeholder for connectors with drawings

---

## 🔄 Future Enhancements

Potential improvements for later:

1. **Zoom functionality** - Add image zoom/pan on click
2. **Download button** - Direct download instead of opening in new tab
3. **Multiple views** - Support for different angles/views
4. **PDF support** - Accept PDF technical drawings in addition to JPG
5. **CAD file download** - Add DXF/DWG file downloads if available

---

## ✅ Verification Commands

### Check database column exists:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'connectors'
AND column_name = 'technical_drawing_url';
```

### Count connectors with technical drawings:
```sql
SELECT COUNT(*)
FROM connectors
WHERE technical_drawing_url IS NOT NULL;
```

### View sample records:
```sql
SELECT model, technical_drawing_url
FROM connectors
WHERE technical_drawing_url IS NOT NULL
LIMIT 10;
```

---

## 📦 Files Modified

1. `/src/types/database.ts` - Added technical_drawing_url field
2. `/src/app/[locale]/connector/[id]/page.tsx` - Updated UI to display drawings
3. `/messages/en.json` - Added English translations
4. `/messages/it.json` - Added Italian translations
5. `/messages/es.json` - Added Spanish translations
6. `/messages/de.json` - Added German translations
7. `/messages/ru.json` - Added Russian translations
8. `/messages/pt.json` - Added Portuguese translations

## 📦 Files Created

1. `add-technical-drawing-column.sql` - Database migration
2. `add-technical-drawings.js` - Upload script
3. `update-drawing-translations.js` - Translation updater
4. `TECHNICAL_DRAWINGS_IMPLEMENTATION.md` - This file

---

**Generated:** 2025-10-08
**Status:** ✅ Ready for deployment

Next step: Run the database migration and upload script!
