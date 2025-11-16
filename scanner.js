// UPC Scanner - Core Logic
// Uses @zxing/library for barcode detection

let codeReader = null;
let videoStream = null;
let lastScannedCode = null;
let lastScanTime = 0;
let isProcessing = false;
let sessionId = null; // Session ID for tracking scan sessions

// DOM Elements
const loading = document.getElementById('loading');
const permissionDenied = document.getElementById('permission-denied');
const scannerContainer = document.getElementById('scanner-container');
const video = document.getElementById('video');
const successFeedback = document.getElementById('success-feedback');
const statusText = document.getElementById('status-text');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const manualEntryBtn = document.getElementById('manual-entry-btn');
const manualEntryModal = document.getElementById('manual-entry-modal');
const manualUpcInput = document.getElementById('manual-upc-input');
const manualSubmitBtn = document.getElementById('manual-submit-btn');
const manualCancelBtn = document.getElementById('manual-cancel-btn');
const metadataCard = document.getElementById('metadata-card');
const metadataClose = document.getElementById('metadata-close');
const metadataUpc = document.getElementById('metadata-upc');
const metadataFormat = document.getElementById('metadata-format');
const metadataTime = document.getElementById('metadata-time');
const metadataCoverContainer = document.getElementById('metadata-cover-container');
const metadataCoverImage = document.getElementById('metadata-cover-image');
const coverScanBtn = document.getElementById('cover-scan-btn');
const metadataTitleValue = document.getElementById('metadata-title-value');
const metadataPublisher = document.getElementById('metadata-publisher');
const metadataProductFormat = document.getElementById('metadata-product-format');
const metadataEnriched = document.getElementById('metadata-enriched');

// Initialize scanner on page load
document.addEventListener('DOMContentLoaded', () => {
    // Track page load time
    pageLoadTime = performance.now();
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🚀 Initializing UPC Scanner...');
        console.log('📝 Config:', CONFIG);
    }
    
    // Generate session ID for this browser session
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    if (CONFIG.DEBUG_MODE) {
        console.log('🆔 Session ID:', sessionId);
    }
    
    initializeScanner();
});

// Initialize camera and barcode scanner
async function initializeScanner() {
    try {
        updateStatus('Requesting camera access...');
        
        // Request camera permission and get video stream
        // Higher resolution helps with small barcodes
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use rear camera
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                focusMode: 'continuous', // Keep autofocusing
                aspectRatio: { ideal: 16/9 }
            }
        });
        
        // Attach stream to video element
        video.srcObject = videoStream;
        
        // Wait for video to be ready
        await video.play();
        
        // Wait a bit for video to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Hide loading, show scanner
        loading.classList.add('hidden');
        scannerContainer.classList.remove('hidden');
        
        updateStatus('Ready to scan');
        
        if (CONFIG.DEBUG_MODE) {
            console.log('✅ Camera initialized successfully');
            console.log('📹 Final video state:', {
                width: video.videoWidth,
                height: video.videoHeight,
                readyState: video.readyState,
                paused: video.paused
            });
        }
        
        // Initialize ZXing barcode reader
        startBarcodeDetection();
        
    } catch (error) {
        handleCameraError(error);
    }
}

