var blobs = [];

function Blob(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

const express = require('express');
const app = express();
const server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running")



var socket = require('socket.io');
var io = socket(server);

// io.sockets.emit('mouse', data) everyone
//socket.broadcast.emit('mouse', data) everyone but sending vlient

const heartbeat = () => {
    io.sockets.emit('heartbeat', blobs);
};

setInterval(heartbeat, 1000/30);

const newConnection = (socket) => {
    console.log(`new connection: ${socket.id}`);
    
    
    // Client connects and their Blob is added to list of Blobs
    const startMsg = data => {
        // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        // io.sockets.emit('mouse', data)
        //socket.broadcast.emit('mouse', data)
        var blob = new Blob(socket.id, data.x, data.y, data.r);
        blobs.push(blob);
    };

    socket.on('start', startMsg);

    socket.on('update', (data) => {
        // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var blob;
        for (var i = 0; i < blobs.length; i++) {
            if (socket.id == blobs[i].id) {
                blob = blobs[i];
            }
        }
        if (blob) {
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
        }
    });

};

io.sockets.on('connection', newConnection);

