# Sheet2: Complete Metadata Structure
## All Enrichment Columns (50+ Fields)

---

## 📊 Complete Column List

### **Core Metadata** (Columns A-P) - Existing

| Col | Field Name | Description | Example | Required |
|-----|------------|-------------|---------|----------|
| A | UPC | Barcode number | `9780062490438` | ✅ |
| B | Timestamp | When enriched | `2025-11-16T14:30:22Z` | ✅ |
| C | Title | Full product title | `Batman: The Long Halloween` | ✅ |
| D | Publisher | Publishing company | `DC Comics` | ✅ |
| E | Release_Date | Publication date | `2011-11-01` | ✅ |
| F | Format | Physical format | `Trade Paperback` | ✅ |
| G | Series | Series name | `Batman` | ✅ |
| H | Volume_Issue | Volume/Issue number | `Vol 1` | ✅ |
| I | Page_Count | Number of pages | `384` | ✅ |
| J | ISBN | ISBN-13 | `978-1401209872` | ✅ |
| K | Price_USD | Cover/retail price | `19.99` | ✅ |
| L | Genre | Genre/category | `Superhero, Mystery` | ✅ |
| M | Description | Plot summary (250 chars) | `Batman pursues...` | ✅ |
| N | Cover_Image_URL | Link to cover image | `https://...` | ✅ |
| O | Goodreads_Rating | Average rating | `4.5` | ✅ |
| P | Data_Source | Where info came from | `OpenLibrary + GPT-4` | ✅ |

---

### **Comic Book Specific** (Columns Q-X)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| Q | Creators | Writer, Artist, Inker | `Scott Snyder, Greg Capullo` | Comic Vine, Google Books |
| R | Cover_Artist | Cover artist name | `Greg Capullo` | Comic Vine, Google Books |
| S | Variant_Type | Cover variant identifier | `Regular, Variant A, 1:25` | Comic Vine, Manual |
| T | First_Print | First printing indicator | `Yes/No` | Comic Vine, ISBN |
| U | Print_Number | Printing number | `1st, 2nd, 3rd` | Comic Vine, ISBN |
| V | Comic_Vine_ID | Comic Vine database ID | `4050-12345` | Comic Vine API |
| W | Key_Issue | Is this a key issue? | `Yes/No` | Comic Vine, Key Collector |
| X | Key_Issue_Reason | Why it's a key issue | `First appearance, Death` | Comic Vine, Manual |

---

### **Pricing Intelligence** (Columns Y-AF)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| Y | MSRP | Manufacturer's suggested retail | `19.99` | Google Books, Publisher |
| Z | Market_Price_High | Highest recent sale | `25.00` | eBay API, Marketplace |
| AA | Market_Price_Low | Lowest recent sale | `8.50` | eBay API, Marketplace |
| AB | Market_Price_Avg | Average recent sale | `15.75` | Calculated |
| AC | Price_Trend | Price direction | `↑ Rising, → Stable, ↓ Falling` | Calculated |
| AD | Last_Sale_Date | Date of most recent sale | `2025-11-10` | eBay API |
| AE | Sales_Count | Number of recent sales | `47` | eBay API |
| AF | Demand_Score | 1-10 demand rating | `7` | Calculated |

---

### **Physical Details** (Columns AG-AK)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| AG | Dimensions | Book dimensions | `6.6 x 10.2 x 0.5 inches` | Google Books |
| AH | Weight_Oz | Weight in ounces | `12.5` | Google Books |
| AI | Binding | Binding type | `Perfect Bound` | Google Books |
| AJ | Paper_Quality | Paper type | `Glossy, Matte` | Google Books, Manual |
| AK | Color | Color or B&W | `Full Color, Black & White` | Google Books |

---

### **Content Details** (Columns AL-AP)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| AL | Language | Primary language | `English` | Google Books |
| AM | Age_Rating | Content rating | `All Ages, Teen, Mature` | Comic Vine |
| AN | Content_Warnings | Content warnings | `Violence, Language` | Comic Vine |
| AO | Story_Arc | Story arc name | `Court of Owls` | Comic Vine |
| AP | Collected_In | Collection info | `Batman Vol 1-3` | Comic Vine |

---

