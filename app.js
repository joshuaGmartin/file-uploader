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
const expressSession = require("express-session");
const { PrismaPg } = require("@prisma/adapter-pg"); // For other db adapters, see Prisma docs
const { PrismaClient } = require("./generated/prisma/client.js");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in ms
    },
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
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
  res.locals.appTitle = "gdocsLite";
  res.locals.isAuth = req.isAuthenticated();
  // in .ejs, check locals.isAuth first to avoid crash on locals.user check
  res.locals.user = req.user;
  next();
});

//debug
// app.use((req, res, next) => {
//   console.log(res.locals);
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
