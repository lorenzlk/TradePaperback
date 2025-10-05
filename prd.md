# Lightweight Mobile UPC Scanner  
**Product Requirements Document (PRD)**  
**Author:** Logan Lorenz  
**Date:** October 2025  
**Version:** 1.0  

---

## 🧭 Overview
The **Lightweight Mobile UPC Scanner** is a browser-based web app designed for instant, frictionless barcode capture.  
When opened on a mobile device, it immediately launches the camera, detects a UPC barcode, captures essential metadata (timestamp, device info, etc.), and sends the data to a backend endpoint for aggregation and analysis.

This tool enables fast, reliable product cataloging or data collection without requiring a native app or installation.

---

## 🎯 Goals & Objectives
- **Instant Access:** Open-to-scan in under 2 seconds  
- **Zero-Friction UX:** No sign-up, downloads, or menus  
- **Accurate Scanning:** 95%+ successful UPC reads under normal lighting  
- **Reliable Data Pipeline:** All scans transmitted and stored with no loss  
- **Cross-Platform Compatibility:** Works on both iOS Safari and Android Chrome  

---

## 👥 Target Users

| User Type | Description | Use Case |
|------------|--------------|-----------|
| **Internal Testers** | Early internal team or QA testers | Rapidly catalog products or UPCs for verification |
| **Field Operators** | Staff scanning physical products in warehouse, retail, or sample testing | Capture product barcodes without specialized hardware |
| **Developers** | Integrators or analysts accessing the data | Connect collected data to other systems (e.g., Sheets, Supabase, CRM) |

---

## 💡 Key Use Cases
1. **Quick Product Scanning:** Open → scan → submit → repeat  
2. **Field Data Logging:** Capture UPCs and metadata in real time  
3. **Automated Catalog Input:** Feed scanned codes into product databases or content pipelines  

---

## 🧱 Core Features

| Feature | Description | Priority |
|----------|--------------|-----------|
| **Camera Activation** | Automatically launches rear camera on page load after permission | 🟢 Must-Have |
| **UPC Barcode Detection** | Detects and decodes UPC/EAN barcodes via open-source JS library | 🟢 Must-Have |
| **Auto Submission** | Immediately transmits detected code to backend without user action | 🟢 Must-Have |
| **Metadata Capture** | Collects timestamp, device info, and browser details for each scan | 🟢 Must-Have |
| **Data Transmission** | Sends structured JSON payload to Pipedream endpoint via HTTPS | 🟢 Must-Have |
| **Visual Feedback** | Displays confirmation (e.g., "✅ Captured!") before resetting | 🟡 Nice-to-Have |
| **Offline Mode** | Queue scans offline, sync on reconnect | 🔵 Future |
| **PWA Support** | "Add to Home Screen" functionality for quick reuse | 🔵 Future |

---

## ⚙️ Technical Architecture

### Frontend
- **Framework:** Vanilla JavaScript + HTML5  
- **Barcode Library:** [`@zxing/browser`](https://github.com/zxing-js/library) (Apache 2.0 License)  
- **Deployment:** Netlify / Vercel / GitHub Pages  
- **Key Functions:**  
  - Initialize camera on load  
  - Detect UPC barcodes in video stream  
  - Auto-submit to backend  

### Backend
- **Platform:** [Pipedream Webhook](https://pipedream.com) (HTTP Trigger)  
- **Data Handling:**  
  - Receive JSON POST payloads  
  - Log events to console or forward to Google Sheets, Airtable, or Supabase  
- **Security:**  
  - HTTPS enforced  
  - Randomized endpoint hash  
  - No video or image data stored  

### Data Schema
```json
{
  "upc": "012345678905",
  "timestamp": "2025-10-04T19:35:22Z",
  "device": "iPhone17,1",
  "browser": "Safari",
  "geo": { "lat": 34.0021, "lng": -118.4821 }
}
```

---

## 📱 User Flow
1. User opens link (e.g., `upcscan.app`)
2. Browser requests camera permission
3. Rear camera activates and scanning begins
4. UPC detected → screen flashes or shows confirmation
5. Data automatically sent to backend endpoint
6. "Ready for next scan" state reappears

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Page-to-camera load time | ≤ 2 seconds |
| Scan accuracy (UPC/EAN) | ≥ 95% |
| Data delivery latency | ≤ 500 ms |
| Data retention (Pipedream logs) | 100% capture |
| Cross-browser compatibility | iOS Safari & Android Chrome verified |

---

## 🔒 Security & Privacy
- Served exclusively over HTTPS
- Camera access requested per session and not persisted
- No image or video data retained or transmitted
- Only numeric barcode + minimal metadata stored
- Optional user/session ID parameters supported for authenticated use

---

## 🧩 Dependencies
- **@zxing/browser** (open-source JS barcode library)
- **Pipedream Webhook** for backend ingestion
- **Modern mobile browser** with camera API access (iOS Safari 14+, Chrome 90+)

---

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Camera permission denied | Show fallback message with "Allow Camera" instructions |
| Poor lighting / unreadable barcode | Auto-retry loop and user feedback |
| Network loss during scan | Queue payload locally (future version) |
| Browser incompatibility | Validate across major mobile browsers |

---

## 🧪 Appendix

### Testing Plan
- Functional scan tests across 10+ common UPCs
- Performance profiling (camera latency, scan speed)
- Edge cases: low light, reflection, partial barcode

### Future Enhancements
- Product name lookup via public APIs (e.g., UPCItemDB)
- CSV export and dashboard visualization
- Multi-user attribution (via query params or auth)

