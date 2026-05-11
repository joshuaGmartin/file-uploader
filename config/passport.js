const passport = require("passport");

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
