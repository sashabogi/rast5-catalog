#!/bin/bash

# ============================================================================
# Middleware Test Script
# ============================================================================
# This script tests the middleware implementation by checking various scenarios
# Usage: ./test-middleware.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL (change if needed)
BASE_URL="http://localhost:3000"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

echo ""
echo "=================================================="
echo "  Middleware Test Suite"
echo "=================================================="
echo ""
echo "Testing middleware at: $BASE_URL"
echo ""

# ============================================================================
# Helper Functions
# ============================================================================

print_test() {
  echo -e "${BLUE}TEST:${NC} $1"
}

print_pass() {
  echo -e "${GREEN}✓ PASS:${NC} $1"
  ((TESTS_PASSED++))
}

print_fail() {
  echo -e "${RED}✗ FAIL:${NC} $1"
  ((TESTS_FAILED++))
}

print_info() {
  echo -e "${YELLOW}INFO:${NC} $1"
}

# ============================================================================
# Test 1: Check if middleware file exists
# ============================================================================

print_test "Checking if middleware.ts exists"
if [ -f "middleware.ts" ]; then
  print_pass "middleware.ts found"
else
  print_fail "middleware.ts not found"
fi

echo ""

# ============================================================================
# Test 2: Check if development server is running
# ============================================================================

print_test "Checking if development server is running"
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" > /dev/null 2>&1; then
  print_pass "Development server is running at $BASE_URL"
else
  print_fail "Development server is not running. Start it with 'npm run dev'"
  echo ""
  echo "Please start the development server and run this script again."
  exit 1
fi

echo ""

# ============================================================================
# Test 3: Test unauthenticated access to admin dashboard
# ============================================================================

print_test "Testing unauthenticated access to /en/admin/dashboard"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L "$BASE_URL/en/admin/dashboard")

if [ "$RESPONSE" = "200" ]; then
  # Follow redirects and check final URL
  FINAL_URL=$(curl -s -o /dev/null -w "%{url_effective}" -L "$BASE_URL/en/admin/dashboard")
  if [[ "$FINAL_URL" == *"/admin/login"* ]]; then
    print_pass "Unauthenticated user redirected to login (final URL: $FINAL_URL)"
  else
    print_fail "Expected redirect to login, but got: $FINAL_URL"
  fi
else
  print_info "Response code: $RESPONSE (might be expected for redirect)"
fi

echo ""

# ============================================================================
# Test 4: Test access to public login page
# ============================================================================

print_test "Testing access to public login page /en/admin/login"
LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/en/admin/login")

if [ "$LOGIN_RESPONSE" = "200" ]; then
  print_pass "Login page is accessible without authentication"
else
  print_fail "Login page returned status code: $LOGIN_RESPONSE (expected 200)"
fi

echo ""

# ============================================================================
# Test 5: Test locale preservation in redirects
# ============================================================================

for locale in en it es de ru pt; do
  print_test "Testing locale preservation for /$locale/admin/dashboard"
  FINAL_URL=$(curl -s -o /dev/null -w "%{url_effective}" -L "$BASE_URL/$locale/admin/dashboard")

  if [[ "$FINAL_URL" == *"/$locale/admin/login"* ]]; then
    print_pass "Locale '$locale' preserved in redirect"
  else
    print_fail "Locale '$locale' not preserved. Final URL: $FINAL_URL"
  fi
done

echo ""

# ============================================================================
# Test 6: Check environment variables
# ============================================================================

print_test "Checking if .env.local exists"
if [ -f ".env.local" ]; then
  print_pass ".env.local found"

  # Check for required variables (without exposing values)
  print_test "Checking for required environment variables"

  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    print_pass "NEXT_PUBLIC_SUPABASE_URL is set"
  else
    print_fail "NEXT_PUBLIC_SUPABASE_URL is missing"
  fi

  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    print_pass "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
  else
    print_fail "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
  fi

  if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    print_pass "SUPABASE_SERVICE_ROLE_KEY is set"
  else
    print_fail "SUPABASE_SERVICE_ROLE_KEY is missing"
  fi
else
  print_fail ".env.local not found"
fi

echo ""

# ============================================================================
# Test 7: Check documentation files
# ============================================================================

print_test "Checking if documentation files exist"

if [ -f "MIDDLEWARE_DOCUMENTATION.md" ]; then
  print_pass "MIDDLEWARE_DOCUMENTATION.md found"
else
  print_fail "MIDDLEWARE_DOCUMENTATION.md not found"
fi

if [ -f "MIDDLEWARE_IMPLEMENTATION_SUMMARY.md" ]; then
  print_pass "MIDDLEWARE_IMPLEMENTATION_SUMMARY.md found"
else
  print_fail "MIDDLEWARE_IMPLEMENTATION_SUMMARY.md not found"
fi

if [ -f "MIDDLEWARE_QUICK_REFERENCE.md" ]; then
  print_pass "MIDDLEWARE_QUICK_REFERENCE.md found"
else
  print_fail "MIDDLEWARE_QUICK_REFERENCE.md not found"
fi

echo ""

# ============================================================================
# Test 8: Check Supabase server utilities
# ============================================================================

print_test "Checking if Supabase server utilities exist"

if [ -f "src/lib/supabase/server.ts" ]; then
  print_pass "src/lib/supabase/server.ts found"

  # Check for required functions
  if grep -q "createServiceClient" src/lib/supabase/server.ts; then
    print_pass "createServiceClient() function exists"
  else
    print_fail "createServiceClient() function not found"
  fi

  if grep -q "getCurrentAdminUserWithRole" src/lib/supabase/server.ts; then
    print_pass "getCurrentAdminUserWithRole() function exists"
  else
    print_fail "getCurrentAdminUserWithRole() function not found"
  fi
else
  print_fail "src/lib/supabase/server.ts not found"
fi

echo ""

# ============================================================================
# Test Summary
# ============================================================================

echo "=================================================="
echo "  Test Summary"
echo "=================================================="
echo ""
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Create admin login page: src/app/[locale]/admin/login/page.tsx"
  echo "2. Create admin layout: src/app/[locale]/admin/layout.tsx"
  echo "3. Test with actual admin user credentials"
  echo ""
  exit 0
else
  echo -e "${RED}Some tests failed. Please fix the issues above.${NC}"
  echo ""
  echo "Common issues:"
  echo "- Development server not running (npm run dev)"
  echo "- Missing environment variables in .env.local"
  echo "- Missing admin_users table in Supabase"
  echo ""
  exit 1
fi
