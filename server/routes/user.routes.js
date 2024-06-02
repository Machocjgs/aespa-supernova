const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.find_many);

router.get("/:id", userController.find_one);

router.post("/", userController.insert_one);

router.delete("/:id", userController.delete_one);

router.patch("/:id", userController.update_one);

module.exports = router;