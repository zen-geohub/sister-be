const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log('Database connected!')
  } catch (error) {
    console.log('Database connection failed:', error)
    process.exit(1)
  }
}

module.exports = connectDB