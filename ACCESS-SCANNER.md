# How to Access the Scanner

## Option 1: Local Development (Quick Test)

### Simple HTTP Server (for testing on desktop)
```bash
cd /Users/loganlorenz/TradePaperback
python3 -m http.server 8000
```
Then open: **http://localhost:8000**

⚠️ **Note:** Camera access requires HTTPS. For mobile testing, use Option 2 or 3.

### With HTTPS (for mobile/camera access)

**Using ngrok:**
```bash
# Terminal 1: Start server
python3 -m http.server 8000

# Terminal 2: Start ngrok (install: brew install ngrok)
ngrok http 8000
```
Then use the ngrok HTTPS URL on your phone.

## Option 2: Deploy to Vercel (Recommended - Already Configured)

Your project already has `vercel.json`, so you can deploy easily:

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy
vercel --prod
```

Or use the Vercel dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click Deploy
4. Get your live URL!

## Option 3: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## Option 4: Quick Test with Live Server (VS Code)

If you use VS Code:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Use ngrok for HTTPS: `ngrok http 5500` (or whatever port Live Server uses)

## Current Status

✅ **Your scanner is ready!**
- `index.html` - Main scanner page
- `config.js` - Configured with your Pipedream webhook
- `scanner.js` - Scanner logic ready
- Pipedream workflow - Working and tested

## Testing the Cover Scan Feature

Once you have the scanner running:

1. **Open the scanner** in your browser (on mobile for best experience)
2. **Allow camera access** when prompted
3. **Click the "📷 Scan Cover" button** (bottom of screen)
4. **Point camera at a book cover**
5. **It will:**
   - Capture the image
   - Send to Pipedream Vision API
   - Identify the book
   - Show metadata (title, ISBN, publisher, etc.)

## Troubleshooting

**Camera not working?**
- Must use HTTPS (not HTTP)
- Check browser permissions
- Try on mobile device (better camera support)

**Cover scan not working?**
- Check browser console for errors
- Verify `CONFIG.VISION_API_URL` is set in `config.js`
- Check Pipedream workflow logs

