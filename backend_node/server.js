const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

const { corstAllowAll } = require("./configs/corsConfig");
const { ConnectMongo } = require("./configs/mongoConfig");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
ConnectMongo();

const app = express();

app.use(cors(corstAllowAll));
app.options("*", cors());
app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(` Node app listening on port ${PORT}`);
});