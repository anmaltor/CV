#!/usr/bin/env node

const https = require('https');
const url = require('url');

const N8N_INSTANCE = 'https://anmaltor.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjU2Y2Q1YS02ODFiLTQ4NmQtYjg3ZS1jYTA2ODRkMzYwMDYiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjA1NmZkZWUyLTliNDQtNDRiMC1hOTYwLTAwNmRiYWZmNjZlNiIsImlhdCI6MTc3ODQzOTM0Mn0.cS8BaG_FEsFlF2T1ZarKWSnAmkohZYSn886znd3DCDg';

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(path, N8N_INSTANCE);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testConnection() {
  console.log('🧪 Testing n8n MCP Server Connection...\n');

  try {
    console.log('1️⃣  Testing API connection...');
    const meResponse = await makeRequest('/api/v1/me');

    if (meResponse.status === 200) {
      console.log('✅ Connected to n8n instance!');
      console.log(`   User: ${meResponse.data.email}\n`);
    } else {
      console.error(`❌ Connection failed with status ${meResponse.status}`);
      console.log(meResponse.data);
      return;
    }

    console.log('2️⃣  Fetching workflows...');
    const workflowsResponse = await makeRequest('/api/v1/workflows');

    if (workflowsResponse.status === 200) {
      const workflows = workflowsResponse.data.data || [];
      console.log(`✅ Found ${workflows.length} workflow(s)\n`);

      if (workflows.length > 0) {
        console.log('📋 Workflows:');
        workflows.forEach((wf, i) => {
          console.log(`   ${i + 1}. "${wf.name}" (ID: ${wf.id})`);
        });
      } else {
        console.log('   No workflows found yet. You can create one in the n8n UI.\n');
      }
    } else {
      console.error(`❌ Failed to fetch workflows: ${workflowsResponse.status}`);
    }

    console.log('\n✨ n8n MCP Server is connected and working!');
    console.log('📝 Next: Create an echo workflow in n8n UI to test execution.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
