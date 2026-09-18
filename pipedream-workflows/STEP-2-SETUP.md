# Step 2: OpenLibrary API - Setup Instructions

## ✅ Use Node.js Code Step

For Step 2, add a **Node.js Code** step.

## Steps:

1. In Pipedream workflow, click **"+"** to add a step
2. Search for **"Code"** or **"Node.js"**
3. Select **"Run Node.js code"** (or just "Code" if that's the only option)
4. Copy **ALL** the code from `STEP-2-OPENLIBRARY.js`
5. Paste into the code editor
6. Export as: `openLibraryData`

## Code Format

The code uses Pipedream's `defineComponent` format:
```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // code here
  },
})
```

This is the correct format for Pipedream Node.js code steps.

## Verify

After pasting, you should see:
- No syntax errors
- Code wrapped in `export default defineComponent`
- Export name: `openLibraryData`

