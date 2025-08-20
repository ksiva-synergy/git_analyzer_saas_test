// Test script for git-summary endpoint
// Run with: node test-git-summary.js

const testEndpoint = async () => {
  const baseUrl = 'http://localhost:3000';
  const endpoint = '/api/git-summary';
  
  // Test cases
  const testCases = [
    {
      name: 'GET with query parameter',
      method: 'GET',
      url: `${baseUrl}${endpoint}?gitUrl=https://github.com/crewAIInc/crewAI`,
             headers: {
         'x-api-key': 'sk_test_0987654321fedcba'
       }
    },
    {
      name: 'POST with request body',
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
             headers: {
         'x-api-key': 'sk_test_0987654321fedcba',
         'Content-Type': 'application/json'
       },
      body: JSON.stringify({
        gitUrl: 'https://github.com/crewAIInc/crewAI'
      })
    }
  ];

  console.log('🧪 Testing Git Summary Endpoint\n');

  for (const testCase of testCases) {
    try {
      console.log(`📋 Testing: ${testCase.name}`);
      console.log(`🔗 URL: ${testCase.url}`);
      console.log(`📤 Method: ${testCase.method}`);
      
      const response = await fetch(testCase.url, {
        method: testCase.method,
        headers: testCase.headers,
        body: testCase.body
      });

      const data = await response.json();
      
      console.log(`📊 Status: ${response.status}`);
      console.log(`📄 Response:`, JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ Test PASSED\n');
      } else {
        console.log('❌ Test FAILED\n');
      }
      
    } catch (error) {
      console.log(`❌ Test ERROR: ${error.message}\n`);
    }
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoint().catch(console.error);
}

module.exports = { testEndpoint };
