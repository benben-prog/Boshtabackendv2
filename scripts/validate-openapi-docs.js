const spec = require("../src/docs/swagger");
const errors = [];
const methods = new Set(["get", "post", "put", "patch", "delete", "options", "head", "trace"]);
const schemes = new Set(Object.keys(spec.components?.securitySchemes || {}));
for (const [route, item] of Object.entries(spec.paths || {})) {
  const pathParams = [...route.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  for (const [method, operation] of Object.entries(item)) {
    if (!methods.has(method)) continue;
    if (!operation.summary) errors.push(`${method.toUpperCase()} ${route}: missing summary`);
    if (!Array.isArray(operation.tags) || operation.tags.length === 0) errors.push(`${method.toUpperCase()} ${route}: missing tags`);
    if (!operation.responses || Object.keys(operation.responses).length === 0) errors.push(`${method.toUpperCase()} ${route}: missing responses`);
    const params = new Map((operation.parameters || []).filter((p) => p.in === "path").map((p) => [p.name, p]));
    for (const name of pathParams) {
      if (!params.has(name)) errors.push(`${method.toUpperCase()} ${route}: missing path parameter ${name}`);
      else if (params.get(name).required !== true) errors.push(`${method.toUpperCase()} ${route}: path parameter ${name} is not required`);
    }
    for (const requirement of operation.security || []) {
      for (const name of Object.keys(requirement)) if (!schemes.has(name)) errors.push(`${method.toUpperCase()} ${route}: unknown security scheme ${name}`);
    }
  }
}
console.log(JSON.stringify({ openapi: spec.openapi, paths: Object.keys(spec.paths || {}).length, operations: Object.values(spec.paths || {}).reduce((n, item) => n + Object.keys(item).filter((k) => methods.has(k)).length, 0), errors }, null, 2));
if (errors.length) process.exit(1);
