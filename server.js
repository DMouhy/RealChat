const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGO_KEY } = require('./keys');
const path = require('path');

// configure app
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 8000;

// mongodb configure
mongoose.connect(MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('Connection'))
.catch(err => console.log('Error: ', err.stack))

mongoose.connection.on('connected', () => console.log(`Connecting to realtimeChatappDB`) );
mongoose.connection.on('error', err => console.log(`ERROR: `, err) );

// socketIO instance
const io = require('socket.io')(http);
const user_Collection = require('./Models/user_model');

// IO Events
let connected_sockets = {};

io.on('connection', (socket) => {
    let user;
    socket.on('user_connect', data => {

        connected_sockets[data.user._id] = socket.id;
        user = data.user;

        socket.emit('welcome', `Welcome ${data.user.username}`);
        socket.broadcast.emit('someoneConnected', `${data.user.username} is connected`);

        user_Collection.findByIdAndUpdate(data.user._id, {
            $set: { is_connected: true }
        }, { new: true })
        .then( userUpdated => console.log(userUpdated.username +' isConnected: '+userUpdated.is_connected))
        .catch(err => console.log('deco'))
    })

    socket.on('getting_message', data => {

        if(data.msg.talking_to._id in connected_sockets){
            const user_toSent_Id = data.msg.talking_to._id;

            io.to(connected_sockets[user_toSent_Id]).emit('setting_message', { msg: data.msg })
        }
    })

    socket.on('view_message', data => {
        if(data.info.send_by._id in connected_sockets){
            const user_toSent_Id = data.info.send_by._id;

            io.to(connected_sockets[user_toSent_Id]).emit('msg_viewed', {
                viewed_by: { 
                    _id: data.talking_to._id,
                    username: data.talking_to.username
                },
                bool_viewed: true
            })
        }
    });

    socket.on('isWriting', data => {
        if(data.writing_to._id in connected_sockets){
            const user_toSent_Id = data.writing_to._id;

            io.to(connected_sockets[user_toSent_Id]).emit('someoneWriting', data);
        }
    })

    // disconnect
    socket.on('disconnect', () => {
        // manage user Disconnection
        if(user){
            socket.broadcast.emit('someoneConnected', `${user.username} is disconnected`)
            
            user_Collection.findByIdAndUpdate(user._id, {
            $set: { is_connected: false }
            }, { new: true })
            .then( userUpdated => console.log(userUpdated.username +' isConnected: '+userUpdated.is_connected))

            // delete myUserId from connected_sockets
            delete connected_sockets[user._id]
        }
        // END: manage user Disconnection
    })
})

// global middleWare
app.use(cors())
app.use(express.json())

// routes
app.use('/api', require('./Routes/auth_route'));
app.use('/api', require('./Routes/user_route'));
app.use('/api', require('./Routes/room_route'));
app.use('/api', require('./Routes/message_route'));

// static files
app.use(express.static(path.join(__dirname, 'frontend/build')))

// listen
http.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`) )