# Complete Pipedream Enrichment Workflow
## All 65 Metadata Columns

---

## 🎯 Workflow Overview

This workflow enriches UPC scans with **65 metadata columns** by:
1. Monitoring Sheet1 for new rows
2. Searching multiple APIs (OpenLibrary, Google Books, Comic Vine, eBay)
3. Using GPT-4 to enrich and format data
4. Writing complete metadata to Sheet2

---

## 📋 Complete Workflow Steps

### **Step 1: Trigger - New Row in Google Sheets**

1. Create **New Workflow** in Pipedream
2. Add trigger: **Google Sheets - New Row**
3. Configure:
   - **Spreadsheet**: `Trade Paperback DB`
   - **Worksheet**: `Sheet1`
   - **Watch for**: New rows

---

### **Step 2: Search OpenLibrary API**

Add **HTTP / Webhook - Make a Request**:

```javascript
const upc = steps.trigger.event.upc;

const isbnUrl = `https://openlibrary.org/isbn/${upc}.json`;

try {
  const response = await require("@pipedreamhq/platform").axios(this, {
    url: isbnUrl,
    timeout: 5000
  });
  return response;
} catch (error) {
  return { found: false };
}
```

**Export as**: `openLibraryData`

---

### **Step 3: Search Google Books API**

Add **HTTP / Webhook - Make a Request**:

```javascript
const upc = steps.trigger.event.upc;
const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${upc}`;

try {
  const response = await require("@pipedreamhq/platform").axios(this, {
    url: url,
    timeout: 5000
  });
  
  if (response.totalItems > 0) {
    return response.items[0];
  } else {
    return { found: false };
  }
} catch (error) {
  return { found: false };
}
```

**Export as**: `googleBooksData`

---

### **Step 4: Search Comic Vine API** (Optional - for comics)

Add **HTTP / Webhook - Make a Request**:

```javascript
// Comic Vine API requires API key (free tier: 200 requests/day)
// Get key from: https://comicvine.gamespot.com/api/

const upc = steps.trigger.event.upc;
const apiKey = process.env.COMIC_VINE_API_KEY; // Set in Pipedream Secrets

// Search by ISBN
const url = `https://comicvine.gamespot.com/api/issue/4000-${upc}/?api_key=${apiKey}&format=json`;

try {
  const response = await require("@pipedreamhq/platform").axios(this, {
    url: url,
    timeout: 5000,
    headers: {
      'User-Agent': 'TradePaperback/1.0'
    }
  });
  
  if (response.results) {
    return response.results;
  } else {
    return { found: false };
  }
} catch (error) {
  return { found: false };
}
```

**Export as**: `comicVineData`

**Note**: Comic Vine API key is free but requires registration.

---

### **Step 5: Search eBay API for Pricing** (Optional)

Add **HTTP / Webhook - Make a Request**:

```javascript
// eBay API requires app credentials
// Free tier: 5,000 calls/day

const upc = steps.trigger.event.upc;
const appId = process.env.EBAY_APP_ID; // Set in Pipedream Secrets

// Search completed listings
const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${appId}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemFilter(0).name=ProductID&itemFilter(0).value=${upc}&itemFilter(0).paramName=ISBN&itemFilter(1).name=ListingType&itemFilter(1).value(0)=FixedPrice&itemFilter(1).value(1)=AuctionWithBIN&sortOrder=EndTimeSoonest&paginationInput.entriesPerPage=50`;

try {
  const response = await require("@pipedreamhq/platform").axios(this, {
    url: url,
    timeout: 10000
  });
  
  if (response.findCompletedItemsResponse && 
      response.findCompletedItemsResponse[0].searchResult &&
      response.findCompletedItemsResponse[0].searchResult[0].item) {
    
    const items = response.findCompletedItemsResponse[0].searchResult[0].item;
    const prices = items.map(item => parseFloat(item.sellingStatus[0].currentPrice[0].__value__));
    
    return {
      found: true,
      items: items,
      prices: prices,
      high: Math.max(...prices),
      low: Math.min(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
      count: prices.length,
      lastSale: items[0].listingInfo[0].endTime[0]
    };
  } else {
    return { found: false };
  }
} catch (error) {
  return { found: false };
}
```

**Export as**: `eBayData`

---

### **Step 6: GPT-4 Complete Metadata Enrichment**

Add **OpenAI (ChatGPT) - Chat**:

**System Prompt**:
```
You are a book and comic book metadata researcher. Extract and format structured metadata from provided API responses. Return valid JSON only with ALL requested fields.
```

**User Message**:
```javascript
`Enrich metadata for this book/comic:

UPC/ISBN: ${steps.trigger.event.upc}
Scanned at: ${steps.trigger.event.timestamp}

