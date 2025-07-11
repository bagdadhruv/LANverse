// Simple test script for your API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000'; // or your Vercel URL

async function testAPI() {
  console.log('Testing LANverse API...\n');

  // Test registration
  try {
    console.log('1. Testing registration...');
    const registerRes = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123'
      })
    });
    const registerData = await registerRes.json();
    console.log('Registration response:', registerData);
  } catch (error) {
    console.error('Registration error:', error.message);
  }

  // Test login
  try {
    console.log('\n2. Testing login...');
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login response:', loginData);
  } catch (error) {
    console.error('Login error:', error.message);
  }
}

testAPI(); 