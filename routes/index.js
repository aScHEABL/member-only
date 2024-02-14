const express = require("express");
const router = express.Router();

const indexController = require("../controllers/index");

router.get("/", indexController.index_get);

router.get("/sign-up", indexController.signUp_get);

router.get("/login", indexController.login_get);

router.post("/sign-up", indexController.signUp_post);

router.post("/login", indexController.login_post);

module.exports = router;