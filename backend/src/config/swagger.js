const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["../docs/*.js", "../routes/**/*.js"], // scan all routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
