# Fix: Headers Only Pasting into A1

## 🔧 Solution: Split Text to Columns

### Step 1: Paste into A1
1. Copy the CSV line from `SHEET2-HEADERS-CSV.csv`
2. Click **cell A1** in Sheet2
3. Paste (Cmd+V / Ctrl+V)
   - You'll see all headers in one cell: `UPC,Timestamp,Title,Publisher,...`

### Step 2: Split into Columns
**Method 1: Using the Menu**
1. Make sure **cell A1 is selected** (with all the comma-separated text)
2. Go to **Data** → **Split text to columns**
3. A separator menu appears at the bottom
4. Select **Comma** (or it may auto-detect)
5. ✅ Done! Headers should now split across columns A, B, C, etc.

**Method 2: Using Right-Click**
1. Right-click on **cell A1**
2. Select **Split text to columns**
3. Choose **Comma** as separator
4. ✅ Done!

**Method 3: Using the Icon**
1. After pasting, look for a small **clipboard icon** next to cell A1
2. Click it → Select **Split text to columns**
3. Choose **Comma**
4. ✅ Done!

---

## 🎯 Visual Guide

**Before:**
```
A1: UPC,Timestamp,Title,Publisher,Release_Date,Format,...
```

**After Split:**
```
A1: UPC
B1: Timestamp  
C1: Title
D1: Publisher
E1: Release_Date
F1: Format
... (all the way to BO1)
```

---

## ✅ Verify It Worked

After splitting, you should see:
- **Column A** = "UPC"
- **Column B** = "Timestamp"
- **Column C** = "Title"
- **Column BO** = "Awards" (last column)

Scroll right to verify all 65 columns are there!

---

## 🆘 Still Not Working?

### Alternative: Import CSV File

1. In Google Sheets: **File** → **Import**
2. Click **Upload** tab
3. Drag and drop `SHEET2-HEADERS-CSV.csv` file
4. Choose **Import location**: "Insert new sheet" or "Replace current sheet"
5. Click **Import data**
6. ✅ Headers will be automatically split!

---

## 📝 Quick Checklist

- [ ] Pasted CSV into A1 (all in one cell is OK)
- [ ] Selected cell A1
- [ ] Used **Data → Split text to columns**
- [ ] Selected **Comma** separator
- [ ] Verified headers split across columns A-BO
- [ ] Formatted Row 1 (bold, background color, freeze)

---

## 💡 Pro Tip

If you're still having trouble, you can also:
1. Copy the CSV line
2. Paste into a text editor first
3. Replace commas with tabs (Cmd+H / Ctrl+H: find `,` replace with `Tab`)
4. Copy the tab-separated text
5. Paste into Google Sheets (tabs automatically create columns)

But the "Split text to columns" method is easier!

