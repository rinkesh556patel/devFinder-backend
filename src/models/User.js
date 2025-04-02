const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        require: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    emailId: {
        type: String,
        require: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            return validator.isEmail(value);
        }
    },
    password: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        min: 10,
        max: 100
    },
    gender: {
        type: String,
        require: true,
        validate(value) {
            return ["male", "female", "other"].includes(value);
        }
    },
    skills: {
        type: [String],
        default: ["javascript"],
        validate(value) {
            return value.length < 3;
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