// Start barcode detection using ZXing
function startBarcodeDetection() {
    try {
        // Check if ZXing is loaded
        if (typeof ZXing === 'undefined') {
            console.error('❌ ZXing is not defined!');
            showError('Barcode library failed to load. Check your internet connection.');
            updateStatus('❌ Library not loaded');
            return;
        }
        
        if (CONFIG.DEBUG_MODE) {
            console.log('🔍 Starting barcode detection...');
            console.log('📹 Video element:', video);
            console.log('📹 Video ready state:', video.readyState);
            console.log('📹 Video dimensions:', video.videoWidth, 'x', video.videoHeight);
            console.log('✅ ZXing available:', typeof ZXing);
        }
        
        // Add a scan counter for debugging
        let scanAttempts = 0;
        
        // Track scan start time
        scanStartTime = Date.now();
        scanAttempts = 0;
        
        // Start continuous decoding with AGGRESSIVE hints for small barcodes
        const hints = new Map();
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
        hints.set(ZXing.DecodeHintType.ASSUME_GS1, true); // Better for product barcodes
        hints.set(ZXing.DecodeHintType.ALSO_INVERTED, true); // Try inverted images
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
            ZXing.BarcodeFormat.UPC_A,
            ZXing.BarcodeFormat.UPC_E,
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.EAN_8,
            ZXing.BarcodeFormat.CODE_128 // Sometimes used for products
        ]);
        
        codeReader = new ZXing.BrowserMultiFormatReader(hints);
        
        console.log('✅ BrowserMultiFormatReader created:', codeReader);
        
        // Set decoding delay for better accuracy with small barcodes
        codeReader.timeBetweenDecodingAttempts = 100; // Faster attempts
        
        console.log('🎬 Starting continuous decode using manual frame capture...');
        
        // Manual scanning loop - grab frames and decode them
        let isScanning = true;
        
        async function scanLoop() {
            console.log('🔄 Scan loop started');
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: true });
            
            while (isScanning) {
                try {
                    // Make sure video is ready
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        scanAttempts++;
                        
                        // Update debug display
                        const debugEl = document.getElementById('scanner-debug');
                        if (debugEl && scanAttempts % 10 === 0) {
                            debugEl.textContent = `🔍 Attempts: ${scanAttempts}`;
                            debugEl.style.color = '#0f0';
                        }
                        
                        // Set canvas to video size
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        
                        // Draw current video frame to canvas
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        // Convert canvas to data URL and decode
                        try {
                            const imageUrl = canvas.toDataURL('image/png');
                            const result = await codeReader.decodeFromImageUrl(imageUrl);
                            
                            if (result) {
                                console.log('✅ BARCODE DETECTED!', result);
                                isScanning = false; // Stop scanning
                                handleBarcodeDetected(result);
                            }
                        } catch (decodeError) {
                            // NotFoundException is normal - no barcode in frame
                            if (decodeError.name !== 'NotFoundException' && CONFIG.DEBUG_MODE && scanAttempts % 50 === 0) {
                                console.warn('Decode error:', decodeError.name, decodeError.message);
                            }
                        }
                        
                        // Log progress
                        if (CONFIG.DEBUG_MODE && scanAttempts % 50 === 0) {
                            console.log(`🔍 Scanning... ${scanAttempts} attempts`);
                        }
                    }
                    
                    // Wait before next scan
                    await new Promise(resolve => setTimeout(resolve, CONFIG.FRAME_PROCESSING_INTERVAL));
                    
                } catch (error) {
                    console.error('❌ Scan loop error:', error);
                    break;
                }
            }
            
            console.log('🛑 Scan loop ended');
        }
        
        // Start the scanning loop
        scanLoop();
        
        // Store stop function
        window.stopScanning = () => { 
            isScanning = false;
            console.log('🛑 Stopping scanner');
        };
        
        console.log('✅ Manual scan loop initiated');
        
        console.log('✅ Barcode detection started successfully');
        
        // Visual feedback that scanning is active
        setTimeout(() => {
            const debugEl = document.getElementById('scanner-debug');
            if (debugEl && scanAttempts === 0) {
                debugEl.textContent = '⚠️ Scanner loop not running!';
                debugEl.style.color = '#ff0';
                console.warn('⚠️ Scan loop never started');
            } else if (CONFIG.DEBUG_MODE) {
                console.log(`✅ Scanner running: ${scanAttempts} attempts so far`);
            }
        }, 2000);
        
    } catch (error) {
        console.error('❌ Failed to start barcode detection:', error);
        showError('Failed to initialize barcode scanner: ' + error.message);
    }
}

