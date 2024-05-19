const db = require("../models/index")

const find_one = (req, res) => {
    const sizeId = req.params.id;

    if (!sizeId || isNaN(sizeId) || parseInt(sizeId) <= 0){
        res.status(400).send({message: "Invalid SizeID Parameter"});
    }

    db.Size.findOne({
        where: {SizeID:sizeId}
    }).then(
        (data) => res.send(data)
    ).catch(
        (err) => res.status(500).send({
            message:err.message
        })
    )
}

const insert_one = (req, res) => {
    const {SizeLabel, SizeDescription} = req.body
    
    // Validate required SizeLabel and SizeDescription
    if (!SizeLabel || !SizeDescription) {
        res.status(400).send({error: "SizeLabel and SizeDescription are required dummy!"});
    }
    
    const size = {
        SizeLabel, SizeDescription
    }

    db.Size.create(size).then(
        (data) => { res.send(data) }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some Error I don't know about lol"
        })
    });
}



module.exports = {
    find_one,
    insert_one
}