# Quick Setup Guide: Node.js Code Steps

## ✅ All Steps Use Node.js Code

### Step 1: Trigger
- **Action Type**: Google Sheets - New Row
- **No code needed** - just configure settings

### Step 2: OpenLibrary API
- **Action Type**: **Run Node.js code**
- Copy **ALL** code from `STEP-2-OPENLIBRARY.js`
- Export as: `openLibraryData`

### Step 3: Google Books API
- **Action Type**: **Run Node.js code**
- Copy **ALL** code from `STEP-3-GOOGLE-BOOKS.js`
- Export as: `googleBooksData`

### Step 4: Comic Vine API (Optional)
- **Action Type**: **Run Node.js code**
- Copy **ALL** code from `STEP-4-COMIC-VINE.js`
- Export as: `comicVineData`
- Requires: `COMIC_VINE_API_KEY` in Secrets

### Step 5: eBay Pricing (Optional)
- **Action Type**: **Run Node.js code**
- Copy **ALL** code from `STEP-5-EBAY-PRICING.js`
- Export as: `eBayData`
- Requires: `EBAY_APP_ID` in Secrets

### Step 6: GPT-4 Enrichment
- **Action Type**: OpenAI (ChatGPT) - Chat
- Copy prompt from `STEP-6-GPT-4-USER-MESSAGE.txt`
- Export as: `gptResponse`

### Step 7: Parse Response
- **Action Type**: **Run Node.js code**
- Copy **ALL** code from `STEP-7-PARSE-RESPONSE.js`
- Export as: `parsedMetadata`

### Step 8: Write to Sheet2
- **Action Type**: Google Sheets - Add Row
- Copy mappings from `STEP-8-GOOGLE-SHEETS-MAPPING.md`

---

## 🎯 Summary

**Use Node.js Code steps for:**
- Steps 2, 3, 4, 5, 7 (all API calls and parsing)

**Use Built-in Actions for:**
- Step 1: Google Sheets trigger
- Step 6: OpenAI Chat
- Step 8: Google Sheets write

---

## 📝 How to Add Node.js Code Step

1. Click **"+"** to add step
2. Search for **"Code"** or **"Node.js"**
3. Select **"Run Node.js code"**
4. Copy entire file content (including `export default defineComponent`)
5. Paste into editor
6. Set export name

---

## ✅ Code Format

All Node.js code files use this format:
```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // your code here
    return result;
  },
})
```

Make sure to copy the **entire file**, including the `export default defineComponent` wrapper!