// Handle detected barcode
function handleBarcodeDetected(result) {
    const code = result.text;
    const format = result.format;
    const now = Date.now();
    
    if (CONFIG.DEBUG_MODE) {
        console.log('📷 Barcode detected:', code, '| Format:', format);
    }
    
    // Validate UPC/EAN format
    if (!isValidUPC(code)) {
        if (CONFIG.DEBUG_MODE) {
            console.warn('⚠️ Invalid UPC format:', code);
        }
        return;
    }
    
    // Prevent duplicate scans (debouncing)
    if (code === lastScannedCode && now - lastScanTime < CONFIG.SCAN_COOLDOWN_MS) {
        if (CONFIG.DEBUG_MODE) {
            console.log('⏭️ Skipping duplicate scan');
        }
        return;
    }
    
    // Prevent overlapping processing
    if (isProcessing) {
        return;
    }
    
    isProcessing = true;
    lastScannedCode = code;
    lastScanTime = now;
    
    // Show success feedback
    showSuccessFeedback();
    
    // Show metadata confirmation card
    showMetadataCard(code, format);
    
    // Vibrate if supported
    if (CONFIG.ENABLE_HAPTIC_FEEDBACK && navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Send to backend
    sendScanData(code, format);
    
    // Reset processing flag after cooldown
    setTimeout(() => {
        isProcessing = false;
        updateStatus('Ready for next scan');
    }, CONFIG.SCAN_COOLDOWN_MS);
}

// Validate UPC format (12-14 digits)
function isValidUPC(code) {
    // UPC-A: 12 digits
    // UPC-E: 8 digits (expanded to 12)
    // EAN-13: 13 digits
    // EAN-8: 8 digits
    const upcPattern = /^\d{8,14}$/;
    return upcPattern.test(code);
}

// Show success feedback animation
function showSuccessFeedback() {
    successFeedback.classList.remove('hidden');
    updateStatus('✓ Scan captured!');
    
    setTimeout(() => {
        successFeedback.classList.add('hidden');
    }, 1000);
}

// Show metadata confirmation card
function showMetadataCard(upc, format) {
    // Populate card with scan data
    metadataUpc.textContent = upc;
    metadataFormat.textContent = format;
    
    // Format timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    metadataTime.textContent = timeStr;
    
    // Reset cover image state
    if (metadataCoverContainer) {
        metadataCoverContainer.classList.add('hidden');
        metadataCoverContainer.classList.remove('error');
    }
    if (metadataCoverImage) {
        metadataCoverImage.classList.remove('loaded', 'error');
        metadataCoverImage.src = '';
    }
    
    // Show the card
    metadataCard.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (!metadataCard.classList.contains('hidden')) {
            hideMetadataCard();
        }
    }, 5000);
}

// Hide metadata confirmation card
function hideMetadataCard() {
    metadataCard.classList.add('hidden');
}

// Show cover image in metadata card
function showCoverImage(imageUrl) {
    if (!imageUrl || !metadataCoverImage || !metadataCoverContainer) {
        return;
    }
    
    // Show container with loading spinner
    metadataCoverContainer.classList.remove('hidden', 'error');
    
    // Load image
    metadataCoverImage.onload = function() {
        metadataCoverImage.classList.add('loaded');
    };
    
    metadataCoverImage.onerror = function() {
        metadataCoverImage.classList.add('error');
        metadataCoverContainer.classList.add('error');
        if (CONFIG.DEBUG_MODE) {
            console.warn('Failed to load cover image:', imageUrl);
        }
    };
    
    metadataCoverImage.src = imageUrl;
}

// Send scan data to webhook
async function sendScanData(upc, format) {
    // Get enhanced device info
    const deviceInfo = getEnhancedDeviceInfo();
    
    // Calculate scan duration
    const scanDuration = scanStartTime ? Date.now() - scanStartTime : null;
    
    const payload = {
        // Core fields
        upc: upc,
        timestamp: new Date().toISOString(),
        device: getDeviceInfo(), // Keep simple version for compatibility
        browser: navigator.userAgent, // Keep full user agent
        format: format,
        session_id: sessionId || 'unknown',
        
        // Enhanced device info
        screen_resolution: deviceInfo.screen_resolution,
        viewport_size: deviceInfo.viewport_size,
        device_pixel_ratio: deviceInfo.device_pixel_ratio,
        os: deviceInfo.os,
        os_version: deviceInfo.os_version,
        browser_name: deviceInfo.browser,
        browser_version: deviceInfo.browser_version,
        timezone: deviceInfo.timezone,
        language: deviceInfo.language,
        is_online: deviceInfo.online,
        
        // Performance metrics
        scan_duration_ms: scanDuration,
        scan_attempts: scanAttempts,
        page_load_time_ms: pageLoadTime ? Math.round(pageLoadTime) : null
    };
    
    // Add network info if available
    if (deviceInfo.connection_type) {
        payload.connection_type = deviceInfo.connection_type;
    }
    if (deviceInfo.network_speed_mbps) {
        payload.network_speed_mbps = deviceInfo.network_speed_mbps;
    }
    
    // Add geolocation if enabled
    if (CONFIG.ENABLE_GEOLOCATION) {
        try {
            const position = await getGeolocation();
            payload.geo = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        } catch (error) {
            if (CONFIG.DEBUG_MODE) {
                console.warn('⚠️ Geolocation failed:', error);
            }
        }
    }
    
    // Reset scan tracking for next scan
    scanStartTime = Date.now();
    scanAttempts = 0;
    
    if (CONFIG.DEBUG_MODE) {
        console.log('📤 Sending payload:', payload);
    }
    
    // Send to webhook with retry logic
    try {
        const response = await fetchWithRetry(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true // Continue even if page closes
        });
        
        if (response.ok) {
            if (CONFIG.DEBUG_MODE) {
                console.log('✅ Data sent successfully');
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Failed to send data:', error);
        showError('Failed to upload scan data');
        
        // TODO: Queue for retry when offline mode is implemented
    }
}

// Fetch with retry logic
async function fetchWithRetry(url, options, retries = CONFIG.MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), CONFIG.NETWORK_TIMEOUT_MS);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            return response;
            
        } catch (error) {
            if (i === retries - 1) throw error;
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * (i + 1)));
            
            if (CONFIG.DEBUG_MODE) {
                console.log(`🔄 Retry attempt ${i + 2}/${retries}`);
            }
        }
    }
}

