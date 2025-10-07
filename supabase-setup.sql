-- RAST 5 Connector Catalog - Database Schema
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. CONNECTORS TABLE (Main Products)
-- =============================================

CREATE TABLE IF NOT EXISTS connectors (
  -- Primary Key
  id TEXT PRIMARY KEY,                    -- e.g., "X01-CS-R502KxxPF"
  model TEXT NOT NULL UNIQUE,             -- e.g., "CS-R502KxxPF"
  display_name TEXT,                      -- e.g., "2-Pole Socket Connector (Horizontal)"

  -- Classification
  category TEXT NOT NULL,                 -- "X-For socket terminals", "X-For tab terminals", "X-Printed circuit board headers"
  pole_count INTEGER NOT NULL,            -- 2, 3, 4, 5, 6, 7, 8, 9, 10, 12

  -- Type & Orientation
  connector_type TEXT NOT NULL,           -- "R" (female), "T" (male), "S" (alt female)
  gender TEXT NOT NULL,                   -- "Female", "Male", "PCB"
  orientation TEXT,                       -- "Horizontal", "Vertical"
  mounting_type TEXT,                     -- "Flag", "Vertical", "PCB", "Special"
  terminal_suffix TEXT NOT NULL,          -- "FR", "VR", "VS", "FT", "VT", "PC"

  -- Terminal Information
  terminal_specs JSONB,                   -- ["5333.xx", "5335.xx"] for FR
  terminal_description TEXT,              -- "Female socket terminals for crimping onto wires"

  -- Compatibility
  compatible_with JSONB,                  -- ["CS-T502*"] - array of compatible model patterns
  mates_with JSONB,                       -- ["X11-CS-T502VKxxPF-VT"] - array of specific connector IDs
  assembly_variants JSONB,                -- ["X01-CS-R502VKxxPF-VR"] - same connector, different orientation

  -- Media (360° video IS the primary visual)
  video_360_url TEXT NOT NULL,            -- URL to 360° video in Supabase Storage
  video_thumbnail_time FLOAT DEFAULT 0,   -- Which second to use as thumbnail

  -- Documentation
  keying_pdf TEXT,                        -- Filename of keying PDF
  is_special_version BOOLEAN DEFAULT false,
  special_notes TEXT,                     -- For 63N series special configurations

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_connectors_pole_count ON connectors(pole_count);
CREATE INDEX IF NOT EXISTS idx_connectors_category ON connectors(category);
CREATE INDEX IF NOT EXISTS idx_connectors_gender ON connectors(gender);
CREATE INDEX IF NOT EXISTS idx_connectors_terminal_suffix ON connectors(terminal_suffix);
CREATE INDEX IF NOT EXISTS idx_connectors_model ON connectors(model);

-- =============================================
-- 2. TERMINALS TABLE (Components, NOT Products)
-- =============================================

CREATE TABLE IF NOT EXISTS terminals (
  id SERIAL PRIMARY KEY,
  spec_number TEXT NOT NULL UNIQUE,       -- "5333.xx", "6423.xx", "19969.02"
  terminal_type TEXT NOT NULL,            -- "FR", "FT", "PC", "VR", "VS", "VT"
  gender TEXT NOT NULL,                   -- "Female", "Male"
  description TEXT,                       -- "Female socket terminal for flag receptacle"
  image_url TEXT,                         -- URL to terminal image in Supabase Storage
  used_in_suffix JSONB,                   -- ["FR", "VR", "VS"] - which connector suffixes use this
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_terminals_spec_number ON terminals(spec_number);
CREATE INDEX IF NOT EXISTS idx_terminals_type ON terminals(terminal_type);

-- =============================================
-- 3. KEYING DOCUMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS keying_documents (
  id SERIAL PRIMARY KEY,
  pole_count INTEGER NOT NULL,            -- 2, 3, 4, etc.
  document_type TEXT NOT NULL,            -- "Standard", "Special Versions"
  filename TEXT NOT NULL,                 -- "2-Pole - RAST 5 - Keying.pdf"
  file_url TEXT NOT NULL,                 -- URL to PDF in Supabase Storage
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_keying_pole_count ON keying_documents(pole_count);

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS) - Public Read Access
-- =============================================

-- Enable RLS
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE keying_documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access (since this is a public catalog)
CREATE POLICY "Allow public read access on connectors"
  ON connectors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on terminals"
  ON terminals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on keying_documents"
  ON keying_documents FOR SELECT
  TO public
  USING (true);

-- =============================================
-- 5. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to connectors table
DROP TRIGGER IF EXISTS update_connectors_updated_at ON connectors;
CREATE TRIGGER update_connectors_updated_at
    BEFORE UPDATE ON connectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check that tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('connectors', 'terminals', 'keying_documents');

-- Check indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('connectors', 'terminals', 'keying_documents');

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables: connectors, terminals, keying_documents';
  RAISE NOTICE '🔒 RLS policies enabled for public read access';
  RAISE NOTICE '⚡ Indexes created for optimal performance';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create storage buckets (connector-videos, terminal-images, keying-pdfs)';
  RAISE NOTICE '2. Update .env.local with Supabase credentials';
  RAISE NOTICE '3. Run data migration script';
END $$;
