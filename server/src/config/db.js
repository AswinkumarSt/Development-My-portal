const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/My-portal");

mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB");
});
mongoose.connection.on("error", () => {
  console.log(`mongoDB connection error : ${error}`);
});

module.exports = mongoose;
