const dgram = require('dgram');
const axios = require('axios');

const SOLARWINDS_URL = 'https://solarwinds.com';
const TOKEN = 'kvtLpjEWhCcGL0WORRkVp90oUwz9c9m404SHJqsMIXnWXTKE-efBaYEkReJhR7jdN132XaU';

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    const logText = msg.toString().trim();
    
    axios.post(SOLARWINDS_URL, logText, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': `Bearer ${TOKEN}`
        }
    })
    .catch(err => console.error('Ошибка отправки в SolarWinds:', err.message));
});

const PORT = process.env.PORT || 514;
server.bind(PORT, '0.0.0.0', () => {
    console.log(`Облачный шлюз логов запущен на порту ${PORT}`);
});
