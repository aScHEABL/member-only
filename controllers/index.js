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