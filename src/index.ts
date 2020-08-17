const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const createMessage = require('./services/messages');
const user = require('./services/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const admin = 'Admin';

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

io.on('connect', (socket: any) => {
    socket.on('join_room', ({ user_name, room }: { user_name: string; room: string }) => {
        const new_user = user.joinUser({ id: socket.id, user_name, room });

        socket.join(new_user.room);

        socket.emit('message', createMessage(admin, 'Welcome to Chat'));

        socket.broadcast
            .to(new_user.room)
            .emit('message', createMessage(admin, `${user_name} has joined the chat`));

        io.to(new_user.room).emit('users_in_room', {
            room: new_user.room,
            users: user.getRoomUsers(new_user.room),
        });
    });

    socket.on('new_message', (msg: string) => {
        const usr = user.getCurrentUser(socket.id);
        io.to(usr.room).emit('message', createMessage(usr.user_name, msg));
    });

    socket.on('disconnect', () => {
        const usr = user.removeUser(socket.id);

        if (usr) {
            io.to(usr.room).emit(
                'message',
                createMessage(admin, `${usr.user_name} has left the chat`)
            );

            io.to(usr.room).emit('users_in_room', {
                room: usr.room,
                users: user.getRoomUsers(usr.room),
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => console.log(`Server is running on port http://${HOST}${PORT}`));
