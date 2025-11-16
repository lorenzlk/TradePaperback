# Marketplace Architecture
## Technical Design for B2B Comic Shop Marketplace

---

## 🎯 Overview

Build a two-sided marketplace connecting comic shops as both buyers and sellers, enabling inventory discovery, transactions, and fulfillment.

**Key Components:**
1. **Inventory Database** - Searchable catalog of all shop inventory
2. **Matching Engine** - Connect buyers with sellers
3. **Transaction System** - Payments, escrow, payouts
4. **Fulfillment** - Shipping labels, tracking, delivery confirmation
5. **Trust Layer** - Ratings, reputation, dispute resolution

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         MOBILE SCANNER APP                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Scan    │  │  List    │  │  Search  │  │  Buy     │       │
│  │  Items   │  │  on Mkt  │  │  Mkt     │  │  Items   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
           │              │              │              │
           ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
│                        (Vercel Edge)                             │
└─────────────────────────────────────────────────────────────────┘
           │              │              │              │
           ▼              ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐
│  Inventory   │  │  Search &    │  │  Transaction │  │  User    │
│  Service     │  │  Discovery   │  │  Service     │  │  Service │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────┘
       │                  │                  │                │
       ▼                  ▼                  ▼                ▼
┌──────────────────────────────────────────────────────────────────┐
│                       POSTGRESQL DATABASE                         │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐            │
│  │ shops   │  │ items   │  │ listings │  │ orders │            │
│  └─────────┘  └─────────┘  └──────────┘  └────────┘            │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐            │
│  │ users   │  │ ratings │  │ messages │  │ payouts│            │
│  └─────────┘  └─────────┘  └──────────┘  └────────┘            │
└──────────────────────────────────────────────────────────────────┘
       │                  │                  │                │
       ▼                  ▼                  ▼                ▼
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ Algolia    │  │ Stripe     │  │ Shippo     │  │ SendGrid   │
│ (Search)   │  │ (Payments) │  │ (Shipping) │  │ (Email)    │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
```

---

## 📊 Database Schema

### Core Tables

```sql
-- Shops (Sellers & Buyers)
CREATE TABLE shops (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  owner_email VARCHAR(255) UNIQUE,
  address JSONB,
  phone VARCHAR(20),
  website VARCHAR(255),
  rating DECIMAL(3,2), -- 0.00 to 5.00
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  subscription_tier VARCHAR(50), -- free, pro, enterprise
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Inventory Items (Shop's catalog)
CREATE TABLE items (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  upc VARCHAR(14),
  title VARCHAR(500),
  publisher VARCHAR(255),
  format VARCHAR(50),
  series VARCHAR(255),
  volume_issue VARCHAR(50),
  cover_image_url TEXT,
  condition VARCHAR(20), -- NM, VF, F, G
  quantity INTEGER DEFAULT 1,
  cost_basis DECIMAL(10,2), -- what shop paid
  retail_price DECIMAL(10,2), -- shelf price
  last_sold_at TIMESTAMP,
  metadata JSONB, -- enriched data
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_shop_upc (shop_id, upc),
  INDEX idx_upc (upc)
);

-- Marketplace Listings (Items for sale)
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  shop_id UUID REFERENCES shops(id),
  list_price DECIMAL(10,2),
  quantity_available INTEGER,
  condition VARCHAR(20),
  status VARCHAR(20), -- active, sold, expired, removed
  visibility VARCHAR(20), -- public, regional, private
  trade_only BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_upc_active (item_id, status)
);

-- Search Index (Denormalized for speed)
CREATE TABLE listing_search (
  listing_id UUID PRIMARY KEY REFERENCES listings(id),
  upc VARCHAR(14),
  title TEXT,
  publisher VARCHAR(255),
  format VARCHAR(50),
  series VARCHAR(255),
  condition VARCHAR(20),
  price DECIMAL(10,2),
  shop_name VARCHAR(255),
  shop_rating DECIMAL(3,2),
  shop_location GEOGRAPHY(POINT),
  cover_image_url TEXT,
  created_at TIMESTAMP,
  FULLTEXT INDEX idx_search (title, series, publisher)
);

-- Orders (Transactions)
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE,
  buyer_shop_id UUID REFERENCES shops(id),
  seller_shop_id UUID REFERENCES shops(id),
  listing_id UUID REFERENCES listings(id),
  item_id UUID REFERENCES items(id),
  quantity INTEGER,
  item_price DECIMAL(10,2),
  shipping_price DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  total_price DECIMAL(10,2),
  status VARCHAR(20), -- pending, paid, shipped, delivered, completed, cancelled
  payment_intent_id VARCHAR(255), -- Stripe
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(50),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_buyer (buyer_shop_id),
  INDEX idx_seller (seller_shop_id),
  INDEX idx_status (status)
);

