const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const database = require("../database");
const { comparePassword } = require("../utils/password");
const { checkCooldownPeriod } = require("../utils/verificationCodeUtil");
const { CustomError } = require("./errorHandlerMiddleware");
const { verifyToken } = require("../utils/token");


const loginValidation = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }),
  asyncHandler(async function (req, res, next) {
    const user = await database.getUserByEmail(req.body.email);

    if (!user) {
      return res.status(404).json({ message: "Email does not exist." });
    }

    // If user exists, attach it to the request object
    req.user = user;

    next();
  }),
  asyncHandler(async function (req, res, next) {
    const user = req.user;

    const { password } = req.body;
    const isPasswordCorrect = await comparePassword(
      password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    next();
  }),
];

const signupValidation = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .custom(async (email) => {
      const user = await database.getUserByEmail(email);
      if (user) {
        throw new Error("Email is already registered!");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }),
];

const getUserValidation = [
  asyncHandler(async function (req, res, next) {
    const { id } = req.user;

    const user = await database.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user.email = user.email;
    req.user.isVerified = user.isVerified;

    next();
  }),
];

const verifyEmailValidation = [
  query("verificationCode")
    .isString({ min: 1 })
    .withMessage("No verification code provided"),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }),
  asyncHandler(async function (req, res, next) {
    const { verificationCode } = req.query;

    const verificationCodeDocument = await database.findVerificationCode(
      verificationCode
    );

    if (!verificationCodeDocument) {
      return res
        .status(400)
        .json({ message: "Verification code is invalid or has expired." });
    }

    req.verificationCode = verificationCodeDocument;
    next();
  }),
  asyncHandler(async function (req, res, next) {
    const user = await database.getUserById(req.verificationCode.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    next();
  }),
];

const resendVerificationCodeValidation = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }),
  asyncHandler(async function (req, res, next) {
    const { email } = req.body;

    const user = await database.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    next();
  }),
  asyncHandler(async function (req, res, next) {
    const { canResend, timeRemaining } = await checkCooldownPeriod(req.user.id);

    if (!canResend) {
      return res
        .status(400)
        .json({ message: `Wait ${timeRemaining} before asking to resend` });
    }

    next();
  }),
];

const refreshTokenValidation = [
  asyncHandler(async function (req, res, next) {
    console.log(req);
    
    const refreshToken = req.cookie.refreshToken;

    console.log('here');
    

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    next();
  }),
  asyncHandler(async function (req, res, next) {
    const customError = new CustomError("Invalid refresh token", 401);
    const user = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      customError
    );
    req.user = user;
    next();
  }),
];
module.exports = {
  getUserValidation,
  loginValidation,
  signupValidation,
  verifyEmailValidation,
  resendVerificationCodeValidation,
  refreshTokenValidation,
};
