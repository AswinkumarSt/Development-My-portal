const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/My-portal");

mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(`mongoDB connection error: ${err.message}`);
});

module.exports = mongoose;