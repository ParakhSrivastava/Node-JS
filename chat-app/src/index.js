const path = require('path')
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

// setting up server side connection
// cb function runs for each client 
io.on('connection', (socket) => {
    console.log('New WebSocket connection')


    socket.on('join', ({ username, room }, callBack) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if(error) {
            return callBack(error)
        }

        socket.join(user.room)

        // for single client
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        // broadcasting to room
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callBack()
    })

    socket.on('sendMessage', (message, callBack) => {
        const user = getUser(socket.id);

        const filter = new Filter();
        if(filter.isProfane(message)){
            return callBack("Profanity not allowed")
        }

        // for every client
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callBack()
    })

    socket.on('sendLocation', ({ latitude, longitude }, callBack) => {
        const user = getUser(socket.id);
        // for every client
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
        callBack()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`)) ;
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        } 
    })
})

server.listen(port, () => {
    console.log("Server is up on:", port);
})