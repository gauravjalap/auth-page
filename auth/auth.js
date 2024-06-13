const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret =
  "1b15c5770bbfa733f5495b505032ce7af5ef8567265d8febb2b3c70c9c003a12edb5ef";

exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    res.status(400).json({ message: "Password length is less tha 6" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      }).then((user) => {
        // console.log(user);
        const maxAge = 3 * 60 * 60;
        const data = {
          id: user._id,
          username,
          role: user.role,
        };
        const token = jwt.sign(data, jwtSecret, {
          expiresIn: maxAge,
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
      });
    });
  } catch (err) {
    res.status(401).json({
      message: "User not created",
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or password not provided",
    });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found. Please provide right credential!!",
      });
    } else {
      // console.log("password: ", password, "user.password", user.password);
      bcrypt.compare(password, user.password).then((result) => {
        // console.log(result);

        if (result) {
          const maxAge = 3 * 60 * 60; // * 3hrs in sec
          const data = {
            id: user._id,
            username,
            role: user.role,
          };
          const token = jwt.sign(data, jwtSecret, {
            expiresIn: maxAge,
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // * 3hrs in ms
          });
          res.status(200).json({
            message: "Login Successful",
            user: user._id,
          });
        } else {
          res.status(400).json({
            message: "Login not successful",
          });
        }
        // result
        //   ? res.status(200).json({
        //       message: "Login successful",
        //       user,
        //     })
        //   : res.status(400).json({ message: "Login not succesful" });
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  if (id && role) {
    if (role === "admin") {
      await User.findById(id)
        .then(async (user) => {
          if (user.role != "admin") {
            user.role = role;
            try {
              await user.save();
              res.status(201).json({
                message: "Updated Successfully",
                user,
              });
            } catch (err) {
              res.status(400).json({
                message: "Error occured",
                error: err.message,
              });
            }
          } else {
            res.status(400).json({
              message: "User is already an admin!!",
            });
          }
        })
        .catch((err) => {
          res.status(400).json({
            message: "An error occurred",
            error: err.message,
          });
        });
    } else {
      res.status(400).json({
        message: "Role is not admin :)",
      });
    }
  } else {
    res.status(400).json({
      message: "Role or id not present!!",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "No user found with this id",
      });
    }
    await user.deleteOne(); // Use deleteOne() instead of remove()
    res.status(201).json({
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: "An error occurred.",
      error: err.message,
    });
  }
};

// TODO Undertstand this
exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.username;
        container.role = user.role;
        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};
