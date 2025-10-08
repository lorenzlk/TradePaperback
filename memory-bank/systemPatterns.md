# System Patterns

## System Architecture

### High-Level Architecture
```
┌─────────────────┐
│  Mobile Browser │
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS POST
         │ (JSON payload)
         ▼
┌─────────────────┐
│  Pipedream WF1  │
│  Raw Scan Data  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Google Sheets  │
│     Sheet1      │ ◄───┐
└────────┬────────┘     │
         │              │
         │ Trigger      │
         ▼              │
┌─────────────────┐     │
│  Pipedream WF2  │     │
│   Enrichment    │     │
└────────┬────────┘     │
         │              │
         ├──────────────┘
         │ Search APIs
         ├──► OpenLibrary
         ├──► Google Books
         │
         │ Enrich
         ▼
    ┌─────────┐
    │ GPT-4o  │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│  Google Sheets  │
│     Sheet2      │
│  (Metadata)     │
└─────────────────┘
```

### Component Relationships

#### Frontend Components
1. **Camera Controller**
   - Manages `getUserMedia()` API
   - Handles permissions and errors
   - Controls video stream lifecycle

2. **Barcode Scanner**
   - Integrates @zxing/browser library
   - Processes video frames
   - Detects and decodes UPC/EAN barcodes

3. **Data Transmitter**
   - Constructs JSON payloads
   - Sends HTTPS POST requests
   - Handles network errors and retries

4. **UI Feedback Controller**
   - Shows visual confirmations
   - Displays error states
   - Manages loading indicators

#### Backend Components
1. **Webhook Receiver (Pipedream WF1)**
   - Receives POST requests from scanner
   - Validates payload structure
   - Logs incoming data
   - Writes to Sheet1 (raw scan data)

2. **Metadata Enrichment Pipeline (Pipedream WF2)**
   - Triggered by new rows in Sheet1
   - Searches OpenLibrary API for book/comic data
   - Searches Google Books API for additional metadata
   - Sends combined data to GPT-4 for enrichment
   - Parses and structures GPT-4 response
   - Writes enriched metadata to Sheet2

3. **External APIs**
   - **OpenLibrary** - Free book/comic metadata
   - **Google Books** - Additional metadata + cover images
   - **OpenAI GPT-4o** - Intelligent metadata enrichment and formatting

4. **Data Storage**
   - **Sheet1** - Raw scan logs (7 columns)
   - **Sheet2** - Enriched metadata (16 columns)

## Key Technical Decisions

### Decision 1: Vanilla JavaScript (No Framework)
**Rationale:**
- Minimize page load time (critical for < 2s goal)
- Reduce complexity for simple use case
- Avoid framework bundle overhead
- Easier to optimize and debug

**Trade-offs:**
- Less abstraction than React/Vue
- Manual DOM manipulation
- More boilerplate code

### Decision 2: @zxing/browser for Barcode Scanning
**Rationale:**
- Open-source (Apache 2.0 License)
- Active maintenance and community
- Good accuracy with UPC/EAN formats
- Browser-native (no server processing)

**Alternatives Considered:**
- QuaggaJS (less maintained)
- Native Barcode Detection API (limited browser support)

### Decision 3: Pipedream for Backend
**Rationale:**
- No server management required
- Built-in integrations (Sheets, Airtable, etc.)
- HTTPS out of the box
- Easy webhook setup
- Free tier sufficient for initial use

**Trade-offs:**
- Vendor lock-in (mitigated by simple API)
- Limited control over infrastructure

### Decision 4: No Authentication (Phase 1)
**Rationale:**
- Minimizes friction (zero-friction UX goal)
- Simplifies initial implementation
- Webhook obscurity provides basic security
- Suitable for internal/controlled use

**Future Consideration:**
- Add API key or token for production scale
- Implement rate limiting

### Decision 5: GPT-4o for Metadata Enrichment
**Rationale:**
- Can intelligently combine multiple API sources
- Handles missing or incomplete data gracefully
- Formats output consistently (structured JSON)
- Cost-effective at ~$0.01-0.03 per enrichment
- Better than manual data entry

**Trade-offs:**
- API costs (mitigated by low volume)
- Potential for hallucination (verify critical data)
- Network dependency

**Alternatives Considered:**
- Manual data entry (too slow)
- Simple API passthrough (too brittle, inconsistent formats)
- Custom ML model (overkill for volume)

## Design Patterns in Use

### Pattern 1: Auto-Initialization
```javascript
// On page load, immediately start camera
document.addEventListener('DOMContentLoaded', async () => {
  await initializeCamera();
  await startScanning();
});
```

### Pattern 2: Event-Driven Scanning
```javascript
// Listen for barcode detection events
scanner.addEventListener('scan', (event) => {
  handleBarcodeDetected(event.barcode);
});
```

### Pattern 3: Fire-and-Forget Transmission
```javascript
// Send data without waiting for confirmation
async function sendScan(data) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    keepalive: true // Continue even if page closes
  }).catch(handleError);
}
```

### Pattern 4: Optimistic UI
```javascript
// Show success immediately, handle errors in background
showSuccessFeedback();
await sendScan(data); // Network call happens after feedback
```

## Critical Implementation Paths

### Path 1: Camera Initialization
```
Page Load → Request Permissions → Get User Media → 
Create Video Stream → Attach to DOM → Initialize Scanner
```

**Critical Points:**
- Permission denial handling
- Camera not available fallback
- iOS Safari quirks (requires user gesture in some contexts)

### Path 2: Barcode Detection
```
Video Frame → ZXing Processing → Decode Attempt → 
Result Found → Extract UPC → Validate Format
```

**Critical Points:**
- Frame processing performance (avoid blocking UI)
- False positive filtering
- Format validation (UPC-A, UPC-E, EAN-13)

### Path 3: Data Submission
```
Barcode Detected → Gather Metadata → Construct Payload → 
POST to Webhook → Handle Response → Reset for Next Scan
```

**Critical Points:**
- Network failure handling
- Duplicate scan prevention (debouncing)
- Payload structure consistency

## Error Handling Strategy

### Camera Errors
- **Permission Denied:** Show message with retry button
- **No Camera Available:** Display error, suggest device check
- **Camera in Use:** Prompt to close other apps

### Scanning Errors
- **Poor Lighting:** Suggest moving to better light
- **Invalid Barcode:** Show "not recognized" message
- **Timeout:** Allow manual retry

### Network Errors
- **Connection Failed:** Queue locally, retry on reconnect
- **Webhook Down:** Show error, allow manual resend
- **Timeout:** Retry with exponential backoff

## Performance Optimizations

### Load Time Optimization
- Inline critical CSS
- Defer non-essential JavaScript
- Minimize external dependencies
- Use CDN for @zxing/browser

### Runtime Optimization
- Process every Nth frame (not every frame)
- Throttle detection attempts
- Release camera when page hidden (battery)
- Use Web Workers for decoding (future)

### Network Optimization
- Compress JSON payloads
- Use `keepalive` flag for reliability
- Batch requests if offline (future)

## Security Considerations

### Current Security
- HTTPS enforced
- Randomized webhook URL (obscurity)
- No sensitive data transmitted
- No video/image storage

### Future Security Enhancements
- API key authentication
- Rate limiting per device
- CORS restrictions
- Request signing/verification

