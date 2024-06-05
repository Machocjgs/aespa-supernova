const db = require("../models/index")

const findOne = async (req, res) => {
    const size_id = req.params.id;

    if (!size_id || isNaN(size_id) || parseInt(size_id) <= 0){
        return res.status(400).send({message: "Invalid size_id!"});
    }

    try {
        const result = await db.Size.findOne({where: {size_id}});
        return res.send(result);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
};

const insertOne = async (req, res) => {
    const {size_label, size_description} = req.body
    
    if (!size_label || !size_description) {
        return res.status(400).send({error: "size_label and size_description are required!"});
    }
    try {
        const response = await db.Size.create({size_label, size_description});
        return res.send(response);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
};

const deleteOne = async (req, res) => {
    const size_id = req.params.id;
    
    if (!size_id || isNaN(size_id) || parseInt(size_id) <= 0){
        return res.status(400).send({message: "Invalid ID Parameter"});
    }
    
    try {
        const data = await db.Size.destroy({where:{size_id}});
        if (data>0) {
            return res.send({message: `Sucessfully deleted ${data} records!`})
        }
        return res.status(404).send({message: `No record found for: ${size_id}`});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
};

const updateOne = async (req,res) => {
    const size_id = req.params.id;
    const {size_label, size_description} = req.body;

    if (!size_id || isNaN(size_id) || parseInt(size_id) <= 0){
        return res.status(400).send({message: "Invalid ID Parameter"});
    }

    if (!size_label  && !size_description) {
        return res.status(400).send({message: "All fields are required!"});
    }

    try {
        const size = await db.Size.findOne({where:{size_id}});

        if (!size) {
            return res.status(404).send({error: "Size not found!"});
        }

        const size_updates = {}
        if (size_label) size_updates.size_label = size_label;
        if (size_description) size_updates.size_description = size_description;

        size.set(size_description);
        save_resp = await size.save();

        return res.send(save_resp);

    } catch (error) {
        return res.status(500).send({error:err.message});
    }
}

const findMany = async (req, res) => {
    const {
        size_label,
        size_description,
        all_search
    } = req.query;
    const condition = {};

    if (all_search) {
        // If all_search is selected, search across all relevant columns including category fields
        condition[db.Sequelize.Op.or] = [
            {size_label: { [db.Sequelize.Op.like]: `%${all_search}%` }},
            {size_description: { [db.Sequelize.Op.like]: `%${all_search}%` }},
        ];
    } else {
        if (size_label) condition.size_label = { [db.Sequelize.Op.like]: `%${size_label}%` };
        if (size_description) condition.size_description = { [db.Sequelize.Op.like]: `%${size_description}%` };
    }

    try {
        const result = await db.Size.findAll({where:condition})
        return res.send(result);
    } catch(err) {
        return res.status(500).send({error: err.message});
    }
};

module.exports = {
    findOne,
    insertOne,
    updateOne,
    deleteOne,
    findMany
}