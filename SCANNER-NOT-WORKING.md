# Scanner Not Working - Troubleshooting Guide

## What You Should See

When the scanner is working correctly, you should see:

1. **Loading Screen** (briefly)
   - Spinner with "Initializing camera..." message
   - Should disappear after 1-2 seconds

2. **Camera Feed** (main screen)
   - Full-screen live camera view
   - Scanning frame overlay (white rectangle with corner brackets)
   - Animated scan line moving up and down
   - Text: "Position barcode within frame"
   - Status at bottom: "Ready to scan"
   - Camera status indicator: "📹 Camera Active" (green)

3. **When Scanning**
   - Green flash/checkmark when barcode detected
   - Metadata card appears showing UPC, format, timestamp
   - Status changes to "✓ Scan captured!"

---

## What "Just Barcode" Means

If you're only seeing barcode detection but not the camera/scanner interface, here's what might be happening:

### Issue 1: Camera Feed Not Showing
**Symptoms:**
- Black screen or blank page
- No video feed visible
- Only seeing barcode detection results

**Possible Causes:**
1. Camera permission denied
2. Camera not initializing
3. Video element hidden or not displaying
4. Browser compatibility issue

**Solutions:**

1. **Check Browser Console** (Open DevTools)
   - Press F12 or right-click → Inspect
   - Look for red error messages
   - Check for camera permission errors

2. **Check Camera Status Indicator**
   - Should show "📹 Camera Active" in green
   - If red, there's a camera error

3. **Check What Screen You're On:**
   - **Loading screen?** → Camera is initializing (wait a few seconds)
   - **Permission denied screen?** → Click "Try Again" and allow camera access
   - **Black screen?** → Camera might not be working

4. **Enable Debug Mode** (Already enabled)
   - Open browser console (F12)
   - Look for messages starting with:
     - ✅ = Success
     - ❌ = Error
     - 🔍 = Scanning activity
     - 📹 = Camera status

---

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. Open the scanner page
2. Press F12 (or right-click → Inspect → Console tab)
3. Look for these messages:

**Good signs:**
```
✅ ZXing loaded
🚀 Initializing UPC Scanner...
📹 Camera initialized successfully
✅ Camera Active
```

**Bad signs:**
```
❌ Camera error: NotAllowedError
❌ ZXing library not loaded
❌ Failed to initialize barcode scanner
```

### Step 2: Check Camera Permission
1. Look at the browser address bar
2. Should see a camera icon (may be blocked)
3. Click it and select "Allow"
4. Reload the page

### Step 3: Check What's Visible
- **Loading spinner?** → Wait, camera is initializing
- **Permission screen?** → Allow camera access
- **Black screen?** → Camera error (check console)
- **Camera feed?** → ✅ Working correctly!

---

## Common Issues & Fixes

### Issue: "Camera Access Required" Screen
**Fix:**
1. Click "Try Again" button
2. When browser asks, click "Allow" for camera
3. Page should reload and show camera feed

### Issue: Black Screen / No Video
**Possible causes:**
- Camera permission denied
- Camera in use by another app
- Browser doesn't support camera API
- HTTPS required (camera won't work on HTTP)

**Fixes:**
1. Close other apps using camera
2. Make sure you're on HTTPS (not HTTP)
3. Try a different browser (Chrome or Safari)
4. Check console for specific error

### Issue: Scanner Detects Barcodes But No Camera Feed
**This means:**
- Barcode detection is working ✅
- Camera feed not displaying ❌

**Check:**
1. Is the video element hidden? (Check CSS)
2. Is camera actually working? (Check console logs)
3. Is the scanner-container visible? (Should not have `hidden` class)

**Debug in Console:**
```javascript
// Check if video element exists and is visible
const video = document.getElementById('video');
console.log('Video element:', video);
console.log('Video srcObject:', video.srcObject);
console.log('Video readyState:', video.readyState);
console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

// Check if scanner container is visible
const container = document.getElementById('scanner-container');
console.log('Container hidden?', container.classList.contains('hidden'));
console.log('Container display:', window.getComputedStyle(container).display);
```

---

## Test Camera Access

Run this in browser console to test camera:

```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log('✅ Camera access granted!');
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    document.body.appendChild(video);
    console.log('Video should appear on page');
  })
  .catch(error => {
    console.error('❌ Camera error:', error.name, error.message);
  });
```

If this works, camera is fine - issue is in scanner code.
If this fails, camera permission or hardware issue.

---

## Still Not Working?

1. **Check the deployed URL:**
   - Make sure you're on: https://trade-paperback.vercel.app
   - Camera requires HTTPS (won't work on HTTP)

2. **Try on Mobile Device:**
   - Scanner is designed for mobile
   - May work better on phone than desktop

3. **Check Browser:**
   - ✅ Chrome (Android)
   - ✅ Safari (iOS)
   - ❌ Some browsers don't support camera API

4. **Share Console Output:**
   - Copy all console messages
   - Share what screen you see
   - Share any error messages

---

## Expected Behavior

**On Page Load:**
1. Loading screen appears (1-2 seconds)
2. Browser asks for camera permission
3. Camera feed appears full-screen
4. Scanning frame overlay visible
5. Status shows "Ready to scan"

**When Scanning:**
1. Point camera at barcode
2. Green flash when detected
3. Metadata card appears
4. Status shows "✓ Scan captured!"
5. Ready for next scan

If you're seeing something different, check the console for errors!

