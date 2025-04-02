const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if (!(["interested", "ignored"].includes(status))) {
            return res.status(400).send("Invalid status selected!");
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).send("User not found");
        }

        const user = await connectionRequest.findOne( {
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId}
            ],
        });
        if (user) {
            return res.status(400).send("Request already sent!");
        }

        const request = new connectionRequest({ fromUserId, toUserId, status });
        await request.save();
        res.send("Request sent successfully");
    }
    catch(e) {
        res.status(400).send("Something went wrong: " + e.message);
    }
});

module.exports = requestRouter;