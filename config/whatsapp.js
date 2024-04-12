import { Client } from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";

const whatsappclient = new Client();

const isReady = new Promise((resolve) => {
    whatsappclient.on("ready", () => {
        console.log("Client is ready!");
        resolve();
    });
});

whatsappclient.on("qr", (qr) => qrcode.generate(qr, { small: true }));

whatsappclient.on("message", msg => {
    try {
        if (process.env.PROCESS_MESSAGE_FROM_CLIENT && msg.from !== "status@broadcast") {
            console.log('messege from contact')
        } else {
            const lowerCaseBody = msg.body.toLowerCase();
            if (lowerCaseBody.includes('who') || lowerCaseBody.includes('kon') || lowerCaseBody.includes('?') || lowerCaseBody.includes('know') || lowerCaseBody.includes('you') || lowerCaseBody.includes('aap')) {
                const reply = "Hello there, I am an AI robot representing Sieren Goupa Corporations. We've noticed that your mobile number is registered with our application, and we'd like to explore the possibility of establishing a partnership with you.\n\nIf you are interested or not, just type:\n `not interested`\n `interested`";
                msg.reply(reply);
            } else if (lowerCaseBody === 'interested') {
                msg.reply('Thank you for considering our partnership!');
            } else if (lowerCaseBody === 'not interested') {
                msg.reply('Okay, Thank you. Have a good day 😊');
            }
        }
    } catch (error) {
        console.error(error);
    }
});

export default whatsappclient;
