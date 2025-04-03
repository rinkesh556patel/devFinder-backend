require("dotenv").config()
const express = require("express");
const connectDB = require("./config/database");
var cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/user"));

connectDB()
.then(() => {
    console.log("Database connected successfully");

    app.listen(process.env.PORT, () => {
        console.log("Server started successfully...");
    });
}).catch((e) => {
    console.log(e);
});
