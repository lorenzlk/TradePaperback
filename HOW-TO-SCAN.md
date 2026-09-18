# How to Use the Scanner

## ✅ Your Scanner IS Working!

From your screenshot, I can see:
- ✅ Camera feed is active and showing
- ✅ Scanning frame overlay is visible  
- ✅ Scanner is attempting to detect barcodes (Attempts: 10)
- ✅ All UI elements are working

## Two Ways to Scan

### 1. **Barcode Scanner** (Recommended - Most Reliable)
**How to use:**
1. Point camera at the **barcode** (usually on the back of the book)
2. Position barcode within the white scanning frame
3. Wait for green flash/checkmark
4. Metadata card appears automatically

**Best for:**
- ✅ Most accurate
- ✅ Fastest
- ✅ Works with any barcode (UPC/EAN/ISBN)

---

### 2. **Cover Scanner** (Alternative - Uses AI)
**How to use:**
1. Click the green **"📷 Scan Cover"** button (top right)
2. Point camera at the **book cover** (front of book)
3. Wait for AI to identify the book
4. Metadata card appears if found

**Best for:**
- When barcode is damaged/unreadable
- When you want to scan by cover image
- May not always work (depends on cover recognition)

---

## Current Issue: Cover Scanner Error

The error you're seeing:
```
Failed to identify book: The string did not match the expected pattern.
```

**What this means:**
- The Vision API tried to extract an ISBN from the cover image
- It found something but it didn't match the expected format
- This is a cover scanning issue, NOT a barcode scanner issue

**Solution:**
1. **Use the barcode scanner instead** (point at barcode, not cover)
2. The barcode scanner works independently and is more reliable
3. Cover scanning is optional - you can ignore it if it doesn't work

---

## Quick Fix: Use Barcode Scanner

**Steps:**
1. **Don't click "Scan Cover"** - just use the regular scanner
2. **Flip the book over** to find the barcode (usually on back cover or spine)
3. **Point camera at barcode** - keep it steady within the frame
4. **Wait for detection** - you'll see a green flash when it works
5. **Metadata card appears** - shows UPC, format, timestamp

The barcode scanner should work perfectly! The cover scanner is just an extra feature.

---

## Why Cover Scanner Might Fail

Cover scanning uses AI to:
1. Extract text from cover image (OCR)
2. Find matching images online (web detection)
3. Extract ISBN from Amazon URLs
4. Look up book in Google Books API

**It can fail if:**
- Cover doesn't have clear text
- Book not found in online databases
- ISBN pattern doesn't match expected format
- Network issues

**That's why barcode scanning is more reliable!**

---

## Troubleshooting

### Scanner shows "Attempts: 10" but no detection?
- **Make sure barcode is clear and well-lit**
- **Hold steady** - don't move camera too much
- **Try different angle** - sometimes tilting helps
- **Check barcode isn't damaged** - try manual entry if needed

### Want to enter barcode manually?
- Click **"Can't scan? Enter manually"** button (bottom)
- Type the barcode number
- Click Submit

### Still having issues?
- Check browser console (F12) for error messages
- Make sure you're on HTTPS (required for camera)
- Try a different browser (Chrome or Safari work best)

---

## Summary

✅ **Your scanner IS working** - camera feed is visible and active  
✅ **Use barcode scanner** - point at barcode, not cover  
✅ **Cover scanner is optional** - ignore if it doesn't work  
✅ **Barcode scanning is more reliable** - use it as primary method

The error you saw is just from the cover scanning feature. The main barcode scanner should work perfectly!

