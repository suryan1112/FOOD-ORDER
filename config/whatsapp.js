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

export let replied=NaN
const questions_word = ['who', 'kon', '?', 'know', 'koon', 'kya'];

whatsappclient.on("message_create", async(msg )=> {
  const lowerCaseBody = msg.body.toLowerCase();

  if (questions_word.some(word => lowerCaseBody.includes(word))) {
      msg.reply("Hello there, I am an _AI bot_ representing *Sieren Goupa* Corporations. We've noticed that your mobile number is registered with our application, and we'd like to explore the possibility of establishing a partnership with you.\n\nIf you are interested or not, just type:\n `interested`  _(continue)_\n `not interested`  _(cancel order)_");
      replied = msg.from;
  }
});

export default whatsappclient;
