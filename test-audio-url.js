// Test if the audio URL from the new track is accessible
const https = require('https');

const audioUrl = 'https://cdn.ttapi.io/suno/20260417/a13f10393a4b46b7a20423512a52ce20.mp3';

console.log('Testing audio URL:', audioUrl);
console.log('');

https.get(audioUrl, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  console.log('');
  
  if (res.statusCode === 200) {
    console.log('✅ Audio URL is accessible!');
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Length:', res.headers['content-length'], 'bytes');
  } else {
    console.log('❌ Audio URL returned error status:', res.statusCode);
  }
  
  res.resume(); // Consume response data to free up memory
}).on('error', (err) => {
  console.error('❌ Error accessing audio URL:', err.message);
});
