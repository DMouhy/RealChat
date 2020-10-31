const mongoose = require('mongoose');

const user_Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 19
    },
    password: {
        type: String,
        required: true
    },
    is_connected: {
        type: Boolean,
        required: true,
        default: false
    }
})

const user_Collection = mongoose.model('users', user_Schema);

module.exports = user_Collection;