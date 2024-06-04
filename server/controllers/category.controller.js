const db = require("../models/index")

const insert_one = (req, res) => {
    const {category_label, subcategory_label} = req.body
    
    if (!category_label || !subcategory_label) {
        res.status(400).send({error: "CategoryLabel and SubCategoryLabel are required dummy!"});
    }
    
    db.Category.create({category_label, subcategory_label}).then(
        (data) => { res.send(data) }
    ).catch(err => {
        res.status(500).send({
            message: err.message
        })
    });
}

const update_one = async (req, res) => {
    const category_id = req.params.id;
    const {category_label, subcategory_label} = req.body;

    if (!category_id || isNaN(category_id) || parseInt(category_id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    if (!category_label  && !subcategory_label) {
        res.status(400).send({message: "Atleast one of CategoryLabel or SubCategoryLabel is required dummy!"})
    }

    try {
        const category = await db.Category.findOne({
            where: {category_id}}
        );

        if (!category) {
            res.status(404).send({message: "Category not found"});
        }

        category_updates = {}
        if (category_label) category_updates.category_label = category_label;
        if (subcategory_label) category_updates.subcategory_label = subcategory_label;

        category.set(category_updates);
        save_resp = await category.save();

        res.send(save_resp);
    } catch (error) {
        res.status(500).send({message: error.message || "Some error I don't know lolskrt"});
    }
}

const find_one = (req, res) => {
    const category_id = req.params.id;

    if (!category_id || isNaN(category_id) || parseInt(category_id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    db.Category.findOne({ where: {category_id}}).then(
        (data) => res.send(data)
    ).catch((err) => res.status(500).send({
        message: err.message
    }));
}

const find_all = (req, res) => {
    const {category_id, category_label, subcategory_label, all_search } = req.query;

    // If no query is passed, condition will be something like "SELECT * FROM ..."
    const condition = {};

    if (all_search) {
        // If all_search is selected, search across all relevant columns including category fields
        condition[db.Sequelize.Op.or] = [
            { category_label: { [db.Sequelize.Op.like]: `%${all_search}%` } },
            { subcategory_label: { [db.Sequelize.Op.like]: `%${all_search}%` } },
        ];
    } else {
        if (category_id) condition.category_id = { [db.Sequelize.Op.like]: `%${category_id}%` };
        if (category_label) condition.category_label = { [db.Sequelize.Op.like]: `%${category_label}%` };
        if (subcategory_label) condition.subcategory_label = { [db.Sequelize.Op.like]: `%${subcategory_label}%` };
    }

    db.Category.findAll({where:condition}).then(
        (data) => res.send(data)
    ).catch((err) => res.status(500).send({
        message: err.message
    }));
}

const delete_one = (req, res) => {
    const category_id = req.params.id;

    if (!category_id || isNaN(category_id) || parseInt(category_id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    db.Category.destroy({
        where: {category_id}
    }).then(
        (data) => {
            if(data>0) res.send({message: `Sucessfully deleted ${data} records!`})
            else res.status(404).send({message: `No record found for: ${category_id}`})
        }
    ).catch(
        (err) => res.status(500).send({
            message: err.message
        })
    );
}

module.exports = {
    insert_one,
    find_one,
    find_all,
    update_one,
    delete_one
}