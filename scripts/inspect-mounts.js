const app = require("../src/app");
const stack = app.router?.stack || app._router?.stack || [];
console.log(stack.filter((layer) => layer.handle?.stack).map((layer) => ({ name: layer.name, path: layer.path, regexp: layer.regexp?.toString(), keys: layer.keys }))); setImmediate(() => process.exit(0));
