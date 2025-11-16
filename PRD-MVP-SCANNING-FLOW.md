# Product Requirements Document: MVP
## Book Scanning & Seller Pricing System

---

## 🧩 Executive Summary

A mobile-first book scanning app that enables comic shop owners and booksellers to instantly list inventory on a marketplace by:
1. Scanning a book (barcode or cover)
2. Confirming visual match
3. Seeing real-time pricing data
4. Setting their price + condition
5. Listing in seconds

**The Hook**: "Scan it. Price it. List it."

**The Retention Loop**: Weekly pricing diagnostics keep sellers engaged and pricing competitive.

---

## 🎯 Goals

### Business Goals
- **Reduce listing friction**: <10 seconds from scan to listed
- **Increase marketplace liquidity**: More items listed = more sales
- **Drive pricing accuracy**: Platform data beats guesswork
- **Build seller engagement**: Weekly emails = ongoing touchpoints

### User Goals
- **Shop Owner**: List 100 books in 15 minutes instead of 2 hours
- **Buyer**: See consistent, fair pricing across sellers
- **Platform**: Dynamic marketplace with real market prices

---

## 📱 Core User Flow

### Step 1: Scan the Book

**Entry Point**: User opens app → Camera auto-activates

**Scan Options**:
1. **Barcode Scan** (UPC/ISBN on back)
   - ZXing library detects code
   - Instant recognition via ISBN
2. **Cover Image Scan** (front cover photo)
   - TinEye API identifies book
   - Matches against visual database

**Technical**:
```javascript
// Detect scan type
if (barcode_detected) {
  lookupByISBN(barcode);
} else if (cover_image_captured) {
  lookupByCover(image_data);
}
```

---

### Step 2: Visual Recognition & Confirmation

**What Happens**:
1. System queries database (ISBN or image match)
2. Returns book metadata + high-quality cover image
3. **Critical**: Shows database cover, NOT user's photo
4. If multiple variants found → "Is it this one, or this one?"

**UI Display**:
```
┌─────────────────────────┐
│   [COVER IMAGE]         │
│   (from database)       │
│                         │
│  Batman Vol 1:          │
│  Court of Owls          │
│                         │
│  DC Comics • 2012       │
│  Trade Paperback        │
│                         │
│  [✓ CORRECT]  [TRY AGAIN]
└─────────────────────────┘
```

**Variant Handling**:
```
Found 3 matches:

◉ 1st Edition (2012)      [SELECT]
○ 2nd Printing (2013)     [SELECT]
○ Deluxe Edition (2015)   [SELECT]
```

**Acceptance Criteria**:
- ✅ Match rate ≥90% on first attempt
- ✅ Multi-variant selector if >1 match
- ✅ High-res cover image from database
- ✅ User confirms before proceeding

---

### Step 3: Pricing Intelligence Display

**What Shows**:
```
┌─────────────────────────────────┐
│  💰 Pricing Data                │
│                                 │
│  📊 Average: $12.99             │
│  📈 Highest: $18.50             │
│  📉 Lowest:  $8.00              │
│                                 │
│  Based on 47 sales              │
│  Last updated: 2 hours ago      │
└─────────────────────────────────┘
```

**Data Source**:
- **All marketplace listings** for this exact ISBN
- **Recent sales** (last 90 days)
- **Live updates** (refreshed hourly)

**Acceptance Criteria**:
- ✅ Shows average, high, low prices
- ✅ Data from actual platform transactions
- ✅ Clear timestamp of last update
- ✅ Handles case where no data exists (new book)

---

### Step 4: Seller Input

**Two Required Fields**:

#### A) Your Price
```
Your Price: [$12.99]
           ─────────
           (pre-filled with average)
           
[EDIT]
```

- Pre-filled with platform average
- Seller can adjust up/down
- Real-time comparison: "15% above average" or "10% below average"

#### B) Condition Grade
```
Select Condition:

◉ 🟢 MINT      Perfect, like new
○ 🟡 GOOD      Minor wear, readable
○ 🟠 FAIR      Noticeable wear, intact
○ 🔴 WORN      Heavy wear, acceptable

[NEXT]
```

**4-Tier Scale**:
1. **MINT** (100% of avg price) - Perfect condition
2. **GOOD** (85% of avg price) - Minor shelf wear
3. **FAIR** (65% of avg price) - Reading copy quality
4. **WORN** (40% of avg price) - Heavy use, complete

**Acceptance Criteria**:
- ✅ Price field pre-filled with average
- ✅ Condition must be selected (no default)
- ✅ Cannot proceed without both fields
- ✅ Visual indicators clear and mobile-friendly

---

### Step 5: List Confirmation

**Final Screen**:
```
┌─────────────────────────────────┐
│  ✓ Ready to List                │
│                                 │
│  Batman Vol 1: Court of Owls    │
│  Your Price: $14.99             │
│  Condition: GOOD                │
│                                 │
│  📊 vs. Average: +15%           │
│  🚀 Estimated Time to Sell: 12d │
│                                 │
│  [LIST THIS BOOK]               │
│  [EDIT]  [SCAN ANOTHER]         │
└─────────────────────────────────┘
```

