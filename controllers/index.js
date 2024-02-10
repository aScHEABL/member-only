const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const testPassword = require("../utils/passwordStrength").testPassword;
const Account = require("../models/account");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


exports.index_get = asyncHandler(async (req, res, next) => {
    res.render("index", {
        title: "index test",
    })
})

exports.signUp_get = asyncHandler(async (req, res, next) => {
    res.render("sign_up", {
        title: "Sign up page",
    })
})

exports.login_get = asyncHandler(async (req, res, next) => {
    res.render("login", {
        title: "Login page",
    })
})

exports.signUp_post = [
    body("email", "It's not a valid email.")
    .trim()
    .isEmail()
    .escape(),

    body("password", "Your password has to be at least 12 characters long")
    .trim()
    .isLength({ min: 12 })
    .custom((value) => {
        const passwordStrength = testPassword(value);
        return passwordStrength <= 3;
    })
    .withMessage("Your password should contain at least 1 uppercase, 1 lowercase, and 1 numeric character. Minimum 12 characters.")
    .escape(),

    body("repeat_password")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Please make sure your passwords match")
    .escape(),

    body("first_name", "Please enter your first name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    body("last_name", "Please enter your last name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    passport.use(
        new LocalStrategy(async (username, password, done) => {
          try {
            const user = await User.findOne({ username: username });
            if (!user) {
              return done(null, false, { message: "Incorrect username" });
            };
            if (user.password !== password) {
              return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
          } catch(err) {
            return done(err);
          };
        })
      ),
      
      app.use(session({
        secret: process.env.session_secret,
        resave: false,
        saveUninitialized: true
      })),
      app.use(passport.initialize),
      app.use(passport.session()),
      app.use(passport.urlencoded({ extended: false })),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // console.log(errors.array());
            res.render("sign_up", {
                title: "Sign up page",
                errors: errors.array(),
            })
        } else if (errors.isEmpty()) {
            const email = req.body.email;
            const duplicatedEmail = await Account.exists({ email });
            if (duplicatedEmail) {
                console.error("This email has been registered!");
                res.render("sign_up", {
                    title: "Sign up page",
                    errors: [{ msg: "This email has been registered!"}],
                })  
            } else {
                const newAccount = new Account({
                    firstName: req.body.first_name,
                    lastName: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    membershipStatus: "standard",
                })

                await newAccount.save();
                res.redirect("/");
            }
        }
    })
]