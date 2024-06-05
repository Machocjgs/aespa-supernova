const db = require("../models/index")
const config = require("../config/jwt.config")
const jwt = require("jsonwebtoken");

const login = (req,res) => {
    const {user_name, password} = req.body;

    // Validate if user_name and password has values
    if (!user_name || !password) {
        res.status(500).send({error: "All fields required!"});
    }

    // Looking for the user_name
    db.User.findOne({ where: {user_name} }).then(async (user) => {
        if (!user) {
            res.status(404).send({error: "Invalid User name or Password"});
        } else if (!await user.validPassword(password)) {
            res.status(404).send({error: "Invalid User name or Password"});
        } else {
            // Removing the password here
            const {password:_, ...jwt_token} = user; 

            const token = jwt.sign(jwt_token, config.jwttoken, {expiresIn: '7d'});
            
            const user_copy = user.toJSON();
            delete user_copy.password;
            res.header('token', token).send({message: "Login successful!", accessToken: token, user:user_copy});
        }
    });
};

const change_password = async (req,res)=> {
    const { user_name, new_password, old_password } = req.body;

    if (!user_name || !new_password || !old_password) {
        res.status(500).send({error: "All fields required!"});
    }
    
    try {
        user = await db.User.findOne({where: {user_name}})
        if (!user) {
            res.status(500).send({error: "User not found!"});
        } else if (! await user.validPassword(old_password)) {
            res.status(500).send({error: "Invalid old password!"});
        } else {
            if (await user.validPassword(new_password)) {
                res.status(500).send({error: "Cannot use previous password!"});
            } else {
                user.set({password: await user.generatePassword(new_password)});
                await user.save();
                res.send({message: "Password changed successfully!"});
            }
        }
    } catch (err) {
        res.status(500).send({error: err.message});
    }
    
}


module.exports = {
    login,
    change_password
}