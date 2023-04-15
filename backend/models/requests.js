const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const RequestSchema = new Schema({
  status: {required: true, type: String, enum: ["pending", "denied", "cancelled", "approval", "tcard", "completed"], default: "pending"},
  group: {required: true, type: Schema.Types.ObjectId, ref: 'Group'},
  owner: {required: true, type: Schema.Types.ObjectId, ref: 'Account'},
  approvers: [{type: String}],
  start_date: {required: true, type: Date},
  end_date: {required: true, type: Date},
  description: {type: String},
  title: {required: true, type: String},
  room: {type: Schema.Types.ObjectId, ref: 'Room'},
  reason: {type: String, required: false}
});

module.exports = {
  Request: mongoose.model('Request', RequestSchema)
};
