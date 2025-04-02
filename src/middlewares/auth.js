const User = require("../models/User");
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    const token = "abcd"
    if (token === "abcd") {
        next();
    } else {
        res.status(401).send({message: "Unauthorized access"});
    }
}

const userAuth = async (req, res, next) => {
   try{
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        const decodedObject = jwt.verify(token, "secrettext");
        const { userId } = decodedObject;
        const user = await User.findOne({ _id: userId });
        if (user.length === 0) {
            return res.status(404).send({message: "User not found"});
        }
        else {
            req.user = user;
            next();
        }
    }
    catch(e){
        res.status(400).send({message: "Unauthorized access"});
    }
}

module.exports = {
    adminAuth,
    userAuth
}