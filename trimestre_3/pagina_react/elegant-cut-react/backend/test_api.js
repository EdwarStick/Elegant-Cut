const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/admin/appointments',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`STATUS: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response received. Writing to response_dump.json...');
        fs.writeFileSync('response_dump.json', data);
        console.log('Done.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
