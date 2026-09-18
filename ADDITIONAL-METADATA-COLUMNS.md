# Additional Metadata Columns for Enrichment

## Current Columns (Sheet2)

You currently have 16 columns:
- UPC, Timestamp, Title, Publisher, Release_Date, Format, Series, Volume_Issue, Page_Count, ISBN, Price_USD, Genre, Description, Cover_Image_URL, Goodreads_Rating, Data_Source

---

## 🎯 Recommended Additional Columns

### **Comic Book Specific** (High Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **Q: Creators** | Writer, Artist, Inker, Colorist | `Scott Snyder, Greg Capullo` | Google Books API, Comic Vine |
| **R: Cover_Artist** | Cover artist name | `Greg Capullo` | Comic Vine, Google Books |
| **S: Variant_Type** | Cover variant identifier | `Regular, Variant A, 1:25, 1:100` | Comic Vine, manual |
| **T: First_Print** | First printing indicator | `Yes/No` | Comic Vine, ISBN lookup |
| **U: Print_Number** | Printing number | `1st, 2nd, 3rd` | Comic Vine, ISBN |
| **V: Comic_Vine_ID** | Comic Vine database ID | `4050-12345` | Comic Vine API |
| **W: Key_Issue** | Is this a key/important issue? | `Yes/No` | Comic Vine, Key Collector |
| **X: Key_Issue_Reason** | Why it's a key issue | `First appearance, Death, Origin` | Comic Vine, manual |

---

### **Pricing Intelligence** (High Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **Y: MSRP** | Manufacturer's suggested retail price | `19.99` | Google Books, publisher data |
| **Z: Market_Price_High** | Highest recent sale price | `25.00` | eBay API, marketplace data |
| **AA: Market_Price_Low** | Lowest recent sale price | `8.50` | eBay API, marketplace data |
| **AB: Market_Price_Avg** | Average recent sale price | `15.75` | Calculated from sales |
| **AC: Price_Trend** | Price direction | `↑ Rising, → Stable, ↓ Falling` | Calculated from history |
| **AD: Last_Sale_Date** | Date of most recent sale | `2025-11-10` | eBay API, marketplace |
| **AE: Sales_Count** | Number of recent sales | `47` | eBay API, marketplace |
| **AF: Demand_Score** | 1-10 demand rating | `7` | Calculated from views/sales |

---

### **Physical Details** (Medium Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **AG: Dimensions** | Book dimensions | `6.6 x 10.2 x 0.5 inches` | Google Books API |
| **AH: Weight_Oz** | Weight in ounces | `12.5` | Google Books API |
| **AI: Binding** | Binding type | `Perfect Bound, Saddle Stitch` | Google Books API |
| **AJ: Paper_Quality** | Paper type | `Glossy, Matte, Newsprint` | Manual, Google Books |
| **AK: Color** | Color or B&W | `Full Color, Black & White` | Google Books, manual |

---

### **Content Details** (Medium Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **AL: Language** | Primary language | `English, Spanish` | Google Books API |
| **AM: Age_Rating** | Content rating | `All Ages, Teen, Mature` | Comic Vine, manual |
| **AN: Content_Warnings** | Content warnings | `Violence, Language` | Comic Vine, manual |
| **AO: Story_Arc** | Story arc name | `Court of Owls, Death of the Family` | Comic Vine |
| **AP: Collected_In** | What collection this is in | `Batman Vol 1-3` | Comic Vine, manual |

---

### **Marketplace & Inventory** (High Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **AQ: Condition_Image_URL** | URL to condition photo | `https://...` | Your storage (from scan) |
| **AR: Condition_Grade** | Condition rating | `MINT, GOOD, FAIR, WORN` | User input |
| **AS: Condition_Notes** | Condition description | `Minor spine crease` | User input |
| **AT: Quantity** | Number in stock | `2` | User input |
| **AU: Location** | Shelf location | `Aisle 3, Shelf B` | User input |
| **AV: Cost_Basis** | What you paid | `5.00` | User input |
| **AW: List_Price** | Your asking price | `12.99` | User input |
| **AX: Profit_Margin** | Profit percentage | `159.8%` | Calculated |

---

### **External IDs & Links** (Low Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **AY: Google_Books_ID** | Google Books volume ID | `abc123xyz` | Google Books API |
| **AZ: OpenLibrary_ID** | OpenLibrary ID | `OL123456M` | OpenLibrary API |
| **BA: Amazon_ASIN** | Amazon ASIN | `B00ABC123` | Amazon API, web detection |
| **BB: eBay_Item_Number** | eBay item number | `123456789` | eBay API |
| **BC: Goodreads_ID** | Goodreads book ID | `12345` | Goodreads API |
| **BD: Wikipedia_URL** | Wikipedia article | `https://...` | Web search |

---

### **Analytics & Tracking** (Medium Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **BE: Views_Count** | How many times viewed | `47` | Your system |
| **BF: Inquiries_Count** | How many inquiries | `3` | Your system |
| **BG: Last_Viewed** | Last view timestamp | `2025-11-16 14:30` | Your system |
| **BH: Scan_Count** | Times scanned | `5` | Your system |
| **BI: Days_In_Inventory** | Days since first scan | `45` | Calculated |
| **BJ: Enrichment_Confidence** | Data quality score | `High, Medium, Low` | Calculated |

---

