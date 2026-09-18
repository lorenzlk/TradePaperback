# How to Paste CSV Headers into Google Sheets

## 🎯 Quick Method (Recommended)

### Step 1: Copy the CSV Headers
1. Open `SHEET2-HEADERS-CSV.csv` file
2. **Select all** (Cmd+A on Mac, Ctrl+A on Windows)
3. **Copy** (Cmd+C on Mac, Ctrl+C on Windows)

### Step 2: Paste into Google Sheets
1. Open your Google Sheet: `Trade Paperback DB`
2. Click on **Sheet2** tab (or create it if it doesn't exist)
3. **Click on cell A1** (top-left cell)
4. **Paste** (Cmd+V on Mac, Ctrl+V on Windows)

**That's it!** Google Sheets will automatically split the comma-separated values into separate columns.

---

## ✅ Verify It Worked

After pasting, you should see:
- **Column A** = "UPC"
- **Column B** = "Timestamp"
- **Column C** = "Title"
- **Column D** = "Publisher"
- ... and so on through Column BO

Each header should be in its own column, not all in one cell.

---

## 🔧 If It Doesn't Split Automatically

If all headers appear in one cell (Column A), try this:

### Method 1: Use Paste Special
1. Copy the CSV headers
2. Click cell A1 in Sheet2
3. Right-click → **Paste special** → **Split text to columns**
4. Or: **Data** → **Split text to columns**
5. Select **Comma** as the separator

### Method 2: Import CSV
1. In Google Sheets: **File** → **Import**
2. Click **Upload** tab
3. Upload `SHEET2-HEADERS-CSV.csv`
4. Choose **Import location**: "Insert new sheet"
5. Click **Import data**

---

## 📋 Alternative: Manual Entry

If you prefer to type them manually, here's the list in order:

```
A: UPC
B: Timestamp
C: Title
D: Publisher
E: Release_Date
F: Format
G: Series
H: Volume_Issue
I: Page_Count
J: ISBN
K: Price_USD
L: Genre
M: Description
N: Cover_Image_URL
O: Goodreads_Rating
P: Data_Source
Q: Creators
R: Cover_Artist
S: Variant_Type
T: First_Print
U: Print_Number
V: Comic_Vine_ID
W: Key_Issue
X: Key_Issue_Reason
Y: MSRP
Z: Market_Price_High
AA: Market_Price_Low
AB: Market_Price_Avg
AC: Price_Trend
AD: Last_Sale_Date
AE: Sales_Count
AF: Demand_Score
AG: Dimensions
AH: Weight_Oz
AI: Binding
AJ: Paper_Quality
AK: Color
AL: Language
AM: Age_Rating
AN: Content_Warnings
AO: Story_Arc
AP: Collected_In
AQ: Condition_Image_URL
AR: Condition_Grade
AS: Condition_Notes
AT: Quantity
AU: Location
AV: Cost_Basis
AW: List_Price
AX: Profit_Margin
AY: Google_Books_ID
AZ: OpenLibrary_ID
BA: Amazon_ASIN
BB: eBay_Item_Number
BC: Goodreads_ID
BD: Wikipedia_URL
BE: Views_Count
BF: Inquiries_Count
BG: Last_Viewed
BH: Scan_Count
BI: Days_In_Inventory
BJ: Enrichment_Confidence
BK: Goodreads_Rating
BL: Goodreads_Reviews
BM: Amazon_Rating
BN: Amazon_Reviews
BO: Awards
```

---

## 🎨 Format the Headers

After pasting:

1. **Select Row 1** (click the "1" on the left)
2. **Make it bold** (Cmd+B / Ctrl+B)
3. **Add background color**: 
   - Click paint bucket icon
   - Choose light blue or gray
4. **Freeze the row**:
   - View → Freeze → 1 row
5. **Center align** (optional):
   - Select Row 1
   - Click center align icon

---

## ✅ Success Checklist

- [ ] Headers pasted into Row 1
- [ ] Each header in its own column (A, B, C, etc.)
- [ ] Row 1 is bold
- [ ] Row 1 has background color
- [ ] Row 1 is frozen
- [ ] Total of 65 columns (A through BO)

---

## 🆘 Troubleshooting

**Problem**: All headers in one cell
- **Solution**: Use Paste Special → Split text to columns

**Problem**: Headers split but wrong columns
- **Solution**: Delete Row 1, try again with Paste Special

**Problem**: Missing some headers
- **Solution**: Check CSV file has all 65 headers, copy again

**Problem**: Too many columns
- **Solution**: Make sure you're copying just Row 1 from CSV, not multiple rows

