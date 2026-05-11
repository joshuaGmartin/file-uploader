const express = require("express");
require("dotenv").config();

// ==========================================================================
// app
// ==========================================================================
const path = require("node:path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ==========================================================================
// session
// ==========================================================================
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("./config/database");

const sessionStore = new pgSession({ pool: pgPool });

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

// ==========================================================================
// authentication
// ==========================================================================
const passport = require("passport");
require("./config/passport");
app.use(passport.session());

// ==========================================================================
// variables/middleware
// ==========================================================================
//globals
app.use((req, res, next) => {
  res.locals.appTitle = "appTitleGoesHere";
  res.locals.isAuth = req.isAuthenticated();
  // in .ejs, check locals.isAuth first to avoid crash on locals.user check
  res.locals.user = req.user;
  next();
});

// //debug
// app.use((req, res, next) => {
//   console.log(res.locals.user);
//   next();
// });

// ==========================================================================
// routes
// ==========================================================================
const routes = require("./routes");

app.use(routes);

// ==========================================================================
// 404/errors
// ==========================================================================
app.use((req, res) => res.send("404: Page not found"));

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

// ==========================================================================
// server
// ==========================================================================
const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log("Listening on port: ", PORT);
});

// ==========================================================================
// testing
// ==========================================================================
