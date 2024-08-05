const { Rectangle, Quadtree } = require('./public/agario/quadtree');
require('dotenv').config();
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

app.use(express.static('public'));

const io = socket(server);

const blobs = new Map();

class Blob {
    constructor(id, x, y, r) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

// Initialize Quadtree
let boundary = new Rectangle(0, 0, 1000, 1000);  // Adjust according to your game's world size
let qtree = new Quadtree(boundary, 4);

const heartbeat = () => {
    // Clear and repopulate the quadtree
    qtree = new Quadtree(boundary, 4);
    blobs.forEach(blob => {
        let point = { x: blob.x, y: blob.y, userData: blob };
        qtree.insert(point);
    });

    io.sockets.emit('heartbeat', Array.from(blobs.values()));
};

setInterval(heartbeat, 1000 / 30);

const newConnection = (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('start', (data) => {
        const blob = new Blob(socket.id, data.x, data.y, data.r);
        blobs.set(socket.id, blob);
    });

    socket.on('update', (data) => {
        const blob = blobs.get(socket.id);
        if (blob) {
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
        }
    });

    socket.on('disconnect', () => {
        blobs.delete(socket.id);
        console.log(`Connection ${socket.id} disconnected`);
    });
};

io.sockets.on('connection', newConnection);
