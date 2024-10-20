// const userModel = require("../models/userModel");
// require("dotenv").config();
// const asynchandler = require("express-async-handler");
// const { generateAccessToken } = require("../utils/token");
// const {
//   refreshTokenValidation,
// } = require("../middlewares/refreshTokenValidationMiddleware");
// const { getUserById } = require("../database");

// const refreshToken = [
//   refreshTokenValidation,
//   asynchandler(async function (req, res) {
//     const userDocument = await getUserById(req.user.id);

//     if (!userDocument) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const newAccessToken = generateAccessToken(req.user.id);

//     return res.status(200).json({
//       accessToken: newAccessToken,
//       user: {
//         id: userDocument._id,
//         email: userDocument.email,
//       },
//     });
//   }),
// ];
// module.exports = { refreshToken };
