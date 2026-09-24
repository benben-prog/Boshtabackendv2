const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  PROJECT_ROOT,
  UPLOAD_ROOT,
  resolveStoredPath,
  toStoredPath,
  cleanupUploadedFiles,
} = require("../src/utils/fileStorage");
const assignmentUpload = require("../src/middlewares/uploads/assignmentUpload");
const videoFilesUpload = require("../src/middlewares/uploads/videoFilesUpload");

assert.ok(path.isAbsolute(UPLOAD_ROOT));
assert.ok(assignmentUpload && typeof assignmentUpload.single === "function");
assert.ok(videoFilesUpload && typeof videoFilesUpload.fields === "function");

const fixture = path.join(UPLOAD_ROOT, "__verification__", "fixture.txt");
fs.mkdirSync(path.dirname(fixture), { recursive: true });
fs.writeFileSync(fixture, "verification");
const stored = toStoredPath(fixture);
assert.strictEqual(resolveStoredPath(stored), fixture);
assert.strictEqual(resolveStoredPath("../../etc/passwd"), null);

const req = { file: { path: stored }, files: undefined };
cleanupUploadedFiles(req);
assert.strictEqual(fs.existsSync(fixture), false);

console.log(JSON.stringify({
  ok: true,
  projectRoot: PROJECT_ROOT,
  uploadRoot: UPLOAD_ROOT,
  storedExample: stored,
  checks: ["absolute upload root", "wrapped multer methods", "safe path traversal rejection", "cleanup uploaded file"],
}, null, 2));
