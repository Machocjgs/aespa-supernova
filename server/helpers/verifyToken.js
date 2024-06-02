const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");

const verifyToken = async(req, res, next) => {
    const token = await req.header('token');

    if (!token) {
        return res.status(401).send({message:"Access Denied"});
    }

    try {
        req.user = await jwt.verify(token, jwtConfig.jwttoken);

        next();
    } catch (err) {
        console.error(err);
        res.status(401).send({message: "Invalid Token"});
    }
}

module.exports = verifyToken