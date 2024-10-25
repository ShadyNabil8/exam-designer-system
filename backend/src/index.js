const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./database");
const {
  errorHandlerMiddleware,
} = require("./middlewares/errorHandlerMiddleware");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const { swaggerUi, swaggerSpec } = require("./swagger");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

const courseRouter = require("./routes/courseRoute");
app.use("/api/courses", courseRouter);

const chapterRouter = require("./routes/chapterRoute");
app.use("/api/chapters", chapterRouter);

const questionRouter = require("./routes/questionRoute");
app.use("/api/questions", questionRouter);

const examRouter = require("./routes/examRoute");
app.use("/api/exams", examRouter);

const userRouter = require("./routes/userRoute");
app.use("/api/users", userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV !== "test") {
  dbConnect();

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(
      `Swagger docs available at http://localhost:${process.env.PORT}/api-docs`
    );
  });
}

module.exports = app;
