const dgram = require('dgram');
const axios = require('axios');
const http = require('http');

const SOLARWINDS_URL = 'https://solarwinds.com';
const TOKEN = 'kvtLpjEWhCcGL0WORRkVp90oUwz9c9m404SHJqsMIXnWXTKE-efBaYEkReJhR7jdN132XaU';

// 1. Запуск сетевого UDP-сервера для роутера
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg) => {
    const logText = msg.toString().trim();
    axios.post(SOLARWINDS_URL, logText, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': `Bearer ${TOKEN}`
        }
    }).catch(err => console.error('Ошибка отправки:', err.message));
});

// Слушаем порт 7860 (это стандартный порт для Hugging Face Spaces)
udpServer.bind(7860, '0.0.0.0', () => {
    console.log('UDP шлюз запущен на порту 7860');
});

// 2. Создаем простейшую веб-пустышку, чтобы Hugging Face думал, что это сайт
const webServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Syslog Bridge is running!');
});
// Веб-сервер вешаем на тот же хост, но UDP и TCP порты 7860 не конфликтуют
webServer.listen(7860);
