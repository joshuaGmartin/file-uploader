const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validatePassword = require("../lib/passwordUtil").validatePassword;
const user = require("../models/user");

async function verifyCallback(username, password, done) {
  try {
    const userMatch = await user.findByUsername(username);

    if (!userMatch)
      return done(null, false, {
        msg: "Username does not exist",
        path: "username", // make like validator errors, for error handle UX
      });

    const isValid = await validatePassword(password, userMatch.password);
    if (!isValid)
      return done(null, false, {
        msg: "Incorrect password",
        path: "password", // make like validator errors, for error handle UX
      });

    return done(null, userMatch);
  } catch (err) {
    return done(err);
  }
}

const strategy = new LocalStrategy(verifyCallback);

//init
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userID, done) => {
  try {
    const userMatch = await user.findByUserID(userID);

    done(null, userMatch);
  } catch (err) {
    done(err);
  }
});
