const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: String,
  refreshToken: { type: String, default: null }
}, { collection: 'Users' })

const Users = mongoose.model('Users', userSchema)

module.exports = Users