// Get device information
function getDeviceInfo() {
    const ua = navigator.userAgent;
    
    // Detect iOS
    if (/iPhone|iPad|iPod/.test(ua)) {
        const match = ua.match(/iPhone OS (\d+_\d+)/);
        return match ? `iOS ${match[1].replace('_', '.')}` : 'iOS';
    }
    
    // Detect Android
    if (/Android/.test(ua)) {
        const match = ua.match(/Android (\d+\.\d+)/);
        return match ? `Android ${match[1]}` : 'Android';
    }
    
    // Desktop/Other
    return navigator.platform || 'Unknown';
}

// Get enhanced device information
function getEnhancedDeviceInfo() {
    const ua = navigator.userAgent;
    const info = {
        platform: navigator.platform || 'Unknown',
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        device_pixel_ratio: window.devicePixelRatio || 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language || 'unknown',
        online: navigator.onLine
    };
    
    // Parse OS version more accurately
    if (/iPhone|iPad|iPod/.test(ua)) {
        const match = ua.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);
        if (match) {
            info.os = 'iOS';
            info.os_version = `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`;
        } else {
            info.os = 'iOS';
            info.os_version = 'unknown';
        }
    } else if (/Android/.test(ua)) {
        const match = ua.match(/Android (\d+\.\d+(?:\.\d+)?)/);
        info.os = 'Android';
        info.os_version = match ? match[1] : 'unknown';
    } else {
        info.os = navigator.platform || 'Unknown';
        info.os_version = 'unknown';
    }
    
    // Parse browser version
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) {
        const match = ua.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
        info.browser = 'Chrome';
        info.browser_version = match ? match[1] : 'unknown';
    } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
        const match = ua.match(/Version\/(\d+\.\d+)/);
        info.browser = 'Safari';
        info.browser_version = match ? match[1] : 'unknown';
    } else if (/Firefox/.test(ua)) {
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        info.browser = 'Firefox';
        info.browser_version = match ? match[1] : 'unknown';
    } else {
        info.browser = 'Unknown';
        info.browser_version = 'unknown';
    }
    
    // Network information (if available)
    if (navigator.connection) {
        info.connection_type = navigator.connection.effectiveType || 'unknown';
        info.network_speed_mbps = navigator.connection.downlink || null;
    }
    
    return info;
}

// Get geolocation (if enabled)
function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000
        });
    });
}

// Update status text
function updateStatus(message) {
    statusText.textContent = message;
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Handle camera errors
function handleCameraError(error) {
    console.error('❌ Camera error:', error);
    
    loading.classList.add('hidden');
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        // Permission denied
        permissionDenied.classList.remove('hidden');
    } else if (error.name === 'NotFoundError') {
        // No camera found
        permissionDenied.classList.remove('hidden');
        permissionDenied.querySelector('h2').textContent = 'No Camera Found';
        permissionDenied.querySelector('p').textContent = 'Please use a device with a camera';
    } else {
        // Other error
        permissionDenied.classList.remove('hidden');
        permissionDenied.querySelector('h2').textContent = 'Camera Error';
        permissionDenied.querySelector('p').textContent = error.message || 'Failed to access camera';
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (codeReader) {
        codeReader.reset();
    }
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
});

// Handle page visibility change (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause scanning when page is hidden (battery saving)
        if (CONFIG.DEBUG_MODE) {
            console.log('⏸️ Page hidden, pausing scanner');
        }
    } else {
        // Resume scanning when page is visible
        if (CONFIG.DEBUG_MODE) {
            console.log('▶️ Page visible, resuming scanner');
        }
    }
});

// Manual entry button
if (manualEntryBtn) {
    manualEntryBtn.addEventListener('click', () => {
        manualEntryModal.classList.remove('hidden');
        manualUpcInput.focus();
    });
}

