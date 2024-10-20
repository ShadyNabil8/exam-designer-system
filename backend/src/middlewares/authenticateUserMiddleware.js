const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../utils/token");
require("dotenv").config();

const authenticateUserMiddleware = asyncHandler(async function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized, No token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];
  verifyToken(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized, Invalid token" });
    }

    req.user = user; // Attach user data to request object
    next();
  });
});

module.exports = authenticateUserMiddleware;
