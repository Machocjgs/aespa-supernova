const db = require("../models/index")

const find_one = (req, res) => {
    const size_id = req.params.id;

    if (!size_id || isNaN(size_id) || parseInt(size_id) <= 0){
        res.status(400).send({message: "Invalid size_id!"});
    }

    db.Size.findOne({where: {size_id}}).then(
        (data) => {
            if (!data) res.send({message: "No match found!"})
            else res.send(data)
        }
    ).catch(
        (err) => res.status(500).send({message:err.message})
    );
};

const insert_one = (req, res) => {
    const {size_label, size_description} = req.body
    
    if (!size_label || !size_description) {
        res.status(400).send({error: "size_label and size_description are required!"});
    }

    db.Size.create({size_label, size_description}).then(
        (data) => { res.send(data) }
    ).catch(err => {
        res.status(500).send({
            message: err.message
        })
    });
};

module.exports = {
    find_one,
    insert_one
}