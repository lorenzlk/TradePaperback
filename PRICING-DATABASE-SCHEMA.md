# Pricing Database Schema
## Track High/Low/Average Prices for Marketplace Intelligence

---

## 🎯 Overview

The pricing system needs to:
1. **Track all listings** - Every seller's price + condition
2. **Calculate real-time averages** - High/Low/Avg by condition
3. **Store price history** - Trend analysis over time
4. **Enable comparisons** - Seller price vs. market average

---

## 📊 Database Tables

### Table 1: `books`
**Purpose**: Master catalog of all books in system

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identifiers
  isbn VARCHAR(13) UNIQUE NOT NULL,
  upc VARCHAR(14),
  
  -- Basic Info
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  authors TEXT[], -- Array of author names
  publisher VARCHAR(255),
  published_date DATE,
  
  -- Physical Details
  format VARCHAR(50), -- Trade Paperback, Hardcover, etc.
  page_count INTEGER,
  dimensions VARCHAR(50), -- "6x9x0.5 inches"
  weight_oz DECIMAL(5,2),
  
  -- Classification
  series VARCHAR(255),
  volume_issue VARCHAR(50), -- "Vol 1" or "#1"
  genre TEXT[], -- Array: ["Superhero", "Action"]
  categories TEXT[], -- ["Comics", "DC Comics", "Batman"]
  
  -- Images
  cover_image_url TEXT,
  cover_image_thumbnail TEXT,
  
  -- Metadata
  description TEXT,
  language VARCHAR(10) DEFAULT 'en',
  
  -- Enrichment
  goodreads_id VARCHAR(50),
  google_books_id VARCHAR(50),
  comic_vine_id VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_isbn (isbn),
  INDEX idx_title (title),
  INDEX idx_publisher (publisher),
  FULLTEXT INDEX idx_search (title, authors, series)
);
```

---

### Table 2: `listings`
**Purpose**: Individual seller listings (active inventory)

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  
  -- Pricing
  list_price DECIMAL(10,2) NOT NULL, -- Seller's asking price
  original_price DECIMAL(10,2), -- MSRP for reference
  
  -- Condition (1-4 scale)
  condition_grade INTEGER NOT NULL CHECK (condition_grade BETWEEN 1 AND 4),
  -- 1 = MINT, 2 = GOOD, 3 = FAIR, 4 = WORN
  
  condition_notes TEXT, -- Optional seller notes
  
  -- Inventory
  quantity INTEGER DEFAULT 1,
  location VARCHAR(100), -- Shelf location in shop
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  -- active, sold, removed, expired
  
  visibility VARCHAR(20) DEFAULT 'public',
  -- public, private, regional
  
  -- Features
  is_featured BOOLEAN DEFAULT FALSE,
  is_negotiable BOOLEAN DEFAULT FALSE,
  
  -- Sales
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  
  -- Timestamps
  listed_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Optional expiration
  sold_at TIMESTAMP,
  removed_at TIMESTAMP,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_book_status (book_id, status),
  INDEX idx_seller (seller_id),
  INDEX idx_price (list_price),
  INDEX idx_condition (condition_grade),
  INDEX idx_status (status)
);
```

---

### Table 3: `sales`
**Purpose**: Historical sales data for accurate pricing

```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  listing_id UUID REFERENCES listings(id),
  book_id UUID NOT NULL REFERENCES books(id),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  buyer_id UUID REFERENCES buyers(id),
  
  -- Sale Details
  sale_price DECIMAL(10,2) NOT NULL,
  condition_grade INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  
  -- Transaction
  transaction_id VARCHAR(100), -- Stripe payment intent
  platform_fee DECIMAL(10,2),
  seller_payout DECIMAL(10,2),
  
  -- Timestamps
  sold_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_book_date (book_id, sold_at DESC),
  INDEX idx_seller (seller_id),
  INDEX idx_buyer (buyer_id),
  INDEX idx_date (sold_at DESC)
);
```

---

### Table 4: `pricing_snapshots`
**Purpose**: Daily aggregated pricing data for fast queries

