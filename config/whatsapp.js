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



export default whatsappclient;
