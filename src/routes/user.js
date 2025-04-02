const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const connectionRequest = require("../models/connectionRequest");
const USER_DATA = "firstName lastName age gender skills photoUrl";

userRouter.post("/request/review/:status/:userId", userAuth, async (req, res) => {
    try { 
        const user = req.user;

        const requestId = req.params.userId;
        const status = req.params.status;

        if (!(["accepted", "rejected"].includes(status))) {
            return res.status(400).send("Invalid status selected!");
        }

        const connectionRequests = await connectionRequest.findOne({
            _id: requestId,
            toUserId: user._id,
            status: "interested"
        });

        if (!connectionRequests) {
            return res.status(404).send("Connection request not found");
        }

        connectionRequests.status = status;

        const data = await connectionRequests.save();
        res.send("Request reviewed successfully");
    }
    catch(e) {
        res.status(400).send("Something went wrong: " + e.message);
    }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const requests = await connectionRequest
            .find({ toUserId: user._id, status: "interested" })
            .populate("fromUserId", USER_DATA);  

        res.send(requests);
    }
    catch(e) {
        res.status(400).send("Something went wrong: " + e.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const user = req.user;

        const connections = await connectionRequest
            .find({
                $or: [
                    { fromUserId: user._id, status: "accepted" },
                    { toUserId: user._id, status: "accepted" }
                ]
            })
            .populate("fromUserId", USER_DATA)
            .populate("toUserId", USER_DATA);

        const data = connections.map(connection => {
            if (connection.fromUserId._id.toString() === user._id.toString()) {
                return connection.toUserId;
            }
            else {
                return connection.fromUserId;
            }
        });

        res.json({ data })
    }
    catch(e) {
        res.status(400).send("Something went wrong: " + e.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await connectionRequest.find({ 
            $or: [
                { toUserId: user._id },
                { fromUserId: user._id },
            ]
        }).select("fromUserId toUserId");

        let hideUsersFromFeed = new Set([user._id.toString()]);

        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        
        let users = await User.find(
            { _id: { $nin: Array.from(hideUsersFromFeed) } }
        ).select(USER_DATA).limit(limit).skip(skip);
        res.json({ data: users });
    }
    catch(e) {
        res.status(400).send("Something went wrong: " + e.message);
    }
});

module.exports = userRouter;