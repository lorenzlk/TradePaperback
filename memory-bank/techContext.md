# Technical Context

## Technologies Used

### Frontend Stack
- **HTML5** - Semantic markup, video element for camera feed
- **CSS3** - Minimal styling for mobile-first design
- **Vanilla JavaScript (ES6+)** - Core application logic
- **@zxing/browser** (v0.1.x) - Barcode detection and decoding library

### Backend Stack
- **Pipedream** - Webhook receiver and data pipeline orchestration
- **HTTPS** - Secure data transmission protocol

### Data Storage (Selected)
- **Google Sheets** - ✅ CHOSEN - Simple spreadsheet logging
  - Sheet: "Trade Paperback DB"
  - ID: 1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck
  - URL: https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit
  
### Alternative Data Storage Options (Not Chosen)
- **Airtable** - Structured database with API (future option)
- **Supabase** - PostgreSQL database with real-time features (future option)

## Development Setup

### Prerequisites
```bash
# No complex setup required for development
# Just need a local web server and HTTPS for camera access
```

### Local Development
```bash
# Option 1: Python SimpleHTTPServer (HTTPS required for camera)
# Use localhost tunneling service (e.g., ngrok) for HTTPS

# Option 2: Local HTTPS server
npx http-server -S -C cert.pem -K key.pem

# Option 3: Development with Netlify Dev
netlify dev
```

### Required Tools
- **Modern Browser** - Chrome or Safari with developer tools
- **Mobile Device** - For testing camera functionality
- **HTTPS Tunnel** - ngrok, localtunnel, or similar for local testing
- **Text Editor** - VS Code, Sublime, or any editor

## Browser APIs Used

### getUserMedia API
```javascript
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment', // Rear camera
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
})
```

**Browser Support:**
- ✅ iOS Safari 11+
- ✅ Android Chrome 53+
- ✅ Desktop browsers (for testing)

**Requirements:**
- HTTPS context (required for camera access)
- User permission grant

### Other Browser APIs
- **Fetch API** - For HTTPS POST requests
- **Geolocation API** - For optional location metadata
- **Vibration API** - For haptic feedback (where supported)

## Technical Constraints

### Browser Limitations
1. **Camera Access Requires HTTPS**
   - Cannot use camera on HTTP (except localhost)
   - Production must be served over HTTPS

2. **iOS Safari Restrictions**
   - May require user gesture for camera access
   - Video autoplay policies
   - Different behavior in home screen PWA mode

3. **Android Chrome Variations**
   - Device-specific camera capabilities
   - Vendor-specific WebView implementations

### Performance Constraints
1. **Frame Processing Overhead**
   - Barcode detection is CPU-intensive
   - Must balance accuracy vs. battery life
   - Consider throttling on lower-end devices

2. **Network Latency**
   - Mobile network variability
   - Must handle offline scenarios gracefully

### Privacy Constraints
1. **No Image Storage**
   - Process video frames in memory only
   - Never upload images to server
   - Clear privacy policy required

2. **Minimal Metadata**
   - Only collect necessary data
   - No PII (Personally Identifiable Information)
   - No precise geolocation without consent

## Dependencies

### Production Dependencies
```json
{
  "dependencies": {
    "@zxing/browser": "^0.1.5"
  }
}
```

### Development Dependencies (Optional)
```json
{
  "devDependencies": {
    "http-server": "^14.1.1",
    "prettier": "^3.0.0"
  }
}
```

### CDN Alternative
```html
<!-- Load @zxing/browser from CDN for zero build step -->
<script src="https://unpkg.com/@zxing/browser@latest"></script>
```

## Deployment Configuration

### Hosting Options

#### Option 1: Netlify
```toml
# netlify.toml
[build]
  publish = "."
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

#### Option 2: Vercel
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

#### Option 3: GitHub Pages
- ✅ Free HTTPS
- ✅ Simple deployment
- ❌ No custom headers
- ✅ Custom domain support

### Pipedream Webhook Setup
1. ✅ Create new workflow in Pipedream (DONE)
2. ✅ Add HTTP trigger (DONE - URL generated)
3. 🔄 Add destination step (Google Sheets - IN PROGRESS)
4. ✅ Copy webhook URL to frontend config (DONE)

**Actual Webhook URL:** https://eo76brlwpbpr9el.m.pipedream.net

### Environment Variables
```javascript
// config.js (CREATED)
const CONFIG = {
  WEBHOOK_URL: 'https://eo76brlwpbpr9el.m.pipedream.net',
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit',
  SHEET_ID: '1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck',
  ENABLE_GEOLOCATION: false,
  ENABLE_HAPTIC_FEEDBACK: true,
  SCAN_COOLDOWN_MS: 2000,
  FRAME_PROCESSING_INTERVAL: 250,
  DEBUG_MODE: false,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  NETWORK_TIMEOUT_MS: 5000
};
```

## Tool Usage Patterns

### Testing Strategy
- **Manual Testing** - Primary method for camera functionality
- **Device Testing** - Test on actual iOS and Android devices
- **Network Simulation** - Test offline/slow network scenarios
- **Cross-Browser Testing** - Verify iOS Safari and Android Chrome

### Debugging Tools
- **Browser DevTools** - Console logging and network inspection
- **Remote Debugging** - Chrome DevTools for mobile devices
- **Pipedream Logs** - Inspect received webhook payloads
- **Network Tab** - Monitor request timing and failures

### Version Control
```bash
# Simple Git workflow
git init
git add .
git commit -m "Initial commit"
git push origin main
```

## Performance Monitoring

### Key Metrics to Track
1. **Page Load Time** - Target: < 2 seconds
2. **Time to Camera Active** - Target: < 2 seconds
3. **Barcode Detection Latency** - Target: < 1 second
4. **API Response Time** - Target: < 500ms
5. **Error Rate** - Target: < 1%

### Monitoring Approach
- Use browser Performance API
- Log timing data to Pipedream
- Create dashboard in Google Sheets or Data Studio

## Browser Compatibility Matrix

| Feature | iOS Safari | Android Chrome | Desktop Chrome |
|---------|-----------|----------------|----------------|
| Camera Access | ✅ 11+ | ✅ 53+ | ✅ 53+ |
| getUserMedia | ✅ | ✅ | ✅ |
| Fetch API | ✅ | ✅ | ✅ |
| Geolocation | ✅ | ✅ | ✅ |
| Vibration | ❌ | ✅ | ❌ |
| Service Workers | ✅ 11.3+ | ✅ 40+ | ✅ 40+ |

## Known Technical Issues

### iOS Safari
- Camera requires user gesture in some contexts
- Video element must be visible (not `display: none`)
- Autoplay policies can block video
- Different behavior in standalone PWA mode

### Android Chrome
- Inconsistent camera quality across devices
- Vendor-specific WebView implementations
- Permission prompts vary by Android version

### General Web
- HTTPS required (no exceptions except localhost)
- Camera access blocked in iframes
- Battery drain from continuous video processing

