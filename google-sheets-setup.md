# Google Sheets Setup for UPC Scanner

## 📊 Sheet Information
- **Sheet Name:** Trade Paperback DB
- **Sheet URL:** https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit
- **Sheet ID:** `1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck`
- **Access:** View-only link (public)

---

## Step 1: Add Column Headers to Your Sheet

Open your [Trade Paperback DB sheet](https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit) and add these headers in **Row 1**:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **UPC** | **Timestamp** | **Device** | **Browser** | **Latitude** | **Longitude** | **Session ID** |

### Column Descriptions:
- **A: UPC** - The barcode number (12-14 digits)
- **B: Timestamp** - When the scan occurred (ISO 8601 format)
- **C: Device** - Device identifier (e.g., "iPhone15,2")
- **D: Browser** - Browser user agent string
- **E: Latitude** - Geographic latitude (optional, if enabled)
- **F: Longitude** - Geographic longitude (optional, if enabled)
- **G: Session ID** - Optional session identifier for tracking scan sessions

### Optional: Format the Header Row
1. Select Row 1
2. Make it **bold**
3. Add background color (light blue or gray)
4. Freeze the row: View → Freeze → 1 row

---

## Step 2: Configure Pipedream Google Sheets Integration

### In Your Pipedream Workflow:

1. **Add a New Step**
   - Click the **"+"** button after your HTTP trigger
   - Search for **"Google Sheets"**
   - Select **"Add Single Row"**

2. **Connect Google Account**
   - Click **"Connect Google Sheets Account"**
   - Authorize Pipedream to access your Google Sheets
   - Allow all requested permissions

3. **Select Your Spreadsheet**
   - **Spreadsheet:** Search for "Trade Paperback DB" or paste the Sheet ID: `1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck`
   - **Worksheet/Tab:** Select "Sheet1" (or rename it to "Scans")

4. **Map Your Columns**

   Map each column to the corresponding data from the webhook:

   **Column A (UPC):**
   ```
   {{steps.trigger.event.body.upc}}
   ```

   **Column B (Timestamp):**
   ```
   {{steps.trigger.event.body.timestamp}}
   ```

   **Column C (Device):**
   ```
   {{steps.trigger.event.body.device}}
   ```

   **Column D (Browser):**
   ```
   {{steps.trigger.event.body.browser}}
   ```

   **Column E (Latitude):**
   ```
   {{steps.trigger.event.body.geo.lat}}
   ```

   **Column F (Longitude):**
   ```
   {{steps.trigger.event.body.geo.lng}}
   ```

   **Column G (Session ID):**
   ```
   {{steps.trigger.event.body.session_id}}
   ```

   > **Note:** For optional fields like geo and session_id, Pipedream will insert empty values if they're not present in the payload.

5. **Test the Step**
   - Click **"Test"** in Pipedream
   - You should see a new row appear in your Google Sheet
   - If it fails, check your Google account connection and field mappings

6. **Deploy the Workflow**
   - Click **"Deploy"** in the top right
   - Your workflow is now live!

---

## Step 3: Test the Complete Flow

### Option A: Use the Test Tool

1. Open `test-webhook.html` in your browser
2. The webhook URL should already be filled in
3. Click **"Send Test"**
4. Check your Google Sheet - a new row should appear!

### Option B: Use curl

```bash
curl -X POST https://eo76brlwpbpr9el.m.pipedream.net \
  -H "Content-Type: application/json" \
  -d '{
    "upc": "012345678905",
    "timestamp": "2025-10-05T21:00:00.000Z",
    "device": "iPhone15,2",
    "browser": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    "geo": {
      "lat": 34.0522,
      "lng": -118.2437
    }
  }'
```

### Option C: Test from Browser Console

Open your browser's Developer Console (F12) and paste:

```javascript
fetch('https://eo76brlwpbpr9el.m.pipedream.net', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    upc: '012345678905',
    timestamp: new Date().toISOString(),
    device: 'Test Device',
    browser: navigator.userAgent,
    geo: { lat: 34.0522, lng: -118.2437 }
  })
})
.then(res => res.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

---

## Verification Checklist

- [ ] Headers added to Row 1 in Google Sheet
- [ ] Google Sheets step added to Pipedream workflow
- [ ] Google account connected in Pipedream
- [ ] Spreadsheet and worksheet selected
- [ ] All 7 columns mapped to correct fields
- [ ] Test step passed in Pipedream
- [ ] Workflow deployed
- [ ] Test data appears in Google Sheet
- [ ] Timestamp format is readable
- [ ] UPC displays as text (not number with scientific notation)

---

## Troubleshooting

### Issue: UPC appears as scientific notation (1.23E+11)

**Solution:** Format Column A as text:
1. Select Column A
2. Format → Number → Plain Text
3. Re-run a test

### Issue: No data appearing in sheet

**Check:**
- [ ] Google account is properly connected in Pipedream
- [ ] Correct spreadsheet selected
- [ ] Sheet has edit permissions (not view-only for Pipedream)
- [ ] Workflow is deployed (not just saved)
- [ ] Check Pipedream Event History for errors

### Issue: "Permission denied" error

**Solution:**
- Make sure the Google account connected to Pipedream has edit access to the sheet
- Re-authorize Google Sheets in Pipedream settings
- Check sheet sharing settings

### Issue: Wrong sheet or tab selected

**Solution:**
- Verify the worksheet name (default is "Sheet1")
- If you renamed it, update the selection in Pipedream

---

## Advanced Tips

### Add Automatic Timestamp
Let Google Sheets handle timestamp:
- Instead of `{{steps.trigger.event.body.timestamp}}`
- Use: `=NOW()` formula (but this requires Apps Script)

### Add Row Numbering
In a new Column A, add formula: `=ROW()-1`

### Create a Dashboard
Use Google Sheets features:
- Pivot tables to analyze scan frequency
- Charts to visualize scan times
- Conditional formatting to highlight duplicates

### Data Validation
Add data validation to ensure data quality:
- UPC column: Custom formula to check 12-14 digit numbers
- Timestamp column: Date format validation

---

## Sample Data

Once configured, your sheet will look like this:

| UPC | Timestamp | Device | Browser | Latitude | Longitude | Session ID |
|-----|-----------|--------|---------|----------|-----------|------------|
| 012345678905 | 2025-10-05T21:00:00Z | iPhone15,2 | Safari 17.0 | 34.0522 | -118.2437 | session_abc123 |
| 078000001907 | 2025-10-05T21:01:15Z | Pixel 8 | Chrome 119 | 34.0522 | -118.2437 | session_abc123 |
| 885909950805 | 2025-10-05T21:02:30Z | iPhone15,2 | Safari 17.0 | 34.0522 | -118.2437 | session_abc123 |

---

## Next Steps

Once your Google Sheets integration is working:

1. ✅ Verify test data appears correctly
2. ✅ Format columns for readability
3. ✅ Build the frontend scanner app
4. ✅ Test end-to-end with real mobile device

---

**Status:** Sheet created, awaiting Pipedream integration setup  
**Last Updated:** October 5, 2025

