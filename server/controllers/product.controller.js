const path = require('path');
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


module.exports = {
    insert_one,
    find_many
}