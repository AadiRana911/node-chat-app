const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server)

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log(`New User Connected`);

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));


    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));
  
    socket.on('createMessage', (message/*, callback*/) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        // callback();
    });
});

server.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});
