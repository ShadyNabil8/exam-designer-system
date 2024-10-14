const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Your API Documentation",
    version: "1.0.0",
    description: "API documentation for your Express.js application",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [`./src/routes/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
