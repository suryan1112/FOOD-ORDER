import { Client } from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";
import fs from 'fs'

const whatsappclient = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    // authStrategy: new Baileys()
  });

// const SESSION_FILE_PATH = './session.json';
// whatsappclient.on("authenticated", session => {
//     try {
//         console.log("Authenticated!");
//         console.log(session);
//         fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
//     } catch (error) {
//         console.error("Error occurred while writing session data:", error);
//     }
// });

// whatsappclient.on("auth_failure", msg => {
//     console.error("Authentication failed:", msg);
// });

whatsappclient.on("qr", (qr) => {
    console.log("QR Code received, scan it!");
    qrcode.generate(qr, { small: true });
});

whatsappclient.on('ready', () => {
    console.log('Client is ready!');
});

whatsappclient.on("message_create", msg => {
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