### **Social & Reviews** (Low Priority)

| Column | Description | Example | Data Source |
|--------|-------------|---------|-------------|
| **BK: Goodreads_Rating** | Average rating | `4.5` | Goodreads API (you have this) |
| **BL: Goodreads_Reviews** | Number of reviews | `1234` | Goodreads API |
| **BM: Amazon_Rating** | Amazon rating | `4.7` | Amazon API |
| **BN: Amazon_Reviews** | Amazon review count | `567` | Amazon API |
| **BO: Awards** | Awards won | `Eisner Award Winner` | Manual, web search |

---

## 🎯 Priority Recommendations

### **Must Have** (Add First)
1. **Creators** (Q) - Critical for comics
2. **Condition_Image_URL** (AQ) - You're already capturing this!
3. **Market_Price_Avg** (AB) - Pricing intelligence
4. **Comic_Vine_ID** (V) - Best comic database
5. **Variant_Type** (S) - Critical for variants

### **Should Have** (Add Next)
6. **MSRP** (Y) - Retail price reference
7. **Key_Issue** (W) - Important for pricing
8. **Price_Trend** (AC) - Market direction
9. **Cover_Artist** (R) - Important for variants
10. **Condition_Grade** (AR) - You'll need this

### **Nice to Have** (Add Later)
- Physical details (dimensions, weight)
- External IDs (for linking)
- Analytics columns (views, inquiries)
- Social ratings (Goodreads, Amazon)

---

## 📊 Updated Sheet2 Structure (Recommended)

### **Core Metadata** (Columns A-P)
- Keep your existing 16 columns

### **Comic-Specific** (Columns Q-X)
- Creators, Cover Artist, Variant Type, First Print, Print Number, Comic Vine ID, Key Issue, Key Issue Reason

### **Pricing** (Columns Y-AF)
- MSRP, Market Price High/Low/Avg, Price Trend, Last Sale Date, Sales Count, Demand Score

### **Physical** (Columns AG-AK)
- Dimensions, Weight, Binding, Paper Quality, Color

### **Content** (Columns AL-AP)
- Language, Age Rating, Content Warnings, Story Arc, Collected In

### **Inventory** (Columns AQ-AX)
- Condition Image URL, Condition Grade, Condition Notes, Quantity, Location, Cost Basis, List Price, Profit Margin

### **External IDs** (Columns AY-BD)
- Google Books ID, OpenLibrary ID, Amazon ASIN, eBay Item Number, Goodreads ID, Wikipedia URL

### **Analytics** (Columns BE-BJ)
- Views Count, Inquiries Count, Last Viewed, Scan Count, Days In Inventory, Enrichment Confidence

### **Social** (Columns BK-BO)
- Goodreads Rating/Reviews, Amazon Rating/Reviews, Awards

---

## 🔧 Implementation Notes

### **Data Sources Priority**

1. **Comic Vine API** (Best for comics)
   - Creators, Variant Type, Key Issues, Story Arcs
   - Free tier: 200 requests/day
   - API: https://comicvine.gamespot.com/api/

2. **eBay API** (For pricing)
   - Market prices, sales history
   - Free tier: 5,000 calls/day
   - API: https://developer.ebay.com/

3. **Google Books API** (You're already using)
   - MSRP, Dimensions, Weight
   - Free tier: 1,000 requests/day

4. **Key Collector API** (For key issues)
   - Key issue identification
   - May require subscription

5. **MyComicShop API** (For pricing)
   - Comic-specific pricing
   - May require partnership

### **Enrichment Workflow**

```
1. Scan UPC → Sheet1
2. Pipedream triggers enrichment
3. Query APIs in priority order:
   a. Comic Vine (if comic detected)
   b. Google Books (always)
   c. eBay (for pricing)
   d. OpenLibrary (fallback)
4. GPT-4 enriches/combines data
5. Write to Sheet2 with all columns
```

---

## 💡 Quick Wins

### **Easy to Add** (No new APIs needed)
- **Condition_Image_URL** - You're already capturing images!
- **Enrichment_Confidence** - Calculate from data sources used
- **Days_In_Inventory** - Calculate from timestamp
- **Scan_Count** - Count scans per UPC

### **Medium Effort** (New API integration)
- **Creators** - Comic Vine API
- **Market_Price_Avg** - eBay API
- **Comic_Vine_ID** - Comic Vine API

### **Higher Effort** (Complex logic)
- **Key_Issue** - Requires Comic Vine + Key Collector
- **Price_Trend** - Requires historical data
- **Variant_Type** - Requires image matching

---

## 📝 Next Steps

1. **Decide which columns you need** based on your priorities
2. **Add columns to Sheet2** (Google Sheets supports up to 18,278 columns!)
3. **Update Pipedream workflow** to populate new columns
4. **Integrate new APIs** (Comic Vine, eBay) if needed
5. **Test** with real scans

---

## 🎯 Recommended Starting Point

**Add these 10 columns first:**
1. Q: Creators
2. R: Cover_Artist  
3. S: Variant_Type
4. V: Comic_Vine_ID
5. Y: MSRP
6. AB: Market_Price_Avg
7. AC: Price_Trend
8. AQ: Condition_Image_URL (you're capturing this!)
9. AR: Condition_Grade
10. W: Key_Issue

These give you the most value for comic book inventory management!

