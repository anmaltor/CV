#!/usr/bin/env node

const https = require('https');
const url = require('url');

const WEBHOOK_URL = 'https://anmaltor.app.n8n.cloud/webhook/9e6bb8c6-1531-4c81-ab3e-9231b0396913';
const TEST_DATA = {
  message: "Hello from Claude Code!",
  timestamp: new Date().toISOString(),
  test: "echo-test"
};

function sendWebhookRequest(testData) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(WEBHOOK_URL);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(testData));
    req.end();
  });
}

async function testEchoWorkflow() {
  console.log('🧪 Testing n8n Echo Workflow\n');
  console.log('📤 Sending test data to webhook...\n');
  console.log('Request body:');
  console.log(JSON.stringify(TEST_DATA, null, 2));
  console.log('\n---\n');

  try {
    const result = await sendWebhookRequest(TEST_DATA);

    console.log(`Response Status: ${result.status}\n`);
    
    if (result.status === 200) {
      console.log('✅ Webhook responded successfully!\n');
      console.log('Response body:');
      console.log(JSON.stringify(result.data, null, 2));
      
      // Check if echo worked
      if (JSON.stringify(result.data) === JSON.stringify(TEST_DATA)) {
        console.log('\n🎉 ECHO TEST PASSED!');
        console.log('The workflow echoed back the exact input.');
      } else {
        console.log('\n📝 Response differs from input (workflow may have transformed it)');
      }
    } else {
      console.log(`⚠️  Received status ${result.status}`);
      console.log('Response:', result.data);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n✨ Test complete!');
}

testEchoWorkflow();
