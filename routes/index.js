const express = require("express");
const router = express.Router();

const indexController = require("../controllers/index");

router.get("/", indexController.index_get);

router.get("/sign-up", indexController.signUp_get);

router.get("/login", indexController.login_get);

router.get("/log-out", indexController.log_out_get);

router.get("/activation", indexController.activation_get);

router.get("/message", indexController.message_get);

router.post("/sign-up", indexController.signUp_post);

router.post("/login", indexController.login_post);

router.post("/activation", indexController.activation_post);

router.post("/message", indexController.message_post);

router.post("/delete-message/:messageIndex", indexController.delete_message_post);

module.exports = router;