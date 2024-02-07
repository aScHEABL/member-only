const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    res.render("index", {
        title: "index test",
    })
})

exports.signUp = asyncHandler(async (req, res, next) => {
    res.render("sign_up", {
        title: "Sign up page",
    })
})

exports.login = asyncHandler(async (req, res, next) => {
    res.render("login", {
        title: "Login page",
    })
})