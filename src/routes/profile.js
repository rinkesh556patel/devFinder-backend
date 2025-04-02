const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const { validateUserData } = require("../utils/validation");

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const updates = Object.keys(req.body);
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.json({
            message: `${user.firstName}, your profile updated successfuly`,
            data: user,
        });
    }
    catch(e) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send("Password changes successfully")
    }
    catch(e) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.get("/profile/view", userAuth ,async (req, res) => {
    try {
        const user = req.user;
        if (user.length === 0) {
            return res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
    }
    catch(e) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User deleted successfully");
    }
    catch(e) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.patch("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndUpdate(userId, req.body, {runValidators: true});
        if (!user) {
            return res.status(404).send("User not found");
        }   
        else {
            res.send("User updated successfully");
        }
    }
    catch(e) {
        res.status(400).send("Something went wrong");
    }
});

module.exports = profileRouter;