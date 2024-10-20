const asyncHandler = require("express-async-handler");
require("dotenv").config();
const crypto = require("crypto");
const {
  loginValidation,
  signupValidation,
  getUserValidation,
  verifyEmailValidation,
} = require("../middlewares/userValidationMiddleware");
const { hashPassword } = require("../utils/password");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const database = require("../database");
const { sendVerificationCode } = require("../utils/email");

const getUser = [
  getUserValidation,
  asyncHandler(async function (req, res) {
    const { id, email, isVerified } = req.user;

    return res.status(200).json({
      email,
      id,
      isVerified,
    });
  }),
];

const login = [
  loginValidation,
  asyncHandler(async function (req, res) {
    // This is the fetched user form db not the user data from the token
    const user = req.user;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    return res.status(200).json({
      accessToken,
      data: {
        email: user.email,
        id: user._id,
        isVerified: user.isVerified,
      },
    });
  }),
];

const signup = [
  signupValidation,
  asyncHandler(async function (req, res) {
    const { email, password } = req.body;

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create a new user in the database
    const createdUser = await database.createUser(email, passwordHash);

    // Generate tokens
    const accessToken = generateAccessToken(createdUser._id);
    const refreshToken = generateRefreshToken(createdUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    // Generate a verification code and store it in the database
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAt = Date.now() + 3600000; // 1 Hour
    await database.createVerificationCode(
      createdUser._id,
      verificationCode,
      expiresAt
    );

    // Send verification code to the user's email
    await sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      message: "Registered successfully",
      accessToken,
      data: {
        email: createdUser.email,
        id: createdUser._id,
        isVerified: createdUser.isVerified,
      },
    });
  }),
];

const verifyEmail = [
  verifyEmailValidation,
  asyncHandler(async function (req, res) {
    const userId = req.user.id;

    await Promise.all([
      database.updateUserbyId(userId, {
        isVerified: true,
      }),
      database.deleteVerificationCodesByUserId(userId),
    ]);

    return res.status(200).json({
      message: "Email verified successfully!",
    });
  }),
];

// const resendVerificationCode = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const userDocument = await userModel.findOne({ email });
//     if (!userDocument) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (userDocument.isVerified) {
//       return res.status(400).json({ message: "User is already verified" });
//     }

//     const { canResend, timeRemaining } = await checkCooldownPeriod(
//       userDocument._id
//     );

//     if (!canResend) {
//       return res
//         .status(400)
//         .json({ message: `Wait ${timeRemaining} before asking to resend` });
//     }

//     await generateAndSendVerificationCode(userDocument);

//     return res
//       .status(200)
//       .json({ message: "Verification code has been resent" });
//   } catch (error) {
//     next(error);
//   }
// };

// const checkCooldownPeriod = async (userId) => {
//   try {
//     const recentVerificationCode = await verificationCodeModel
//       .findOne({ userId })
//       .sort({ createdAt: -1 });

//     if (!recentVerificationCode) {
//       return { canResend: true };
//     }

//     const now = new Date();
//     const createdAt = recentVerificationCode.createdAt;

//     const timeDifferenceInSeconds = (now - createdAt) / 1000;

//     if (timeDifferenceInSeconds < 60) {
//       const timeRemaining = Math.floor(60 - timeDifferenceInSeconds);
//       return { canResend: false, timeRemaining };
//     }

//     return { canResend: true };
//   } catch (error) {
//     console.error("Error checking cooldown period:", error);
//     throw error;
//   }
// };

module.exports = {
  login,
  getUser,
  signup,
  //   verifyEmail,
  //   resendVerificationCode,
  //   getUserInitialData,
};
