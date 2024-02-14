const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const testPassword = require("../utils/passwordStrength").testPassword;
const Account = require("../models/account");
const bcrypt = require("bcryptjs");


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
                try {
                    // Hash the password
                    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                        if (err) {
                            throw new Error('Error hashing password');
                        } else {
                            // Create a new user object with the hashed password
                            const newAccount = new Account({
                                firstName: req.body.first_name,
                                lastName: req.body.last_name,
                                email: req.body.email,
                                password: hashedPassword,
                                membershipStatus: "standard",
                            })                            
                            // Save the user to the database
                            await newAccount.save();
                            res.redirect("/");
                        }
                    });
                } catch (err) {
                    return next(err);
                }
            }
        }
    })
]