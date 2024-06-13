const jwt = require("jsonwebtoken");
const jwtSecret =
  "1b15c5770bbfa733f5495b505032ce7af5ef8567265d8febb2b3c70c9c003a12edb5ef";

const adminAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          message: "Not Authorized",
        });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({
            message: "Not Authorized",
          });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "Basic") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
