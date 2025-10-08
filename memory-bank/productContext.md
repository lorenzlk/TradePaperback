# Product Context

## Why This Project Exists
Traditional barcode scanning requires either:
- Dedicated hardware scanners (expensive, bulky)
- Native mobile apps (installation friction, app store approval)
- Complex multi-step workflows (login, navigation, manual submission)

This creates barriers for quick product cataloging and field data collection.

## Problems Being Solved
1. **Access Friction** - Users need instant scanning capability without downloads or setup
2. **Hardware Dependency** - Eliminate need for specialized scanning equipment
3. **Workflow Complexity** - Remove unnecessary steps between intent and action
4. **Data Collection** - Enable systematic product data gathering with minimal overhead
5. **Cross-Platform Needs** - Work seamlessly on both iOS and Android devices

## How It Should Work

### Ideal User Experience
```
User opens URL → Camera launches immediately → Points at barcode → 
Visual confirmation → Ready for next scan (< 5 seconds total)
```

### Key Experience Principles
- **Immediate Action** - No splash screens, no menus, no setup
- **One-Handed Operation** - Works while holding products
- **Fail-Safe** - Clear feedback when scan succeeds or fails
- **Continuous Flow** - Optimized for scanning multiple items in sequence
- **Trust Through Transparency** - Clear visual feedback at each step

## User Flow Details

### Step 1: Access
- User opens link (e.g., `upcscan.app`)
- Page loads with minimal assets (optimized for speed)

### Step 2: Permission
- Browser requests camera permission
- Clear messaging explains why camera is needed
- Graceful handling if permission denied

### Step 3: Scanning
- Rear camera activates automatically
- Real-time barcode detection in video stream
- Visual guide shows where to position barcode

### Step 4: Capture
- UPC detected → Screen flashes or shows confirmation
- Haptic feedback (if supported)
- **Display scanned metadata on screen for user confirmation**

### Step 5: Metadata Display
- **Show what was just scanned** (UPC, title, publisher, format)
- Stay on screen for 3-5 seconds or until user dismisses
- Provides confidence that correct item was scanned
- Visual confirmation before moving to next scan

### Step 6: Transmission
- Data automatically sent to backend endpoint
- Enrichment happens in background (Pipedream → Sheet2)
- Silent operation (user doesn't see technical details)

### Step 7: Reset
- "Ready for next scan" state appears
- Metadata card disappears (or minimizes)
- Camera remains active
- User can immediately scan next item

## User Experience Goals

### Performance Targets
- **Page-to-camera load time:** ≤ 2 seconds
- **Scan accuracy (UPC/EAN):** ≥ 95%
- **Data delivery latency:** ≤ 500 ms
- **Cross-browser compatibility:** iOS Safari & Android Chrome verified

### Usability Goals
- No training required (intuitive operation)
- Works in typical indoor lighting
- Handles various barcode conditions (angles, distances)
- Responsive feedback (no guessing if it worked)

### Emotional Goals
- **Confidence** - User trusts the scan was captured AND knows what was scanned
- **Verification** - User can confirm correct item before next scan
- **Speed** - Feels fast and efficient
- **Simplicity** - No cognitive load
- **Reliability** - Works consistently every time

## Non-Goals (Out of Scope - Phase 1)
- User authentication/accounts
- Historical scan review in the app
- Barcode editing or correction
- Multi-barcode scanning (batch mode)
- QR code or other barcode formats

## Phase 2 Goals (In Progress)
- ✅ Product information lookup via APIs (OpenLibrary, Google Books)
- ✅ LLM-powered metadata enrichment (GPT-4)
- 🔄 **On-screen metadata display after each scan** (NEW REQUIREMENT)
- ⏳ Integration with Sheet2 enriched data

## Future Considerations
- **Offline Mode** - Queue scans offline, sync on reconnect
- **PWA Support** - "Add to Home Screen" functionality
- **Scan History** - View recent scans in-app
- ~~**Product Enrichment** - Display product info after scan~~ ✅ **NOW IN PHASE 2**
- **Advanced Analytics** - Dashboard for scan patterns
- **Real-time metadata** - Fetch enriched data from Sheet2 and display immediately
- **Edit/Correct** - Allow users to fix incorrect metadata before finalizing

