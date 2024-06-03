const express = require('express');
const router = express.Router();

const productcontroller = require('../controllers/product.controller');
const verifyToken = require("../helpers/verifyToken");

router.post("/", verifyToken, productcontroller.insert_one);

module.exports = router;