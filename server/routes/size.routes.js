const express = require('express')
const sizeController = require("../controllers/size.controller");
const verifyToken = require("../helpers/verifyToken");
const router = express.Router();


/**
 * Get all categories.
 * Supports filter by providing query parameters.
 *      e.g. /api/category/?CategoryID=1&CategoryLabel=Top
 */
// sizeRoutes.get("/", sizeController.find_all);

/**
 * Get one category based on id only.
 *      e.g. /api/category/2
 */
router.get("/:id", verifyToken, sizeController.find_one);

/**
 * Creates new category item.
 * Request body must contain all required fields.
 */
router.post("/", verifyToken, sizeController.insert_one);

/**
 * Updates a category based on id.
 * Request body must contain all required fields.
 */
// sizeRoutes.patch("/:id", sizeController.update_one);

/**
 * Deletes a category based on id.
 */
// sizeRoutes.delete("/:id", sizeController.delete_one);


module.exports = router