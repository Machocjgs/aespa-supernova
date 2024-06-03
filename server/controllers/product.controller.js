const path = require('path');
const fs = require('fs');
const db = require("../models/index");
const {upload} = require("../helpers/image.handler");

const generateImageLink = (req, filename) => {
    const host = req.get('host');
    const protocol = req.protocol;
    return `${protocol}://${host}/images/${filename}`;
}

const insert_one = async (req, res) => {
    upload.single('image')(req, res, async function(err) {
        if (err){
            return res.status(400).send({error: err.message});
        }
        const {
            category_id,
            product_name,
            product_brand,
            product_description,
            product_price
        } = req.body;
    
        if (!category_id || !product_name || !product_brand || !product_description || !product_price) {
            res.status(500).send({error: "All fields required!"});
        }

        try {
    
            const new_product = {
                category_id,
                product_name,
                product_brand,
                product_description,
                product_price,
                image_link: generateImageLink(req, req.file.filename)
            };
    
            console.log(new_product);
    
            db.Product.create(new_product).then(
                (data) => res.send(data)
            ).catch(
                (err) => res.status(500).send({message: err.message})
            )

        } catch(err) {
            res.status(500).send({error: err.message});
        }

    });
}

const update_one = (req,res) => {
    upload.single('image')(req, res, async function(err) {
        if (err){
            return res.status(400).send({error: err.message});
        }

        const product_id = req.params.id;

        if (!product_id || isNaN(product_id) || parseInt(product_id) <= 0){
            res.status(400).send({message: "Invalid ID!"});
        }

        const {
            category_id,
            product_name,
            product_brand,
            product_description,
            product_price,
        } = req.body;

        const product_updates = {}
        if (category_id) product_updates.category_id = category_id;
        if (product_name) product_updates.product_name = product_name;
        if (product_brand) product_updates.product_brand = product_brand;
        if (product_description) product_updates.product_description = product_description;
        if (product_price) product_updates.product_price = product_price;

        if (req.file) {
            product_updates.image_link = generateImageLink(req, req.file.filename);
        }

        try {
            const product = await db.Product.findOne({where: {product_id}});
            if (!product) {
                res.status(404).send({error: "Product not found!"});
            }

            product.set(product_updates);
            save_resp = await product.save();

            res.send(save_resp);
        } catch(err) {
            res.status(500).send({error: err.message});
        }
    });
}

const find_many = (req,res) => {
    const {
        product_name,
        product_brand,
        product_description,
        category_label,
        subcategory_label
    } = req.query;

    const productCondition = {};
    if(product_name) productCondition.product_name = product_name
    if(product_brand) productCondition.product_brand = product_brand
    if(product_description) productCondition.product_description = product_description

    const categoryCondition = {};
    if(category_label) categoryCondition.category_label = category_label
    if(subcategory_label) categoryCondition.subcategory_label = subcategory_label

    db.Product.findAll({
        where: productCondition,
        include: [{
            model: db.Category,
            as: 'category',
            attributes: [],
            where: categoryCondition
        }],
        attributes: {
            include: [
                [db.Sequelize.col('category.category_label'), 'category_label'],
                [db.Sequelize.col('category.subcategory_label'), 'subcategory_label']
            ]
        },
    }).then(
        (data) => res.send(data)
    ).catch(
        (err) => res.status(500).send({error: err.message})
    );

}

const delete_one = async (req, res) => {
    const product_id = req.params.id;

    if (!product_id || isNaN(product_id) || parseInt(product_id) <= 0) {
        return res.status(400).send({ message: "Invalid ID!" });
    }

    try {
        const product = await db.Product.findOne({ where: { product_id } });

        if (!product) {
            return res.status(404).send({ message: `No record found for: ${product_id}` });
        }

        const image_name = product.image_link.split('/').pop();
        const image_path = path.join(__dirname, 'images', image_name);

        const deletedCount = await db.Product.destroy({ where: { product_id } });

        if (deletedCount > 0) {
            fs.unlink(image_path, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`${image_name} successfully deleted!`);
                }
            });
            return res.send({ message: `Successfully deleted ${deletedCount} records!` });
        } else {
            return res.status(404).send({ message: `No record found for: ${product_id}` });
        }
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};

module.exports = {
    insert_one,
    find_many,
    update_one,
    delete_one
}