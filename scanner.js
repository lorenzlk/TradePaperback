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
const manualEntryBtn = document.getElementById('manual-entry-btn');
const manualEntryModal = document.getElementById('manual-entry-modal');
const manualUpcInput = document.getElementById('manual-upc-input');
const manualSubmitBtn = document.getElementById('manual-submit-btn');
const manualCancelBtn = document.getElementById('manual-cancel-btn');

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
        
        console.log('🎬 Starting continuous scan loop...');
        
        // Use continuous scanning loop (new ZXing API)
        let isScanning = true;
        
        async function continuousScan() {
            while (isScanning) {
                try {
                    scanAttempts++;
                    
                    // Update debug display every 10 attempts
                    if (scanAttempts % 10 === 0) {
                        const debugEl = document.getElementById('scanner-debug');
                        if (debugEl) {
                            debugEl.textContent = `🔍 Attempts: ${scanAttempts}`;
                        }
                    }
                    
                    // Try to decode from video element
                    const result = await codeReader.decodeFromVideoElement(video);
                    
                    if (result) {
                        console.log('✅ BARCODE DETECTED!', result);
                        handleBarcodeDetected(result);
                    }
                    
                    // Log scanning attempts every 50 tries
                    if (CONFIG.DEBUG_MODE && scanAttempts % 50 === 0) {
                        console.log(`🔍 Scan attempts: ${scanAttempts} (still scanning...)`);
                        updateStatus(`Scanning... ${scanAttempts} attempts`);
                    }
                    
                } catch (error) {
                    // NotFoundException is expected when no barcode in frame
                    if (error.name !== 'NotFoundException') {
                        if (CONFIG.DEBUG_MODE) {
                            console.warn('⚠️ Decode error:', error.name, error.message);
                        }
                    }
                }
                
                // Small delay between scans to avoid blocking
                await new Promise(resolve => setTimeout(resolve, CONFIG.FRAME_PROCESSING_INTERVAL));
            }
        }
        
        // Start the continuous scanning loop
        continuousScan();
        
        // Store the scanning state so we can stop it later
        window.stopScanning = () => { isScanning = false; };
        
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

