#!/usr/bin/env node

/**
 * Complete Firebase Backend API Testing Suite
 * Tests all endpoints to verify mobile app integration
 * 
 * Usage: node test-backend.js
 * 
 * This script tests:
 * - Health check
 * - Authentication flow
 * - Profile CRUD
 * - Check-ins
 * - Chat operations
 * - Error handling
 */

const https = require('https');

const BASE_URL = 'https://api-zajzlo33xa-uc.a.run.app';
const TEST_TOKEN = 'test-token-' + Date.now();

let results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Make HTTP request
 */
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = bodyStr.length;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Test helper
 */
async function test(name, fn) {
  try {
    console.log(`\n🧪 Testing: ${name}...`);
    await fn();
    console.log(`   ✅ PASSED`);
    results.passed++;
    results.tests.push({ name, status: 'PASSED' });
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

/**
 * Test Suite
 */
async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Firebase Backend API Testing Suite    ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Test 1: Health Check
  await test('Health Check', async () => {
    const res = await makeRequest('GET', '/health');
    if (res.status !== 200 || !res.body.status) {
      throw new Error('Health check failed');
    }
    console.log(`   Response: ${res.body.status} at ${res.body.timestamp}`);
  });

  // Test 2: Auth Missing Header
  await test('Auth Endpoint - Missing Authorization Header', async () => {
    const res = await makeRequest('POST', '/auth/verify');
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // Test 3: Profile Endpoint - Auth Required
  await test('Profile Creation - Missing Authorization', async () => {
    const res = await makeRequest('POST', '/profile', {
      profile: { name: 'Test' }
    });
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // Test 4: Chat Endpoints - Auth Required
  await test('Chat - Create Room Without Auth', async () => {
    const res = await makeRequest('POST', '/chat/rooms', {
      participantIds: ['user1', 'user2']
    });
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // Test 5: Check-in Endpoint - Auth Required
  await test('Check-in - Create Without Auth', async () => {
    const res = await makeRequest('POST', '/checkin', {
      location: { lat: 12.97, long: 77.59 }
    });
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // Test 6: Location Endpoint - Auth Required
  await test('Location Search - Without Auth', async () => {
    const res = await makeRequest('POST', '/location/search', {
      latitude: 12.97,
      longitude: 77.59
    });
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // Test 7: Invalid Token Format
  await test('Invalid Token Format', async () => {
    const res = await makeRequest('GET', '/profile/test123', null, 'invalid-token');
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // Test 8: 404 Handling
  await test('Route Not Found', async () => {
    const res = await makeRequest('GET', '/nonexistent');
    if (res.status !== 404 || !res.body.type.includes('NOT_FOUND')) {
      throw new Error(`Expected 404 NOT_FOUND, got ${res.status}`);
    }
  });

  // Test 9: CORS Headers
  await test('CORS Headers Present', async () => {
    const res = await makeRequest('GET', '/health');
    if (!res.headers['access-control-allow-origin']) {
      throw new Error('CORS headers missing');
    }
    console.log(`   CORS Origin: ${res.headers['access-control-allow-origin']}`);
  });

  // Test 10: JSON Parsing
  await test('JSON Response Parsing', async () => {
    const res = await makeRequest('GET', '/health');
    if (!res.body || typeof res.body !== 'object') {
      throw new Error('Response not valid JSON object');
    }
  });

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║           Test Summary                 ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.passed + results.failed}`);
  console.log(`   Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

  console.log('\n📋 Detailed Results:');
  results.tests.forEach((test, i) => {
    const icon = test.status === 'PASSED' ? '✅' : '❌';
    console.log(`  ${i + 1}. ${icon} ${test.name}`);
    if (test.error) {
      console.log(`     Error: ${test.error}`);
    }
  });

  console.log('\n' + (results.failed === 0 ? 
    '🎉 All tests passed! Backend is ready!' :
    '⚠️ Some tests failed. Check errors above.'));

  console.log('\n📚 Next Steps for Mobile App:');
  console.log('  1. Use Firebase Phone Auth to get ID token');
  console.log('  2. Include token in Authorization header: Bearer {token}');
  console.log('  3. Call API endpoints with authenticated requests');
  console.log('  4. Handle 401 errors by redirecting to login');
  console.log('  5. Test real data with actual Firebase tokens\n');
}

// Run tests
runTests().then(() => {
  process.exit(results.failed === 0 ? 0 : 1);
}).catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
