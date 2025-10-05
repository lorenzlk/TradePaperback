# Pipedream Webhook Setup Guide

## Step 1: Create New Workflow

1. Go to [Pipedream](https://pipedream.com)
2. Click **"New"** → **"Workflow"**
3. Name it: `UPC Scanner Webhook`

## Step 2: Add HTTP Trigger

1. Search for **"HTTP / Webhook"** trigger
2. Select **"HTTP API"** or **"Webhook"**
3. Configure:
   - **Method:** POST
   - **Authentication:** None (for MVP)
4. **Deploy** - This generates your webhook URL
5. **Copy the webhook URL** (looks like: `https://xxxxx.m.pipedream.net`)

## Step 3: Add Data Validation Step (Optional but Recommended)

Add a **Node.js code step** to validate incoming data:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const payload = steps.trigger.event.body;
    
    // Validate required fields
    if (!payload.upc) {
      throw new Error("Missing required field: upc");
    }
    
    // Validate UPC format (basic check)
    const upcPattern = /^\d{12,14}$/;
    if (!upcPattern.test(payload.upc)) {
      $.export("validation_error", "Invalid UPC format");
      return { error: "Invalid UPC format", received: payload.upc };
    }
    
    // Enrich the data
    const enrichedData = {
      ...payload,
      received_at: new Date().toISOString(),
      webhook_id: steps.trigger.event.id,
      source: "upc-scanner-app"
    };
    
    $.export("validated_data", enrichedData);
    return enrichedData;
  }
});
```

## Step 4: Choose Your Data Destination

### Option A: Google Sheets (Easiest for Viewing Data)

1. Click **"+"** to add a step
2. Search **"Google Sheets"**
3. Select **"Add Single Row"**
4. Configure:
   - Connect your Google account
   - Select or create a spreadsheet: `UPC_Scanner_Data`
   - Select or create a sheet: `Scans`
   - Map fields:
     - Column A: `{{steps.trigger.event.body.upc}}`
     - Column B: `{{steps.trigger.event.body.timestamp}}`
     - Column C: `{{steps.trigger.event.body.device}}`
     - Column D: `{{steps.trigger.event.body.browser}}`
     - Column E: `{{steps.trigger.event.body.geo.lat}}`
     - Column F: `{{steps.trigger.event.body.geo.lng}}`

**Sheet Headers:**
```
UPC | Timestamp | Device | Browser | Latitude | Longitude
```

### Option B: Airtable (Better for Relational Data)

1. Click **"+"** to add a step
2. Search **"Airtable"**
3. Select **"Create Record"**
4. Configure:
   - Connect your Airtable account
   - Select Base
   - Select Table
   - Map fields to Airtable columns

### Option C: Supabase (Best for Scalability)

1. Click **"+"** to add a step
2. Search **"Supabase"**
3. Select **"Insert Row"**
4. Configure:
   - Add Supabase URL and API key
   - Select table
   - Map fields

### Option D: Just Log It (For Testing)

Add a **Node.js code step**:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const data = steps.trigger.event.body;
    
    console.log("📱 New UPC Scan Received:");
    console.log(JSON.stringify(data, null, 2));
    
    $.export("scan_data", data);
    
    return {
      success: true,
      upc: data.upc,
      timestamp: new Date().toISOString()
    };
  }
});
```

## Step 5: Add Response Step (Optional)

Add a final **"Return HTTP Response"** step:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    await $.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Enable CORS
      },
      body: {
        success: true,
        message: "UPC scan received",
        upc: steps.trigger.event.body.upc,
        timestamp: new Date().toISOString()
      }
    });
  }
});
```

## Step 6: Test Your Webhook

### Test with curl

```bash
curl -X POST https://YOUR-WEBHOOK-URL.m.pipedream.net \
  -H "Content-Type: application/json" \
  -d '{
    "upc": "012345678905",
    "timestamp": "2025-10-05T20:30:00Z",
    "device": "iPhone15,2",
    "browser": "Safari 17.0",
    "geo": {
      "lat": 34.0522,
      "lng": -118.2437
    }
  }'
```

### Test with JavaScript (Browser Console)

```javascript
fetch('https://YOUR-WEBHOOK-URL.m.pipedream.net', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    upc: '012345678905',
    timestamp: new Date().toISOString(),
    device: navigator.platform,
    browser: navigator.userAgent,
    geo: { lat: 34.0522, lng: -118.2437 }
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

## Step 7: Monitor & Debug

1. Go to your workflow in Pipedream
2. Click on **"Event History"** tab
3. You'll see all incoming requests
4. Click any event to see:
   - Raw payload received
   - Each step's output
   - Any errors

## Advanced Configuration

### Add Rate Limiting (Future)

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const deviceId = steps.trigger.event.body.device;
    const recentScans = await $.service.get(deviceId) || [];
    const now = Date.now();
    
    // Check for duplicate scans within 2 seconds
    const isDuplicate = recentScans.some(scan => 
      now - scan < 2000 && scan.upc === steps.trigger.event.body.upc
    );
    
    if (isDuplicate) {
      return { error: "Duplicate scan detected", throttled: true };
    }
    
    // Store this scan
    await $.service.set(deviceId, [...recentScans, now]);
    
    return steps.trigger.event.body;
  }
});
```

### Add Error Notifications

Add a **Slack** or **Email** step after validation to alert on errors:

```javascript
// Only runs if validation fails
if (steps.validation.error) {
  // Send to Slack channel
}
```

## Expected Payload Format

Your frontend will send this JSON structure:

```json
{
  "upc": "012345678905",
  "timestamp": "2025-10-05T20:30:00.000Z",
  "device": "iPhone15,2",
  "browser": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...",
  "geo": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "session_id": "optional-session-identifier",
  "user_id": "optional-user-identifier"
}
```

## Security Considerations

### For MVP (Current)
- ✅ Webhook URL is long and randomized (security through obscurity)
- ✅ HTTPS enforced by default
- ✅ No sensitive data transmitted

### For Production (Future)
- Add API key validation
- Implement rate limiting per device
- Add request signing/verification
- Set up CORS restrictions
- Add IP allowlisting if needed

## Cost Considerations

**Pipedream Free Tier:**
- 10,000 invocations/day
- 300 seconds of compute time/day
- Sufficient for MVP and testing

**Upgrade triggers:**
- If you exceed 10,000 scans/day
- If you need longer data retention
- If you need custom domains

## Next Steps

Once your webhook is set up:

1. ✅ Copy your webhook URL
2. ✅ Test it with curl or browser console
3. ✅ Verify data appears in your destination (Sheets/Airtable)
4. ✅ Save the URL to `config.js` in your frontend
5. ✅ Update Memory Bank with webhook details

## Troubleshooting

### No data appearing?
- Check Pipedream Event History for errors
- Verify payload format matches expected structure
- Check destination connection (Google Sheets auth, etc.)

### CORS errors?
- Add "Return HTTP Response" step with CORS headers
- See Step 5 above

### Duplicate scans?
- Add debouncing logic (see Advanced Configuration)
- Frontend should also implement duplicate prevention

---

**Webhook URL:** `https://eo76brlwpbpr9el.m.pipedream.net`

**Created:** October 5, 2025  
**Status:** ✅ ACTIVE - Trigger configured, awaiting data destination setup

