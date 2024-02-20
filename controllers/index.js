const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const testPassword = require("../utils/passwordStrength").testPassword;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.index_get = asyncHandler(async (req, res, next) => {
    res.render("index", {
        title: "Home page",
        user: req.user,
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
        user: req.user,
        message: req.flash('error'),
    })
})

exports.log_out_get = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    }) 
})

exports.activation_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.render("error", {
            title: "Error Page",
            error: "You need to log in first!",
        })
    }
    res.render("activation", {
        title: "Activation Page",
    })
})

exports.signUp_post = [
    body("username", "It's not a valid email.")
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


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("sign_up", {
                title: "Sign up page",
                errors: errors.array(),
            })
        } else if (errors.isEmpty()) {
            const username = req.body.username;
            const duplicatedEmail = await User.exists({ username });
            if (duplicatedEmail) {
                console.error("This email has been registered!");
                res.render("sign_up", {
                    title: "Sign up page",
                    errors: [{ msg: "This email has been registered!"}],
                })  
            } else {
                try {
                    // Hash the password
                    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                        if (err) {
                            throw new Error('Error hashing password');
                        } else {
                            // Create a new user object with the hashed password
                            const newUser = new User({
                                firstName: req.body.first_name,
                                lastName: req.body.last_name,
                                username: req.body.username,
                                password: hashedPassword,
                                membershipStatus: "inactive",
                                isAdmin: false,
                            })                            
                            // Save the user to the database
                            await newUser.save();
                            res.redirect("/login");
                        }
                    });
                } catch (err) {
                    return next(err);
                }
            }
        }
    })
]

exports.login_post = [
    body("username", "It's not a valid email.")
    .trim()
    .isEmail()
    .escape(),

    body("password", "Your must enter a password to log-in.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    
    passport.authenticate("local", { 
        failureRedirect: "/login",
        failureFlash: true,
        successRedirect: "/",
    })

]

exports.activation_post = [
    body("password", "Please enter a valid activation code.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const activationCode = req.body.password;

        if (activationCode === process.env.member_code) {
            // Membership activation
            await User.findByIdAndUpdate(req.user.id, { membershipStatus: "active" });
        } else if (activationCode === process.env.admin_code) {
            // Administrator activation
            await User.findByIdAndUpdate(req.user.id, { isAdmin: true, membershipStatus: "active" });
        } else {
            // Invalid activation code
            return res.render("activation", {
                title: "Activation Page",
                errors: [{ msg: "Invalid activation code." }],
            })
        }

        // If not logged in
        if (!req.user) {
            const err = new Error("User not found.");
            err.status = 404;
            throw err;
        }

        res.redirect("/");
    })
]