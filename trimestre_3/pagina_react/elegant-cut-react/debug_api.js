const http = require('http');

function testUrl(path) {
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- Response for ${path} ---`);
            console.log(`Status Code: ${res.statusCode}`);
            try {
                const json = JSON.parse(data);
                console.log('Body (JSON):', JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Body (Raw):', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error(`Error with request to ${path}:`, error.message);
    });

    req.end();
}

testUrl('/admin/barbers');
testUrl('/admin/services');
testUrl('/api/barbers'); // Check this one too
testUrl('/api/services'); // Check this one too
