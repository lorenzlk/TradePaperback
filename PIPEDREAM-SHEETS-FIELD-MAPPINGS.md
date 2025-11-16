# Pipedream Google Sheets Field Mappings

## Complete Field Mappings (Copy-Paste Ready)

### For Barcode Scans (Current Workflow)

| Column | Field Path |
|--------|------------|
| **A (UPC)** | `{{steps.trigger.event.body.upc}}` |
| **B (Timestamp)** | `{{steps.trigger.event.body.timestamp}}` |
| **C (Device)** | `{{steps.trigger.event.body.device}}` |
| **D (Browser)** | `{{steps.trigger.event.body.browser}}` |
| **E (Latitude)** | `{{steps.trigger.event.body.geo.lat}}` |
| **F (Longitude)** | `{{steps.trigger.event.body.geo.lng}}` |
| **G (Session ID)** | `{{steps.trigger.event.body.session_id}}` |

---

### For Cover Scans (Vision API Workflow)

**If you want to add a separate Google Sheets step for cover scans, use these mappings:**

| Column | Field Path |
|--------|------------|
| **A (Cover Image URL)** | `{{steps.code.$return_value.bookData.coverImageUrl}}` |
| **B (ISBN)** | `{{steps.code.$return_value.bookData.isbn}}` |
| **C (Title)** | `{{steps.code.$return_value.bookData.title}}` |
| **D (Series)** | `{{steps.code.$return_value.bookData.series}}` |
| **E (Volume/Issue)** | `{{steps.code.$return_value.bookData.volumeIssue}}` |
| **F (Publisher)** | `{{steps.code.$return_value.bookData.publisher}}` |
| **G (Format)** | `{{steps.code.$return_value.bookData.format}}` |
| **H (Release Date)** | `{{steps.code.$return_value.bookData.publishedDate}}` |
| **I (Authors)** | `{{steps.code.$return_value.bookData.authors}}` |
| **J (Page Count)** | `{{steps.code.$return_value.bookData.pageCount}}` |
| **K (Timestamp)** | `{{steps.trigger.event.body.timestamp}}` |

---

## Quick Copy-Paste (Barcode Scans)

Copy these into your Pipedream Google Sheets step:

```
Column A: {{steps.trigger.event.body.upc}}
Column B: {{steps.trigger.event.body.timestamp}}
Column C: {{steps.trigger.event.body.device}}
Column D: {{steps.trigger.event.body.browser}}
Column E: {{steps.trigger.event.body.geo.lat}}
Column F: {{steps.trigger.event.body.geo.lng}}
Column G: {{steps.trigger.event.body.session_id}}
```

---

## Quick Copy-Paste (Cover Scans)

If adding cover scan data to sheets:

```
Column A: {{steps.code.$return_value.bookData.coverImageUrl}}
Column B: {{steps.code.$return_value.bookData.isbn}}
Column C: {{steps.code.$return_value.bookData.title}}
Column D: {{steps.code.$return_value.bookData.series}}
Column E: {{steps.code.$return_value.bookData.volumeIssue}}
Column F: {{steps.code.$return_value.bookData.publisher}}
Column G: {{steps.code.$return_value.bookData.format}}
Column H: {{steps.code.$return_value.bookData.publishedDate}}
Column I: {{steps.code.$return_value.bookData.authors}}
Column J: {{steps.code.$return_value.bookData.pageCount}}
```

---

## Enhanced Fields (If You Added Them)

If you want to include the enhanced device info fields:

| Column | Field Path |
|--------|------------|
| **H (Screen Resolution)** | `{{steps.trigger.event.body.screen_resolution}}` |
| **I (OS Version)** | `{{steps.trigger.event.body.os_version}}` |
| **J (Browser Version)** | `{{steps.trigger.event.body.browser_version}}` |
| **K (Timezone)** | `{{steps.trigger.event.body.timezone}}` |
| **L (Language)** | `{{steps.trigger.event.body.language}}` |
| **M (Scan Duration)** | `{{steps.trigger.event.body.scan_duration_ms}}` |
| **N (Scan Attempts)** | `{{steps.trigger.event.body.scan_attempts}}` |
| **O (Connection Type)** | `{{steps.trigger.event.body.connection_type}}` |

---

## Google Sheet Headers

### Sheet 1: "Scans" (Barcode Scans)
```
UPC | Timestamp | Device | Browser | Latitude | Longitude | Session ID
```

### Sheet 2: "Inventory" (Cover Scans - Shop Owner View)
```
Cover Image URL | ISBN | Title | Series | Volume/Issue | Publisher | Format | Release Date | Authors | Page Count | Timestamp
```

Or with cover image displayed:
```
Cover Image | ISBN | Title | Series | Volume/Issue | Publisher | Format | Release Date | Authors | Page Count | Timestamp
```

**Note:** For "Cover Image" column, use Google Sheets formula:
```
=IMAGE(A2)
```
(Where A2 is the Cover Image URL)

---

## How to Use in Pipedream

1. **Open your Pipedream workflow**
2. **Click on the Google Sheets step**
3. **For each column, paste the field path** from above
4. **Save and Deploy**

---

## Troubleshooting

**If field shows as empty:**
- Check the field path matches exactly (case-sensitive)
- Verify the workflow step name (e.g., `steps.code` vs `steps.vision`)
- Check Pipedream Event History to see actual data structure

**If cover image doesn't show:**
- Use `=IMAGE(cell)` formula in Google Sheets
- Make sure URL is valid (test by opening in browser)
- Some URLs may need authentication - Google Books URLs should work

