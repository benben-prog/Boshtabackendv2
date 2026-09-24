const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const app = require("../src/app");

const root = path.resolve(__dirname, "..");
const existingSwagger = swaggerJsdoc({
  definition: { openapi: "3.0.0" },
  apis: [
    path.join(root, "src/docs/auth.docs.js"),
    path.join(root, "src/docs/student.docs.js"),
    path.join(root, "src/docs/parent.docs.js"),
    path.join(root, "src/docs/assistant.docs.js"),
    path.join(root, "src/docs/teacher.docs.js"),
    path.join(root, "src/docs/super-admin.docs.js"),
  ],
});
const prefixes = ["/api/auth", "/api/student", "/api/parent", "/api/assistant", "/api/teacher", "/api/super-admin", "/webhook"];
const normalizePath = (value) => {
  const normalized = value.replace(/:([A-Za-z0-9_]+)/g, "{$1}").replace(/\/$/, "");
  return normalized || "/";
};
const stack = app.router?.stack || app._router?.stack || [];
const operations = [];
let routerIndex = 0;

for (const layer of stack) {
  if (!layer.handle?.stack) continue;
  const prefix = prefixes[routerIndex++];
  if (!prefix) continue;
  for (const child of layer.handle.stack) {
    if (!child.route) continue;
    for (const method of Object.keys(child.route.methods || {})) {
      const fullPath = normalizePath(`${prefix}${child.route.path}`.replace(/\/+/g, "/"));
      if (fullPath.startsWith("/api/") || fullPath.startsWith("/webhook")) {
        operations.push({ method: method.toUpperCase(), path: fullPath });
      }
    }
  }
}

const uniqueOperations = [...new Map(operations.map((op) => [`${op.method} ${op.path}`, op])).values()]
  .sort((a, b) => `${a.path} ${a.method}`.localeCompare(`${b.path} ${b.method}`));
const existing = new Set();
for (const [route, item] of Object.entries(existingSwagger.paths || {})) {
  for (const method of Object.keys(item)) {
    if (!["parameters", "summary", "description"].includes(method)) existing.add(`${method.toUpperCase()} ${route}`);
  }
}

const tagFor = (route) => {
  if (route.startsWith("/api/auth")) return "Auth";
  if (route.startsWith("/api/parent")) return "Parent";
  if (route.startsWith("/api/student")) return "Student - Generated Routes";
  if (route.startsWith("/api/assistant")) return "Assistant - Generated Routes";
  if (route.startsWith("/api/teacher")) return "Teacher - Generated Routes";
  if (route.startsWith("/api/super-admin")) return "Super Admin - Generated Routes";
  return "Webhooks";
};
const securityFor = (route) => {
  if (route.startsWith("/api/auth") || route.startsWith("/api/parent") || route.startsWith("/webhook")) return "";
  if (route.startsWith("/api/super-admin")) return "    security:\n      - ApiAuth: []\n        ClientToken: []\n      - ApiAuth: []\n        SuperAdminKey: []\n";
  return "    security:\n      - ApiAuth: []\n        ClientToken: []\n";
};
const humanize = (method, route) => `${method} ${route.replace(/^\/api\//, "").replace(/[{}]/g, "").replaceAll("/", " ")}`;
const bodyFor = (method, route) => {
  if (["GET", "DELETE"].includes(method)) return "";
  const upload = /(upload|profile-image|submit|essay|questions|assignments|videos|playlists|students\/bulk|grades\/bulk|groups\/bulk)/i.test(route);
  if (upload) {
    return `    requestBody:\n      content:\n        multipart/form-data:\n          schema:\n            type: object\n            additionalProperties: true\n            properties:\n              file:\n                type: string\n                format: binary\n              image:\n                type: string\n                format: binary\n              thumbnail:\n                type: string\n                format: binary\n`;
  }
  return `    requestBody:\n      content:\n        application/json:\n          schema:\n            type: object\n            additionalProperties: true\n`;
};
const parametersFor = (route) => {
  if (route === "/webhook/webhook") {
    return `    parameters:\n      - in: query\n        name: hub.mode\n        required: true\n        schema:\n          type: string\n      - in: query\n        name: hub.verify_token\n        required: true\n        schema:\n          type: string\n      - in: query\n        name: hub.challenge\n        required: true\n        schema:\n          type: string\n`;
  }
  const params = [...route.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  if (!params.length) return "";
  return `    parameters:\n${params.map((name) => `      - in: path\n        name: ${name}\n        required: true\n        schema:\n          type: string\n`).join("")}`;
};
const responsesFor = (route) => {
  if (route === "/webhook/webhook") {
    return `    responses:\n      '200':\n        description: Webhook accepted or verification challenge returned\n      '403':\n        description: Webhook verification failed\n      '500':\n        description: Webhook processing failed\n`;
  }
  return `    responses:\n      '200':\n        description: Request completed successfully\n      '400':\n        description: Invalid request or validation error\n      '401':\n        description: Authentication required or invalid credentials\n      '403':\n        description: Insufficient permissions\n      '404':\n        description: Resource not found\n      '500':\n        description: Internal server error\n`;
};

const missing = uniqueOperations.filter((op) => !existing.has(`${op.method} ${op.path}`));
let output = `/**\n * Automatically generated coverage documentation for routes that are not\n * represented by a hand-written Swagger block. Keep this file in sync by\n * running: node scripts/generate-route-docs.js\n */\n`;
for (const { method, path: route } of missing) {
  output += `/**\n * @swagger\n * ${route}:\n *   ${method.toLowerCase()}:\n *     summary: ${humanize(method, route)}\n *     description: Generated from the currently mounted Express route.\n *     tags:\n *       - ${tagFor(route)}\n`;
  output += securityFor(route);
  output += parametersFor(route);
  output += bodyFor(method, route);
  output += responsesFor(route);
  output += ` */\n`;
}

output = output
  .split("\n")
  .map((line) => {
    if (line && !line.startsWith("/*") && !line.startsWith(" *") && line !== " */") {
      return ` * ${line}`;
    }
    return line;
  })
  .join("\n");
fs.writeFileSync(path.join(root, "src/docs/generated-routes.docs.js"), output);
fs.writeFileSync(path.join(root, "src/docs/route-catalog.json"), JSON.stringify(uniqueOperations, null, 2) + "\n");
console.log(JSON.stringify({ totalMountedOperations: uniqueOperations.length, existingDocumentedOperations: existing.size, generatedOperations: missing.length }, null, 2));
setImmediate(() => process.exit(0));
