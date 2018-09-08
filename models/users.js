const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  "userName": {
    type: 'string',
    unique: true
  },
  "password": 'string',
  "firstName": 'string',
  "lastName": 'string',
  "assignmentList": [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }
  ]
})

const User = mongoose.model('User', userSchema);

module.exports = { User };
