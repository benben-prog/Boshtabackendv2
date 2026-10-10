const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk(path.join(__dirname, '..', 'src'));
const findings = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check if query is called with + concatenation or raw string concatenation
    if (
      (line.includes('query(') || line.includes('query = ') || line.includes('query +=')) &&
      (line.includes(' + ') || line.includes('`') || line.includes('${'))
    ) {
      // Exclude simple multiline strings that are static (no variables)
      if (line.includes('${') || line.includes(' + req.') || line.includes(' + body') || line.includes(' + params') || line.includes(' + query')) {
        findings.push({
          file: path.relative(path.join(__dirname, '..'), file),
          line: idx + 1,
          code: line.trim()
        });
      }
    }
  });
});

console.log(`Found ${findings.length} suspected SQL string concatenations:`);
findings.forEach(f => {
  console.log(`- ${f.file}:${f.line} -> ${f.code.substring(0, 120)}`);
});
