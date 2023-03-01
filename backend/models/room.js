const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const RoomSchema = new Schema({
  roomName: {type: String, required: true, index: {unique: true}},
  friendlyName: {type: String},
  capacity: {type: Number},
  requests: [
    {type: Schema.Types.ObjectId, ref: 'Request'}
  ]
});

module.exports = {
  Room: mongoose.model('Room', RoomSchema)
};