// Manual entry submit
if (manualSubmitBtn) {
    manualSubmitBtn.addEventListener('click', () => {
        const upc = manualUpcInput.value.trim();
        
        if (!upc) {
            showError('Please enter a UPC code');
            return;
        }
        
        if (!isValidUPC(upc)) {
            showError('Invalid UPC format. Must be 8-14 digits.');
            return;
        }
        
        // Create a fake result object to match scanner format
        const fakeResult = {
            text: upc,
            format: upc.length === 12 ? 'UPC_A' : 'EAN_13'
        };
        
        manualEntryModal.classList.add('hidden');
        manualUpcInput.value = '';
        
        handleBarcodeDetected(fakeResult);
    });
}

// Manual entry cancel
if (manualCancelBtn) {
    manualCancelBtn.addEventListener('click', () => {
        manualEntryModal.classList.add('hidden');
        manualUpcInput.value = '';
    });
}

// Allow Enter key to submit
if (manualUpcInput) {
    manualUpcInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            manualSubmitBtn.click();
        }
    });
}

// Close metadata card button
if (metadataClose) {
    metadataClose.addEventListener('click', () => {
        hideMetadataCard();
    });
}

// Cover scan button
if (coverScanBtn) {
    coverScanBtn.addEventListener('click', () => {
        captureAndIdentifyCover();
    });
}

// Capture cover photo and identify book
async function captureAndIdentifyCover() {
    try {
        updateStatus('📷 Capturing cover...');
        
        // Create canvas to capture current video frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        
        // Remove data URL prefix
        const base64Data = imageBase64.split(',')[1];
        
        updateStatus('🔍 Identifying book...');
        
        // Call backend endpoint (we'll create this next)
        const bookData = await identifyBookCover(base64Data);
        
        if (bookData && bookData.isbn) {
            // Show success feedback
            showSuccessFeedback();
            
            // Show metadata card with book data
            showBookMetadata(bookData);
            
            // Send to backend (same as barcode scan)
            sendScanData(bookData.isbn, 'COVER_SCAN');
            
        } else {
            showError('Could not identify book. Try scanning barcode instead.');
            updateStatus('Ready to scan');
        }
        
    } catch (error) {
        console.error('Cover scan error:', error);
        showError('Failed to identify book: ' + error.message);
        updateStatus('Ready to scan');
    }
}

// Call backend API to identify book from cover
async function identifyBookCover(imageBase64) {
    // Check if endpoint is configured
    if (!CONFIG.VISION_API_URL || CONFIG.VISION_API_URL.includes('your-pipedream')) {
        throw new Error('Vision API endpoint not configured. See PIPEDREAM-VISION-WORKFLOW.md');
    }
    
    try {
        updateStatus('🔍 Sending to Vision API...');
        
        const response = await fetch(CONFIG.VISION_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageBase64,
                timestamp: new Date().toISOString()
            }),
            signal: AbortSignal.timeout(CONFIG.NETWORK_TIMEOUT_MS)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to identify book');
        }
        
        return data.bookData || null;
        
    } catch (error) {
        console.error('Vision API call failed:', error);
        
        if (error.name === 'TimeoutError') {
            throw new Error('Request timed out. Check your internet connection.');
        }
        
        throw error;
    }
}

// Show book metadata in card
function showBookMetadata(bookData) {
    // Populate basic fields
    metadataUpc.textContent = bookData.isbn || '-';
    metadataFormat.textContent = 'Cover Scan';
    
    // Format timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    metadataTime.textContent = timeStr;
    
    // Show enriched data if available
    if (bookData.title) {
        metadataTitleValue.textContent = bookData.title;
        if (bookData.subtitle) {
            metadataTitleValue.textContent += ': ' + bookData.subtitle;
        }
    }
    
    if (bookData.publisher) {
        metadataPublisher.textContent = bookData.publisher;
    }
    
    if (bookData.format || bookData.categories) {
        metadataProductFormat.textContent = bookData.format || bookData.categories?.[0] || '-';
    }
    
    // Show cover image if available
    if (bookData.imageLinks?.thumbnail || bookData.imageLinks?.smallThumbnail) {
        const coverUrl = bookData.imageLinks.thumbnail || bookData.imageLinks.smallThumbnail;
        showCoverImage(coverUrl);
    }
    
    // Show enriched section
    if (bookData.title || bookData.publisher) {
        metadataEnriched.classList.remove('hidden');
    }
    
    // Show the card
    metadataCard.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (!metadataCard.classList.contains('hidden')) {
            hideMetadataCard();
        }
    }, 5000);
}

