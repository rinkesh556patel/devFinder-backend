const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("Test API called...");
});

app.use("/hello", (req, res) => {
    res.send("Hello API called...");
});


app.listen(7777, () => {
    console.log("Server started successfully...");
});


