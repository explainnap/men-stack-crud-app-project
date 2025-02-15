const mongoose = require("mongoose");

const stampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
  
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  album: [stampSchema],
})


const User = mongoose.model('User', userSchema);

module.exports = User;
