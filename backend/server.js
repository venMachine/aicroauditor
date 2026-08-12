require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
require('./config/passport')(passport)

const app = express()

// Session (для Passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 часа
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}))
app.use(express.json())

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB error:', err))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/audit', require('./routes/audit'))
app.use('/api/payment', require('./routes/payment'))
app.use('/webhook', require('./routes/webhook'))

app.listen(process.env.PORT || 5000, () => {
  console.log(` Server running on port ${process.env.PORT || 5000}`)
})