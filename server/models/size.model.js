module.exports = (sequelize, Sequelize) => {
    const Size = sequelize.define("size", 
    // Table fields and chu chu here
    {
        size_id : {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        size_label: {
            type: Sequelize.STRING,
            allownull: false
        },
        size_description: {
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
        }
    },
    // DB Settings from here
    {
        freezeTableName: true,
        tableName: 'size',
        timestamps: true,
        createdAt: 'created_dt',
        updatedAt: 'last_modified_dt'

    });

    return Size
};