```sql
CREATE TABLE pricing_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  book_id UUID NOT NULL REFERENCES books(id),
  snapshot_date DATE NOT NULL,
  
  -- Overall Market Data (all conditions)
  avg_price DECIMAL(10,2),
  median_price DECIMAL(10,2),
  high_price DECIMAL(10,2),
  low_price DECIMAL(10,2),
  
  listing_count INTEGER DEFAULT 0,
  active_sellers_count INTEGER DEFAULT 0,
  
  -- By Condition (MINT - Grade 1)
  mint_avg_price DECIMAL(10,2),
  mint_high_price DECIMAL(10,2),
  mint_low_price DECIMAL(10,2),
  mint_count INTEGER DEFAULT 0,
  
  -- By Condition (GOOD - Grade 2)
  good_avg_price DECIMAL(10,2),
  good_high_price DECIMAL(10,2),
  good_low_price DECIMAL(10,2),
  good_count INTEGER DEFAULT 0,
  
  -- By Condition (FAIR - Grade 3)
  fair_avg_price DECIMAL(10,2),
  fair_high_price DECIMAL(10,2),
  fair_low_price DECIMAL(10,2),
  fair_count INTEGER DEFAULT 0,
  
  -- By Condition (WORN - Grade 4)
  worn_avg_price DECIMAL(10,2),
  worn_high_price DECIMAL(10,2),
  worn_low_price DECIMAL(10,2),
  worn_count INTEGER DEFAULT 0,
  
  -- Sales Velocity
  sales_last_7_days INTEGER DEFAULT 0,
  sales_last_30_days INTEGER DEFAULT 0,
  avg_days_to_sale DECIMAL(5,1),
  
  -- Trends
  price_trend VARCHAR(10), -- up, down, stable
  price_change_pct DECIMAL(5,2), -- % change from last week
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(book_id, snapshot_date),
  INDEX idx_book_date (book_id, snapshot_date DESC),
  INDEX idx_date (snapshot_date DESC)
);
```

---

### Table 5: `price_alerts`
**Purpose**: Notify sellers of significant price changes

```sql
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  book_id UUID NOT NULL REFERENCES books(id),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  listing_id UUID REFERENCES listings(id),
  
  -- Alert Type
  alert_type VARCHAR(50) NOT NULL,
  -- above_average, below_average, price_drop, price_spike
  
  -- Data
  your_price DECIMAL(10,2),
  market_avg DECIMAL(10,2),
  difference_pct DECIMAL(5,2),
  
  -- Status
  sent_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  action_taken VARCHAR(50), -- adjusted, kept, removed
  
  -- Indexes
  INDEX idx_seller_book (seller_id, book_id),
  INDEX idx_sent (sent_at DESC)
);
```

---

## 🔄 Pricing Calculation Logic

### Real-Time Price Query

**Get current pricing for a book**:
```sql
-- Get active listings for a book
WITH active_listings AS (
  SELECT 
    list_price,
    condition_grade,
    listed_at
  FROM listings
  WHERE book_id = $1
    AND status = 'active'
    AND expires_at > NOW() OR expires_at IS NULL
)

-- Calculate aggregates
SELECT
  -- Overall
  AVG(list_price) as avg_price,
  MAX(list_price) as high_price,
  MIN(list_price) as low_price,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY list_price) as median_price,
  COUNT(*) as listing_count,
  
  -- By Condition
  AVG(CASE WHEN condition_grade = 1 THEN list_price END) as mint_avg,
  AVG(CASE WHEN condition_grade = 2 THEN list_price END) as good_avg,
  AVG(CASE WHEN condition_grade = 3 THEN list_price END) as fair_avg,
  AVG(CASE WHEN condition_grade = 4 THEN list_price END) as worn_avg,
  
  -- Recent Sales (from sales table)
  (
    SELECT AVG(sale_price)
    FROM sales
    WHERE book_id = $1
      AND sold_at > NOW() - INTERVAL '30 days'
  ) as avg_recent_sale

FROM active_listings;
```

### API Endpoint

