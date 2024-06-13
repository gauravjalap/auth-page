const mongoose = require("mongoose");
const localDB = "mongodb://127.0.0.1:27017/auth-page";
const connectDB = async () => {
  await mongoose.connect(localDB);
  console.log("MongoDB connected!!!!");
};

module.exports = connectDB;
