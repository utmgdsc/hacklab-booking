const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const GroupSchema = new Schema({
  name: {type: String, required: true, index: {unique: true}},
  members: [
    {type: Schema.Types.ObjectId, ref: 'Account'}
  ],
  requests: [
    {type: Schema.Types.ObjectId, ref: 'Request'}
  ]
});

module.exports = {
  Group: mongoose.model('Group', GroupSchema)
};