# Sheet2: LLM-Powered Metadata Enrichment

## 📊 Sheet2 Column Structure

Create a new tab in your Google Sheet called **"Sheet2"** with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| **A: UPC** | Barcode number (from Sheet1) | `978-1-4012-9087-5` |
| **B: Timestamp** | When enriched | `2025-10-05 14:30:22` |
| **C: Title** | Full product title | `Batman: The Long Halloween` |
| **D: Publisher** | Publishing company | `DC Comics` |
| **E: Release_Date** | Publication date | `2011-11-01` |
| **F: Format** | Physical format | `Trade Paperback` |
| **G: Series** | Series name (if part of one) | `Batman` |
| **H: Volume_Issue** | Volume/Issue number | `Vol 1` |
| **I: Page_Count** | Number of pages | `384` |
| **J: ISBN** | ISBN-13 if different from UPC | `978-1401209872` |
| **K: Price_USD** | Cover/retail price | `19.99` |
| **L: Genre** | Genre/category | `Superhero, Mystery, Crime` |
| **M: Description** | Plot summary (250 chars) | `Batman pursues a serial killer...` |
| **N: Cover_Image_URL** | Link to cover image | `https://...` |
| **O: Goodreads_Rating** | Average rating (if found) | `4.5` |
| **P: Data_Source** | Where info came from | `OpenLibrary API + GPT-4` |

---

## 🤖 LLM Search Strategy

The LLM will use a **multi-source approach**:

1. **Public APIs First** (fast, accurate):
   - OpenLibrary API
   - Google Books API
   - ISBN/UPC databases
   
2. **LLM Knowledge** (for context/enrichment):
   - GPT-4 with web search tool
   - Series information
   - Genre classification
   - Description writing

3. **Fallback**:
   - If no data found, mark as "Not Found"
   - User can manually fill in

---

## 🔄 Automatic Workflow

### **Trigger: New Row in Sheet1**
When a new UPC is scanned and added to Sheet1:

1. ✅ **Pipedream detects** new row
2. 🔍 **Searches APIs** for UPC/ISBN data
3. 🤖 **Asks GPT-4** to enrich/format the data
4. 📝 **Writes to Sheet2** with all metadata
5. ✉️ **Optional**: Sends notification

---

## 📝 GPT-4 Prompt Template

```
You are a book/comic metadata researcher. Given a UPC code, find and return structured metadata.

UPC: {upc_code}
Raw API data: {api_response}

Return a JSON object with these fields:
{
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
  "data_source": "APIs used + GPT-4"
}

If data is unavailable, use null. Be accurate and concise.
```

---

## 🚀 Next Steps

1. **Create Sheet2** in your Google Sheet with the columns above
2. **Set up Pipedream workflow** (see `pipedream-enrichment-setup.md`)
3. **Test** with a few scanned UPCs
4. **Review** and adjust metadata as needed

---

## 💡 Tips

- **Rate Limits**: GPT-4 API has rate limits. For bulk processing, add delays.
- **Cost**: ~$0.01-0.03 per enrichment with GPT-4. Use GPT-3.5-turbo for cheaper option.
- **Accuracy**: LLM may hallucinate. Always verify critical data.
- **Images**: Cover images are best found via Google Books/OpenLibrary APIs.

