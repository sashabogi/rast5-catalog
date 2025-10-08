-- Add technical_drawing_url column to connectors table
ALTER TABLE connectors ADD COLUMN IF NOT EXISTS technical_drawing_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN connectors.technical_drawing_url IS 'URL to the technical drawing JPG image for this connector';
