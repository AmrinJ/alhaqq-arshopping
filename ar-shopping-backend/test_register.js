const http = require('http');

const testRegister = (name, email, password) => {
    const data = JSON.stringify({ name, email, password });
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
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

const timestamp = Date.now();
console.log(`Testing Registration for amrin_${timestamp}@example.com (should be 201):`);
testRegister('Amrin Test', `amrin_${timestamp}@example.com`, 'password123');
