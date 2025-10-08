#!/bin/bash

echo "🔍 COMPREHENSIVE TESTING - RAST 5 Catalog Template Integration"
echo "================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_page() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓${NC} $name - Status: $response"
        return 0
    else
        echo -e "${RED}✗${NC} $name - Status: $response"
        return 1
    fi
}

# Test all 6 languages - Homepage
echo -e "${BLUE}📱 Testing Homepage (All Languages)${NC}"
test_page "http://localhost:3000/en" "English Homepage"
test_page "http://localhost:3000/it" "Italian Homepage"
test_page "http://localhost:3000/es" "Spanish Homepage"
test_page "http://localhost:3000/de" "German Homepage"
test_page "http://localhost:3000/ru" "Russian Homepage"
test_page "http://localhost:3000/pt" "Portuguese Homepage"
echo ""

# Test Catalog pages
echo -e "${BLUE}📚 Testing Catalog Pages${NC}"
test_page "http://localhost:3000/en/catalog" "English Catalog"
test_page "http://localhost:3000/it/catalog" "Italian Catalog"
test_page "http://localhost:3000/es/catalog" "Spanish Catalog"
test_page "http://localhost:3000/de/catalog" "German Catalog"
echo ""

# Test catalog filters
echo -e "${BLUE}🔍 Testing Catalog Filters${NC}"
test_page "http://localhost:3000/en/catalog?gender=Male" "Gender Filter: Male"
test_page "http://localhost:3000/en/catalog?poles=2" "Pole Count Filter: 2-Pole"
test_page "http://localhost:3000/en/catalog?gender=Female&poles=5" "Combined Filters"
echo ""

# Test Resources pages
echo -e "${BLUE}📖 Testing Resources Pages${NC}"
test_page "http://localhost:3000/en/resources" "Resources Index"
test_page "http://localhost:3000/en/resources/terminals" "Terminal Guide"
test_page "http://localhost:3000/en/resources/installation" "Installation Guide"
test_page "http://localhost:3000/en/resources/connector-guide" "Connector Selection Guide"
echo ""

# Test connector detail page (if exists)
echo -e "${BLUE}🔌 Testing Connector Detail Page${NC}"
test_page "http://localhost:3000/en/connector/1" "Connector Detail (ID: 1)"
echo ""

echo "================================================================"
echo -e "${GREEN}✅ Comprehensive Testing Complete${NC}"
