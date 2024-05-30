const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const sizeController = require("../controllers/size.controller");
const userController = require("../controllers/user.controller");

/** Category Routes */

/**
 * Get all categories.
 * Supports filter by providing query parameters.
 *      e.g. /api/category/?CategoryID=1&CategoryLabel=Top
 */
router.get("/category/", categoryController.find_all);

/**
 * Get one category based on id only.
 *      e.g. /api/category/2
 */
router.get("/category/:id", categoryController.find_one);

/**
 * Creates new category item.
 * Request body must contain all required fields.
 */
router.post("/category/", categoryController.insert_one);

/**
 * Updates a category based on id.
 * Request body must contain all required fields.
 */
router.patch("/category/:id", categoryController.update_one);

/**
 * Deletes a category based on id.
 */
router.delete("/category/:id", categoryController.delete_one);

/**
 * Get one size based on id only.
 */
router.get("/size/:id", sizeController.find_one);

router.post("/size/", sizeController.insert_one);


/**
 * User registration!
 */

router.post("/user/register", userController.insert_one);

router.post("/user/login", userController.log_in);


module.exports = router;
