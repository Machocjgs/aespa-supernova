module.exports = (sequelize, Sequelize) => {
    const Size = sequelize.define("size", 
    // Table fields and chu chu here
    {
        SizeID : {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SizeLabel: {
            type: Sequelize.STRING,
            allownull: false
        },
        SizeDescription: {
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
        }
    },
    // DB Settings from here
    {
        freezeTableName: true,
        tableName: 'size',
        timestamps: true,
        createdAt: 'CreatedDt',
        updatedAt: 'LastModifiedDt'

    });

    return Size
};