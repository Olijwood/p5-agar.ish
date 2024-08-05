const express = require('express');
const socket = require('socket.io');
const path = require('path');
const { setupSocketHandlers } = require('./socketHandlers');

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

app.use(express.static(path.join(__dirname, '../public')));

const io = socket(server);
setupSocketHandlers(io);
