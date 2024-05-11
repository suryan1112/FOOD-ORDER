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
const questions_word = ['who', 'kon', 'know', 'koon', 'kya'];

whatsappclient.on("message_create", async (msg) => {
  try {
    const lowerCaseBody = msg.body.toLowerCase();

    if (questions_word.some((word) => lowerCaseBody.includes(word))) {
      msg.reply("Hello there, I am an _AI bot_ representing *Sieren Goupa* Corporations. We've noticed that your mobile number is registered with our application, and we'd like to explore the possibility of establishing a partnership with you.\n\nIf you are interested or not, just type:\n `interested`  _(continue)_\n `not interested`  _(cancel order)_");
      global.replied = msg.from;
    }
    if (!global.make_order && global.replied == msg.from) {
      if (lowerCaseBody === 'interested') {
        msg.reply('Thank you for considering our partnership!');
        setTimeout(() => {
          whatsappclient.sendMessage(msg.from, interestedReplies[Math.floor(Math.random() * interestedReplies.length)]);
        }, 4000);
        global.replied = NaN;
      } else if (lowerCaseBody === 'not interested') {
        msg.reply('Fu** off.. 🤬');
        setTimeout(() => whatsappclient.sendMessage(msg.from, 'lol, Firstly make an order 😮‍💨'), 2000);
        global.replied = NaN;
      }
    }
  } catch (error) {
    console.error('Error in message_create event handler:', error);
  }
});


const interestedReplies = [
  "I'm sorry, but it looks like you haven't placed an order yet. 😅",
  "Apologies, but it seems you haven't made an order yet. 😅",
  "Unfortunately, you haven't placed an order yet. 😅",
  "Regrettably, there's no order from you yet. 😅",
  "Sorry to say, but you haven't made an order yet. 😅",
  "I'm afraid there's no order under your name yet. 😅",
  "Sorry to break it to you, but there's no order from you yet. 😅",
  "No order has been placed under your name yet. 😅",
  "I regret to inform you that you haven't made an order yet. 😅",
  "You haven't placed an order yet, I'm afraid. 😅",
  "bhai order to kar pehle",
  "order place kar fir kuch bhi likhna 😂",
  "Tu rehne de terse na hopaega ye sab....😂"
];



















export default whatsappclient;
