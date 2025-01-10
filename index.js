const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeImage = null;

// Inicializa o cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento para geração de QR Code
client.on('qr', async (qr) => {
    console.log('Gerando QR Code...');
    qrCodeImage = await qrcode.toDataURL(qr);
    console.log('QR Code gerado com sucesso!');
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('WhatsApp conectado!');
    // Teste: envia uma mensagem de boas-vindas para o número de teste
    client.sendMessage('<seu-número-aqui>', 'Bot WhatsApp conectado com sucesso!');
});

// Evento para mensagens recebidas
client.on('message', (message) => {
    console.log(`Mensagem recebida de ${message.from}: ${message.body}`);
    
    // Verifica se a mensagem é "olá"
    if (message.body.toLowerCase().trim() === 'olá') {
        console.log('Respondendo à mensagem "olá"');
        client.sendMessage(message.from, 'Olá! Como posso ajudar?');
    } else {
        console.log('Mensagem recebida não corresponde ao esperado.');
    }
});

// Inicializa o cliente
client.initialize();

// Endpoint para exibir o QR Code
app.get('/qr', (req, res) => {
    if (qrCodeImage) {
        res.send(`
            <div style="text-align: center;">
                <h2>Escaneie o QR Code abaixo para conectar-se ao WhatsApp:</h2>
                <img src="${qrCodeImage}" alt="QR Code do WhatsApp" style="width:300px;"/>
            </div>
        `);
    } else {
        res.send('QR Code ainda não gerado ou já expirado. Atualize a página.');
    }
});

// Endpoint para verificar o status da API
app.get('/status', (req, res) => {
    res.send('API funcionando! WhatsApp conectado? ' + (client.info ? 'Sim' : 'Não'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
