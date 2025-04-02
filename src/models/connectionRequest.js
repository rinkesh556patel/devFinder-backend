const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "accepted", "ignored", "rejected"],
            message: "Invalid status selected!"
        },
        required: true
    }
}, {
    timestamps: true
});

ConnectionRequestSchema.pre("save", function(next) {
    if (this.fromUserId.toString() === this.toUserId.toString()) {
        return next(new Error("You cannot send a connection request to yourself!"));
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);