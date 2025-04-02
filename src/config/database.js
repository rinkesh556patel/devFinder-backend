const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rinkeshpatel:vmXJ0JpjLVPl2v2e@namastenodejs.bxnyn.mongodb.net/?retryWrites=true&w=majority&appName=namastenodejs")
}

module.exports = connectDB;