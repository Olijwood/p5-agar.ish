const { Blobby } = require('./game/Blob');
const { Rectangle, Quadtree } = require('./game/Quadtree');

const blobs = new Map();
const foodItems = [];
const boundary = new Rectangle(0, 0, 1000, 1000);
let qtree = new Quadtree(boundary, 4);

const initializeFood = (numFood) => {
    for (let i = 0; i < numFood; i++) {
        const x = Math.random() * boundary.w - boundary.w / 2;
        const y = Math.random() * boundary.h - boundary.h / 2;
        const food = { x, y, r: 20 }; // Add unique ID if needed
        foodItems.push(food);
    }
};

// Inside the heartbeat function
const heartbeat = (io) => {
    qtree = new Quadtree(boundary, 4);
    blobs.forEach(blob => {
        let point = { x: blob.x, y: blob.y, userData: blob };
        qtree.insert(point);
    });

    blobs.forEach(blob => {
        foodItems.forEach((food, index) => {
            const distance = Math.hypot(blob.x - food.x, blob.y - food.y);
            if (distance < blob.r + food.r) {
                // Update blob size
                const newRadius = Math.sqrt(blob.r * blob.r + food.r * food.r);
                blob.r = newRadius;

                // Remove food item
                foodItems.splice(index, 1);

                console.log(`Blob ${blob.id} ate food at (${food.x}, ${food.y}). New size: ${blob.r}`);
            }
        });
    });

    io.sockets.emit('heartbeat', {
        blobs: Array.from(blobs.values()),
        foodItems
    });
};


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

    initializeFood(50); // Initialize food items
    setInterval(() => heartbeat(io), 1000/30);
};

module.exports = { setupSocketHandlers };
