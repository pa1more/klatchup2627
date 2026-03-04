#!/usr/bin/env node

/**
 * Test script to verify profile creation endpoint
 * Usage: node test-profile-creation.js <firebase-token>
 */

const https = require('https');

// Get token from command line or use placeholder
const token = process.argv[2] || 'test-token';
const baseUrl = 'https://us-central1-klatchup-pavan2.cloudfunctions.net/api';

console.log('🧪 Testing Profile Creation Endpoint');
console.log('==================================\n');

// Test profile data
const profileData = {
  name: 'Test User',
  mobile: '919876543210',
  birthDate: '1995-03-15',
  gender: 'Male',
  interests: [{ name: 'Music', subInterest: '' }, { name: 'Sports', subInterest: '' }],
  city: 'Bangalore',
  bio: 'This is a test profile created for testing purposes of our application.',
  profilePicture: '',
  showPictures: [{ priority: 0, path: '' }],
  work: 'Software Engineer',
  education: 'B.Tech',
  lookingFor: '',
  friendRequest: { user_ids: [] },
  friends: { user_ids: [] },
  currentLocation: { placeName: 'Bangalore', lat: '12.9716', long: '77.5946' },
  isActive: true,
  isDeleted: false,
  updatedAt: new Date().toISOString()
};

const payload = JSON.stringify({ profile: profileData });

console.log('Request Details:');
console.log('- Endpoint: POST ' + baseUrl + '/profile');
console.log('- Token: ' + token.substring(0, 20) + '...');
console.log('- Profile Name: ' + profileData.name);
console.log('- Mobile: ' + profileData.mobile);
console.log('- Payload Size: ' + payload.length + ' bytes\n');

const options = {
  hostname: 'us-central1-klatchup-pavan2.cloudfunctions.net',
  port: 443,
  path: '/api/profile',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Content-Length': payload.length
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Headers:', res.headers);
    console.log('Response Body:', data);
    console.log('\n✅ Test Complete');
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

console.log('Sending request...\n');
req.write(payload);
req.end();
