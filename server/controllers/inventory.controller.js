const db = require("../models/index");


const insertOne = async(req,res) => {
    const {
        product_id,
        size_id,
        quantity,
        status,
    } = req.body

    if (!product_id || !size_id || !quantity || !status){
        return res.send(400).error({error: "All fields required!"});
    }

    try {
        const response = await db.Inventory.create({product_id, size_id, quantity, status});
        return res.send(response);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const findMany = async(req,res) => {
    const {
        product_name,
        product_brand,
        size_label,
        status,
        all_search
    } = req.body;

    const productCondition = {};
    const sizeCondition = {};
    const statusCondition = {};

    if (all_search) {
        productCondition[db.Sequelize.Op.or] = [
            { product_name: { [db.Sequelize.Op.like]: `%${all_search}%` } },
            { product_brand: { [db.Sequelize.Op.like]: `%${all_search}%` } }
        ];
        sizeCondition[db.Sequelize.Op.or] = [
            {size_label: { [db.Sequelize.Op.like]: `%${all_search}%` } },
        ]
        statusCondition[db.Sequelize.Op.or] = [
            {status: { [db.Sequelize.Op.like]: `%${all_search}%` } },
        ]
        
    } else {
        if(product_name) productCondition.product_name = product_name;
        if(product_brand) productCondition.product_brand = product_brand;

        if(size_label) sizeCondition.size_label = size_label;
        if(status) statusCondition = status;
    }

    try {
        const result = await db.Inventory.findAll({
            where: statusCondition,
            include: [
                {model: db.Size, as: 'size', attributes:[], where:sizeCondition},
                {model: db.Product, as: 'product', attributes:[], where:productCondition, include: [{model: db.Category, as: 'category', attributes:[]}]},
            ],
            attributes: {
                include: [
                    [db.Sequelize.col('size.size_label'), 'size_label'],
                    [db.Sequelize.col('product.product_name'), 'product_name'],
                    [db.Sequelize.col('product.product_brand'), 'product_brand'],
                    [db.Sequelize.col('product.category.category_label'), 'category_label'],
                    [db.Sequelize.col('product.category.subcategory_label'), 'subcategory_label'],
                ]
            }
        })
        return res.send(result);
    } catch (error) {
        return res.status(500).send({error: error.message});        
    }
};

const updateOne = async(req,res) => {
    const inventory_id = req.params.id;
    const {status, quantity} = req.body;

    if (!inventory_id || isNaN(inventory_id) || parseInt(inventory_id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    try {
        const inventory = await db.Inventory.findOne({where:{inventory_id}});

        if (!inventory) {
            return res.status(400).send({error: "No record found!"});
        }

        const inventory_update = {}
        if(status) inventory_update.status = status;
        if(quantity) inventory_update.quantity = quantity;

        inventory.set(inventory_update);

        save_resp = await inventory.save();

        return res.send(save_resp);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};

const deleteOne = async(req,res) => {
    const inventory_id = req.params.id;

    if (!inventory_id || isNaN(inventory_id) || parseInt(inventory_id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    try {
        const data = await db.Inventory.destroy({where:{inventory_id}});
        if(data>0) res.send({message: `Sucessfully deleted ${data} records!`})
        else res.status(404).send({message: `No record found for: ${inventory_id}`})
    } catch (error) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = {
    insertOne,
    findMany,
    deleteOne,
    updateOne,
}