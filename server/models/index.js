const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        dialectOptions: {
            project: dbConfig.PROJECT,
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.Category = require("./category.model.js")(sequelize, Sequelize);
db.Size = require("./size.model.js")(sequelize, Sequelize);
db.Product = require("./product.model.js")(sequelize, Sequelize);

db.Category.hasMany(db.Product, {
    foreignKey: 'category_id',
    as: 'products'
});

db.Product.belongsTo(db.Category, {
    foreignKey: 'category_id',
    as: 'category'
});


module.exports = db;