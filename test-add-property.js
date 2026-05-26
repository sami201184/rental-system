const http = require('http');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const parts = [
  '--' + boundary,
  'Content-Disposition: form-data; name="name"',
  '',
  'test',
  '--' + boundary,
  'Content-Disposition: form-data; name="type"',
  '',
  'استراحة',
  '--' + boundary,
  'Content-Disposition: form-data; name="price"',
  '',
  '100',
  '--' + boundary + '--',
  ''
];
const data = parts.join('\r\n');
const options = {
  method: 'POST',
  hostname: 'localhost',
  port: 3000,
  path: '/add-property',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('body', body);
  });
});
req.on('error', err => {
  console.error('error', err);
});
req.write(data);
req.end();
