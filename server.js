require('dotenv').config();
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

app.use(express.static('public'));

const io = socket(server);

let blobs = [];

function Blob(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

const heartbeat = () => {
    io.sockets.emit('heartbeat', blobs);
};

setInterval(heartbeat, 1000 / 30);

const newConnection = (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('start', (data) => {
        const blob = new Blob(socket.id, data.x, data.y, data.r);
        blobs.push(blob);
    });

    socket.on('update', (data) => {
        const blob = blobs.find(b => b.id === socket.id);
        if (blob) {
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
        }
    });

    socket.on('disconnect', () => {
        blobs = blobs.filter(b => b.id !== socket.id);
        console.log(`Connection ${socket.id} disconnected`);
    });
};

io.sockets.on('connection', newConnection);
