import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSocketHandlers } from './socketHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

app.use(express.static(path.join(__dirname, '../public')));

const io = new Server(server);
setupSocketHandlers(io);
