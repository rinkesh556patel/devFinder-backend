const express = require("express")
const authRouter = express.Router()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

authRouter.post("/signup", async (req, res) => {
    try {
        const { _id, firstName, lastName, emailId, password} = new User(req.body);

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        const token = jwt.sign({
            userId: _id,
        }, "secrettext", { expiresIn: "1h" });
        res.cookie("token", token)

        res.json({ 
            message: "User added successfully", 
            data: savedUser
        });
    }
    catch(e) {
        res.status(400).send(e.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password} = req.body;

        const user = await User.findOne({emailId});
        if (!user) {
            return res.status(404).send("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({
            userId: user._id,
        }, "secrettext", { expiresIn: "1h" });
        res.cookie("token", token)
        res.send(user);
    }
    catch(e) {
        res.status(400).send(e.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expiresIn: new Date(0)});
        res.send("Logout successfull");
    }
    catch(e) {
        res.status(400).send(e.message);
    }
});

module.exports = authRouter;