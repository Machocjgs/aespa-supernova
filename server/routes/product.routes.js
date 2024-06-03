const express = require('express');
const router = express.Router();

const productcontroller = require('../controllers/product.controller');
const verifyToken = require("../helpers/verifyToken");

router.post("/", verifyToken, productcontroller.insert_one);

router.get("/", verifyToken, productcontroller.find_many);

module.exports = router;