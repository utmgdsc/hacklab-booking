const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const RequestSchema = new Schema({
  status: {required: true, type: String, enum: ["pending", "denied", "approved"], default: "pending"},
  group: {required: true, type: Schema.Types.ObjectId, ref: 'Group'},
  owner: {required: true, type: Schema.Types.ObjectId, ref: 'Account'},
});

module.exports = {
  Request: mongoose.model('Request', RequestSchema)
};