# Weekly Email Templates
## Seller Engagement & Pricing Diagnostics

---

## 🎯 Email Strategy

**Purpose**: Keep sellers engaged and pricing competitive  
**Frequency**: Weekly (Monday 9am, seller's timezone)  
**Trigger**: Automated cron job  
**Goal**: 40%+ open rate, 15%+ click-through rate

---

## 📧 Email 1: Weekly Pricing Digest

### Subject Lines (A/B Test)

**Option A** (Direct):
```
Your Weekly Marketplace Report - [Shop Name]
```

**Option B** (Value-focused):
```
💰 Adjust 12 prices, increase sales this week
```

**Option C** (FOMO):
```
You're missing sales - Quick price fixes inside
```

**Option D** (Personal):
```
Hi [FirstName], here's what's happening with your 47 listings
```

### Email Template (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #111827;
      background: #F9FAFB;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
    }
    .header {
      background: linear-gradient(135deg, #00D084, #00B874);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .section {
      padding: 24px;
      border-bottom: 1px solid #E5E7EB;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #111827;
    }
    .book-card {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      gap: 16px;
    }
    .book-cover {
      width: 60px;
      height: 90px;
      object-fit: cover;
      border-radius: 4px;
    }
    .book-info {
      flex: 1;
    }
    .book-title {
      font-weight: 600;
      font-size: 14px;
      margin: 0 0 4px 0;
    }
    .pricing-row {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      margin: 4px 0;
    }
    .your-price {
      font-weight: 600;
      color: #111827;
    }
    .market-price {
      color: #6B7280;
    }
    .diff {
      font-weight: 600;
    }
    .diff-high {
      color: #DC2626;
    }
    .diff-low {
      color: #059669;
    }
    .btn-primary {
      display: inline-block;
      background: #00D084;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin-right: 8px;
    }
    .btn-secondary {
      display: inline-block;
      background: white;
      color: #6B7280;
      border: 1px solid #E5E7EB;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    .stat-card {
      background: #F9FAFB;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #00D084;
    }
    .stat-label {
      font-size: 12px;
      color: #6B7280;
      margin-top: 4px;
    }
    .footer {
      background: #F9FAFB;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Header -->
    <div class="header">
      <h1>📊 Your Weekly Marketplace Report</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">
        Hi {{seller_name}}, here's what's happening with your {{total_listings}} listings
      </p>
    </div>
    
    <!-- Above Average Section -->
    <div class="section">
      <h2 class="section-title">📈 Priced Above Average ({{above_count}} books)</h2>
      <p style="color: #6B7280; font-size: 14px;">
        These may take longer to sell. Consider lowering to match market prices.
      </p>
      
      {{#each above_average}}
      <div class="book-card">
        <img src="{{cover_image}}" alt="Cover" class="book-cover">
        <div class="book-info">
          <div class="book-title">{{title}}</div>
          <div class="pricing-row">
            <span class="your-price">Your price: ${{your_price}}</span>
            <span class="market-price">• Avg: ${{market_avg}}</span>
            <span class="diff diff-high">(+{{diff_pct}}%)</span>
          </div>
          <div style="margin-top: 12px;">
            <a href="{{adjust_url}}" class="btn-primary">Lower to ${{suggested_price}}</a>
            <a href="{{keep_url}}" class="btn-secondary">Keep As Is</a>
          </div>
        </div>
      </div>
      {{/each}}
      
      {{#if has_more_above}}
      <p style="text-align: center; margin-top: 16px;">
        <a href="{{view_all_url}}" style="color: #00D084; text-decoration: none; font-weight: 600;">
          View all {{above_count}} overpriced listings →
        </a>
      </p>
      {{/if}}
    </div>
    
    <!-- Below Average Section -->
    <div class="section">
      <h2 class="section-title">📉 Priced Below Average ({{below_count}} books)</h2>
      <p style="color: #6B7280; font-size: 14px;">
        You could increase margins on these listings.
      </p>
      
      {{#each below_average}}
      <div class="book-card">
        <img src="{{cover_image}}" alt="Cover" class="book-cover">
        <div class="book-info">
          <div class="book-title">{{title}}</div>
          <div class="pricing-row">
            <span class="your-price">Your price: ${{your_price}}</span>
            <span class="market-price">• Avg: ${{market_avg}}</span>
            <span class="diff diff-low">({{diff_pct}}%)</span>
          </div>
          <div style="margin-top: 12px;">
            <a href="{{adjust_url}}" class="btn-primary">Raise to ${{suggested_price}}</a>
            <a href="{{keep_url}}" class="btn-secondary">Keep As Is</a>
          </div>
        </div>
      </div>
      {{/each}}
      
      {{#if has_more_below}}
      <p style="text-align: center; margin-top: 16px;">
        <a href="{{view_all_url}}" style="color: #00D084; text-decoration: none; font-weight: 600;">
          View all {{below_count}} underpriced listings →
        </a>
      </p>
      {{/if}}
    </div>
    
    <!-- Stats Section -->
    <div class="section">
      <h2 class="section-title">💰 This Week's Activity</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{books_sold}}</div>
          <div class="stat-label">Books Sold</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${{revenue}}</div>
          <div class="stat-label">Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{new_listings}}</div>
          <div class="stat-label">New Listings</div>
        </div>
      </div>
      
      <p style="margin-top: 16px; text-align: center;">
        <a href="{{dashboard_url}}" class="btn-primary" style="display: inline-block;">
          View Full Dashboard
        </a>
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Questions? Reply to this email or visit our <a href="{{help_url}}" style="color: #00D084;">Help Center</a></p>
      <p style="margin-top: 16px;">
        <a href="{{unsubscribe_url}}" style="color: #9CA3AF;">Unsubscribe</a> • 
        <a href="{{frequency_url}}" style="color: #9CA3AF;">Adjust Email Frequency</a>
      </p>
      <p style="margin-top: 16px; color: #9CA3AF;">
        © 2024 TradePaperback. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
```

---

## 📧 Email 2: First Listing Celebration

**Trigger**: User lists their first book

### Subject
```
🎉 You just listed your first book!
```

### Template

```html
<div class="header" style="background: linear-gradient(135deg, #00D084, #00B874); padding: 40px 24px; text-align: center;">
  <h1 style="color: white; font-size: 32px; margin: 0;">🎉</h1>
  <h2 style="color: white; margin: 8px 0;">You Just Listed Your First Book!</h2>
  <p style="color: rgba(255,255,255,0.9);">Congrats, {{seller_name}}! You're on your way.</p>
</div>

<div class="section">
  <div class="book-card">
    <img src="{{cover_image}}" class="book-cover">
    <div>
      <h3>{{title}}</h3>
      <p>Listed at ${{price}} • {{condition}}</p>
    </div>
  </div>
  
  <h3>What Happens Next?</h3>
  <ul>
    <li>Your book is now visible to buyers on the marketplace</li>
    <li>You'll get notified when someone views or purchases it</li>
    <li>Average time to sale: {{avg_days}} days</li>
  </ul>
  
  <p style="text-align: center; margin-top: 24px;">
    <a href="{{scan_more_url}}" class="btn-primary">Scan More Books</a>
  </p>
</div>

<div class="section" style="background: #F0FDF4; border-left: 4px solid #10B981;">
  <h3>💡 Pro Tips for Faster Sales</h3>
  <ol>
    <li><strong>Price competitively</strong> - Books within ±10% of market average sell 3x faster</li>
    <li><strong>Accurate condition</strong> - Honest grading builds buyer trust</li>
    <li><strong>List more inventory</strong> - Shops with 20+ listings sell 5x more</li>
  </ol>
</div>
```

---

## 📧 Email 3: First Sale Celebration

**Trigger**: User's first book sells

### Subject
```
💰 You made your first sale!
```

### Template

```html
<div class="header" style="background: linear-gradient(135deg, #10B981, #059669); padding: 40px 24px; text-align: center;">
  <h1 style="color: white; font-size: 48px; margin: 0;">🎊</h1>
  <h2 style="color: white; margin: 8px 0;">You Made Your First Sale!</h2>
  <p style="color: rgba(255,255,255,0.9); font-size: 24px; font-weight: 600;">
    ${{sale_price}}
  </p>
</div>

<div class="section">
  <h3>Sale Details</h3>
  <div class="book-card">
    <img src="{{cover_image}}" class="book-cover">
    <div>
      <h4>{{title}}</h4>
      <p>Sold to: {{buyer_name}}</p>
      <p>Sale Price: ${{sale_price}}</p>
      <p>Your Payout: ${{payout}} (after 5% fee)</p>
    </div>
  </div>
  
  <h3>Next Steps</h3>
  <ol>
    <li><strong>Print shipping label</strong> - <a href="{{label_url}}">Click here to print</a></li>
    <li><strong>Pack and ship</strong> - Ship within 24 hours for best ratings</li>
    <li><strong>Get paid</strong> - Funds released after delivery (~3-5 days)</li>
  </ol>
  
  <p style="text-align: center; margin-top: 24px;">
    <a href="{{print_label_url}}" class="btn-primary">Print Shipping Label</a>
  </p>
</div>

<div class="section">
  <h3>Keep the Momentum Going</h3>
  <p>List more books to increase your sales:</p>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-number">3x</div>
      <div class="stat-label">Faster sales with 20+ listings</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">$500</div>
      <div class="stat-label">Avg monthly revenue for active shops</div>
    </div>
  </div>
  
  <p style="text-align: center; margin-top: 16px;">
    <a href="{{scan_url}}" class="btn-primary">Scan More Books</a>
  </p>
</div>
```

---

## 📧 Email 4: Inventory Sitting Alert

**Trigger**: Books listed >30 days with no sales

### Subject
```
⏰ 12 books have been sitting for 30+ days
```

### Template

```html
<div class="header">
  <h1>⏰ Time to Refresh Your Listings</h1>
  <p>{{stale_count}} books haven't sold in 30+ days</p>
</div>

<div class="section">
  <p>These books might need a price adjustment or better condition description:</p>
  
  {{#each stale_listings}}
  <div class="book-card">
    <img src="{{cover_image}}" class="book-cover">
    <div class="book-info">
      <div class="book-title">{{title}}</div>
      <p style="color: #DC2626; font-size: 13px;">
        Listed {{days_ago}} days ago • No sales yet
      </p>
      <div class="pricing-row">
        <span>Your price: ${{your_price}}</span>
        <span>Market avg: ${{market_avg}}</span>
      </div>
      <div style="margin-top: 12px;">
        <a href="{{lower_price_url}}" class="btn-primary">Lower Price</a>
        <a href="{{remove_url}}" class="btn-secondary">Remove Listing</a>
      </div>
    </div>
  </div>
  {{/each}}
</div>

<div class="section" style="background: #FEF3C7; border-left: 4px solid #F59E0B;">
  <h3>💡 Why Aren't These Selling?</h3>
  <ul>
    <li><strong>Price too high</strong> - {{high_price_count}} are priced >30% above average</li>
    <li><strong>Low demand</strong> - {{low_demand_count}} have <5 searches this month</li>
    <li><strong>Better alternatives</strong> - Buyers choosing other sellers with better ratings</li>
  </ul>
  <p><strong>Recommendation:</strong> Lower prices by 10-20% to move inventory faster.</p>
</div>
```

---

## 📧 Email 5: Weekly Digest (No Alerts)

**Trigger**: Weekly, but seller has no pricing issues

### Subject
```
✅ Your listings look great this week!
```

### Template

```html
<div class="header" style="background: linear-gradient(135deg, #10B981, #059669);">
  <h1>✅ You're Priced Perfectly!</h1>
  <p>All your listings are within market range</p>
</div>

<div class="section">
  <p>Great job, {{seller_name}}! Your pricing strategy is working:</p>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-number">{{competitive_count}}</div>
      <div class="stat-label">Competitively Priced</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{views}}</div>
      <div class="stat-label">Views This Week</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{inquiries}}</div>
      <div class="stat-label">Buyer Inquiries</div>
    </div>
  </div>
</div>

<div class="section">
  <h3>💰 This Week's Sales</h3>
  {{#if has_sales}}
    {{#each recent_sales}}
    <div class="book-card">
      <img src="{{cover_image}}" class="book-cover">
      <div>
        <h4>{{title}}</h4>
        <p style="color: #059669; font-weight: 600;">
          Sold for ${{price}} • Your payout: ${{payout}}
        </p>
      </div>
    </div>
    {{/each}}
  {{else}}
    <p>No sales this week yet. Keep your listings active!</p>
  {{/if}}
</div>

<div class="section">
  <h3>🚀 Grow Your Business</h3>
  <p>Want to increase sales? Here's how:</p>
  <ul>
    <li><strong>List more inventory</strong> - Shops with 50+ listings average $800/month</li>
    <li><strong>Respond quickly</strong> - Answer buyer messages within 2 hours</li>
    <li><strong>Ship fast</strong> - Ship within 24 hours for 5-star ratings</li>
  </ul>
  <p style="text-align: center; margin-top: 16px;">
    <a href="{{scan_url}}" class="btn-primary">List More Books</a>
  </p>
</div>
```

---

## 🎯 Email Personalization

### Dynamic Content Based on Seller Tier

**New Seller** (<10 listings):
- Emphasize listing more inventory
- Educational content about pricing
- "Getting Started" tips

**Active Seller** (10-50 listings):
- Focus on optimization
- Pricing diagnostics
- Sales velocity insights

**Power Seller** (50+ listings):
- Advanced analytics
- Bulk tools promotion
- Marketplace trends

---

## 📊 Email Performance Tracking

### Key Metrics

```sql
CREATE TABLE email_analytics (
  id UUID PRIMARY KEY,
  email_type VARCHAR(50),
  seller_id UUID,
  
  -- Delivery
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Engagement
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  clicked_link VARCHAR(255),
  
  -- Actions
  action_taken VARCHAR(50), -- adjusted_price, kept_same, removed
  action_at TIMESTAMP,
  
  -- Conversion
  listings_adjusted INTEGER DEFAULT 0,
  revenue_impact DECIMAL(10,2)
);
```

### Dashboard Queries

```javascript
// Email performance summary
const stats = await db.query(`
  SELECT 
    email_type,
    COUNT(*) as sent,
    COUNT(opened_at) as opened,
    COUNT(clicked_at) as clicked,
    COUNT(action_at) as actions,
    AVG(CASE WHEN opened_at IS NOT NULL THEN 1 ELSE 0 END) as open_rate,
    AVG(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) as ctr,
    AVG(CASE WHEN action_at IS NOT NULL THEN 1 ELSE 0 END) as conversion_rate
  FROM email_analytics
  WHERE sent_at > NOW() - INTERVAL '30 days'
  GROUP BY email_type
`);
```

---

## ✅ Implementation Checklist

- [ ] Set up SendGrid/Postmark account
- [ ] Create email templates (HTML + plain text)
- [ ] Build cron job (runs Monday 9am)
- [ ] Generate price alerts from database
- [ ] Implement link tracking (UTM parameters)
- [ ] Add unsubscribe management
- [ ] Test emails on all devices/clients
- [ ] Monitor open/click rates
- [ ] A/B test subject lines
- [ ] Iterate based on performance

---

**All 4 implementation guides complete! Ready to build the MVP. 🚀**

