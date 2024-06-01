const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs");

/**
 * Dynamically generate routes based on *.router.js
 */
const routePath = __dirname + "\\"
fs.readdirSync(routePath).forEach((file) => {
    if (file.endsWith(".routes.js")) {
        const routerModule = require(path.join(routePath, file));
        
        router.use("/" + file.replace(".routes.js", ""), routerModule)
    }
});

module.exports = router;
