const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = [];

io.on('connection', (socket)=>{
    console.log("Conexão detectada...");

    socket.on('join-request', (username) => {
        socket.username = username;
        connectedUsers.push( username );
        console.log( connectedUsers );

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);
        console.log(connectedUsers);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });

    });

    socket.on('send-msg', (text) => {
        let object = {
            username: socket.username,
            message: text
        };

        socket.emit('show-msg', object);
        socket.broadcast.emit('show-msg', object);
        socket.broadcast.emit('warning-msg', object);
    });

});

