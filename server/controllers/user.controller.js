const db = require("../models/index");

const find_one = (req, res) => {
    const user_id = req.params.id;

    if (!user_id || isNaN(user_id) || parseInt(user_id) <= 0){
        res.status(400).send({message: "Invalid ID!"});
    }

    db.User.findOne({
        where: {user_id},
        attributes: {
            exclude: ['password']
        }
    }).then(
        (data) => res.send(data)
    ).catch((err) => {
        res.status(500).send({error:err.message});
    });
}

const update_one = async (req,res) => {
    const user_id = req.params.id;

    if (!user_id || isNaN(user_id) || parseInt(user_id) <= 0){
        res.status(400).send({message: "Invalid ID!"});
    }

    const {user_name, email, position, tier_access} = req.body;

    const user_updates = {}
    if (user_name) user_updates.user_name = user_name;
    if (email) user_updates.email = email;
    if (position) user_updates.position = position;
    if (tier_access) user_updates.tier_access = tier_access;

    try {
        const user = await db.User.findOne({
            where:{user_id}
        });

        user.set(user_updates);
        save_resp = await user.save();

        const user_copy = user.toJSON();
        delete user_copy.password
        
        res.send({message: "Successfully updated!", user:user_copy});
    } catch(error) {
        res.status(500).send({error: error.message});
    }
}

const find_many = (req, res) => {
    const { search } = req.query;

    const conditions = search ? {
        [db.Sequelize.Op.or]: [
            { user_name: { [db.Sequelize.Op.like]: `%${search}%` } },
            { email: { [db.Sequelize.Op.like]: `%${search}%` } },
            { position: { [db.Sequelize.Op.like]: `%${search}%` } },
        ]
    } : {};

    db.User.findAll({
        where: conditions,
        order: [['created_dt', 'ASC']],
        attributes: {
            exclude: ['password']
        }
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ error: err.message }));
};


const insert_one = (req,res) => {
    const {user_name, password, email, position, tier_access} = req.body

    // Validate input parameters making sure they all have values
    if (!user_name || !password || !email || !position || !tier_access) {
        res.status(400).send({error: "All fields are required!"});
    }

    db.User.create({user_name, password, email, position, tier_access}).then(
        (_) => res.send({message:"User successfully created!"})
    ).catch(
        (err) => res.status(500).send({error:err.message})
    )
}

const delete_one = (req,res) => {
    const user_id = req.params.id;

    if (!user_id || isNaN(user_id) || parseInt(user_id) <= 0){
        res.status(400).send({message: "Invalid ID!"});
    }

    db.User.destroy(
        {where: {user_id}}
    ).then(
        (data) => {
            if (data>0) res.send({message: "User successfully deleted!"});
            else res.status(404).send({message: `No user found with id: ${user_id}`});
        }
    ).catch(
        (err) => res.status(500).send({message:err.message})
    );
}

module.exports = {
    find_one,
    find_many,
    insert_one,
    delete_one,
    update_one
}