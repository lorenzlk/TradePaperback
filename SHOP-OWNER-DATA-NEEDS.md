# Data Shop Owners Want to See

## 🎯 Most Important Fields for Shop Owners

### **Visual Identification** (Critical)
1. **Cover Image** ⭐⭐⭐
   - Visual confirmation of the book
   - Helps identify variants, editions
   - Shows condition at a glance
   - **Current:** ✅ Available from Google Books API

2. **Cover Image URL** ⭐⭐⭐
   - Store high-quality cover image
   - Display in inventory systems
   - Share with customers
   - **Current:** ✅ Available (`imageLinks.thumbnail` or `imageLinks.smallThumbnail`)

### **Product Identification** (Critical)
3. **Title** ⭐⭐⭐
   - Full title of the book/comic
   - **Current:** ✅ Available

4. **Subtitle** ⭐⭐
   - Additional title information
   - **Current:** ✅ Available

5. **ISBN/UPC** ⭐⭐⭐
   - Primary identifier for inventory
   - **Current:** ✅ Available

6. **Publisher** ⭐⭐⭐
   - DC Comics, Marvel, Image, etc.
   - Critical for organization
   - **Current:** ✅ Available

7. **Series Name** ⭐⭐⭐
   - Which series (e.g., "Batman", "The Walking Dead")
   - **Current:** ⚠️ Partially available (in categories)

8. **Volume/Issue Number** ⭐⭐⭐
   - "Vol 1", "#1", "Issue 1"
   - Critical for comics
   - **Current:** ❌ Not extracted (needs parsing from title)

### **Product Details** (High Value)
9. **Format** ⭐⭐
   - Trade Paperback, Hardcover, Single Issue, etc.
   - **Current:** ⚠️ Partially available (in categories)

10. **Release Date** ⭐⭐
    - When the book was published
    - Helps with pricing (newer = more valuable)
    - **Current:** ✅ Available (`publishedDate`)

11. **Page Count** ⭐
    - Number of pages
    - **Current:** ✅ Available

12. **Authors/Creators** ⭐⭐
    - Writer, Artist, etc.
    - **Current:** ✅ Available (`authors` array)

### **Shop-Specific Fields** (Need to Add)
13. **Condition** ⭐⭐⭐
    - Near Mint, Very Fine, Fine, Good, Poor
    - **Current:** ❌ Not collected (shop owner needs to input)

14. **Price** ⭐⭐⭐
    - What shop is selling it for
    - **Current:** ❌ Not collected (shop owner needs to input)

15. **Cost Basis** ⭐⭐
    - What shop paid for it
    - **Current:** ❌ Not collected

16. **Stock Quantity** ⭐⭐
    - How many copies in stock
    - **Current:** ❌ Not collected

17. **Location in Store** ⭐
    - Shelf, bin, section
    - **Current:** ❌ Not collected

18. **Date Acquired** ⭐
    - When shop got the book
    - **Current:** ❌ Not collected

## 📊 Current Data Available from Cover Scan

When you scan a cover, you get:

```json
{
  "isbn": "9781401235420",
  "title": "Batman Vol 1: Court of Owls",
  "subtitle": "The New 52",
  "authors": ["Scott Snyder", "Greg Capullo"],
  "publisher": "DC Comics",
  "publishedDate": "2012-05-08",
  "description": "Following his battle with...",
  "pageCount": 176,
  "categories": ["Comics & Graphic Novels", "Superheroes"],
  "imageLinks": {
    "thumbnail": "https://books.google.com/books/...",
    "smallThumbnail": "https://books.google.com/books/...",
    "small": "https://books.google.com/books/...",
    "medium": "https://books.google.com/books/...",
    "large": "https://books.google.com/books/..."
  },
  "averageRating": 4.5
}
```

## 🎨 Enhanced Data Collection for Shop Owners

### Option 1: Add Shop Fields to Scanner (Recommended)

Add input fields after cover scan:

