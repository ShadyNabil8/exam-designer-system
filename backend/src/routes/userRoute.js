const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authenticateUserMiddleware = require("../middlewares/authenticateUserMiddleware");

userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);
userRouter.get("/", authenticateUserMiddleware, userController.getUser);

module.exports = userRouter;