-- Ratings & Reviews
CREATE TABLE ratings (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  from_shop_id UUID REFERENCES shops(id),
  to_shop_id UUID REFERENCES shops(id),
  rating INTEGER, -- 1-5
  review TEXT,
  shipping_speed INTEGER, -- 1-5
  description_accuracy INTEGER, -- 1-5
  communication INTEGER, -- 1-5
  created_at TIMESTAMP
);

-- Messages (Shop-to-Shop)
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  from_shop_id UUID REFERENCES shops(id),
  to_shop_id UUID REFERENCES shops(id),
  order_id UUID REFERENCES orders(id),
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  amount DECIMAL(10,2),
  orders JSONB, -- array of order IDs
  status VARCHAR(20), -- pending, processing, paid, failed
  stripe_payout_id VARCHAR(255),
  paid_at TIMESTAMP,
  created_at TIMESTAMP
);
```

---

## 🔍 Search & Discovery

### Algolia Integration

**Why Algolia:**
- Instant search (<10ms)
- Typo tolerance ("Batmen" finds "Batman")
- Faceted filters (price, condition, location)
- Geo search (near me)
- Ranking algorithm (relevance + seller rating)

**Index Structure:**
```json
{
  "objectID": "listing-uuid",
  "upc": "9780785154471",
  "title": "Batman Vol 1: Court of Owls",
  "publisher": "DC Comics",
  "format": "Trade Paperback",
  "series": "Batman",
  "volume_issue": "Vol 1",
  "condition": "NM",
  "price": 12.99,
  "shop": {
    "id": "shop-uuid",
    "name": "Comic City",
    "rating": 4.8,
    "location": {
      "lat": 41.8781,
      "lng": -87.6298
    }
  },
  "cover_image_url": "https://...",
  "created_at": 1234567890
}
```

**Search Query:**
```javascript
index.search('batman court owls', {
  filters: 'condition:NM AND price < 15',
  aroundLatLng: '41.8781,-87.6298',
  aroundRadius: 50000, // 50km
  hitsPerPage: 20
});
```

---

## 💳 Transaction Flow

### Payment Architecture (Stripe Connect)

**Setup:**
1. Each shop creates Stripe Connect account (Express)
2. Platform is the parent account
3. Funds flow: Buyer → Platform → Seller (minus fee)

**Transaction Flow:**

```
1. Buyer clicks "Buy Now"
   ↓
2. Create PaymentIntent with destination charge
   amount: $12.99 (item) + $4.00 (shipping) = $16.99
   application_fee: $0.85 (5% of $16.99)
   destination: seller_stripe_account
   ↓
3. Buyer completes payment (Stripe Checkout)
   ↓
4. Funds held in platform account (escrow)
   ↓
5. Seller ships item, updates tracking
   ↓
6. Item delivered (confirmed by tracking)
   ↓
7. 48-hour review period
   ↓
8. Funds released to seller
   seller receives: $16.14 ($16.99 - $0.85 fee)
   platform receives: $0.85
   ↓
9. Buyer can rate seller
```

**Code Example:**
```javascript
// Create charge with platform fee
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1699, // $16.99 in cents
  currency: 'usd',
  application_fee_amount: 85, // $0.85 platform fee
  transfer_data: {
    destination: seller_stripe_account,
  },
  metadata: {
    order_id: 'order-uuid',
    buyer_shop_id: 'buyer-uuid',
    seller_shop_id: 'seller-uuid'
  }
});
```

---

## 📦 Shipping & Fulfillment

### Shippo Integration

**Features:**
- Rate comparison (USPS, UPS, FedEx)
- Label generation
- Tracking webhooks
- Insurance for high-value items
- Signature confirmation

**Flow:**
```javascript
// 1. Get shipping rates
const rates = await shippo.shipment.create({
  address_from: seller_address,
  address_to: buyer_address,
  parcels: [{
    length: 10,
    width: 7,
    height: 2,
    weight: 1,
    distance_unit: 'in',
    mass_unit: 'lb'
  }]
});

// 2. Buyer selects rate, seller prints label
const transaction = await shippo.transaction.create({
  rate: selected_rate_id,
  label_file_type: 'PDF',
  async: false
});

