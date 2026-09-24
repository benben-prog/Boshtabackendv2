const fs = require("fs");
const path = require("path");
const swaggerSpec = require("../src/docs/swagger");
const app = require("../src/app");
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
      operations.push({ method: method.toUpperCase(), path: normalizePath(`${prefix}${child.route.path}`.replace(/\/+/g, "/")) });
    }
  }
}
const actual = new Set(operations.map((x) => `${x.method} ${x.path}`));
const documented = new Set();
for (const [route, item] of Object.entries(swaggerSpec.paths || {})) {
  for (const [method, op] of Object.entries(item)) {
    if (["parameters", "summary", "description"].includes(method)) continue;
    documented.add(`${method.toUpperCase()} ${route}`);
  }
}
const missing = [...actual].filter((x) => !documented.has(x)).sort();
const stale = [...documented].filter((x) => !actual.has(x)).sort();
console.log(JSON.stringify({ actualOperations: actual.size, documentedOperations: documented.size, actualPaths: new Set(operations.map((x) => x.path)).size, documentedPaths: Object.keys(swaggerSpec.paths || {}).length, missing, stale }, null, 2));
setImmediate(() => process.exit(0));
