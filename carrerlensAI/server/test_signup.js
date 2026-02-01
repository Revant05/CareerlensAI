const axios = require('axios');

const testSignup = async () => {
    console.log('⚠️ Testing Signup Endpoint...');
    try {
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log('✅ Signup Success:', res.data);
    } catch (err) {
        console.error('❌ Signup Failed!');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else if (err.request) {
            console.error('No response received - Server might be down or not running on port 5000');
        } else {
            console.error('Error:', err.message);
        }
    }
};

testSignup();
