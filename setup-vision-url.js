#!/usr/bin/env node
// Helper script to set VISION_API_URL in config.js and test it

const fs = require('fs');
const path = require('path');

const webhookUrl = process.argv[2];

if (!webhookUrl) {
  console.log('📝 Usage: node setup-vision-url.js <pipedream-webhook-url>');
  console.log('');
  console.log('Example:');
  console.log('  node setup-vision-url.js https://abc123.m.pipedream.net');
  console.log('');
  console.log('To find your webhook URL:');
  console.log('  1. Go to your Pipedream workflow');
  console.log('  2. Click on the HTTP trigger step');
  console.log('  3. Copy the webhook URL');
  process.exit(1);
}

// Validate URL format
if (!webhookUrl.startsWith('https://') || !webhookUrl.includes('.pipedream.net')) {
  console.error('❌ Invalid webhook URL. Should be: https://xxx.m.pipedream.net');
  process.exit(1);
}

// Read config.js
const configPath = path.join(__dirname, 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Update VISION_API_URL
const oldPattern = /VISION_API_URL:\s*(null|'[^']*'|"[^"]*"),?\s*\/\/.*/;
const newLine = `VISION_API_URL: '${webhookUrl}', // Pipedream webhook URL`;

if (oldPattern.test(configContent)) {
  configContent = configContent.replace(oldPattern, newLine);
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✅ Updated config.js with webhook URL:', webhookUrl);
} else {
  console.error('❌ Could not find VISION_API_URL in config.js');
  process.exit(1);
}

// Run test
console.log('\n🧪 Testing webhook...\n');
const { execSync } = require('child_process');
try {
  execSync(`node test-pipedream-vision.js "${webhookUrl}"`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('\n❌ Test failed. Check the error above.');
  process.exit(1);
}

