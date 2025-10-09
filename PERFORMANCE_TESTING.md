# Performance Testing & Optimization Guide

## Overview

This document outlines performance testing strategies, benchmarks, and optimization recommendations for the RAST 5 Admin Backend.

---

## Table of Contents

1. [Performance Metrics](#performance-metrics)
2. [Testing Tools](#testing-tools)
3. [Performance Benchmarks](#performance-benchmarks)
4. [Optimization Strategies](#optimization-strategies)
5. [Monitoring & Observability](#monitoring--observability)
6. [Performance Testing Checklist](#performance-testing-checklist)

---

## Performance Metrics

### Core Web Vitals

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **First Contentful Paint (FCP)** | < 1.8s | TBD | ⏳ |
| **Largest Contentful Paint (LCP)** | < 2.5s | TBD | ⏳ |
| **Time to Interactive (TTI)** | < 3.8s | TBD | ⏳ |
| **First Input Delay (FID)** | < 100ms | TBD | ⏳ |
| **Cumulative Layout Shift (CLS)** | < 0.1 | TBD | ⏳ |
| **Total Blocking Time (TBT)** | < 200ms | TBD | ⏳ |

### Backend Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| **API Response Time (p50)** | < 200ms | Median response time |
| **API Response Time (p95)** | < 500ms | 95th percentile |
| **API Response Time (p99)** | < 1000ms | 99th percentile |
| **Database Query Time** | < 100ms | Most queries |
| **Authentication Time** | < 150ms | User login flow |
| **Rate Limit Check** | < 10ms | Per request |
| **Audit Log Write** | < 50ms | Async preferred |

---

## Testing Tools

### 1. Lighthouse CI

**Purpose**: Automated performance testing in CI/CD

**Setup**:
```bash
npm install -D @lhci/cli

# Create lighthouserc.js
cat > lighthouserc.js <<'EOF'
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/en/admin/login'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
EOF
```

**Run Lighthouse**:
```bash
# Start dev server
npm run dev

# Run Lighthouse CI
npx lhci autorun
```

### 2. Next.js Built-in Performance Tools

**Analyze Bundle Size**:
```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... existing config
})

# Run analysis
ANALYZE=true npm run build
```

**Next.js Speed Insights**:
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 3. Playwright Performance Testing

**Create performance test**:
```typescript
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test('admin login page loads in < 2 seconds', async ({ page }) => {
  const startTime = Date.now()

  await page.goto('/en/admin/login')
  await page.waitForLoadState('networkidle')

  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(2000)
})

test('admin dashboard API responses < 500ms', async ({ page }) => {
  const responses: number[] = []

  page.on('response', (response) => {
    if (response.url().includes('/api/')) {
      responses.push(response.timing().responseEnd)
    }
  })

  await page.goto('/en/admin/dashboard')
  await page.waitForLoadState('networkidle')

  const avgResponseTime = responses.reduce((a, b) => a + b, 0) / responses.length
  expect(avgResponseTime).toBeLessThan(500)
})
```

### 4. k6 Load Testing

**Install k6**:
```bash
# macOS
brew install k6

# Or download from https://k6.io/docs/getting-started/installation/
```

**Create load test script**:
```javascript
// tests/load/login-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
}

export default function () {
  const payload = JSON.stringify({
    email: 'admin@example.com',
    password: 'SecurePassword123!',
  })

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const res = http.post('http://localhost:3000/api/auth/login', payload, params)

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)
}
```

**Run load test**:
```bash
k6 run tests/load/login-test.js
```

---

## Performance Benchmarks

### Database Query Performance

**Benchmark Script**:
```typescript
// scripts/benchmark-db.ts
import { createClient } from '@supabase/supabase-js'
import { performance } from 'perf_hooks'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function benchmarkQuery(name: string, queryFn: () => Promise<any>) {
  const iterations = 100
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await queryFn()
    const end = performance.now()
    times.push(end - start)
  }

  const avg = times.reduce((a, b) => a + b, 0) / iterations
  const p50 = times.sort((a, b) => a - b)[Math.floor(iterations * 0.5)]
  const p95 = times.sort((a, b) => a - b)[Math.floor(iterations * 0.95)]
  const p99 = times.sort((a, b) => a - b)[Math.floor(iterations * 0.99)]

  console.log(`${name}:`)
  console.log(`  Average: ${avg.toFixed(2)}ms`)
  console.log(`  p50: ${p50.toFixed(2)}ms`)
  console.log(`  p95: ${p95.toFixed(2)}ms`)
  console.log(`  p99: ${p99.toFixed(2)}ms`)
  console.log()
}

async function runBenchmarks() {
  // Benchmark: Get user by ID
  await benchmarkQuery('Get user by ID', async () => {
    await supabase.auth.getUser()
  })

  // Benchmark: Check admin status
  await benchmarkQuery('Check admin status', async () => {
    await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', 'test-user-id')
      .single()
  })

  // Benchmark: List connectors
  await benchmarkQuery('List connectors (paginated)', async () => {
    await supabase
      .from('connectors')
      .select('*')
      .range(0, 24)
  })

  // Benchmark: Audit log write
  await benchmarkQuery('Write audit log', async () => {
    await supabase.rpc('log_admin_action', {
      p_user_id: 'test-user-id',
      p_action: 'READ',
      p_resource_type: 'connector',
      p_resource_id: 'test-id',
      p_status: 'SUCCESS',
    })
  })
}

runBenchmarks().catch(console.error)
```

**Run benchmarks**:
```bash
npx tsx scripts/benchmark-db.ts
```

---

## Optimization Strategies

### 1. Frontend Optimizations

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/connector-image.jpg"
  alt="Connector"
  width={400}
  height={300}
  loading="lazy"
  quality={85}
/>
```

#### Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR if not needed
})
```

#### Lazy Loading
```typescript
// Lazy load components below the fold
import { lazy, Suspense } from 'react'

const ConnectorTable = lazy(() => import('@/components/ConnectorTable'))

function ConnectorsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ConnectorTable />
    </Suspense>
  )
}
```

#### React Server Components
```typescript
// app/[locale]/admin/dashboard/page.tsx
// Use Server Components by default for data fetching
export default async function DashboardPage() {
  const stats = await fetchDashboardStats() // Server-side fetch

  return <DashboardView stats={stats} />
}
```

### 2. Backend Optimizations

#### Database Indexing
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_connectors_series ON connectors(series);
CREATE INDEX idx_connectors_gender ON connectors(gender);
```

#### Connection Pooling
```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

// Use connection pooling in production
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        'x-connection-pool': 'enabled',
      },
    },
  }
)
```

#### Caching Strategy
```typescript
// Use React cache for server components
import { cache } from 'react'

export const getConnectorById = cache(async (id: string) => {
  const { data } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', id)
    .single()

  return data
})

// Use Next.js revalidation
export const revalidate = 3600 // Revalidate every hour
```

#### Rate Limiting Optimization
```typescript
// Use in-memory cache for rate limiting
import { LRUCache } from 'lru-cache'

const rateLimitCache = new LRUCache<string, number>({
  max: 10000,
  ttl: 15 * 60 * 1000, // 15 minutes
})

export function checkRateLimit(fingerprint: string): boolean {
  const attempts = rateLimitCache.get(fingerprint) || 0

  if (attempts >= 5) {
    return false
  }

  rateLimitCache.set(fingerprint, attempts + 1)
  return true
}
```

### 3. Network Optimizations

#### Enable Compression
```typescript
// next.config.js
module.exports = {
  compress: true, // Enable gzip compression
}
```

#### HTTP/2 Server Push
```typescript
// Use Vercel or configure HTTP/2 on your server
// Automatically enabled on Vercel
```

#### Prefetching
```typescript
// Use Next.js Link with prefetch
import Link from 'next/link'

<Link href="/admin/connectors" prefetch={true}>
  Connectors
</Link>
```

---

## Monitoring & Observability

### 1. Vercel Analytics

**Install**:
```bash
npm install @vercel/analytics
```

**Setup**:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Sentry Performance Monitoring

**Install**:
```bash
npm install @sentry/nextjs
```

**Configure**:
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ['localhost', 'rast5-catalog.vercel.app'],
    }),
  ],
})
```

### 3. Custom Performance Logging

```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = performance.now()

    try {
      const result = await fn(...args)
      const duration = performance.now() - start

      console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`)

      // Send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name,
          value: Math.round(duration),
          event_category: 'Performance',
        })
      }

      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`[PERF ERROR] ${name}: ${duration.toFixed(2)}ms`, error)
      throw error
    }
  }
}

