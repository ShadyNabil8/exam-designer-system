const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../utils/token");
const { CustomError } = require("./errorHandlerMiddleware");
require("dotenv").config();

const authenticateUserMiddleware = asyncHandler(async function (
  req,
  res,
  next
) {
  if (process.env.NODE_ENV === "test") {
    return next();
  }
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized, No token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];
  const customError = new CustomError("Unauthorized, Invalid token", 401);
  const user = await verifyToken(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    customError
  );
  req.user = user; // Attach user data to request object
  next();
});

module.exports = authenticateUserMiddleware;
