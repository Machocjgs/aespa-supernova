const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/login", userController.log_in);

router.post("/register", userController.register);

module.exports = router