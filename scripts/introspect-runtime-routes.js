const app = require("../src/app");

function walk(stack, prefix = "") {
  const result = [];
  for (const layer of stack || []) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods || {}).map((m) => m.toUpperCase());
      result.push(...methods.map((method) => ({ method, path: `${prefix}${layer.route.path}` })));
    } else if (layer.handle?.stack) {
      const mount = layer.path || layer.regexp?.source || "";
      result.push(...walk(layer.handle.stack, `${prefix}${mount}`));
    }
  }
  return result;
}

const stack = app.router?.stack || app._router?.stack || [];
console.log(JSON.stringify({
  stackLayers: stack.length,
  sample: stack.slice(0, 20).map((layer) => ({
    name: layer.name,
    path: layer.path,
    route: layer.route?.path,
    nested: Boolean(layer.handle?.stack),
  })),
  routes: walk(stack),
}, null, 2));
setImmediate(() => process.exit(0));
