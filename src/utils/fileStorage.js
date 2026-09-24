const fs = require("fs");
const path = require("path");
const env = require("../config/env");

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const UPLOAD_ROOT = path.resolve(
  env.UPLOAD_ROOT || path.join(PROJECT_ROOT, "uploads"),
);

const isInsideUploadRoot = (candidatePath) => {
  const relative = path.relative(UPLOAD_ROOT, candidatePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const ensureUploadDir = (relativeDir) => {
  const normalizedDir = relativeDir.replace(/^uploads[\\/]/, "");
  const directory = path.resolve(UPLOAD_ROOT, normalizedDir);
  if (!isInsideUploadRoot(directory)) {
    throw new Error("مسار التخزين غير مسموح به");
  }
  fs.mkdirSync(directory, { recursive: true });
  return directory;
};

const resolveStoredPath = (storedPath) => {
  if (!storedPath || typeof storedPath !== "string") return null;

  const candidate = path.isAbsolute(storedPath)
    ? path.resolve(storedPath)
    : path.resolve(PROJECT_ROOT, storedPath);

  return isInsideUploadRoot(candidate) ? candidate : null;
};

const toStoredPath = (filePath) => {
  const absolutePath = path.resolve(filePath);
  if (!isInsideUploadRoot(absolutePath)) {
    throw new Error("مسار الملف خارج مجلد الرفع");
  }
  return path.relative(PROJECT_ROOT, absolutePath).split(path.sep).join("/");
};

const normalizeUploadedPaths = (req) => {
  if (req.file?.path) req.file.path = toStoredPath(req.file.path);

  if (req.files && !Array.isArray(req.files)) {
    for (const files of Object.values(req.files)) {
      for (const file of files || []) {
        if (file.path) file.path = toStoredPath(file.path);
      }
    }
  }

  if (Array.isArray(req.files)) {
    for (const file of req.files) {
      if (file.path) file.path = toStoredPath(file.path);
    }
  }
};

const cleanupUploadedFiles = (req) => {
  const files = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);
  if (req.files && !Array.isArray(req.files)) {
    for (const group of Object.values(req.files)) files.push(...(group || []));
  }

  for (const file of files) {
    const fullPath = resolveStoredPath(file?.path);
    if (!fullPath) continue;
    try {
      fs.rmSync(fullPath, { force: true });
    } catch (error) {
      console.error("Failed to remove uploaded file:", error.message);
    }
  }
};

const wrapUpload = (upload) => {
  const wrapped = {};
  for (const method of ["single", "array", "fields", "any", "none"]) {
    if (typeof upload[method] !== "function") continue;
    wrapped[method] = (...args) => {
      const middleware = upload[method](...args);
      return (req, res, next) =>
        middleware(req, res, (error) => {
          if (error) {
            cleanupUploadedFiles(req);
            return next(error);
          }
          try {
            normalizeUploadedPaths(req);
            return next();
          } catch (normalizationError) {
            cleanupUploadedFiles(req);
            return next(normalizationError);
          }
        });
    };
  }
  return wrapped;
};

module.exports = {
  PROJECT_ROOT,
  UPLOAD_ROOT,
  ensureUploadDir,
  resolveStoredPath,
  toStoredPath,
  normalizeUploadedPaths,
  cleanupUploadedFiles,
  wrapUpload,
};
