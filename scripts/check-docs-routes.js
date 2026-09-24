const fs = require("fs");
const path = require("path");
const swaggerSpec = require("../src/docs/swagger");

const root = path.resolve(__dirname, "..");
const routeFiles = [];
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") collect(full);
    else if (entry.isFile() && entry.name.endsWith(".routes.js")) routeFiles.push(full);
  }
}
collect(path.join(root, "src/modules"));

const moduleMounts = {
  auth: "/api/auth",
  student: "/api/student",
  parent: "/api/parent",
  assistant: "/api/assistant",
  teacher: "/api/teacher",
  "super-admin": "/api/super-admin",
};
const expected = new Set();
const routes = [];
for (const file of routeFiles) {
  const moduleName = path.basename(path.dirname(file));
  const prefix = moduleMounts[moduleName];
  if (!prefix) continue;
  const source = fs.readFileSync(file, "utf8");
  const pattern = /routes\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gs;
  for (const match of source.matchAll(pattern)) {
    let routePath = match[2];
    if (routePath === "/") routePath = "";
    const fullPath = `${prefix}${routePath}`.replace(/\/+/g, "/");
    expected.add(fullPath);
    routes.push({ method: match[1].toUpperCase(), path: fullPath, file: path.relative(root, file) });
  }
}

const documented = new Set(Object.keys(swaggerSpec.paths || {}));
const missing = [...expected].filter((route) => !documented.has(route)).sort();
const stale = [...documented].filter((route) => !expected.has(route)).sort();
const pathParameterProblems = [];
for (const [route, item] of Object.entries(swaggerSpec.paths || {})) {
  const names = [...route.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  for (const [method, operation] of Object.entries(item)) {
    if (["parameters", "summary", "description"].includes(method)) continue;
    const params = new Set((operation.parameters || []).filter((p) => p.in === "path").map((p) => p.name));
    for (const name of names) if (!params.has(name)) pathParameterProblems.push(`${method.toUpperCase()} ${route}: missing path parameter ${name}`);
  }
}

console.log(JSON.stringify({
  swaggerPaths: documented.size,
  staticRoutePaths: expected.size,
  operations: routes.length,
  missingDocumentation: missing,
  undocumentedSwaggerPaths: stale,
  pathParameterProblems,
  swaggerTags: [...new Set(Object.values(swaggerSpec.paths || {}).flatMap((item) => Object.values(item).flatMap((op) => op.tags || [])))].sort(),
}, null, 2));
