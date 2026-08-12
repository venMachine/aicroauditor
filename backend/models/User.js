const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 0 },
  googleId: { type: String, sparse: true },
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)