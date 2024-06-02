module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        category_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_label: {
            type: Sequelize.STRING,
            allownull: false
        },
        subcategory_label: {
            type: Sequelize.STRING,
            allownull: false
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
        tableName: 'category',
        timestamps: true,
        createdAt: "created_dt",
        updatedAt: "last_modified_dt"
    }
    );

    return Category;
}