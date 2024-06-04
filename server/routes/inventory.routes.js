const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory.controller');
const verifyToken = require("../helpers/verifyToken");

router.post("/", verifyToken, inventoryController.insertOne);

router.get("/", verifyToken, inventoryController.findMany);

router.patch("/:id", verifyToken, inventoryController.updateOne);

router.delete("/:id", verifyToken, inventoryController.deleteOne);

module.exports = router;