
module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product",
    {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        product_brand: {
            type: Sequelize.STRING,
            allowNull: false
        },
        product_description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        product_price: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        image_link: {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_dt: {
            type: Sequelize.DATE,
            allownull: false
        },
        last_modified_dt: {
            type: Sequelize.DATE,
            allownull: true
        },
    },
    {
        freezeTableName: true,
        tableName: 'product',
        timestamps: true,
        createdAt: "created_dt",
        updatedAt: "last_modified_dt"
    }
    );

    return Product;
}