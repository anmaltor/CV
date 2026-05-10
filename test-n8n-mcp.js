#!/usr/bin/env node

const https = require('https');

const MCP_SERVER_URL = 'https://anmaltor.app.n8n.cloud/mcp-server/http';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjU2Y2Q1YS02ODFiLTQ4NmQtYjg3ZS1jYTA2ODRkMzYwMDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjA1NmZkZWUyLTliNDQtNDRiMC1hOTYwLTAwNmRiYWZmNjZlNiIsImlhdCI6MTc3ODQzOTM0Mn0.cS8BaG_FEsFlF2T1ZarKWSnAmkohZYSn886znd3DCDg';

function testMCPConnection() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'anmaltor.app.n8n.cloud',
      path: '/mcp-server/http',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', reject);

    // Send a simple MCP initialization request
    const body = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    });

    req.write(body);
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing n8n Instance-level MCP Connection...\n');

  try {
    console.log('🔗 Connecting to Instance-level MCP...');
    const result = await testMCPConnection();

    if (result.status === 200) {
      console.log('✅ Successfully connected to n8n MCP Server!\n');
      console.log('📊 Response:');
      console.log(result.data);
    } else {
      console.log(`Status: ${result.status}`);
      console.log('Response:', result.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
