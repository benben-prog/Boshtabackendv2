const x = require("/tmp/docs-operations.json");
console.log(JSON.stringify({
  counts: { missing: x.missing.length, stale: x.stale.length },
  missing: x.missing.slice(0, 35),
  stale: x.stale.slice(0, 35),
}, null, 2));