OpenLibrary Data: ${JSON.stringify(steps.openLibraryData, null, 2)}
Google Books Data: ${JSON.stringify(steps.googleBooksData, null, 2)}
Comic Vine Data: ${JSON.stringify(steps.comicVineData, null, 2)}
eBay Pricing Data: ${JSON.stringify(steps.eBayData, null, 2)}

Return a JSON object with ALL these fields (use null if unavailable):

{
  // Core Metadata (A-P)
  "title": "Full product title",
  "publisher": "Publisher name",
  "release_date": "YYYY-MM-DD",
  "format": "Trade Paperback|Hardcover|Single Issue|Omnibus|Graphic Novel",
  "series": "Series name or null",
  "volume_issue": "Vol X or #X or null",
  "page_count": number or null,
  "isbn": "ISBN-13",
  "price_usd": number or null,
  "genre": "Genre1, Genre2, Genre3",
  "description": "Brief 250-character summary",
  "cover_image_url": "Direct image URL - prioritize Google Books or OpenLibrary",
  "goodreads_rating": number or null,
  "data_source": "List all sources used",
  
  // Comic Specific (Q-X)
  "creators": "Writer, Artist, Inker (comma-separated) or null",
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
  "language": "English or null",
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

IMPORTANT:
- Use null for unavailable data, never make up data
- For cover_image_url, prioritize: Google Books > OpenLibrary > null
- For pricing, use eBay data if available
- For comics, prioritize Comic Vine data
- Be accurate and concise
- Return ONLY valid JSON, no markdown or extra text`
```

**Model**: `gpt-4o`  
**Temperature**: `0.3`  
**Max Tokens**: `2000`

**Export as**: `gptResponse`

---

### **Step 7: Parse GPT Response**

Add **Node.js Code**:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    try {
      const content = steps.gptResponse.$return_value.choices[0].message.content;
      
      // Extract JSON (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/\{[\s\S]*\}/);
      const metadata = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      
      // Add original UPC and timestamp
      metadata.upc = steps.trigger.event.upc;
      metadata.enriched_at = new Date().toISOString();
      
      // Add condition image URL if available from Sheet1
      metadata.condition_image_url = steps.trigger.event.condition_image_url || null;
      
      // Calculate enrichment confidence
      let confidenceScore = 0;
      if (metadata.title) confidenceScore += 20;
      if (metadata.publisher) confidenceScore += 10;
      if (metadata.cover_image_url) confidenceScore += 15;
      if (metadata.creators) confidenceScore += 10;
      if (metadata.comic_vine_id) confidenceScore += 15;
      if (metadata.market_price_avg) confidenceScore += 10;
      if (steps.googleBooksData.found) confidenceScore += 10;
      if (steps.comicVineData.found) confidenceScore += 10;
      
      metadata.enrichment_confidence = confidenceScore >= 70 ? 'High' : 
                                       confidenceScore >= 40 ? 'Medium' : 'Low';
      
      return metadata;
    } catch (error) {
      return {
        upc: steps.trigger.event.upc,
        enriched_at: new Date().toISOString(),
        error: "Failed to parse metadata",
        raw_response: steps.gptResponse.$return_value.choices[0].message.content
      };
    }
  },
})
```

**Export as**: `parsedMetadata`

---

### **Step 8: Write to Sheet2 (All 65 Columns)**

Add **Google Sheets - Add Row**:

**Spreadsheet**: `Trade Paperback DB`  
**Worksheet**: `Sheet2`

**Column Mappings** (65 columns total):

**Core Metadata (A-P):**
- Column A: `{{steps.parsedMetadata.upc}}`
- Column B: `{{steps.parsedMetadata.enriched_at}}`
- Column C: `{{steps.parsedMetadata.title}}`
- Column D: `{{steps.parsedMetadata.publisher}}`
- Column E: `{{steps.parsedMetadata.release_date}}`
- Column F: `{{steps.parsedMetadata.format}}`
- Column G: `{{steps.parsedMetadata.series}}`
- Column H: `{{steps.parsedMetadata.volume_issue}}`
- Column I: `{{steps.parsedMetadata.page_count}}`
- Column J: `{{steps.parsedMetadata.isbn}}`
- Column K: `{{steps.parsedMetadata.price_usd}}`
- Column L: `{{steps.parsedMetadata.genre}}`
- Column M: `{{steps.parsedMetadata.description}}`
- Column N: `{{steps.parsedMetadata.cover_image_url}}`
- Column O: `{{steps.parsedMetadata.goodreads_rating}}`
- Column P: `{{steps.parsedMetadata.data_source}}`

**Comic Specific (Q-X):**
- Column Q: `{{steps.parsedMetadata.creators}}`
- Column R: `{{steps.parsedMetadata.cover_artist}}`
- Column S: `{{steps.parsedMetadata.variant_type}}`
- Column T: `{{steps.parsedMetadata.first_print}}`
- Column U: `{{steps.parsedMetadata.print_number}}`
- Column V: `{{steps.parsedMetadata.comic_vine_id}}`
- Column W: `{{steps.parsedMetadata.key_issue}}`
- Column X: `{{steps.parsedMetadata.key_issue_reason}}`

**Pricing (Y-AF):**
- Column Y: `{{steps.parsedMetadata.msrp}}`
- Column Z: `{{steps.parsedMetadata.market_price_high}}`
- Column AA: `{{steps.parsedMetadata.market_price_low}}`
- Column AB: `{{steps.parsedMetadata.market_price_avg}}`
- Column AC: `{{steps.parsedMetadata.price_trend}}`
- Column AD: `{{steps.parsedMetadata.last_sale_date}}`
- Column AE: `{{steps.parsedMetadata.sales_count}}`
- Column AF: `{{steps.parsedMetadata.demand_score}}`

**Physical (AG-AK):**
- Column AG: `{{steps.parsedMetadata.dimensions}}`
- Column AH: `{{steps.parsedMetadata.weight_oz}}`
- Column AI: `{{steps.parsedMetadata.binding}}`
- Column AJ: `{{steps.parsedMetadata.paper_quality}}`
- Column AK: `{{steps.parsedMetadata.color}}`

**Content (AL-AP):**
- Column AL: `{{steps.parsedMetadata.language}}`
- Column AM: `{{steps.parsedMetadata.age_rating}}`
- Column AN: `{{steps.parsedMetadata.content_warnings}}`
- Column AO: `{{steps.parsedMetadata.story_arc}}`
- Column AP: `{{steps.parsedMetadata.collected_in}}`

**Inventory (AQ-AX):**
- Column AQ: `{{steps.parsedMetadata.condition_image_url}}`
- Column AR: (User input - leave empty)
- Column AS: (User input - leave empty)
- Column AT: (User input - leave empty)
- Column AU: (User input - leave empty)
- Column AV: (User input - leave empty)
- Column AW: (User input - leave empty)
- Column AX: (Calculated - leave empty)

**External IDs (AY-BD):**
- Column AY: `{{steps.parsedMetadata.google_books_id}}`
- Column AZ: `{{steps.parsedMetadata.openlibrary_id}}`
- Column BA: `{{steps.parsedMetadata.amazon_asin}}`
- Column BB: `{{steps.parsedMetadata.ebay_item_number}}`
- Column BC: `{{steps.parsedMetadata.goodreads_id}}`
- Column BD: `{{steps.parsedMetadata.wikipedia_url}}`

**Analytics (BE-BJ):**
- Column BE: `0` (initial value)
- Column BF: `0` (initial value)
- Column BG: (empty - will be updated)
- Column BH: `1` (first scan)
- Column BI: `0` (calculated later)
- Column BJ: `{{steps.parsedMetadata.enrichment_confidence}}`

**Social (BK-BO):**
- Column BK: `{{steps.parsedMetadata.goodreads_rating}}` (duplicate of O)
- Column BL: `{{steps.parsedMetadata.goodreads_reviews}}`
- Column BM: `{{steps.parsedMetadata.amazon_rating}}`
- Column BN: `{{steps.parsedMetadata.amazon_reviews}}`
- Column BO: `{{steps.parsedMetadata.awards}}`

---

## 🔑 API Keys Required

### **Required:**
- **OpenAI API Key** - For GPT-4 enrichment
- **Google Books API** - Free (no key needed)

### **Optional (but recommended):**
- **Comic Vine API Key** - Free, 200 requests/day
  - Get at: https://comicvine.gamespot.com/api/
- **eBay API App ID** - Free, 5,000 calls/day
  - Get at: https://developer.ebay.com/

**Set in Pipedream Secrets:**
- `OPENAI_API_KEY`
- `COMIC_VINE_API_KEY`
- `EBAY_APP_ID`

---

## 💰 Cost Estimates

- **GPT-4o**: ~$0.02-0.05 per enrichment (more fields = more tokens)
- **API calls**: Free (OpenLibrary, Google Books, Comic Vine, eBay)
- **Pipedream**: Free tier = 10K invocations/month

**For 100 scans/month: ~$2-5 total**

---

## ✅ Testing

1. **Test each step individually** before connecting
2. **Use sample UPC**: `9781401209872` (Batman: Court of Owls)
3. **Check Sheet2** after test run
4. **Verify all columns** populate correctly

---

## 🚀 Next Steps

1. ✅ Create Sheet2 with all 65 column headers
2. ⏳ Set up Pipedream workflow with all steps
3. ⏳ Configure API keys in Pipedream Secrets
4. ⏳ Test with sample UPC
5. ⏳ Deploy and monitor

---

## 📝 Notes

- **Not all columns will populate** - depends on data availability
- **User input columns** (AR-AX) will be empty initially
- **Analytics columns** (BE-BJ) update over time
- **Some APIs** may have rate limits - add delays if needed

