const express = require("express");
const port = 3001;
const cors = require("cors");
const bodyParser = require("body-parser");

const { corstAllowAll } = require("./configs/corsConfig");
const { ConnectMongo } = require("./configs/mongoConfig");

const app = express();

app.use(cors(corstAllowAll));
app.options("*", cors());
app.use(bodyParser.json());

app.get("/test", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

app.listen(port, () => {
    console.log(` Node app listening on port ${port}`);
    ConnectMongo();
});