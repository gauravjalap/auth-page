const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middlewares/auth");
const { router } = require("./auth/route");
const connectDB = require("./db");

connectDB();

const app = express();
const port = 5000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", router);

app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));
app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
/*
// app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
// app.get("/basic", userAuth, (req, res) => res.send("User Route"));
*/

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});

// error handling
process.on("unhandledRejection", (err) => {
  console.log(`An error occured : ${err.message}`);
  server.close(() => process.exit(1));
});
