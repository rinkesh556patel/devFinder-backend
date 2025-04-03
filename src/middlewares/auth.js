const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
   try{
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            return res.status(401).send({message: "Unauthorized access"});
        }
        const decodedObject = jwt.verify(token, process.env.JWT_SECRET);
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
    userAuth
}