// Usage
const fetchConnectors = measurePerformance('fetchConnectors', async () => {
  return await supabase.from('connectors').select('*')
})
```

---

## Performance Testing Checklist

### Pre-Deployment Checklist

- [ ] **Run Lighthouse CI** with minimum scores:
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 80+

- [ ] **Bundle Size Analysis**
  - Main bundle < 200KB gzipped
  - No duplicate dependencies
  - Tree shaking enabled

- [ ] **Database Performance**
  - All queries < 100ms (p95)
  - Indexes on foreign keys
  - Connection pooling enabled

- [ ] **API Performance**
  - p50 response time < 200ms
  - p95 response time < 500ms
  - p99 response time < 1000ms

- [ ] **Load Testing**
  - Handle 50 concurrent users
  - Error rate < 1%
  - No memory leaks

- [ ] **Caching Strategy**
  - Static assets cached (1 year)
  - API responses cached appropriately
  - CDN configured

- [ ] **Image Optimization**
  - All images using Next.js Image
  - WebP format enabled
  - Lazy loading below fold

- [ ] **Code Splitting**
  - Dynamic imports for heavy components
  - Route-based splitting
  - Vendor chunk optimization

- [ ] **Monitoring Setup**
  - Error tracking (Sentry)
  - Performance monitoring (Vercel/Sentry)
  - Real user monitoring

---

## Running Performance Tests

### Complete Performance Test Suite

```bash
# 1. Run unit tests with coverage
npm run test:coverage

