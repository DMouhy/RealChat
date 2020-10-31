const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const user_Collection = require('./user_model');

const message_Schema = new mongoose.Schema({
   content: {
       type: String,
       required: true
   },
   send_by: {
       type: ObjectId,
       ref: user_Collection,
       required: true
   },
   viewed: {
       type: Boolean,
       default: false,
       required: true
   },
   Date_created_at: {
       type: Date,
       required: true
   },
   Time_created_at: {
       type: String,
       required: true
   }
})

const message_Collection = mongoose.model('messages', message_Schema)

module.exports = message_Collection;