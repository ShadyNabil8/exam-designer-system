// const asyncHandler = require("express-async-handler");
// const { body, query, validationResult } = require("express-validator");
// const database = require("../database");
// const { comparePassword } = require("../utils/password");
// const { checkCooldownPeriod } = require("../utils/verificationCodeUtil");
// const { CustomError } = require("./errorHandlerMiddleware");
// const { verifyToken } = require("../utils/token");

// const refreshTokenValidation = [
//   asyncHandler(async function (req, res, next) {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(401).json({ message: "Refresh token not found" });
//     }

//     next();
//   }),
//   asyncHandler(async function (req, res, next) {
//     const customError = new CustomError("Invalid refresh token", 401);
//     const user = await verifyToken(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       customError
//     );
//     req.user = user;
//     next();
//   }),
// ];

// module.exports = {
//   refreshTokenValidation,
// };