### **Marketplace & Inventory** (Columns AQ-AX)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| AQ | Condition_Image_URL | URL to condition photo | `https://...` | Your Storage |
| AR | Condition_Grade | Condition rating | `MINT, GOOD, FAIR, WORN` | User Input |
| AS | Condition_Notes | Condition description | `Minor spine crease` | User Input |
| AT | Quantity | Number in stock | `2` | User Input |
| AU | Location | Shelf location | `Aisle 3, Shelf B` | User Input |
| AV | Cost_Basis | What you paid | `5.00` | User Input |
| AW | List_Price | Your asking price | `12.99` | User Input |
| AX | Profit_Margin | Profit percentage | `159.8%` | Calculated |

---

### **External IDs & Links** (Columns AY-BD)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| AY | Google_Books_ID | Google Books volume ID | `abc123xyz` | Google Books API |
| AZ | OpenLibrary_ID | OpenLibrary ID | `OL123456M` | OpenLibrary API |
| BA | Amazon_ASIN | Amazon ASIN | `B00ABC123` | Amazon API |
| BB | eBay_Item_Number | eBay item number | `123456789` | eBay API |
| BC | Goodreads_ID | Goodreads book ID | `12345` | Goodreads API |
| BD | Wikipedia_URL | Wikipedia article | `https://...` | Web Search |

---

### **Analytics & Tracking** (Columns BE-BJ)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| BE | Views_Count | How many times viewed | `47` | Your System |
| BF | Inquiries_Count | How many inquiries | `3` | Your System |
| BG | Last_Viewed | Last view timestamp | `2025-11-16 14:30` | Your System |
| BH | Scan_Count | Times scanned | `5` | Your System |
| BI | Days_In_Inventory | Days since first scan | `45` | Calculated |
| BJ | Enrichment_Confidence | Data quality score | `High, Medium, Low` | Calculated |

---

### **Social & Reviews** (Columns BK-BO)

| Col | Field Name | Description | Example | Data Source |
|-----|------------|-------------|---------|-------------|
| BK | Goodreads_Rating | Average rating | `4.5` | Goodreads API |
| BL | Goodreads_Reviews | Number of reviews | `1234` | Goodreads API |
| BM | Amazon_Rating | Amazon rating | `4.7` | Amazon API |
| BN | Amazon_Reviews | Amazon review count | `567` | Amazon API |
| BO | Awards | Awards won | `Eisner Award Winner` | Manual, Web |

---

## 📋 Google Sheets Setup

### Step 1: Create Sheet2 Headers

1. Open your Google Sheet: `Trade Paperback DB`
2. Create a new tab called **"Sheet2"**
3. Add all column headers in Row 1 (A1 through BO1)

### Step 2: Copy Headers

Copy this CSV header row and paste into Row 1:

```csv
UPC,Timestamp,Title,Publisher,Release_Date,Format,Series,Volume_Issue,Page_Count,ISBN,Price_USD,Genre,Description,Cover_Image_URL,Goodreads_Rating,Data_Source,Creators,Cover_Artist,Variant_Type,First_Print,Print_Number,Comic_Vine_ID,Key_Issue,Key_Issue_Reason,MSRP,Market_Price_High,Market_Price_Low,Market_Price_Avg,Price_Trend,Last_Sale_Date,Sales_Count,Demand_Score,Dimensions,Weight_Oz,Binding,Paper_Quality,Color,Language,Age_Rating,Content_Warnings,Story_Arc,Collected_In,Condition_Image_URL,Condition_Grade,Condition_Notes,Quantity,Location,Cost_Basis,List_Price,Profit_Margin,Google_Books_ID,OpenLibrary_ID,Amazon_ASIN,eBay_Item_Number,Goodreads_ID,Wikipedia_URL,Views_Count,Inquiries_Count,Last_Viewed,Scan_Count,Days_In_Inventory,Enrichment_Confidence,Goodreads_Rating,Goodreads_Reviews,Amazon_Rating,Amazon_Reviews,Awards
```

### Step 3: Format Headers

1. Select Row 1
2. Make it **bold**
3. Add background color (light blue or gray)
4. Freeze the row: View → Freeze → 1 row
5. Set text alignment: Center

---

## 🔄 Pipedream Column Mapping

### Google Sheets Step Configuration

In your Pipedream Google Sheets "Add Single Row" step, map columns:

**Column A (UPC):**
```
{{steps.trigger.event.body.upc}}
```

**Column B (Timestamp):**
```
{{steps.enrichment.$return_value.timestamp}}
```

**Column C (Title):**
```
{{steps.enrichment.$return_value.title}}
```

... (and so on for all columns)

---

## 📝 GPT-4 Enrichment Prompt

