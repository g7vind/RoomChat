let roomMembers = {};
const joinRoom = (io, socket, data) => {
    if (!roomMembers[data.room]) {
        roomMembers[data.room] = [];
        }
        if (roomMembers[data.room].some((member) => member.id === socket.id)) {
        console.log(`User with ID: ${socket.id} is already in room: ${data.room}`);
        return;
    }
    socket.join(data.room);
    console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    const roomPersonData = {
        username: data.username,
        id: socket.id,
    };
    roomMembers[data.room].push(roomPersonData);
    io.to(data.room).emit('room_members', roomMembers[data.room]);
}
const leaveRoom = (io, socket, room) => {
    if (!roomMembers[room] || !roomMembers[room].some((member) => member.id === socket.id)) {
        console.log(`User with ID: ${socket.id} is not in room: ${room}`);
        return;
        }
        socket.leave(room);
        roomMembers[room] = roomMembers[room].filter((member) => member.id !== socket.id);
        if (roomMembers[room].length > 0) {
        io.to(room).emit('room_members', roomMembers[room]);
        } else {
        delete roomMembers[room];
        console.log(`Room ${room} is now empty and has been deleted.`);
        }
        console.log(`User ${socket.id} left room ${room}`);
}
const sendMessage = (io, socket, data) => {
    if (!roomMembers[data.room] || !roomMembers[data.room].some((member) => member.id === socket.id)) {
        console.log(`User with ID: ${socket.id} is not in room: ${data.room}`);
        return;
    }
    socket.to(data.room).emit('receive_message', data);
}
const disconnectFromSocket = (io, socket) => {
    console.log(`User ${socket.id} disconnected`);
    for (const room in roomMembers) {
        roomMembers[room] = roomMembers[room].filter(
            (member) => member.id !== socket.id
    );
    if (roomMembers[room].length > 0) {
            io.to(room).emit("room_members", roomMembers[room]);
    } else {
        delete roomMembers[room];
        console.log(`Room ${room} is now empty and has been deleted.`);
    }
        }
}
module.exports = { joinRoom, leaveRoom, sendMessage ,disconnectFromSocket};