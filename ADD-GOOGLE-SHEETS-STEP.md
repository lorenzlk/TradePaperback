# Add Google Sheets Step to Pipedream Workflow

## Step-by-Step Guide

### Step 1: Add the Google Sheets Step

1. **In your Pipedream workflow**, look at the workflow editor (left side)
2. **Click the "+" button** below your "code" step
3. **Search for "Google Sheets"** in the search box
4. **Select "Google Sheets - Add Single Row"** (or "Add Row")

---

### Step 2: Connect Your Google Account

1. **Click "Connect Google Sheets Account"** (or similar button)
2. **Sign in** with your Google account (the one that owns the sheet)
3. **Authorize Pipedream** to access Google Sheets
4. **Allow all permissions** when prompted

---

### Step 3: Select Your Spreadsheet

1. **Spreadsheet field:** 
   - Click the dropdown
   - Search for "Trade Paperback DB" 
   - OR paste the Sheet ID: `1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck`
   - Select it

2. **Worksheet/Tab field:**
   - Select "Sheet1" (or whatever tab you want to use)

---

### Step 4: Map the Columns

**For Barcode Scans** - Copy these field paths:

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

---

### Step 5: Test the Step

1. **Click "Test"** button (bottom right)
2. **Check your Google Sheet** - a new row should appear
3. **Verify all columns** have data (or empty if optional)

---

### Step 6: Deploy

1. **Click "Deploy"** button (blue button, bottom right)
2. **Your workflow is now live!**
3. **Test with a real scan** - data should appear in your sheet

---

## Troubleshooting

### Issue: Can't find spreadsheet

**Solution:**
- Make sure you're signed in with the correct Google account
- Check the Sheet ID is correct: `1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck`
- Try searching by sheet name: "Trade Paperback DB"

### Issue: "Permission denied"

**Solution:**
- Re-authorize Google Sheets in Pipedream
- Make sure your Google account has edit access to the sheet
- Check sheet sharing settings

### Issue: Fields are empty

**Solution:**
- Verify field paths match exactly (case-sensitive)
- Check that your workflow is deployed (not just saved)
- Look at Pipedream Event History to see what data is actually being sent

### Issue: Wrong columns

**Solution:**
- Make sure your Google Sheet has headers in Row 1
- Column order should match: UPC, Timestamp, Device, Browser, Latitude, Longitude, Session ID
- Pipedream will add data starting from Row 2

---

## Visual Guide

Your workflow should look like this:

```
[trigger] → [code] → [Google Sheets]
   ✅         ✅          ✅
```

All three steps should have green checkmarks when working correctly.

---

## Quick Checklist

- [ ] Added Google Sheets step
- [ ] Connected Google account
- [ ] Selected correct spreadsheet
- [ ] Selected correct worksheet (Sheet1)
- [ ] Mapped all 7 columns
- [ ] Tested the step
- [ ] Deployed the workflow
- [ ] Verified data appears in sheet

---

**Need help?** Check the Pipedream Event History to see what data is being received and troubleshoot from there.

