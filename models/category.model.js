module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        CategoryID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CategoryLabel: {
            type: Sequelize.STRING,
            allownull: false
        },
        SubCategoryLabel: {
            type: Sequelize.STRING,
            allownull: false
        },
        CreatedDt: {
            type: Sequelize.DATE,
            allownull: false
        },
        LastModifiedDt: {
            type: Sequelize.DATE,
            allownull: true
        },
    },
    {
        freezeTableName: true,
        tableName: 'category',
        timestamps: true,
        createdAt: "CreatedDt",
        updatedAt: "LastModifiedDt"
    }
    );

    return Category;
}