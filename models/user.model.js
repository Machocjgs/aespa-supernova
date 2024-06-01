const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", 
    {
        UserID : {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserName: {
            type: Sequelize.STRING,
            primaryKey: true,
            allownull: false
        },
        Email: {
            type: Sequelize.STRING,
            primaryKey: true,
            allownull: false
        },
        Password: {
            type: Sequelize.STRING,
            allownull: false
        },
        Position: {
            type: Sequelize.STRING,
            allownull: false
        },
        TierAccess: {
            type: Sequelize.INTEGER,
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
    {
        freezeTableName: true,
        tableName: 'user',
        timestamps: true,
        createdAt: 'CreatedDt',
        updatedAt: 'LastModifiedDt',
        hookes: {
            beforeCreate: async function(user) {
                const salt = await bcrypt.genSalt(10);
                user.Password = await bcrypt.hash(user.Password, salt);
            }
        }
    });

    User.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.Password);
    }

    return User
};