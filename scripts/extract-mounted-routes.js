const app = require("../src/app");
function mountPrefix(layer) {
  const source = layer.regexp?.source || "";
  const match = source.match(/^\\\^\\\\?\/(api(?:\\\\\/[^?()]+)+|webhook)/i);
  if (match) return "/" + match[1].replaceAll("\\\\/", "/");
  return "";
}
function walk(stack, prefix = "") {
  const result = [];
  for (const layer of stack || []) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods || {}).map((m) => m.toUpperCase());
      result.push(...methods.map((method) => ({ method, path: `${prefix}${layer.route.path}`.replace(/\/+/g, "/") })));
    } else if (layer.handle?.stack) {
      const nextPrefix = prefix + (layer.path || mountPrefix(layer));
      result.push(...walk(layer.handle.stack, nextPrefix));
    }
  }
  return result;
}
const stack = app.router?.stack || app._router?.stack || [];
console.log(JSON.stringify(walk(stack), null, 2));
setImmediate(() => process.exit(0));
