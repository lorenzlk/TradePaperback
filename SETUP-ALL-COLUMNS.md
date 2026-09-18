# Setup Guide: All 65 Metadata Columns

## 🎯 Quick Start

### Step 1: Create Sheet2 Headers

1. Open your Google Sheet: `Trade Paperback DB`
2. Create new tab: **Sheet2**
3. Open `SHEET2-HEADERS-CSV.csv` file
4. Copy the header row
5. Paste into Row 1 of Sheet2
6. Format Row 1: Bold, background color, freeze row

**Done!** You now have all 65 column headers.

---

### Step 2: Set Up Pipedream Workflow

Follow the guide in `PIPEDREAM-COMPLETE-ENRICHMENT.md`:

1. **Create workflow** with Google Sheets trigger
2. **Add API search steps** (OpenLibrary, Google Books, Comic Vine, eBay)
3. **Add GPT-4 enrichment step** (with complete prompt)
4. **Add parse step** (extract JSON from GPT response)
5. **Add Google Sheets step** (map all 65 columns)

---

### Step 3: Configure API Keys

In Pipedream Secrets, add:

- `OPENAI_API_KEY` - Required for GPT-4
- `COMIC_VINE_API_KEY` - Optional (get free at comicvine.gamespot.com/api/)
- `EBAY_APP_ID` - Optional (get free at developer.ebay.com/)

---

### Step 4: Test

1. Scan a UPC with your app
2. Check Sheet1 - should see new row
3. Wait 10-30 seconds
4. Check Sheet2 - should see enriched metadata

---

## 📊 Column Reference

See `SHEET2-COMPLETE-STRUCTURE.md` for:
- Complete column list (A through BO)
- Descriptions and examples
- Data sources for each column

---

## 🔄 Implementation Phases

### Phase 1: Basic (Now)
- Columns A-P (16 core columns)
- OpenLibrary + Google Books APIs
- GPT-4 enrichment

### Phase 2: Comics (Next)
- Columns Q-X (8 comic-specific columns)
- Comic Vine API integration

### Phase 3: Pricing (Later)
- Columns Y-AF (8 pricing columns)
- eBay API integration

### Phase 4: Complete (Future)
- All remaining columns
- Full API integrations

---

## ✅ Checklist

- [ ] Created Sheet2 with all 65 headers
- [ ] Set up Pipedream workflow
- [ ] Configured OpenAI API key
- [ ] Configured Comic Vine API key (optional)
- [ ] Configured eBay API key (optional)
- [ ] Tested with sample UPC
- [ ] Verified columns populate correctly

---

## 📚 Documentation Files

- `SHEET2-COMPLETE-STRUCTURE.md` - Full column reference
- `SHEET2-HEADERS-CSV.csv` - Headers to copy/paste
- `PIPEDREAM-COMPLETE-ENRICHMENT.md` - Complete workflow guide
- `ADDITIONAL-METADATA-COLUMNS.md` - Column suggestions and rationale

---

## 🆘 Need Help?

- Check Pipedream logs for errors
- Verify API keys are set correctly
- Test each workflow step individually
- Check GPT-4 response format matches expected JSON

