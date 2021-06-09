const express = require("express");

const app = express();
app.use(express.static("."));

const server = app.listen(3000, function () {
    console.log("Server listen on port ", 3000);
});
