// Configuration for UPC Scanner App
// Created: October 5, 2025

const CONFIG = {
  // Pipedream webhook endpoint
  WEBHOOK_URL: 'https://eo76brlwpbpr9el.m.pipedream.net',
  
  // Google Sheet for data storage
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck/edit',
  SHEET_ID: '1NIbYNYHdnuksYUDfPUQMExmPTpETvmqlu8WZVr4F_ck',
  
  // Feature flags
  ENABLE_GEOLOCATION: false, // Set to true to collect location data
  ENABLE_HAPTIC_FEEDBACK: true, // Vibration on successful scan (Android)
  
  // Performance settings
  SCAN_COOLDOWN_MS: 2000, // Minimum time between scans of same barcode
  FRAME_PROCESSING_INTERVAL: 250, // Process every N milliseconds (not every frame)
  
  // Debug mode
  DEBUG_MODE: false, // Set to true for console logging
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  
  // Timeout settings
  NETWORK_TIMEOUT_MS: 5000,
};

// Export for use in scanner.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

