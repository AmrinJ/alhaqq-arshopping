const http = require('http');

const testLogin = (email, password) => {
    const data = JSON.stringify({ email, password });
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Email: ${email}, Status: ${res.statusCode}`);
            console.log(`Response: ${body}`);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
};

console.log('Testing Non-Admin Login (should be 430/403):');
testLogin('notadmin@gmail.com', 'password123');

setTimeout(() => {
    console.log('\nTesting Admin Login (should be 200):');
    testLogin('alhaqq@gmail.com', 'admin123');
}, 1000);
