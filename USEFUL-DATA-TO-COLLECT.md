# Useful Additional Data to Collect

## Currently Collecting
- ✅ UPC
- ✅ Timestamp
- ✅ Device (basic)
- ✅ Browser (user agent)
- ✅ Latitude/Longitude (optional)
- ✅ Session ID
- ✅ Format (barcode format)

## Recommended Additions

### 1. **Performance Metrics** (High Value)
- **Scan Duration** - How long it took to detect the barcode
- **Scan Attempts** - Number of frames processed before success
- **Page Load Time** - Time from page load to camera ready
- **API Response Time** - How long backend took to respond

**Why:** Helps identify slow devices, network issues, optimization opportunities

### 2. **Device Details** (High Value)
- **Screen Resolution** - `screen.width x screen.height`
- **Viewport Size** - `window.innerWidth x window.innerHeight`
- **Device Pixel Ratio** - For retina displays
- **OS Version** - More detailed than current (e.g., "iOS 17.1.2")
- **Browser Version** - More detailed (e.g., "Chrome 119.0.6045.193")
- **Device Model** - If detectable (iPhone 15 Pro, Pixel 8, etc.)

**Why:** Helps understand device capabilities, optimize for different screens

### 3. **Network Information** (Medium Value)
- **Connection Type** - `navigator.connection.effectiveType` (4g, 3g, wifi)
- **Network Speed** - `navigator.connection.downlink` (Mbps)
- **Online Status** - `navigator.onLine`

**Why:** Helps understand network-related failures, optimize retry logic

### 4. **User Context** (Medium Value)
- **Timezone** - `Intl.DateTimeFormat().resolvedOptions().timeZone`
- **Language** - `navigator.language`
- **Referrer** - `document.referrer` (if shared via link)
- **Screen Orientation** - `screen.orientation.angle`

**Why:** Better timestamp normalization, internationalization, marketing insights

### 5. **Scan Quality Metrics** (Medium Value)
- **Barcode Format** - Already have this
- **Confidence Score** - If ZXing provides it
- **Image Quality** - Brightness, contrast (if available)
- **Camera Resolution** - Actual video resolution used

**Why:** Helps identify scanning issues, optimize detection settings

### 6. **UX Metrics** (Low-Medium Value)
- **Time to First Scan** - From page load to first successful scan
- **Scans Per Session** - Count of scans in this session
- **Error Count** - Number of failed attempts
- **Manual Entry Used** - Whether user used manual entry

**Why:** UX optimization, identify friction points

## Implementation Priority

### **Priority 1: Quick Wins** (Easy to add, high value)
1. ✅ **Screen Resolution** - `screen.width + 'x' + screen.height`
2. ✅ **OS Version** - Parse from user agent more accurately
3. ✅ **Browser Version** - Parse from user agent
4. ✅ **Timezone** - `Intl.DateTimeFormat().resolvedOptions().timeZone`
5. ✅ **Language** - `navigator.language`

### **Priority 2: Performance Tracking** (Medium effort, high value)
1. **Scan Duration** - Track time from scan start to success
2. **Scan Attempts** - Count frames processed
3. **Page Load Time** - Use Performance API

### **Priority 3: Network Info** (Easy, medium value)
1. **Connection Type** - If `navigator.connection` available
2. **Online Status** - `navigator.onLine`

### **Priority 4: Advanced Metrics** (More complex)
1. **Device Model** - Requires device detection library
2. **Camera Resolution** - Get from video element
3. **Referrer** - Simple but may be empty

## Example Enhanced Payload

```javascript
{
  // Current fields
  "upc": "012345678905",
  "timestamp": "2025-11-16T07:30:00.000Z",
  "device": "iOS 17.1.2",
  "browser": "Safari 17.1",
  "session_id": "session_1234567890_abc123",
  "format": "UPC_A",
  
  // New fields (Priority 1)
  "screen_resolution": "390x844",
  "viewport_size": "390x844",
  "device_pixel_ratio": 3,
  "os_version": "17.1.2",
  "browser_version": "17.1",
  "timezone": "America/Los_Angeles",
  "language": "en-US",
  
  // New fields (Priority 2)
  "scan_duration_ms": 1250,
  "scan_attempts": 8,
  "page_load_time_ms": 1800,
  
  // New fields (Priority 3)
  "connection_type": "4g",
  "network_speed_mbps": 10.5,
  "is_online": true,
  
  // Geolocation (if enabled)
  "geo": {
    "lat": 34.0522,
    "lng": -118.2437
  }
}
```

## Google Sheet Columns to Add

If you add these fields, update your sheet headers:

| Column | Field | Example |
|--------|-------|---------|
| H | Screen Resolution | 390x844 |
| I | OS Version | 17.1.2 |
| J | Browser Version | 17.1 |
| K | Timezone | America/Los_Angeles |
| L | Language | en-US |
| M | Scan Duration (ms) | 1250 |
| N | Scan Attempts | 8 |
| O | Connection Type | 4g |

## Privacy Considerations

✅ **Safe to collect:**
- Technical specs (screen size, OS version)
- Performance metrics
- Network type (not precise location)

⚠️ **Be careful with:**
- Precise geolocation (only with permission)
- Device identifiers (avoid if possible)
- Personal information (don't collect)

---

**Recommendation:** Start with Priority 1 fields - they're easy to add and provide immediate value for analytics and debugging.

