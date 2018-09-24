const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  "username": {
    type: 'string'
    //unique: true
  },
  "password": {type: 'string'},
  "firstName": 'string',
  "lastName": 'string',
  "assignmentList": [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }
  ]
})

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