# 2. Run E2E tests
npm run test:e2e

# 3. Build production bundle
npm run build

# 4. Analyze bundle size
ANALYZE=true npm run build

# 5. Start production server
npm run start

# 6. Run Lighthouse CI (in another terminal)
npx lhci autorun

# 7. Run load tests (with k6)
k6 run tests/load/login-test.js

# 8. Database benchmarks
npx tsx scripts/benchmark-db.ts
```

---

## Performance Optimization Roadmap

### Phase 1: Current (MVP)
- ✅ Next.js 15 with App Router
- ✅ Server Components for data fetching
- ✅ Image optimization with next/image
- ✅ Automatic code splitting

### Phase 2: Short-term (Next Sprint)
- [ ] Implement Lighthouse CI in GitHub Actions
- [ ] Add bundle size monitoring
- [ ] Set up Vercel Analytics
- [ ] Create performance budget
- [ ] Add database indexes

### Phase 3: Medium-term
- [ ] Implement Redis caching layer
- [ ] Add service workers for offline support
- [ ] Optimize critical rendering path
- [ ] Implement lazy loading for tables
- [ ] Add prefetching for common routes

### Phase 4: Long-term
- [ ] Implement CDN for static assets
- [ ] Add edge caching with Vercel Edge
- [ ] Optimize database queries with materialized views
- [ ] Implement streaming SSR
- [ ] Add progressive enhancement

---

## Conclusion

Performance testing should be continuous and automated. This document provides the foundation for measuring, monitoring, and optimizing the RAST 5 Admin Backend.

**Key Takeaways:**
1. **Measure First**: Establish baselines before optimizing
2. **Automate**: Integrate performance tests into CI/CD
3. **Monitor**: Track real user metrics in production
4. **Iterate**: Continuously improve based on data

For questions or suggestions, refer to the Next.js Performance documentation: https://nextjs.org/docs/app/building-your-application/optimizing
