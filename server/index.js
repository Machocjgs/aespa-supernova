const express = require("express")
const app = express()
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(morgan("dev"));

app.use(cors());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));
// Parse requests of content-type - applicaiton/json
app.use(express.json());

// Tell Node that our routes are found in apiRoutes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// Initialize our database using sequelize as our orm
const db = require("./models")
db.sequelize.sync().then(
    () => console.log("Synced database!")
).catch((err) => console.log("Failed to sync db: ", err.message));

app.listen(PORT, () => console.log("Listening on http://localhost:" + PORT));

module.exports = app;
