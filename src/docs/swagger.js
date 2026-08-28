const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JupiterLearn API",
      version: "1.0.0",
      description: "JupiterLearn Platform API Documentation",
    },
    servers: [{ url: "http://localhost:3000/" }],
    components: {
      securitySchemes: {
        ApiAuth: {
          type: "http",
          scheme: "basic",
        },
        ClientToken: {
          type: "apiKey",
          in: "header",
          name: "x-client-key",
        },
        SuperAdminKey: {
          type: "apiKey",
          in: "header",
          name: "x-super-admin-key",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "auth.docs.js"),
    path.join(__dirname, "student.docs.js"),
    path.join(__dirname, "parent.docs.js"),
    path.join(__dirname, "assistant.docs.js"),
    path.join(__dirname, "teacher.docs.js"),
    path.join(__dirname, "super-admin.docs.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;
