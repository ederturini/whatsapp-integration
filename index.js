const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();

const PORT = process.env.PORT || 3000;

let qrCodeImage = null;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', async (qr) => {
    console.log('Gerando QR Code...');
    qrCodeImage = await qrcode.toDataURL(qr);
    console.log('QR Code gerado com sucesso!');
});

client.on('ready', () => {
    console.log('WhatsApp conectado!');
});

client.on('message', (message) => {
    console.log(`Mensagem de ${message.from}: ${message.body}`);
    if (message.body.toLowerCase() === 'olá') {
        message.reply('Olá! Como posso ajudar?');
    }
});

client.initialize();

app.get('/qr', (req, res) => {
    if (qrCodeImage) {
        res.send(`<img src="${qrCodeImage}" alt="QR Code do WhatsApp" style="width:300px;"/>`);
    } else {
        res.send('QR Code ainda não gerado ou já expirado. Atualize a página.');
    }
});

app.get('/status', (req, res) => {
    res.send('API funcionando! WhatsApp conectado? ' + (client.info ? 'Sim' : 'Não'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