Updated prompt to include all fields:

```
You are a book/comic metadata researcher. Given a UPC code and API data, return structured metadata.

UPC: {upc_code}
Raw API data: {api_response}

Return a JSON object with ALL these fields (use null if unavailable):

{
  // Core (A-P)
  "title": "Full product title",
  "publisher": "Publisher name",
  "release_date": "YYYY-MM-DD",
  "format": "Trade Paperback|Hardcover|Single Issue|Omnibus",
  "series": "Series name or null",
  "volume_issue": "Vol X or #X or null",
  "page_count": number or null,
  "isbn": "ISBN-13 if different from UPC",
  "price_usd": number or null,
  "genre": "Genre1, Genre2, Genre3",
  "description": "Brief 250-char summary",
  "cover_image_url": "Image URL or null",
  "goodreads_rating": number or null,
  "data_source": "APIs used + GPT-4",
  
  // Comic Specific (Q-X)
  "creators": "Writer, Artist, Inker (comma-separated)",
  "cover_artist": "Cover artist name or null",
  "variant_type": "Regular, Variant A, 1:25, etc. or null",
  "first_print": "Yes/No or null",
  "print_number": "1st, 2nd, 3rd or null",
  "comic_vine_id": "Comic Vine ID or null",
  "key_issue": "Yes/No or null",
  "key_issue_reason": "First appearance, Death, etc. or null",
  
  // Pricing (Y-AF)
  "msrp": number or null,
  "market_price_high": number or null,
  "market_price_low": number or null,
  "market_price_avg": number or null,
  "price_trend": "↑ Rising|→ Stable|↓ Falling|null",
  "last_sale_date": "YYYY-MM-DD or null",
  "sales_count": number or null,
  "demand_score": number (1-10) or null,
  
  // Physical (AG-AK)
  "dimensions": "6.6 x 10.2 x 0.5 inches or null",
  "weight_oz": number or null,
  "binding": "Perfect Bound, Saddle Stitch or null",
  "paper_quality": "Glossy, Matte, Newsprint or null",
  "color": "Full Color, Black & White or null",
  
  // Content (AL-AP)
  "language": "English, Spanish, etc.",
  "age_rating": "All Ages, Teen, Mature or null",
  "content_warnings": "Violence, Language or null",
  "story_arc": "Story arc name or null",
  "collected_in": "Collection info or null",
  
  // External IDs (AY-BD)
  "google_books_id": "Google Books volume ID or null",
  "openlibrary_id": "OpenLibrary ID or null",
  "amazon_asin": "Amazon ASIN or null",
  "ebay_item_number": "eBay item number or null",
  "goodreads_id": "Goodreads book ID or null",
  "wikipedia_url": "Wikipedia URL or null",
  
  // Social (BK-BO)
  "goodreads_reviews": number or null,
  "amazon_rating": number or null,
  "amazon_reviews": number or null,
  "awards": "Award name or null"
}

Be accurate. Use null for unavailable data. Prioritize accuracy over completeness.
```

---

## 🚀 Implementation Priority

### Phase 1: Core Enrichment (Now)
- Columns A-P (existing)
- Columns Q-X (Comic-specific)
- Columns Y-AB (Basic pricing)

### Phase 2: Enhanced Pricing (Next)
- Columns AC-AF (Price trends, demand)
- eBay API integration

### Phase 3: Physical & Content (Later)
- Columns AG-AP (Physical details, content info)
- Comic Vine API integration

### Phase 4: Inventory & Analytics (Future)
- Columns AQ-AX (Inventory fields)
- Columns BE-BJ (Analytics)
- Columns BK-BO (Social ratings)

---

## 📊 Total Columns: 65

- **Core Metadata:** 16 columns (A-P)
- **Comic Specific:** 8 columns (Q-X)
- **Pricing:** 8 columns (Y-AF)
- **Physical:** 5 columns (AG-AK)
- **Content:** 5 columns (AL-AP)
- **Inventory:** 8 columns (AQ-AX)
- **External IDs:** 6 columns (AY-BD)
- **Analytics:** 6 columns (BE-BJ)
- **Social:** 5 columns (BK-BO)

---

## ✅ Next Steps

1. ✅ Create Sheet2 with all headers
2. ⏳ Update Pipedream enrichment workflow
3. ⏳ Integrate Comic Vine API
4. ⏳ Integrate eBay API for pricing
5. ⏳ Update GPT-4 prompt
6. ⏳ Test with real scans

