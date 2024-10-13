const {Server} = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { joinRoom, leaveRoom, sendMessage,disconnectFromSocket } = require('../controllers/socket.controller');
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        method : ['GET','POST']
    },
});
io.on('connection', (socket) => {
    console.log(`${socket.id}user connected`);
    socket.on('join_room', (data) => {
        joinRoom(io, socket, data);
    });
    socket.on('send_message', (data) => {
        sendMessage(io, socket, data);
    });
    socket.on('leave_room', (room) => {
        leaveRoom(io, socket, room);
    });
    socket.on('disconnect', () => {
        disconnectFromSocket(io, socket);
    });
});
module.exports = {app, server};