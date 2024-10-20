require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const verifyToken = async function (refreshToken, secretKey, customError) {
  return new Promise((resolve, reject) => {
    try {
      const user = jwt.verify(refreshToken, secretKey);
      resolve(user);
    } catch (error) {
      reject(customError);
    }
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
