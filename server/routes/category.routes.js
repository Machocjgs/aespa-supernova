const express = require('express')
const categoryController = require("../controllers/category.controller");
const router = express.Router();


/**
 * Get all categories.
 * Supports filter by providing query parameters.
 *      e.g. /api/category/?CategoryID=1&CategoryLabel=Top
 */
router.get("/", categoryController.find_all);

/**
 * Get one category based on id only.
 *      e.g. /api/category/2
 */
router.get("/:id", categoryController.find_one);

/**
 * Creates new category item.
 * Request body must contain all required fields.
 */
router.post("/", categoryController.insert_one);

/**
 * Updates a category based on id.
 * Request body must contain all required fields.
 */
router.patch("/:id", categoryController.update_one);

/**
 * Deletes a category based on id.
 */
router.delete("/:id", categoryController.delete_one);


module.exports = router