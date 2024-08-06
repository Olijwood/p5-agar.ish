const { Blobby } = require('./game/Blob');
const { Rectangle, Quadtree } = require('./game/Quadtree');

const blobs = new Map();
const boundary = new Rectangle(0, 0, 1000, 1000);
let qtree = new Quadtree(boundary, 4);

// Function to handle the heartbeat logic
const heartbeat = (io) => {
    qtree = new Quadtree(boundary, 4);
    blobs.forEach(blob => {
        let point = { x: blob.x, y: blob.y, userData: blob };
        qtree.insert(point);
        console.log(blob);
    });
    
    io.sockets.emit('heartbeat', Array.from(blobs.values()));
};

// Function to set up socket handlers
const setupSocketHandlers = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        socket.on('start', (data) => {
            const blob = new Blobby(socket.id, data.x, data.y, data.r);
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
    });

    // Start the heartbeat loop
    setInterval(() => heartbeat(io), 1000);
};

module.exports = { setupSocketHandlers };
