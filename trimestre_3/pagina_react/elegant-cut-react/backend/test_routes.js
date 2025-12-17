const http = require('http');

const options1 = {
    hostname: 'localhost',
    port: 3001,
    path: '/admin/dashboard/reports',
    method: 'GET'
};

const req1 = http.request(options1, (res) => {
    console.log(`STATUS REPORTS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req1.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req1.end();

const options2 = {
    hostname: 'localhost',
    port: 3001,
    path: '/auth/verify-code',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req2 = http.request(options2, (res) => {
    console.log(`STATUS VERIFY: ${res.statusCode}`);
});

req2.write(JSON.stringify({ email: 'test', codigo: '123' }));
req2.end();
