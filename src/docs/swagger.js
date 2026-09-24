const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const routeCatalog = require("./route-catalog.json");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Boshta-Platform API",
      version: "1.0.0",
      description: "Boshta-Platform Platform API Documentation",
    },
    servers: [{ url: "https://backend.benb3n.cloud/" }],
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
    path.join(__dirname, "generated-routes.docs.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const allowedOperations = new Set(
  routeCatalog.map(({ method, path: routePath }) => `${method} ${routePath}`),
);

for (const [routePath, pathItem] of Object.entries(swaggerSpec.paths || {})) {
  for (const method of Object.keys(pathItem)) {
    if (["parameters", "summary", "description"].includes(method)) continue;
    if (!allowedOperations.has(`${method.toUpperCase()} ${routePath}`)) {
      delete pathItem[method];
    }
  }
  if (!Object.keys(pathItem).some((key) =>
    !["parameters", "summary", "description"].includes(key),
  )) {
    delete swaggerSpec.paths[routePath];
  }
}
module.exports = swaggerSpec;
