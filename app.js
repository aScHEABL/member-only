require('dotenv').config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.mongoDB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const indexRouter = require('./routes/index');

const Account = require("./models/account");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const account = await Account.findOne({ email });
      if (!account) {
        return done(null, false, { message: "Incorrect email" });
      };
      if (account.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port} !`);
});