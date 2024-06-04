module.exports = (sequelize, Sequelize) => {
    const Inventory = sequelize.define("inventory", 
    {
        inventory_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        size_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true
        },
        created_dt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        last_modified_dt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        tableName: 'inventory',
        timestamps: true,
        createdAt: 'created_dt',
        updatedAt: 'last_modified_dt',
        indexes: [
            {unique:true, fields: ['product_id', 'size_id'],  uniqueKey: 'unique_product_size_constraint'}
        ],
        validate: {
            isUniqueProductSize() {
                // Only check uniqueness if product_id or size_id is changed
                if (this.changed('product_id') || this.changed('size_id')) {
                    return sequelize.models.inventory.findOne({
                        where: {
                            product_id: this.product_id,
                            size_id: this.size_id
                        }
                    }).then((inventory) => {
                        if (inventory) {
                            throw new Error('The combination of product ID and size ID must be unique.');
                        }
                    });
                }
            }
        }
    });

    return Inventory
};