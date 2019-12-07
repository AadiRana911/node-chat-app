const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Users} = require('./utils/users.js');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server)
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log(`New User Connected`);

    socket.on('join', (params) => {
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        socket.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined.`));
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user){
            socket.to(user.room).emit('updateUserList', users.getUserList(user.room));
            socket.to(user.room).emit('newMessage', generateMessage(`${user.name} has left the room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});
