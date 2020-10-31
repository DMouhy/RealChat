const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const user_Collection = require('./user_model');
const message_Collection = require('./message_model');

const room_Schema = new mongoose.Schema({
    participant1: {
        type: ObjectId,
        ref: user_Collection
    },
    participant2: {
        type: ObjectId,
        ref: user_Collection
    },
   messages: [
    {
        type: ObjectId,
        ref: message_Collection
    }
   ]
})

const room_Collection = mongoose.model('rooms', room_Schema)

module.exports = room_Collection;