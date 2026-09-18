# Condition Image Capture Setup

## Overview

The scanner now automatically captures an image of the book when a barcode is detected. This image is used for **condition verification** - allowing you to see the actual condition of each book scanned.

## How It Works

### Automatic Image Capture

1. **When barcode is detected:**
   - Scanner automatically captures the current camera frame
   - Image is converted to JPEG format (85% quality)
   - Image is displayed in the metadata confirmation card
   - Image is sent to backend with scan data

2. **Image Display:**
   - Shows in metadata card with label "📷 Condition Photo"
   - Displays the exact image that was captured
   - Helps verify the book condition visually

3. **Backend Storage:**
   - Image sent as base64 in payload: `condition_image`
   - Flag `has_condition_image: true` indicates image is present
   - Pipedream workflow receives image and can store it

---

## Data Payload

When a barcode is scanned, the payload now includes:

```json
{
  "upc": "9780062490438",
  "timestamp": "2025-11-16T08:23:39.089Z",
  "device": "iOS 18.6",
  "browser": "Mozilla/5.0...",
  "format": "EAN_13",
  "session_id": "session_123...",
  
  // NEW: Condition verification image
  "condition_image": "base64_encoded_image_data...",
  "has_condition_image": true,
  
  // ... other fields
}
```

---

## Pipedream Workflow Updates

### Option 1: Store Image in Google Sheets (Simple)

**Add a new column to Sheet1:**
- Column H: `Condition_Image_URL` or `Condition_Image_Base64`

**In Pipedream Google Sheets step:**
- Column H: `{{steps.trigger.event.body.condition_image}}`

**Note:** Base64 images in Google Sheets can be large. Consider Option 2 for better performance.

---

### Option 2: Store Image in Cloud Storage (Recommended)

**Use Google Cloud Storage or similar:**

1. **Add a Code Step** before Google Sheets:
   ```javascript
   // Upload image to Google Cloud Storage
   const { Storage } = require('@google-cloud/storage');
   const storage = new Storage();
   const bucket = storage.bucket('your-bucket-name');
   
   if (steps.trigger.event.body.condition_image) {
     const filename = `condition-images/${steps.trigger.event.body.upc}_${Date.now()}.jpg`;
     const file = bucket.file(filename);
     
     const imageBuffer = Buffer.from(steps.trigger.event.body.condition_image, 'base64');
     await file.save(imageBuffer, {
       metadata: {
         contentType: 'image/jpeg',
       },
     });
     
     // Make file publicly accessible (or use signed URL)
     await file.makePublic();
     
     const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
     
     return {
       condition_image_url: imageUrl
     };
   }
   ```

2. **Update Google Sheets step:**
   - Column H: `{{steps.code.$return_value.condition_image_url}}`

---

### Option 3: Store Image URL in Separate Column

**Simplest approach - store image URL:**

1. **Add column to Sheet1:**
   - Column H: `Condition_Image_URL`

2. **In Pipedream:**
   - If you have image storage service, upload image and get URL
   - Store URL in Column H
   - Or store base64 directly (works but large)

---

## Image Storage Services

### Recommended Options:

1. **Google Cloud Storage**
   - Free tier: 5GB storage
   - Easy integration with Pipedream
   - Can make images public or use signed URLs

2. **Cloudinary**
   - Free tier: 25GB storage, 25GB bandwidth
   - Automatic image optimization
   - Easy to use API

3. **AWS S3**
   - Free tier: 5GB storage
   - Reliable and scalable

4. **Imgur API**
   - Free, simple
   - Good for testing/prototyping

---

## Example: Cloudinary Integration

**Add to Pipedream workflow:**

```javascript
// In a Code step
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (steps.trigger.event.body.condition_image) {
  const uploadResult = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${steps.trigger.event.body.condition_image}`,
    {
      folder: 'book-conditions',
      public_id: `${steps.trigger.event.body.upc}_${Date.now()}`,
      resource_type: 'image'
    }
  );
  
  return {
    condition_image_url: uploadResult.secure_url
  };
}
```

---

## Image Quality Settings

Current settings:
- **Format:** JPEG
- **Quality:** 85% (good balance of size/quality)
- **Resolution:** Full camera resolution (typically 1920x1080)

To adjust quality, edit `scanner.js`:
```javascript
// Line ~491
const imageBase64 = canvas.toDataURL('image/jpeg', 0.85); // 0.85 = 85% quality
```

**Quality options:**
- `0.9` = Higher quality, larger file
- `0.85` = Balanced (current)
- `0.7` = Lower quality, smaller file

---

## Display in Google Sheets

### Option A: Show Image Directly

If storing base64 in sheet:
1. Use Google Sheets formula: `=IMAGE("data:image/jpeg;base64," & H2)`
2. Image displays inline in cell

### Option B: Show Image URL

If storing URL:
1. Use formula: `=IMAGE(H2)`
2. Image displays from URL

### Option C: Hyperlink

1. Format column as hyperlink
2. Click to view full-size image

---

## Privacy & Storage Considerations

### Image Size
- Typical image: 200-500 KB (base64)
- 100 scans = ~20-50 MB
- Consider compression or resizing for large volumes

### Storage Costs
- Google Sheets: Free but limited (10M cells)
- Cloud Storage: ~$0.02/GB/month (very cheap)
- Cloudinary: Free tier generous for most use cases

### Privacy
- Images contain book covers (not personal info)
- Consider if you need to make images public
- Signed URLs provide access control

---

## Next Steps

1. **Choose storage solution** (Cloudinary recommended for simplicity)
2. **Update Pipedream workflow** to handle `condition_image` field
3. **Add column to Google Sheets** for image URL
4. **Test** - scan a book and verify image is captured and stored
5. **Display images** in Google Sheets or separate viewer

---

## Testing

After setup:

1. Scan a barcode
2. Check metadata card - should show captured image
3. Check Pipedream logs - should see `condition_image` in payload
4. Check Google Sheets - should see image URL or base64
5. Verify image displays correctly

---

## Troubleshooting

### Image not capturing?
- Check browser console for errors
- Verify camera is active when scanning
- Check `DEBUG_MODE` is enabled to see logs

### Image too large?
- Reduce quality in `scanner.js` (change 0.85 to 0.7)
- Or resize image before sending

### Image not displaying in sheet?
- Check if base64 is valid
- Verify image URL is accessible
- Try opening URL directly in browser

---

## Summary

✅ **Automatic capture** - Image captured on every scan  
✅ **Display in UI** - Shows in metadata card  
✅ **Sent to backend** - Included in webhook payload  
✅ **Storage ready** - Can be stored in Google Sheets or cloud storage  

The image capture is now fully integrated! Just need to configure storage in Pipedream.

