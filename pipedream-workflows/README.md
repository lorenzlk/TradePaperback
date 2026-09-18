# Pipedream Workflow Steps

## 📋 Quick Reference

Each workflow step is in its own file for easy copy-paste:

1. **STEP-1-TRIGGER.md** - Google Sheets trigger setup
2. **STEP-2-OPENLIBRARY.js** - OpenLibrary API search
3. **STEP-3-GOOGLE-BOOKS.js** - Google Books API search
4. **STEP-4-COMIC-VINE.js** - Comic Vine API search (optional)
5. **STEP-5-EBAY-PRICING.js** - eBay pricing search (optional)
6. **STEP-6-GPT-4-PROMPT.md** - GPT-4 setup instructions
7. **STEP-6-GPT-4-USER-MESSAGE.txt** - GPT-4 prompt (copy entire file)
8. **STEP-7-PARSE-RESPONSE.js** - Parse GPT response
9. **STEP-8-GOOGLE-SHEETS-MAPPING.md** - All 65 column mappings

---

## 🚀 Setup Order

1. Create new workflow in Pipedream
2. Add steps in order (1 → 2 → 3 → ... → 8)
3. For **Node.js code steps** (2, 3, 4, 5, 7):
   - Add "Run Node.js code" step
   - Copy **ENTIRE** `.js` file content (including `export default defineComponent`)
   - Paste into code editor
   - Set export name
4. Copy prompt from `STEP-6-GPT-4-USER-MESSAGE.txt` into OpenAI Chat step
5. Copy column mappings from `STEP-8-GOOGLE-SHEETS-MAPPING.md` into Google Sheets step

---

## ⚙️ Required API Keys

Set in Pipedream Secrets:

- `OPENAI_API_KEY` - Required
- `COMIC_VINE_API_KEY` - Optional (for Step 4)
- `EBAY_APP_ID` - Optional (for Step 5)

---

## 📝 Notes

- Steps 4 and 5 are optional (skip if you don't have API keys)
- Each `.js` file uses `export default defineComponent` format - copy **entire file**
- All Node.js code steps use the same format
- Each mapping in Step 8 goes into the corresponding column field
- Test each step individually before connecting them

## ⚠️ Important

When copying `.js` files:
- Copy the **entire file** including `export default defineComponent`
- Don't just copy the code inside - you need the wrapper too!
- This is the correct format for Pipedream Node.js code steps

---

## 🔗 Related Files

- `PIPEDREAM-COMPLETE-ENRICHMENT.md` - Full workflow guide
- `SHEET2-COMPLETE-STRUCTURE.md` - Column reference
- `WORKFLOW-ARCHITECTURE.md` - Why two workflows