// 3. Tracking updates
shippo.webhooks.on('track_updated', (event) => {
  if (event.tracking_status.status === 'DELIVERED') {
    releaseFundsToSeller(order_id);
  }
});
```

---

## 🔐 Trust & Safety

### Reputation System

**Seller Score Calculation:**
```javascript
function calculateSellerScore(shop) {
  const weights = {
    rating: 0.4,
    shipping_speed: 0.2,
    description_accuracy: 0.2,
    total_sales: 0.1,
    response_time: 0.1
  };
  
  const score = 
    shop.avg_rating * weights.rating +
    shop.avg_shipping_speed * weights.shipping_speed +
    shop.avg_description_accuracy * weights.description_accuracy +
    Math.min(shop.total_sales / 100, 5) * weights.total_sales +
    (5 - shop.avg_response_hours) * weights.response_time;
  
  return Math.round(score * 100) / 100; // 0.00 to 5.00
}
```

**Badges:**
```javascript
function assignBadges(shop) {
  const badges = [];
  
  if (shop.total_sales >= 100) badges.push('TOP_SELLER');
  if (shop.avg_ship_time <= 24) badges.push('FAST_SHIPPER');
  if (shop.avg_rating >= 4.8 && shop.total_sales >= 50) badges.push('TRUSTED');
  if (shop.age_months >= 6) badges.push('ESTABLISHED');
  if (shop.verified) badges.push('VERIFIED');
  
  return badges;
}
```

### Dispute Resolution

**Process:**
1. Buyer opens dispute (item not as described, damaged, not received)
2. Upload evidence (photos, messages)
3. Seller responds with counter-evidence
4. Platform mediates (24-48 hour resolution)
5. Outcome: Full refund, partial refund, or no refund
6. Funds released or returned accordingly

---

## 🚀 Scaling Strategy

### Phase 1: MVP (0-100 shops)
- **Database**: Supabase (PostgreSQL)
- **Search**: PostgreSQL full-text search
- **Payments**: Stripe Connect
- **Shipping**: Manual (sellers print their own labels)
- **Hosting**: Vercel + Supabase

**Cost**: ~$200/month

---

### Phase 2: Growth (100-1000 shops)
- **Database**: Supabase → AWS RDS (read replicas)
- **Search**: Migrate to Algolia
- **Payments**: Stripe Connect (optimized with batching)
- **Shipping**: Shippo integration
- **Hosting**: Vercel + AWS
- **Cache**: Redis for hot listings

**Cost**: ~$2K/month

---

### Phase 3: Scale (1000+ shops)
- **Database**: AWS Aurora (multi-region)
- **Search**: Algolia + Elasticsearch (for analytics)
- **Payments**: Stripe + optional ACH for large transactions
- **Shipping**: Negotiated rates with carriers
- **Hosting**: Multi-region CDN
- **Queue**: SQS for async processing
- **Analytics**: Snowflake for data warehouse

**Cost**: ~$20K/month

**Revenue**: $300K+/month → Profitable

---

## 📊 Key Metrics to Track

### Marketplace Health
- **GMV** (Gross Merchandise Value): Total $ transacted
- **Take Rate**: Platform fee % of GMV
- **Liquidity**: % of listings that sell within 30 days
- **Avg Time to Sale**: Days from list to sold
- **Repeat Purchase Rate**: % buyers who buy again

### Network Effects
- **Active Listings**: Total items for sale
- **Searches per Day**: Demand signal
- **Conversion Rate**: Searches → purchases
- **Cross-Regional Trades**: Geographic diversity

### Quality Metrics
- **Avg Seller Rating**: 4.5+ target
- **Dispute Rate**: <2% target
- **Delivery Success**: 98%+ target
- **Response Time**: <4 hours target

---

## 🎯 Success Criteria

**Month 6:**
- 100 shops registered
- $10K GMV
- 50 active listings
- 10 completed transactions

**Month 12:**
- 500 shops registered
- $450K GMV
- 5,000 active listings
- 500+ transactions/month

**Year 2:**
- 2,000 shops
- $6M GMV/month
- 50,000+ active listings
- Network effects clearly visible

**The Tipping Point**: When shops start saying **"If it's not on the marketplace, it doesn't exist."**

---

## 🔮 Future Innovations

1. **AI Pricing Agent**: Suggest optimal prices based on demand
2. **Bulk Matching**: Match wholesalers with retailers
3. **Inventory Financing**: Lend capital to buy inventory
4. **Drop Shipping Network**: Virtual inventory for all shops
5. **Regional Hubs**: Physical consolidation centers
6. **International**: Expand beyond US to Canada, UK, EU

---

*This is how we become the **Faire.com for comic shops**.*

