import { Connection } from "./config/database.js";
import dotenv from 'dotenv'
import server from "./index.js";
import { socket_connection } from "./config/sockets.js";
import whatsappclient from "./config/whatsapp.js";

dotenv.config({ path: './config/config.env' })
Connection();
whatsappclient.initialize()

socket_connection(server);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