**What Happens on "List"**:
1. Creates listing in database
2. Adds to seller's inventory
3. Makes searchable on marketplace
4. Success animation + haptic feedback
5. Auto-returns to camera for next scan

**Time from Scan to Listed**: **<10 seconds**

---

## 🔄 Automated Seller Engagement Loop

### Weekly Pricing Diagnostics Email

**Sent**: Every Monday at 9am (seller's timezone)

**Subject**: "Your Weekly Marketplace Report - [Shop Name]"

**Email Content**:
```
Hi Mike,

Here's what's happening with your 47 active listings:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 PRICED ABOVE AVERAGE (12 books)

These may take longer to sell:

• Batman Vol 1 - Your price: $18.99, Avg: $12.99 (+46%)
  [LOWER PRICE] [KEEP AS IS]

• Superman Birthright - Your price: $22.00, Avg: $16.50 (+33%)
  [LOWER PRICE] [KEEP AS IS]

... 10 more

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📉 PRICED BELOW AVERAGE (8 books)

You could increase margins:

• Saga Vol 1 - Your price: $8.99, Avg: $12.99 (-31%)
  [RAISE PRICE] [KEEP AS IS]

• Watchmen - Your price: $14.99, Avg: $18.50 (-19%)
  [RAISE PRICE] [KEEP AS IS]

... 6 more

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 THIS WEEK'S ACTIVITY

• 3 books sold ($47.50 total)
• 2 new listings added
• Average listing price: $13.25

[VIEW FULL DASHBOARD]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email.

- The Team

[Unsubscribe] | [Adjust Email Frequency]
```

**Smart Links**:
- **[LOWER PRICE]** → Opens app to edit screen, suggests new price (average)
- **[RAISE PRICE]** → Opens app to edit screen, suggests new price (average)
- **[KEEP AS IS]** → Dismisses suggestion for 30 days
- **[VIEW FULL DASHBOARD]** → Opens web dashboard

**Acceptance Criteria**:
- ✅ Sent automatically every 7 days
- ✅ Accurate price comparisons
- ✅ One-click price adjustment links
- ✅ Opt-out option in settings
- ✅ Mobile-friendly email design

---

## 🎯 Success Metrics

### Listing Efficiency
- **Time to List**: <10 seconds average
- **Scan Success Rate**: ≥90%
- **Listings per Session**: 10+ average

### Pricing Accuracy
- **Use of Platform Average**: 60%+ listings within ±20% of average
- **Price Adjustments**: 15%+ sellers adjust prices after email
- **Competitive Pricing**: Avg price variance <25%

### Engagement
- **Weekly Email Open Rate**: 40%+
- **Email Click-Through Rate**: 15%+
- **Repeat Listing Rate**: 70%+ sellers list again within 30 days

### Marketplace Health
- **Listing Growth**: 20% MoM
- **Price Accuracy**: 90%+ listings have condition + price
- **Sale Velocity**: Avg 30 days to sale

---

## 🏗️ Technical Implementation

### Frontend (Mobile App)

**Tech Stack**:
- React Native (iOS + Android)
- @zxing/library (barcode scanning)
- Camera API (cover image capture)

**Key Screens**:
1. **Scanner Screen** (camera + detection)
2. **Confirmation Screen** (visual match)
3. **Pricing Screen** (data display)
4. **Input Screen** (price + condition)
5. **Success Screen** (confirmation)

### Backend Services

**API Endpoints**:
```javascript
POST /api/v1/scan/barcode
  body: { upc: "9780785154471" }
  returns: { book_data, pricing_data, variants }

POST /api/v1/scan/cover
  body: { image: base64_data }
  returns: { book_data, pricing_data, variants }

POST /api/v1/listings/create
  body: { book_id, price, condition, seller_id }
  returns: { listing_id, success }

GET /api/v1/pricing/{book_id}
  returns: { average, high, low, recent_sales }
```

**Database Schema**:
```sql
-- Books (Master catalog)
CREATE TABLE books (
  id UUID PRIMARY KEY,
  isbn VARCHAR(13) UNIQUE,
  title VARCHAR(500),
  cover_image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP
);

-- Listings (Seller inventory)
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  book_id UUID REFERENCES books(id),
  seller_id UUID REFERENCES sellers(id),
  price DECIMAL(10,2),
  condition INTEGER, -- 1-4
  status VARCHAR(20), -- active, sold, removed
  created_at TIMESTAMP,
  sold_at TIMESTAMP
);

-- Price History (For analytics)
CREATE TABLE price_history (
  id UUID PRIMARY KEY,
  book_id UUID REFERENCES books(id),
  date DATE,
  avg_price DECIMAL(10,2),
  high_price DECIMAL(10,2),
  low_price DECIMAL(10,2),
  sale_count INTEGER
);
```

### Image Recognition Service

**Option A: TinEye API**
```javascript
const tineye = require('tineye-api');

async function searchByCover(imageData) {
  const results = await tineye.search({
    image: imageData,
    limit: 10,
    offset: 0
  });
  
  // Extract book data from results
  return parseBookFromResults(results.matches);
}
```

**Option B: Google Cloud Vision + Custom Matching**
```javascript
const vision = require('@google-cloud/vision');

async function searchByCover(imageData) {
  // Step 1: Extract text from cover
  const [result] = await vision.textDetection(imageData);
  const title = extractTitle(result.textAnnotations);
  
  // Step 2: Search book database
  return searchBooksByTitle(title);
}
```

### Email Service (SendGrid)

**Weekly Digest Template**:
```javascript
// Cron job runs every Monday 9am
async function sendWeeklyDigest(seller_id) {
  const listings = await getActiveListings(seller_id);
  const pricing = await getPricingComparisons(listings);
  
  const aboveAvg = pricing.filter(p => p.diff > 0);
  const belowAvg = pricing.filter(p => p.diff < 0);
  
  await sendGrid.send({
    to: seller.email,
    template_id: 'weekly-digest',
    dynamic_data: {
      seller_name: seller.name,
      above_average: aboveAvg,
      below_average: belowAvg,
      weekly_stats: getWeeklyStats(seller_id)
    }
  });
}
```

---

## 🚧 MVP Scope

### Phase 1: Core Scanning (Week 1-2)
- ✅ Barcode scanning (UPC/ISBN)
- ✅ Visual confirmation screen
- ✅ Basic metadata display

### Phase 2: Pricing Intelligence (Week 3-4)
- ✅ Price history database
- ✅ Average/high/low calculation
- ✅ Pricing display on scan

### Phase 3: Listing Creation (Week 5-6)
- ✅ Price input + condition selector
- ✅ Listing creation flow
- ✅ Success confirmation

### Phase 4: Email Automation (Week 7-8)
- ✅ Weekly digest email
- ✅ Price comparison logic
- ✅ One-click adjustment links

### Phase 5: Cover Scanning (Week 9-10)
- ✅ TinEye API integration
- ✅ Image upload + matching
- ✅ Variant handling

---

## ⚠️ Out of Scope (Post-MVP)

- Multi-store management
- POS integration
- Bulk listing tools
- Advanced analytics dashboard
- Buyer-facing marketplace (separate app)
- Payment processing
- Shipping integration
- Customer reviews/ratings

**Focus**: Get sellers listing inventory fast. Marketplace features come after.

---

## 🎬 Demo Script

**"Watch me list 5 books in 60 seconds"**

1. Open app → Camera appears
2. Scan Batman TPB → Cover pops up → $12.99 average
3. Set $13.99, Good condition → [LIST]
4. Scan Superman TPB → Cover pops up → $10.50 average
5. Set $11.00, Mint condition → [LIST]
6. Scan Wonder Woman → Cover pops up → $15.99 average
7. Set $14.99, Fair condition → [LIST]
8. Scan Flash → $9.99 average → $10.50, Good → [LIST]
9. Scan Green Lantern → $12.50 average → $12.00, Mint → [LIST]

**Result**: 5 books listed in under 60 seconds.

**The Hook**: "Scan your entire backroom in an afternoon."

---

## 💡 Key Insights

### Why This Works

1. **Visual Confirmation** = Trust
   - Seeing the cover image confirms "yes, this is the right book"
   - Reduces listing errors

2. **Pricing Data** = Confidence
   - Sellers aren't guessing
   - Platform becomes pricing authority

3. **Simple Conditions** = Speed
   - 4 tiers is faster than detailed grading
   - Good enough for marketplace pricing

4. **Weekly Emails** = Engagement
   - Keeps sellers thinking about their inventory
   - Creates pricing discipline
   - Non-intrusive (once per week)

5. **One-Click Actions** = Conversion
   - "Lower Price" button removes friction
   - Immediate gratification

### Why Sellers Will Love This

- **"I priced 50 books in 20 minutes"**
- **"My dead stock started selling when I adjusted prices"**
- **"I don't have to guess what to charge anymore"**
- **"The weekly email keeps me competitive"**

---

## 📊 Validation Checklist

Before launch, validate:
- [ ] Barcode scan works on 90%+ of books
- [ ] Cover scan works on 70%+ of books (harder)
- [ ] Pricing data is accurate (spot-check 20 books)
- [ ] Listing creation is <10 seconds
- [ ] Email links open correct screens
- [ ] Mobile experience is smooth (iOS + Android)
- [ ] Database handles 1000+ listings

---

## 🚀 Go-to-Market

**Beta**: 10 shops, unlimited listings, 90 days free

**Launch**: $49/month, unlimited listings + weekly emails

**Pitch**: "List your entire inventory in a day. Know exactly what to charge."

---

**This is the MVP. Everything else comes later.**

