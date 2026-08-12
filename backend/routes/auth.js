const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// ===== РЕГИСТРАЦИЯ (EMAIL/PASSWORD) =====
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashed })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, email: user.email, credits: user.credits } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== ЛОГИН (EMAIL/PASSWORD) =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, email: user.email, credits: user.credits } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== GOOGLE AUTH =====
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}))

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: true 
  }),
  (req, res) => {
    // Успешная авторизация — редирект на фронтенд с токеном
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  }
)

// ===== ПРОВЕРКА GOOGLE АВТОРИЗАЦИИ =====
router.get('/google/status', (req, res) => {
  if (req.user) {
    res.json({ 
      authenticated: true, 
      user: { 
        id: req.user._id, 
        email: req.user.email, 
        credits: req.user.credits,
        name: req.user.name,
        avatar: req.user.avatar
      } 
    })
  } else {
    res.json({ authenticated: false })
  }
})

// ===== ПОЛУЧИТЬ ПРОФИЛЬ =====
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router