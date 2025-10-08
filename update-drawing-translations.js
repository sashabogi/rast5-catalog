#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const translations = {
  en: {
    description: "Detailed dimensional specifications and connector layout",
    viewFull: "View Full Size"
  },
  it: {
    description: "Specifiche dimensionali dettagliate e layout del connettore",
    viewFull: "Visualizza Dimensione Completa"
  },
  es: {
    description: "Especificaciones dimensionales detalladas y diseño del conector",
    viewFull: "Ver Tamaño Completo"
  },
  de: {
    description: "Detaillierte Maßangaben und Steckeraufbau",
    viewFull: "Vollständige Größe anzeigen"
  },
  ru: {
    description: "Подробные размерные спецификации и схема разъема",
    viewFull: "Просмотр в полном размере"
  },
  pt: {
    description: "Especificações dimensionais detalhadas e layout do conector",
    viewFull: "Ver Tamanho Completo"
  }
}

const messagesDir = path.join(__dirname, 'messages')

for (const [lang, newKeys] of Object.entries(translations)) {
  const filePath = path.join(messagesDir, `${lang}.json`)

  try {
    // Read the existing file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)

    // Update the drawings object
    if (data.ConnectorDetailPage && data.ConnectorDetailPage.documentation && data.ConnectorDetailPage.documentation.drawings) {
      data.ConnectorDetailPage.documentation.drawings = {
        ...data.ConnectorDetailPage.documentation.drawings,
        ...newKeys
      }

      // Write back to file with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
      console.log(`✅ Updated ${lang}.json`)
    } else {
      console.log(`⚠️  ${lang}.json: Missing expected structure`)
    }
  } catch (error) {
    console.error(`❌ Error updating ${lang}.json:`, error.message)
  }
}

console.log('\n✅ All translation files updated!')
