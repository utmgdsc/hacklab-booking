const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const AccountSchema = new Schema({
  utorid: {type: String, required: true, index: {unique: true}},
  email: {type: String, required: true},
  name: {type: String, required: true},
  role: {
    type: String,
    required: true,
    enum : ['student', 'prof', 'admin'],
    default: 'student'
  },
  accessGranted: {type: Boolean, required: true, default: false},
});

module.exports = {
  Account: mongoose.model('Account', AccountSchema)
};