```javascript
// GET /api/v1/books/:isbn/pricing
async function getBookPricing(isbn) {
  // 1. Get book_id from ISBN
  const book = await db.query(
    'SELECT id FROM books WHERE isbn = $1',
    [isbn]
  );
  
  if (!book) return { error: 'Book not found' };
  
  // 2. Check if we have recent snapshot (< 1 hour old)
  const snapshot = await db.query(`
    SELECT * FROM pricing_snapshots
    WHERE book_id = $1
      AND snapshot_date = CURRENT_DATE
    ORDER BY created_at DESC
    LIMIT 1
  `, [book.id]);
  
  if (snapshot && snapshot.created_at > Date.now() - 3600000) {
    // Use cached snapshot
    return formatPricingData(snapshot);
  }
  
  // 3. Calculate real-time pricing
  const pricing = await calculateRealTimePricing(book.id);
  
  // 4. Cache result
  await cachePricingSnapshot(book.id, pricing);
  
  return pricing;
}
```

---

## 📈 Daily Snapshot Job

**Cron Job** (runs every day at 2am):

```javascript
// jobs/daily-pricing-snapshot.js
async function generateDailySnapshots() {
  // Get all books with active listings
  const books = await db.query(`
    SELECT DISTINCT book_id
    FROM listings
    WHERE status = 'active'
  `);
  
  for (const book of books) {
    const pricing = await calculateRealTimePricing(book.book_id);
    
    await db.query(`
      INSERT INTO pricing_snapshots (
        book_id,
        snapshot_date,
        avg_price,
        high_price,
        low_price,
        listing_count,
        mint_avg_price,
        good_avg_price,
        fair_avg_price,
        worn_avg_price,
        sales_last_7_days,
        sales_last_30_days
      ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (book_id, snapshot_date)
      DO UPDATE SET
        avg_price = EXCLUDED.avg_price,
        high_price = EXCLUDED.high_price,
        low_price = EXCLUDED.low_price,
        updated_at = NOW()
    `, [
      book.book_id,
      pricing.avg_price,
      pricing.high_price,
      pricing.low_price,
      pricing.listing_count,
      pricing.mint_avg,
      pricing.good_avg,
      pricing.fair_avg,
      pricing.worn_avg,
      pricing.sales_7d,
      pricing.sales_30d
    ]);
  }
  
  console.log(`✓ Generated snapshots for ${books.length} books`);
}
```

---

## 🔔 Price Alert Generation

**Weekly Job** (runs Monday at 9am):

```javascript
// jobs/weekly-price-alerts.js
async function generatePriceAlerts() {
  // Get all active listings
  const listings = await db.query(`
    SELECT 
      l.id as listing_id,
      l.book_id,
      l.seller_id,
      l.list_price,
      l.condition_grade,
      ps.avg_price as market_avg
    FROM listings l
    JOIN pricing_snapshots ps ON l.book_id = ps.book_id
      AND ps.snapshot_date = CURRENT_DATE
    WHERE l.status = 'active'
  `);
  
  for (const listing of listings) {
    const diff = listing.list_price - listing.market_avg;
    const diff_pct = (diff / listing.market_avg) * 100;
    
    // Generate alert if >20% above or below average
    if (Math.abs(diff_pct) > 20) {
      const alert_type = diff > 0 ? 'above_average' : 'below_average';
      
      await db.query(`
        INSERT INTO price_alerts (
          book_id,
          seller_id,
          listing_id,
          alert_type,
          your_price,
          market_avg,
          difference_pct
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        listing.book_id,
        listing.seller_id,
        listing.listing_id,
        alert_type,
        listing.list_price,
        listing.market_avg,
        diff_pct
      ]);
    }
  }
  
  // Send emails (batch)
  await sendWeeklyDigestEmails();
}
```

---

## 📊 Pricing API Endpoints

### GET `/api/v1/books/:isbn/pricing`
**Returns**: Current pricing data

```json
{
  "isbn": "9781401235420",
  "title": "Batman Vol 1: Court of Owls",
  "pricing": {
    "average": 12.99,
    "high": 18.50,
    "low": 8.00,
    "median": 12.50,
    "listing_count": 47,
    "last_updated": "2024-01-15T10:30:00Z"
  },
  "by_condition": {
    "mint": { "avg": 15.99, "high": 18.50, "low": 14.00, "count": 12 },
    "good": { "avg": 12.99, "high": 15.00, "low": 10.00, "count": 20 },
    "fair": { "avg": 9.99, "high": 12.00, "low": 8.00, "count": 10 },
    "worn": { "avg": 6.50, "high": 8.00, "low": 5.00, "count": 5 }
  },
  "recent_sales": [
    { "price": 13.50, "condition": 2, "sold_at": "2024-01-12T15:20:00Z" },
    { "price": 11.99, "condition": 3, "sold_at": "2024-01-10T09:15:00Z" },
    { "price": 15.00, "condition": 1, "sold_at": "2024-01-08T11:45:00Z" }
  ],
  "velocity": {
    "sales_7d": 3,
    "sales_30d": 12,
    "avg_days_to_sale": 15.5
  }
}
```

### GET `/api/v1/sellers/:seller_id/price-alerts`
**Returns**: Current price alerts for seller

```json
{
  "alerts": [
    {
      "id": "alert-uuid",
      "book": {
        "isbn": "9781401235420",
        "title": "Batman Vol 1: Court of Owls"
      },
      "alert_type": "above_average",
      "your_price": 18.99,
      "market_avg": 12.99,
      "difference_pct": 46.2,
      "suggestion": "Lower to $12.99",
      "sent_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

### POST `/api/v1/listings/:listing_id/adjust-price`
**Adjust price based on alert**

```json
{
  "new_price": 12.99,
  "reason": "adjusted_to_average"
}
```

---

## 🎯 Performance Optimization

### Caching Strategy

```javascript
// Use Redis for hot pricing data
const redis = require('redis');
const client = redis.createClient();

async function getCachedPricing(bookId) {
  const cacheKey = `pricing:${bookId}`;
  
  // Check cache (TTL: 1 hour)
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Calculate fresh
  const pricing = await calculateRealTimePricing(bookId);
  
  // Store in cache
  await client.setex(cacheKey, 3600, JSON.stringify(pricing));
  
  return pricing;
}
```

### Database Indexes

```sql
-- Speed up pricing queries
CREATE INDEX idx_listings_book_active ON listings(book_id, status)
  WHERE status = 'active';

CREATE INDEX idx_sales_book_recent ON sales(book_id, sold_at DESC)
  WHERE sold_at > NOW() - INTERVAL '90 days';

-- Partial index for hot books
CREATE INDEX idx_hot_books ON pricing_snapshots(book_id, snapshot_date DESC)
  WHERE listing_count > 10;
```

---

## 📏 Data Quality Rules

### Outlier Detection

```javascript
// Remove outliers before calculating average
function removeOutliers(prices) {
  // Use IQR (Interquartile Range) method
  const sorted = prices.sort((a, b) => a - b);
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  
  const lowerBound = q1 - (1.5 * iqr);
  const upperBound = q3 + (1.5 * iqr);
  
  return sorted.filter(p => p >= lowerBound && p <= upperBound);
}
```

### Price Validation

```javascript
// Validate listing price before saving
function validatePrice(price, bookId) {
  // Get recent pricing
  const pricing = await getPricing(bookId);
  
  // Flag if > 3x average
  if (price > pricing.average * 3) {
    return {
      valid: false,
      warning: 'Price is 3x market average. Are you sure?'
    };
  }
  
  // Flag if < 25% of average
  if (price < pricing.average * 0.25) {
    return {
      valid: false,
      warning: 'Price is very low. Check for typos.'
    };
  }
  
  return { valid: true };
}
```

---

## ✅ Implementation Checklist

- [ ] Create all 5 database tables
- [ ] Add indexes for performance
- [ ] Implement real-time pricing calculation
- [ ] Build daily snapshot cron job
- [ ] Build weekly alert generation job
- [ ] Create pricing API endpoints
- [ ] Add Redis caching layer
- [ ] Implement outlier detection
- [ ] Add price validation logic
- [ ] Test with 100+ sample listings

---

**Ready for implementation? This gives you accurate, real-time pricing intelligence that scales.**

