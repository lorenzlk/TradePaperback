// Test Google Cloud Vision API
// Run: node test-vision-api.js

const CONFIG = require('./config.js');
const { identifyBookFromCover, initializeVisionClient } = require('./vision-api.js');
const vision = require('@google-cloud/vision');
const path = require('path');
const fs = require('fs');

// Set credentials path
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'google-cloud-key.json');

async function testVisionAPI() {
  try {
    console.log('🔍 Testing Google Cloud Vision API...\n');
    
    // Test 1: Initialize client
    console.log('Test 1: Initializing Vision client...');
    const client = initializeVisionClient();
    console.log('✅ Vision client initialized\n');
    
    // Test 2: Test with a public image URL
    console.log('Test 2: Testing with public image URL...');
    const testImageUrl = 'https://images-na.ssl-images-amazon.com/images/I/51abc.jpg';
    
    const [result] = await client.annotateImage({
      image: { source: { imageUri: testImageUrl } },
      features: [
        { type: 'TEXT_DETECTION', maxResults: 10 },
        { type: 'WEB_DETECTION', maxResults: 10 },
        { type: 'LABEL_DETECTION', maxResults: 10 }
      ]
    });
    
    console.log('✅ API call successful!\n');
    
    // Display results
    if (result.textAnnotations && result.textAnnotations.length > 0) {
      console.log('📝 Text Detected:');
      console.log(result.textAnnotations[0].description);
      console.log('');
    }
    
    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      console.log('🏷️  Labels:');
      result.labelAnnotations.slice(0, 5).forEach(label => {
        console.log(`   - ${label.description} (${(label.score * 100).toFixed(1)}%)`);
      });
      console.log('');
    }
    
    if (result.webDetection) {
      if (result.webDetection.webEntities && result.webDetection.webEntities.length > 0) {
        console.log('🌐 Web Entities:');
        result.webDetection.webEntities.slice(0, 5).forEach(entity => {
          console.log(`   - ${entity.description} (${(entity.score * 100).toFixed(1)}%)`);
        });
        console.log('');
      }
      
      if (result.webDetection.fullMatchingImages && result.webDetection.fullMatchingImages.length > 0) {
        console.log('🖼️  Matching Images Found:', result.webDetection.fullMatchingImages.length);
        console.log('   First match:', result.webDetection.fullMatchingImages[0].url);
        console.log('');
      }
    }
    
    // Test 3: Test identifyBookFromCover function (if we have a test image)
    console.log('Test 3: Testing identifyBookFromCover function...');
    console.log('   (Skipping - requires base64 image data)');
    console.log('   To test: Pass base64 image to identifyBookFromCover()\n');
    
    console.log('✅ Vision API is working correctly!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Integrate vision-api.js into scanner.js');
    console.log('   2. Add "Cover Scan" button to UI');
    console.log('   3. Capture image from camera');
    console.log('   4. Call identifyBookFromCover() with base64 data');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    
    if (error.message.includes('credentials') || error.message.includes('ENOENT')) {
      console.error('\n💡 Make sure:');
      console.error('   1. google-cloud-key.json exists in project root');
      console.error('   2. File path is correct');
      console.error('   3. Service account has Vision API enabled');
      console.error('   4. Project ID matches:', CONFIG.GOOGLE_CLOUD_PROJECT_ID);
    }
    
    if (error.message.includes('PERMISSION_DENIED')) {
      if (error.message.includes('billing')) {
        console.error('\n💡 Billing Required:');
        console.error('   Google Cloud requires billing to be enabled (even for free tier)');
        console.error('   Enable billing: https://console.cloud.google.com/billing/enable');
        console.error('   Project ID:', CONFIG.GOOGLE_CLOUD_PROJECT_ID);
        console.error('\n   Note: You get 1,000 free requests/month, then $1.50 per 1,000');
      } else {
        console.error('\n💡 Permission issue:');
        console.error('   1. Check service account has "Cloud Vision API User" role');
        console.error('   2. Verify Vision API is enabled in Google Cloud Console');
      }
    }
    
    process.exit(1);
  }
}

// Run test
testVisionAPI();

