const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authenticateUserMiddleware = require("../middlewares/authenticateUserMiddleware");

userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);
userRouter.get("/", authenticateUserMiddleware, userController.getUser);
userRouter.post(
  "/verify-email",
  authenticateUserMiddleware,
  userController.verifyEmail
);
userRouter.post(
  "/resend-verification-code",
  authenticateUserMiddleware,
  userController.resendVerificationCode
);
module.exports = userRouter;
