const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { register, login, update, deleteUser, getUsers } = require("./auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getUsers").get(getUsers);
router.route("/update").put(adminAuth, update);
router.route("/deleteUser").delete(adminAuth, deleteUser);
module.exports = {
  router,
};
