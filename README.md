# 📱 TradePaperback - Lightweight Mobile UPC Scanner

A browser-based UPC/barcode scanner that instantly captures product codes using your mobile device's camera. No app installation required!

## ✨ Features

- **Instant Camera Launch** - Opens camera immediately on page load
- **Real-Time Scanning** - Detects UPC-A, UPC-E, and EAN-13 barcodes
- **Cover Image Recognition** - Scan book covers to identify ISBNs using Google Cloud Vision API
- **Auto-Submit** - Automatically sends scan data to backend
- **Mobile-First Design** - Optimized for phone screens
- **Offline-Ready** - Handles network failures gracefully
- **Zero Friction** - No sign-up, no downloads, just scan

## 🚀 Quick Start

### Local Development

1. **Clone or download this repository**

2. **Serve with HTTPS** (required for camera access):
   
   ```bash
   # Option 1: Using Python
   python3 -m http.server 8000
   # Then use ngrok for HTTPS: ngrok http 8000
   
   # Option 2: Using Netlify Dev
   netlify dev
   
   # Option 3: Using http-server with SSL
   npx http-server -S -C cert.pem -K key.pem
   ```

3. **Open on mobile device** via the HTTPS URL

4. **Allow camera permission** when prompted

5. **Point camera at a barcode** - it will scan automatically!

### Configuration

Edit `config.js` to customize:

```javascript
const CONFIG = {
  WEBHOOK_URL: 'https://your-webhook-url.m.pipedream.net',
  VISION_API_URL: 'https://your-vision-webhook-url.m.pipedream.net', // For cover scanning
  ENABLE_GEOLOCATION: false,
  ENABLE_HAPTIC_FEEDBACK: true,
  SCAN_COOLDOWN_MS: 2000,
  DEBUG_MODE: false
};
```

**Note:** Cover scanning requires Google Cloud Vision API setup. See `PIPEDREAM-VISION-WORKFLOW.md` for instructions.

## 📊 Backend Setup

### Pipedream Webhook

1. Create a workflow at [Pipedream](https://pipedream.com)
2. Add an HTTP trigger
3. Add a Google Sheets step (or Airtable, Supabase, etc.)
4. Copy the webhook URL to `config.js`

See `pipedream-setup.md` for detailed instructions.

### Google Cloud Vision API (Cover Scanning)

To enable cover image recognition:

1. Create a Pipedream workflow following `PIPEDREAM-VISION-WORKFLOW.md`
2. Add the code from `pipedream-code-step.js` to a Node.js step
3. Configure Google Cloud credentials in Pipedream Secrets
4. Copy the webhook URL to `VISION_API_URL` in `config.js`

**Note:** The "📷 Scan Cover" button will be disabled until `VISION_API_URL` is configured.

### Google Sheets

Your sheet should have these columns:

| UPC | Timestamp | Device | Browser | Latitude | Longitude | Session ID |
|-----|-----------|--------|---------|----------|-----------|------------|

See `google-sheets-setup.md` for setup guide.

## 📱 Browser Support

| Platform | Browser | Status |
|----------|---------|--------|
| iOS 14+ | Safari | ✅ Tested |
| Android 10+ | Chrome | ✅ Tested |
| Desktop | Chrome/Edge | ✅ Works (for testing) |

## 🏗️ Project Structure

```
/TradePaperback/
├── index.html              # Main scanner page
├── styles.css              # Mobile-first CSS
├── scanner.js              # Core scanning logic
├── config.js               # Configuration
├── test-webhook.html       # Webhook testing tool
├── pipedream-setup.md      # Backend setup guide
├── google-sheets-setup.md  # Data destination guide
├── prd.md                  # Product requirements
├── memory-bank/            # Project documentation
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   └── progress.md
└── README.md               # This file
```

## 🔧 Technologies Used

- **HTML5** - Camera video element
- **CSS3** - Mobile-first responsive design
- **Vanilla JavaScript** - Zero dependencies (except ZXing)
- **[@zxing/browser](https://github.com/zxing-js/library)** - Barcode detection
- **Pipedream** - Webhook backend
- **Google Sheets** - Data storage

## 🎯 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Page-to-camera load time | ≤ 2 seconds | ⏳ Testing |
| Scan accuracy (UPC/EAN) | ≥ 95% | ⏳ Testing |
| Data delivery latency | ≤ 500 ms | ⏳ Testing |

## 🔒 Security & Privacy

- Served exclusively over HTTPS
- Camera access requested per session (not persisted)
- **No image or video data retained or transmitted**
- Only barcode number + minimal metadata stored
- Optional geolocation (disabled by default)

## 📝 Data Schema

Each scan sends this JSON payload:

```json
{
  "upc": "012345678905",
  "timestamp": "2025-10-05T21:30:00.000Z",
  "device": "iOS 17.0",
  "browser": "Mozilla/5.0 ...",
  "format": "UPC_A",
  "geo": {
    "lat": 34.0522,
    "lng": -118.2437
  }
}
```

## 🧪 Testing

### Test the Webhook

1. Open `test-webhook.html` in your browser
2. Click "Send Test"
3. Check your Pipedream Event History
4. Verify data appears in Google Sheet

### Test the Scanner

1. Print a test UPC barcode or use a product
2. Open the scanner URL on your phone
3. Point camera at barcode
4. Verify success feedback and data in sheet

**Sample UPCs for Testing:**
- `012345678905` - Sample UPC-A
- `078000001907` - Coca-Cola
- `885909950805` - Apple AirPods

## 🚀 Deployment

### Vercel (Recommended - This Project Uses Vercel)

**Quick Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Or via Vercel Dashboard:**
1. Push to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Click Deploy
4. Done! 🎉

See `DEPLOY.md` for complete Vercel deployment guide.

### Alternative Options

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
1. Push to GitHub
2. Settings → Pages → Deploy

All options work great for this static site!

## 🐛 Troubleshooting

### Camera not working?

- Ensure you're using **HTTPS** (not HTTP)
- Check browser permissions (Settings → Site Settings → Camera)
- Try refreshing the page
- Make sure no other app is using the camera

### Barcodes not scanning?

- Ensure good lighting
- Hold camera steady
- Position barcode within the frame
- Try different angles
- Clean camera lens

### Data not appearing in Google Sheet?

- Check Pipedream Event History for errors
- Verify Google Sheets step is connected
- Ensure column mappings are correct
- Test webhook with `test-webhook.html`

## 📚 Documentation

- `prd.md` - Complete product requirements
- `pipedream-setup.md` - Backend webhook setup
- `google-sheets-setup.md` - Data storage setup
- `memory-bank/` - Comprehensive project documentation

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

MIT License - feel free to use and modify

## 🔗 Resources

- [ZXing Library](https://github.com/zxing-js/library)
- [Pipedream Documentation](https://pipedream.com/docs)
- [MDN getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Memory Bank Methodology](https://docs.cline.bot/prompting/cline-memory-bank)

---

**Built with** ❤️ **by Logan Lorenz | October 2025**

