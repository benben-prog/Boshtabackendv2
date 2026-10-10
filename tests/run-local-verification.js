// tests/run-local-verification.js
// Runs comprehensive test suite against locally running code to verify all security patches

process.env.PORT = "8990";
process.env.NODE_ENV = "test";

const app = require("../src/app");
const assert = require("node:assert");

const server = app.listen(8990, async () => {
  console.log("Local test server listening on http://127.0.0.1:8990");
  const BASE_URL = "http://127.0.0.1:8990";

  let passed = 0;
  let failed = 0;

  async function runCheck(name, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log("\n--- Testing P0 Security Patches (File Export & Download Protection) ---");

  await runCheck("GET /api/teacher/students/export/excel without token MUST return 401", async () => {
    const res = await fetch(`${BASE_URL}/api/teacher/students/export/excel`);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await runCheck("GET /api/teacher/payments/export/excel without token MUST return 401", async () => {
    const res = await fetch(`${BASE_URL}/api/teacher/payments/export/excel`);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await runCheck("GET /api/assistant/students/export/excel without token MUST return 401", async () => {
    const res = await fetch(`${BASE_URL}/api/assistant/students/export/excel`);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await runCheck("GET /api/teacher/students/export/excel with invalid token MUST return 401", async () => {
    const res = await fetch(`${BASE_URL}/api/teacher/students/export/excel?token=invalid_forged_token`);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  console.log("\n--- Testing P1 Auth Error Status Codes (401 instead of 500) ---");

  await runCheck("POST /api/auth/student/login with wrong password MUST return 401 (not 500)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "01012345678", password: "wrong_password_xyz" }),
    });
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.stack, undefined, "Stack trace must NEVER be exposed on auth errors");
  });

  await runCheck("POST /api/auth/user/login with wrong password MUST return 401 (not 500)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "01012345678", password: "wrong_password_xyz" }),
    });
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.stack, undefined, "Stack trace must NEVER be exposed on auth errors");
  });

  console.log("\n--- Testing Rate Limiter on /api/auth ---");

  await runCheck("Headers from /api/auth must include standard RateLimit headers", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "01012345678", password: "wrong_password_xyz" }),
    });
    const limitHeader = res.headers.get("ratelimit-limit");
    assert.ok(limitHeader, "RateLimit-Limit header must be present on auth endpoints");
  });

  console.log("\n--- Testing Public Discovery & 404 Handlers ---");

  await runCheck("GET /health returns 200 with uptime", async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  await runCheck("GET /api/nonexistent returns clean 404 JSON", async () => {
    const res = await fetch(`${BASE_URL}/api/nonexistent-route-random`);
    assert.strictEqual(res.status, 404);
  });

  console.log(`\n==========================================================`);
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==========================================================`);

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
});
