#!/bin/bash

echo "🎨 REDESIGN TESTING - Inter Font & Template Styling"
echo "=========================================================="
echo ""

# Test all redesigned pages
echo "✅ Testing Redesigned Pages:"
echo ""

# Homepage
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en" 2>/dev/null)
echo "  Homepage (EN): $response"

# Catalog with connector cards
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/catalog" 2>/dev/null)
echo "  Catalog Page (EN): $response"

# Connector Detail
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/connector/X01-CS-R502KxxPF-FR" 2>/dev/null)
echo "  Connector Detail (EN): $response"

# Resources Index
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/resources" 2>/dev/null)
echo "  Resources Index (EN): $response"

# Terminal Guide
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/resources/terminals" 2>/dev/null)
echo "  Terminal Guide (EN): $response"

# Installation Guide
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/resources/installation" 2>/dev/null)
echo "  Installation Guide (EN): $response"

# Connector Selection Guide
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/resources/connector-guide" 2>/dev/null)
echo "  Connector Guide (EN): $response"

echo ""
echo "🌐 Testing Multiple Languages:"
echo ""

# Test Italian
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/it" 2>/dev/null)
echo "  Homepage (IT): $response"

response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/it/catalog" 2>/dev/null)
echo "  Catalog (IT): $response"

# Test Spanish
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/es/resources" 2>/dev/null)
echo "  Resources (ES): $response"

# Test German
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/de/catalog" 2>/dev/null)
echo "  Catalog (DE): $response"

echo ""
echo "=========================================================="
echo "✅ All tests complete!"
