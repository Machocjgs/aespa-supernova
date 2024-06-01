const db = require("../models/index")
const config = require("../config/jwt.config")
const jwt = require("jsonwebtoken");

const log_in = (req,res) => {
    const {UserName, Password} = req.body;

    if (!UserName || !Password) {
        res.status(500).send({error: "Missing UserName or Password!"});
    }

    db.User.findOne({ where: {UserName} }).then(async (user) => {
        if (!user) {
            res.status(404).send({error: "Invalid User or Password"});
        } else if (!user.validPassword(Password)) {
            res.status(404).send({error: "Invalid User or Password"});
        } else {
            // Generate JWT here

            const {Password:_, ...jwt_payload} = user;

            const token = jwt.sign(jwt_payload, config.jwttoken, {expiresIn: '3h'});
            res.header('token', token).send({message: "Login successful!"});
        }
    })

};

const register = (req,res) => {
    const {UserName, Password, Email, Position, TierAccess} = req.body

    // Validate input parameters
    if (!UserName || !Password || !Email || !Position || !TierAccess) {
        res.status(400).send({error: "All fields must contain value!"});
    }

    const user = {UserName, Password, Email, Position, TierAccess};

    db.User.create(user).then(
        (data) => res.send({message:"User successfully created"})
    ).catch(
        (err) => res.status(500).send({error:err.message})
    )
};

module.exports = {
    log_in,
    register
}