```javascript
// After successful cover scan, show form:
- Condition: [Dropdown: Near Mint, Very Fine, Fine, Good, Poor]
- Price: $[Input]
- Quantity: [Input]
- Notes: [Text area]
```

### Option 2: Separate Inventory Management Sheet

Create a second Google Sheet with columns:

| Column | Field | Source |
|--------|-------|--------|
| A | Cover Image | From Google Books API |
| B | ISBN | From scan |
| C | Title | From scan |
| D | Publisher | From scan |
| E | Series | Parse from title/categories |
| F | Volume/Issue | Parse from title |
| G | Format | From categories |
| H | Release Date | From scan |
| I | Condition | Shop input |
| J | Price | Shop input |
| K | Cost Basis | Shop input |
| L | Quantity | Shop input |
| M | Date Scanned | Auto |
| N | Cover Image URL | From scan |

## 🔧 Implementation: Enhanced Cover Scan Data

### Update Pipedream to Extract More Fields

The cover scan workflow should extract:

1. **Series Name** - Parse from title or categories
   - Look for patterns: "Batman Vol 1" → Series: "Batman"
   - Or use categories: ["Comics", "DC Comics", "Batman"]

2. **Volume/Issue** - Parse from title
   - Patterns: "Vol 1", "#1", "Issue 1", "Volume 1"
   - Extract and store separately

3. **Format** - Determine from categories/title
   - "Trade Paperback" → Format: "TPB"
   - "Hardcover" → Format: "HC"
   - "Single Issue" → Format: "Single"

### Enhanced Book Data Structure

```javascript
{
  // Identifiers
  isbn: "9781401235420",
  upc: "012345678905",
  
  // Basic Info
  title: "Batman Vol 1: Court of Owls",
  subtitle: "The New 52",
  series: "Batman",           // ⭐ NEW - Parsed from title
  volume_issue: "Vol 1",      // ⭐ NEW - Parsed from title
  format: "Trade Paperback",  // ⭐ Enhanced - Better parsing
  
  // Creators
  authors: ["Scott Snyder", "Greg Capullo"],
  publisher: "DC Comics",
  
  // Details
  published_date: "2012-05-08",
  page_count: 176,
  categories: ["Comics & Graphic Novels", "Superheroes"],
  
  // Images
  cover_image_url: "https://books.google.com/books/...",  // ⭐ High-res
  cover_image_thumbnail: "https://books.google.com/books/...",
  
  // Shop Fields (to be added)
  condition: null,      // ⭐ Shop owner inputs
  price: null,          // ⭐ Shop owner inputs
  quantity: null,       // ⭐ Shop owner inputs
  cost_basis: null,     // ⭐ Shop owner inputs
  
  // Metadata
  description: "...",
  average_rating: 4.5,
  confidence: "high"
}
```

## 📋 Recommended Google Sheet Structure for Shop Owners

### Sheet 1: "Scans" (Current - Raw Data)
Keep as-is for tracking all scans

### Sheet 2: "Inventory" (New - Shop Management)

| Column | Field | Example |
|--------|-------|---------|
| A | Cover Image | [Image] |
| B | ISBN | 9781401235420 |
| C | Title | Batman Vol 1: Court of Owls |
| D | Series | Batman |
| E | Volume/Issue | Vol 1 |
| F | Publisher | DC Comics |
| G | Format | Trade Paperback |
| H | Release Date | 2012-05-08 |
| I | Condition | Near Mint |
| J | Price | $15.99 |
| K | Cost Basis | $8.00 |
| L | Quantity | 3 |
| M | Date Scanned | 2025-11-16 |
| N | Cover Image URL | https://... |

## 🚀 Next Steps

1. **Enhance Cover Scan** - Extract series/volume from title
2. **Add Shop Input Form** - After scan, prompt for condition/price
3. **Create Inventory Sheet** - Separate sheet for shop management
4. **Add Cover Image Column** - Use `IMAGE()` formula in Google Sheets
5. **Parse Series/Volume** - Better extraction from title

---

**Priority:** Cover Image URL is the most important - shop owners need visual confirmation!

