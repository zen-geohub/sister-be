const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const morgan = require('morgan')
const router = require('./src/router')
const connectDB = require('./src/db/db')
const port = process.env.PORT || 3000
const app = express()

connectDB()

app.use(cookieParser())
app.use(express.json())
app.use(cors({ credentials: true }))
app.use(morgan('dev'))

app.use('/api', router)

app.listen(port, () => {
  console.log(`Server listen to ${port}`)
})