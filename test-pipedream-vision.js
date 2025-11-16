// Test script for Pipedream Vision API workflow
// Usage: node test-pipedream-vision.js <webhook-url> [image-path]

const fs = require('fs');
const path = require('path');

async function testPipedreamVision(webhookUrl, imagePath) {
  if (!webhookUrl) {
    console.error('❌ Error: Webhook URL required');
    console.log('Usage: node test-pipedream-vision.js <webhook-url> [image-path]');
    console.log('Example: node test-pipedream-vision.js https://abc123.m.pipedream.net ./test-image.jpg');
    process.exit(1);
  }

  let imageBase64;
  
  if (imagePath) {
    // Read image file and convert to base64
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBase64 = imageBuffer.toString('base64');
      console.log(`✅ Loaded image: ${imagePath} (${imageBuffer.length} bytes)`);
    } catch (error) {
      console.error(`❌ Error reading image file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Create a minimal test image (1x1 pixel PNG) for testing
    // This is a valid base64-encoded 1x1 transparent PNG
    imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    console.log('⚠️  No image provided, using minimal test image (1x1 pixel PNG)');
    console.log('   Provide an image path for real testing: node test-pipedream-vision.js <url> <image-path>');
  }

  const payload = {
    image: imageBase64,
    timestamp: new Date().toISOString()
  };

  console.log('\n📤 Sending request to:', webhookUrl);
  console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
  console.log('⏳ Waiting for response...\n');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Response is not valid JSON:');
      console.log(responseText);
      process.exit(1);
    }

    console.log('📥 Response Status:', response.status, response.statusText);
    console.log('\n📋 Response Body:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ SUCCESS!');
      if (data.bookData) {
        console.log('\n📚 Book Data:');
        console.log('  ISBN:', data.bookData.isbn || 'N/A');
        console.log('  Title:', data.bookData.title || 'N/A');
        console.log('  Authors:', data.bookData.authors?.join(', ') || 'N/A');
        console.log('  Publisher:', data.bookData.publisher || 'N/A');
        console.log('  Confidence:', data.bookData.confidence || 'N/A');
      }
    } else {
      console.log('\n❌ FAILED:', data.error || 'Unknown error');
      if (data.debug) {
        console.log('\n🐛 Debug Info:');
        console.log(JSON.stringify(data.debug, null, 2));
      }
    }

  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

// Get command line arguments
const webhookUrl = process.argv[2];
const imagePath = process.argv[3];

// Run test
testPipedreamVision(webhookUrl, imagePath).catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

