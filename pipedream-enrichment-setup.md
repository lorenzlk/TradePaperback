# Pipedream Workflow: LLM Metadata Enrichment

## 🎯 Overview

This Pipedream workflow automatically enriches UPC data from Sheet1 by:
1. Monitoring Sheet1 for new rows
2. Searching public APIs for product data
3. Using GPT-4 to enrich and format the data
4. Writing results to Sheet2

---

## 📋 Workflow Steps

### **Step 1: Trigger - New Row in Google Sheets**

1. Go to [Pipedream](https://pipedream.com/workflows)
2. Create **New Workflow**
3. Add trigger: **Google Sheets - New Row**
4. Configure:
   - **Spreadsheet**: Select your sheet
   - **Worksheet**: `Sheet1`
   - **Watch for**: New rows

---

### **Step 2: Search OpenLibrary API**

Add **HTTP / Webhook - Make a Request**:

```javascript
// OpenLibrary ISBN search
const upc = steps.trigger.event.upc;

// Try as ISBN first
const isbnUrl = `https://openlibrary.org/isbn/${upc}.json`;

try {
  const response = await require("@pipedreamhq/platform").axios(this, {
    url: isbnUrl,
    timeout: 5000
  });
  
  return response;
} catch (error) {
  // No data found
  return { found: false };
}
```

**Export as**: `openLibraryData`

---

### **Step 3: Search Google Books API**

Add **HTTP / Webhook - Make a Request**:

```javascript
// Google Books API search
const upc = steps.trigger.event.upc;

const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${upc}`;

try {
  const response = await require("@pipedreamhq/platform").axios(this, {
    url: url,
    timeout: 5000
  });
  
  if (response.totalItems > 0) {
    return response.items[0].volumeInfo;
  } else {
    return { found: false };
  }
} catch (error) {
  return { found: false };
}
```

**Export as**: `googleBooksData`

---

### **Step 4: GPT-4 Metadata Enrichment**

Add **OpenAI (ChatGPT) - Chat**:

**System Prompt**:
```
You are a book and comic book metadata researcher. Extract and format structured metadata from provided API responses. Return valid JSON only.
```

**User Message**:
```javascript
`You are enriching metadata for a book or comic.

UPC/ISBN: ${steps.trigger.event.upc}
Scanned at: ${steps.trigger.event.timestamp}
Device: ${steps.trigger.event.device}

OpenLibrary Data: ${JSON.stringify(steps.openLibraryData, null, 2)}
Google Books Data: ${JSON.stringify(steps.googleBooksData, null, 2)}

Return a JSON object with these exact fields (use null if unknown):
{
  "title": "Full product title",
  "publisher": "Publisher name",
  "release_date": "YYYY-MM-DD format",
  "format": "Trade Paperback|Hardcover|Single Issue|Omnibus|Graphic Novel",
  "series": "Series name or null",
  "volume_issue": "Vol X or #X or null",
  "page_count": number or null,
  "isbn": "ISBN-13",
  "price_usd": number or null,
  "genre": "Comma-separated genres",
  "description": "Brief 250-character summary",
  "cover_image_url": "Direct image URL or null",
  "goodreads_rating": number or null,
  "data_source": "List sources used"
}

Return ONLY the JSON object, no additional text.`
```

**Model**: `gpt-4o` (or `gpt-3.5-turbo` for cheaper option)
**Temperature**: `0.3` (more consistent)
**Max Tokens**: `500`

**Export as**: `gptResponse`

---

### **Step 5: Parse GPT Response**

Add **Node.js Code**:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    try {
      // Parse GPT-4 response
      const content = steps.gptResponse.$return_value.choices[0].message.content;
      
      // Extract JSON from response (in case GPT adds markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const metadata = JSON.parse(jsonMatch[0]);
      
      // Add original UPC and timestamp
      metadata.upc = steps.trigger.event.upc;
      metadata.enriched_at = new Date().toISOString();
      
      return metadata;
    } catch (error) {
      // If parsing fails, return error data
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

### **Step 6: Write to Sheet2**

Add **Google Sheets - Add Row**:

**Spreadsheet**: Your sheet
**Worksheet**: `Sheet2`

**Row Data** (map these fields):
```javascript
{
  "UPC": steps.parsedMetadata.upc,
  "Timestamp": steps.parsedMetadata.enriched_at,
  "Title": steps.parsedMetadata.title,
  "Publisher": steps.parsedMetadata.publisher,
  "Release_Date": steps.parsedMetadata.release_date,
  "Format": steps.parsedMetadata.format,
  "Series": steps.parsedMetadata.series,
  "Volume_Issue": steps.parsedMetadata.volume_issue,
  "Page_Count": steps.parsedMetadata.page_count,
  "ISBN": steps.parsedMetadata.isbn,
  "Price_USD": steps.parsedMetadata.price_usd,
  "Genre": steps.parsedMetadata.genre,
  "Description": steps.parsedMetadata.description,
  "Cover_Image_URL": steps.parsedMetadata.cover_image_url,
  "Goodreads_Rating": steps.parsedMetadata.goodreads_rating,
  "Data_Source": steps.parsedMetadata.data_source
}
```

---

### **Step 7: (Optional) Send Notification**

Add **Slack - Send Message** or **Email**:

```javascript
New metadata enriched! 
📚 ${steps.parsedMetadata.title}
🏢 ${steps.parsedMetadata.publisher}
📅 ${steps.parsedMetadata.release_date}
🔗 Sheet: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID
```

---

## ✅ Activate Workflow

1. **Test** with a manual trigger using sample data
2. **Deploy** the workflow
3. **Scan a UPC** with your app
4. **Watch** it auto-populate Sheet2!

---

## 💰 Cost Estimates

- **GPT-4o**: ~$0.01-0.03 per enrichment
- **GPT-3.5-turbo**: ~$0.001 per enrichment
- **API calls**: Free (OpenLibrary, Google Books)
- **Pipedream**: Free tier = 10K invocations/month

For 100 scans/month: **~$1-3 total**

---

## 🐛 Troubleshooting

**Issue**: Metadata not found
- **Solution**: GPT returns null values, manually fill in Sheet2

**Issue**: Rate limit errors
- **Solution**: Add a delay step between searches

**Issue**: JSON parse errors
- **Solution**: Check GPT response format, adjust prompt

**Issue**: Wrong metadata
- **Solution**: GPT hallucination - verify against source APIs, adjust temperature lower

---

## 🚀 Enhancements

1. **Add retry logic** for failed API calls
2. **Cache results** to avoid duplicate lookups
3. **Add image download** to store covers in Google Drive
4. **Multi-language support** for international books
5. **Price tracking** from Amazon/retailer APIs

