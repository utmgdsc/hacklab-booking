const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = require("mongoose");
const SALT_WORK_FACTOR = 10;


const AccountSchema = new Schema({
  utorid: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  name: {type: String, required: true}
});
AccountSchema.pre('save', function (next) {
  const user = this;

// only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

// generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });

});

AccountSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = {
  Account: mongoose.model('Account', AccountSchema)
};