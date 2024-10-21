class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandlerMiddleware = function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "test") {    
    console.error(`Error: ${message}, Status Code: ${statusCode}`);
  }

  res.status(statusCode).json({
    message,
  });
};

module.exports = { errorHandlerMiddleware, CustomError };
