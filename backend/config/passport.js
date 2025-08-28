require("dotenv").config(); // <-- PHẢI ở ngay dòng đầu
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// (tuỳ chọn) debug nhanh, chạy xong nhớ xoá:
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    " GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET chưa được load từ .env"
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // KHÔNG được undefined
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            profilePic: profile.photos?.[0]?.value || "",
            password: "",
            role: "GENERAL",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "7d" }
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((obj, done) => done(null, obj));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
