const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Проверяем, есть ли пользователь с таким email
          const email = profile.emails[0].value
          let user = await User.findOne({ email })

          if (!user) {
            // Создаём нового пользователя
            user = new User({
              email: email,
              password: 'google_oauth_' + profile.id, // пароль не используется
              credits: 0,
              googleId: profile.id,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value || null
            })
            await user.save()
          }

          return done(null, user)
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )

  // Сериализация пользователя в сессию
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}