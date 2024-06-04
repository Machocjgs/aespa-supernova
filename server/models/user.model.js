const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", 
    {
        user_id : {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: Sequelize.STRING,
            allownull: false,
            unique: {
                args: true,
                msg: 'User name is already in use!'
            }
        },
        email: {
            type: Sequelize.STRING,
            allownull: false,
            unique: {
                args: true,
                msg: 'Email address is already in use!'
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Email address should be properly formatted!'
                },
            }
        },
        password: {
            type: Sequelize.STRING,
            allownull: false
        },
        position: {
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
    {
        freezeTableName: true,
        tableName: 'user',
        timestamps: true,
        createdAt: 'created_dt',
        updatedAt: 'last_modified_dt',
        hooks: {
            beforeCreate: async function(user) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    });

    User.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    }

    User.prototype.generatePassword = async function(newPassword) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(newPassword, salt);
    }

    return User
};