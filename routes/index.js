const express = require("express");
const router = express.Router();

const indexController = require("../controllers/index");

router.get("/", indexController.index);

router.get("/sign-up", indexController.signUp);

router.get("/login", indexController.login);

module.exports = router;