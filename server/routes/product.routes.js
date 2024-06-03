const express = require('express');
const router = express.Router();

const productcontroller = require('../controllers/product.controller');
const verifyToken = require("../helpers/verifyToken");

router.post("/", productcontroller.insert_one);

module.exports = router;