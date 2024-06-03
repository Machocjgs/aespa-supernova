const express = require('express');
const router = express.Router();

const productcontroller = require('../controllers/product.controller');
const verifyToken = require("../helpers/verifyToken");

router.post("/", verifyToken, productcontroller.insert_one);

router.get("/", verifyToken, productcontroller.find_many);

router.patch("/:id", verifyToken, productcontroller.update_one);

router.delete("/:id", verifyToken, productcontroller.delete_one);

module.exports = router;