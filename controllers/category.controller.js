const db = require("../models/index")

const insert_one = (req, res) => {
    const {CategoryLabel, SubCategoryLabel} = req.body
    
    // Validate required CategoryLabel and SubCategoryLabel
    if (!CategoryLabel || !SubCategoryLabel) {
        res.status(400).send({error: "CategoryLabel and SubCategoryLabel are required dummy!"});
    }
    
    const category = {
        CategoryLabel, SubCategoryLabel
    }

    db.Category.create(category).then(
        (data) => { res.send(data)}
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some Error I don't know about lol"
        })
    });
}

const update_one = async (req, res) => {
    const categoryId = req.params.id;

    // Validate id
    if (!id || isNaN(id) || parseInt(id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    const {CategoryLabel, SubCategoryLabel} = req.body;

    // Validate fields to update
    if (!CategoryLabel || !SubCategoryLabel) {
        res.status(400).send({message: "Atleast one of CategoryLabel or SubCategoryLabel is required dummy!"})
    }

    try {
        // Find first target category to update.
        const category = await db.Category.findOne({
            where: {CategoryID:categoryId}}
        );
        // Validate if target id exists
        if (!category) {
            res.status(404).send({message: "Category not found"});
        }

        // Set appropriate category only when provided.
        category_updates = {}
        if (CategoryLabel) category_updates.CategoryLabel = CategoryLabel;
        if (SubCategoryLabel) category_updates.SubCategoryLabel = SubCategoryLabel;

        // Update and save!
        category.set(category_updates);
        save_resp = await category.save();

        res.send(save_resp);

    } catch (error) {
        res.status(500).send({message: err.message || "Some error I don't know lolskrt"});
    }
}

const find_one = (req, res) => {
    console.log("Looking for:");
    // Validate ID
    const categoryId = req.params.id;
    if (!id || isNaN(id) || parseInt(id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    db.Category.findOne(
        { where: {CategoryID:categoryId}}
    ).then(
        (data) => res.send(data)
    ).catch((err) => res.status(500).send({
        message: err.message || "Some error I don't know about lols"
    }));
}

const find_all = (req, res) => {
    const {CategoryID, CategoryLabel, SubCategoryLabel } = req.query;

    // Check and generate filter conditions.
    const condition = {};
    if (CategoryID) condition.CategoryID = CategoryID;
    if (CategoryLabel) condition.CategoryLabel = CategoryLabel;
    if (SubCategoryLabel) condition.SubCategoryLabel = SubCategoryLabel;

    db.Category.findAll({where:condition}).then(
        (data) => res.send(data)
    ).catch((err) => res.status(500).send({
        message: err.message || "Some error I don't know about lols"
    }));
}

const delete_one = (req, res) => {
    const id = req.params.id;

    // Validate id
    if (!id || isNaN(id) || parseInt(id) <= 0){
        res.status(400).send({message: "Invalid ID Parameter"});
    }

    db.Category.destroy({
        where: {CategoryID: id}
    }).then(
        (data) => {
            if(data>0) res.send({message: `Sucessfully delete ${data} records!`})
            else res.status(404).send({message: `No record found with CategoryID: ${id}`})
        }
    ).catch(
        (err) => res.status(500).send({
            message: err.message || "Some error I don't know about lolski!"
        })
    )

}

module.exports = {
    insert_one,
    find_one,
    find_all,
    update_one,
    delete_one
}