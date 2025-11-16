# Fix Google Sheets Field Mapping

## Current Issue

Barcode scanning works, but fields aren't mapping correctly to Google Sheets.

## Fields Expected in Sheet

| Column | Field | Status |
|--------|-------|--------|
| A | UPC | ✅ Working |
| B | Timestamp | ⚠️ Needs check |
| C | Device | ⚠️ Needs check |
| D | Browser | ⚠️ Needs check |
| E | Latitude | ⚠️ Needs check |
| F | Longitude | ⚠️ Needs check |
| G | Session ID | ❌ Missing |

## What Scanner Sends

The scanner now sends:
```json
{
  "upc": "012345678905",
  "timestamp": "2025-11-16T07:30:00.000Z",
  "device": "iOS 17.0",
  "browser": "Mozilla/5.0...",
  "format": "UPC_A",
  "session_id": "session_1234567890_abc123",
  "geo": {
    "lat": 34.0522,
    "lng": -118.2437
  }
}
```

## Fix Pipedream Google Sheets Mapping

### Step 1: Open Your Pipedream Workflow

1. Go to [Pipedream](https://pipedream.com/workflows)
2. Open your workflow (the one with webhook URL: `https://eo76brlwpbpr9el.m.pipedream.net`)
3. Find the **Google Sheets** step

### Step 2: Update Column Mappings

Click on the Google Sheets step and update the column mappings:

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
*Note: This will be empty if geolocation is disabled*

**Column F (Longitude):**
```
{{steps.trigger.event.body.geo.lng}}
```
*Note: This will be empty if geolocation is disabled*

**Column G (Session ID):**
```
{{steps.trigger.event.body.session_id}}
```

### Step 3: Handle Optional Fields

For Latitude/Longitude, if you want to show "N/A" instead of empty:

**Column E (Latitude):**
```
{{steps.trigger.event.body.geo.lat || "N/A"}}
```

**Column F (Longitude):**
```
{{steps.trigger.event.body.geo.lng || "N/A"}}
```

### Step 4: Test the Mapping

1. **Deploy** your workflow
2. **Scan a barcode** using the scanner
3. **Check your Google Sheet** - all fields should populate correctly

## Troubleshooting

### Issue: Fields are empty

**Check:**
1. Is the workflow deployed? (not just saved)
2. Are the field paths correct? (use `steps.trigger.event.body.field_name`)
3. Check Pipedream Event History for errors

### Issue: Session ID is missing

**Solution:** The scanner now includes `session_id`. Make sure:
1. You've updated `scanner.js` with the session ID code
2. The Google Sheets step maps to `{{steps.trigger.event.body.session_id}}`

### Issue: Latitude/Longitude always empty

**Check:**
- `ENABLE_GEOLOCATION` is set to `true` in `config.js`
- User granted location permission
- Or use "N/A" as default (see Step 3 above)

### Issue: Timestamp format is wrong

**Current format:** ISO 8601 (`2025-11-16T07:30:00.000Z`)

**To change format in Pipedream:**
Use a Code step before Google Sheets to format:
```javascript
const timestamp = steps.trigger.event.body.timestamp;
const date = new Date(timestamp);
const formatted = date.toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
return { formatted_timestamp: formatted };
```

Then map Column B to: `{{steps.format_timestamp.formatted_timestamp}}`

## Verify It's Working

After fixing the mappings:

1. ✅ Scan a barcode
2. ✅ Check Google Sheet - all 7 columns should have data
3. ✅ Session ID should be unique per browser session
4. ✅ Timestamp should be readable
5. ✅ Device/Browser should show device info

## Quick Reference

**Pipedream Field Paths:**
- UPC: `{{steps.trigger.event.body.upc}}`
- Timestamp: `{{steps.trigger.event.body.timestamp}}`
- Device: `{{steps.trigger.event.body.device}}`
- Browser: `{{steps.trigger.event.body.browser}}`
- Latitude: `{{steps.trigger.event.body.geo.lat}}`
- Longitude: `{{steps.trigger.event.body.geo.lng}}`
- Session ID: `{{steps.trigger.event.body.session_id}}`

---

**Next Steps:**
1. Update Pipedream Google Sheets mapping
2. Test with a scan
3. Verify all fields populate correctly

