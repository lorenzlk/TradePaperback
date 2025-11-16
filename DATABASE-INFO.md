# Database Information

## Current Database: Google Sheets

Your scan data is stored in **Google Sheets** (not a traditional SQL database).

### 📊 Your Database Sheet

**Sheet Name:** Trade Paperback DB  
**Sheet URL:** https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit  
**Sheet ID:** `1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck`

### 📋 Data Flow

```
Scanner App → Pipedream Webhook → Google Sheets
```

1. **Scanner** sends scan data to Pipedream webhook
2. **Pipedream** receives the data
3. **Google Sheets** step adds a new row with the scan data

### 📝 What Data is Stored

Each scan creates a new row with:
- **UPC** - The barcode number
- **Timestamp** - When the scan occurred
- **Device** - Device type (iPhone, Android, etc.)
- **Browser** - Browser information
- **Latitude** - Location (if enabled)
- **Longitude** - Location (if enabled)
- **Session ID** - Optional session tracking

### 🔍 How to Access Your Database

**Option 1: Direct Link**
Open: https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit

**Option 2: Google Drive**
1. Go to [drive.google.com](https://drive.google.com)
2. Search for "Trade Paperback DB"
3. Open the spreadsheet

**Option 3: Pipedream**
1. Go to your Pipedream workflow
2. Check the Google Sheets step
3. Click "View Sheet" or similar link

### 📊 Viewing Your Data

Once you open the Google Sheet, you'll see:
- All scans in rows (newest at bottom)
- Columns for each data field
- Ability to sort, filter, and analyze

### 🔄 How Data Gets There

1. **Scanner sends data** → `WEBHOOK_URL` in config.js
2. **Pipedream receives** → HTTP trigger step
3. **Pipedream processes** → Google Sheets step adds row
4. **Data appears** → In your Google Sheet

### ✅ Verify It's Working

To check if data is being saved:
1. Open your Google Sheet
2. Scan a barcode using the scanner
3. Refresh the sheet
4. You should see a new row appear!

### 🔐 Access Control

**Current Setup:**
- Sheet is view-only (public link)
- Pipedream has edit access (to add rows)
- You can edit directly in Google Sheets

**To Change Access:**
1. Open the Google Sheet
2. Click "Share" button
3. Adjust permissions as needed

### 📈 Future Database Options

For a more advanced setup, you could migrate to:

**Option 1: Supabase (PostgreSQL)**
- More scalable
- Better for complex queries
- Supports relationships

**Option 2: Airtable**
- Better UI than Sheets
- Relational data support
- Still easy to use

**Option 3: Firebase**
- Real-time updates
- Good for mobile apps
- Google ecosystem

**Current Status:** Google Sheets works great for MVP! ✅

---

**Quick Access:** https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit

