var mongoose = require("mongoose");

module.exports.ConnectMongo = () => {
    mongoose
        .connect(process.env.MONGO_URI || "mongodb://localhost:27017/todolist", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("MongoDB is connected !"))
        .catch((err) => console.log(err));
};