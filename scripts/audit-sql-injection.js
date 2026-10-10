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
console.log(`Auditing ${files.length} JavaScript files for dynamic SQL concatenation...`);

const findings = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check if query is called with template string interpolation
    // e.g. query(`...${var}...`)
    // but exclude safe patterns like static strings or table creation scripts
    if (
      (line.includes('query(') || line.includes('query = ') || line.includes('query +=')) &&
      line.includes('${')
    ) {
      findings.push({
        file: path.relative(path.join(__dirname, '..'), file),
        line: idx + 1,
        code: line.trim()
      });
    }
  });
});

console.log(`\nFound ${findings.length} dynamic query construction lines:`);
findings.forEach(f => {
  console.log(`- ${f.file}:${f.line} -> ${f.code.substring(0, 100)}`);
});
