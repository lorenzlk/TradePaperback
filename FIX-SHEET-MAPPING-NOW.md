# Fix Missing Fields in Google Sheet

## Problem
Your sheet shows these columns:
- ✅ UPC (working)
- ✅ Timestamp (working)
- ❌ Device (empty)
- ❌ Browser (empty)
- ❌ Latitude (empty - expected, geolocation is disabled)
- ❌ Longitude (empty - expected, geolocation is disabled)
- ❌ Session ID (empty)

## Solution: Update Pipedream Google Sheets Mapping

### Step 1: Open Your Pipedream Workflow
1. Go to https://pipedream.com/workflows
2. Find your workflow with webhook URL: `https://eotlck7p4oeyvob.m.pipedream.net`
3. Click on it to edit

### Step 2: Find the Google Sheets Step
Look for the step that says "Google Sheets - Add Single Row" (or similar)

### Step 3: Update Column Mappings

Click on the Google Sheets step and update these column mappings:

**Column A (UPC):**
```
{{steps.trigger.event.body.upc}}
```

**Column B (Timestamp):**
```
{{steps.trigger.event.body.timestamp}}
```

**Column C (Device):** ⬅️ FIX THIS
```
{{steps.trigger.event.body.device}}
```

**Column D (Browser):** ⬅️ FIX THIS
```
{{steps.trigger.event.body.browser}}
```

**Column E (Latitude):** ⬅️ Will be empty (geolocation disabled)
```
{{steps.trigger.event.body.geo?.lat || ""}}
```

**Column F (Longitude):** ⬅️ Will be empty (geolocation disabled)
```
{{steps.trigger.event.body.geo?.lng || ""}}
```

**Column G (Session ID):** ⬅️ FIX THIS
```
{{steps.trigger.event.body.session_id}}
```

### Step 4: Save and Test
1. Click **"Deploy"** or **"Save"** button
2. Test by scanning a barcode
3. Check your Google Sheet - all fields should now populate!

---

## Quick Copy-Paste (All Columns)

Copy this entire block into your Pipedream Google Sheets step:

```
Column A: {{steps.trigger.event.body.upc}}
Column B: {{steps.trigger.event.body.timestamp}}
Column C: {{steps.trigger.event.body.device}}
Column D: {{steps.trigger.event.body.browser}}
Column E: {{steps.trigger.event.body.geo?.lat || ""}}
Column F: {{steps.trigger.event.body.geo?.lng || ""}}
Column G: {{steps.trigger.event.body.session_id}}
```

---

## What the Scanner Actually Sends

The scanner sends this JSON payload:
```json
{
  "upc": "9780062490438",
  "timestamp": "2025-11-16T08:23:39.089Z",
  "device": "iOS 18.6",
  "browser": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X)...",
  "format": "EAN_13",
  "session_id": "session_1734343419081_abc123xyz",
  "geo": null  // null because ENABLE_GEOLOCATION is false
}
```

So the Pipedream workflow needs to extract:
- `device` from `body.device`
- `browser` from `body.browser`
- `session_id` from `body.session_id`
- `geo.lat` and `geo.lng` (will be null/empty)

---

## Why Some Rows Have Empty UPC

Those rows with just timestamps (no UPC) might be:
1. Test requests sent directly to the webhook
2. Errors or invalid scans
3. Cover scans (which use `isbn` instead of `upc`)

You can safely delete those rows or filter them out.

---

## After Fixing

Once you update the mappings, new scans should show:
- ✅ Device: "iOS 18.6" or "Android 14.0"
- ✅ Browser: Full user agent string
- ✅ Session ID: "session_1734343419081_abc123xyz"
- ⚠️ Latitude/Longitude: Empty (because geolocation is disabled in config.js)

If you want to enable geolocation, change this in `config.js`:
```javascript
ENABLE_GEOLOCATION: true, // Set to true to collect location data
```

