const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./database");
const {
  errorHandlerMiddleware,
} = require("./middlewares/errorHandlerMiddleware");
const logger = require("morgan");
require("dotenv").config();
const { swaggerUi, swaggerSpec } = require("./swagger");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

const courseRouter = require("./routes/courseRoute");
app.use("/api/courses", courseRouter);

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
