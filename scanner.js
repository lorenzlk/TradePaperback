// UPC Scanner - Core Logic
// Uses @zxing/library for barcode detection

let codeReader = null;
let videoStream = null;
let lastScannedCode = null;
let lastScanTime = 0;
let isProcessing = false;

// DOM Elements
const loading = document.getElementById('loading');
const permissionDenied = document.getElementById('permission-denied');
const scannerContainer = document.getElementById('scanner-container');
const video = document.getElementById('video');
const successFeedback = document.getElementById('success-feedback');
const statusText = document.getElementById('status-text');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// Initialize scanner on page load
document.addEventListener('DOMContentLoaded', () => {
    if (CONFIG.DEBUG_MODE) {
        console.log('🚀 Initializing UPC Scanner...');
        console.log('📝 Config:', CONFIG);
    }
    
    initializeScanner();
});

// Initialize camera and barcode scanner
async function initializeScanner() {
    try {
        updateStatus('Requesting camera access...');
        
        // Request camera permission and get video stream
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use rear camera
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });
        
        // Attach stream to video element
        video.srcObject = videoStream;
        
        // Wait for video to be ready
        await video.play();
        
        // Hide loading, show scanner
        loading.classList.add('hidden');
        scannerContainer.classList.remove('hidden');
        
        updateStatus('Ready to scan');
        
        if (CONFIG.DEBUG_MODE) {
            console.log('✅ Camera initialized successfully');
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
        // Initialize BrowserMultiFormatReader (supports UPC-A, UPC-E, EAN-13, etc.)
        codeReader = new ZXing.BrowserMultiFormatReader();
        
        if (CONFIG.DEBUG_MODE) {
            console.log('🔍 Starting barcode detection...');
        }
        
        // Start continuous decoding
        codeReader.decodeFromVideoElement(video, (result, error) => {
            if (result) {
                handleBarcodeDetected(result);
            }
            
            // Ignore common errors (no barcode in frame, etc.)
            if (error && error.name !== 'NotFoundException') {
                if (CONFIG.DEBUG_MODE) {
                    console.warn('Decode error:', error);
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to start barcode detection:', error);
        showError('Failed to initialize barcode scanner');
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

// Send scan data to webhook
async function sendScanData(upc, format) {
    const payload = {
        upc: upc,
        timestamp: new Date().toISOString(),
        device: getDeviceInfo(),
        browser: navigator.userAgent,
        format: format
    };
    
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

