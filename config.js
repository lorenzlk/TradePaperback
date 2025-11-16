// Configuration for UPC Scanner App
// Created: October 5, 2025

const CONFIG = {
  // Pipedream webhook endpoint
  // Replace with your Pipedream webhook URL
  WEBHOOK_URL: 'https://your-webhook-url.m.pipedream.net',
  
  // Google Sheet for data storage
  // Replace with your Google Sheet URL and ID
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit',
  SHEET_ID: 'YOUR_SHEET_ID',
  
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
  
  // Google Cloud Vision API
  // Note: google-cloud-key.json should be in .gitignore
  GOOGLE_CLOUD_KEY_FILE: './google-cloud-key.json',
  GOOGLE_CLOUD_PROJECT_ID: 'your-project-id',
  // Pipedream Vision API webhook URL
  // Replace with your Vision API workflow webhook URL
  VISION_API_URL: 'https://your-vision-webhook-url.m.pipedream.net',
};

// Export for use in scanner.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

