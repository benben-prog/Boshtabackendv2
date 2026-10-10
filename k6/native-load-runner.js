// k6/native-load-runner.js
// Standalone Native Node.js Concurrent Load Testing Tool
// Runs immediately on Windows without requiring external k6 installation.

const http = require("http");
const https = require("https");
const { URL } = require("url");

// Parse Command-line Arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.split("=");
  acc[key.replace(/^--/, "")] = val;
  return acc;
}, {});

const TARGET_URL = args.url || process.env.TARGET_URL || "https://backend.benb3n.cloud/health";
const CONCURRENCY = parseInt(args.concurrency || args.c || "10", 10);
const DURATION_SEC = parseInt(args.duration || args.d || "15", 10);

console.log("==========================================================");
console.log("   NATIVE CONCURRENT PERFORMANCE & CAPACITY TESTER");
console.log("==========================================================");
console.log(`Target URL:       ${TARGET_URL}`);
console.log(`Concurrency (VUs): ${CONCURRENCY}`);
console.log(`Duration:         ${DURATION_SEC} seconds`);
console.log("----------------------------------------------------------");

const parsedUrl = new URL(TARGET_URL);
const isHttps = parsedUrl.protocol === "https:";
const client = isHttps ? https : http;

const agent = new client.Agent({
  keepAlive: true,
  maxSockets: CONCURRENCY * 2,
  timeout: 10000,
});

const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  statusCodes: {},
  latencies: [],
  errors: [],
  startTime: Date.now(),
  endTime: null,
};

let isRunning = true;
const stopTimer = setTimeout(() => {
  isRunning = false;
}, DURATION_SEC * 1000);

function sendRequest() {
  if (!isRunning) return;

  const start = process.hrtime.bigint();
  const req = client.request(
    TARGET_URL,
    {
      method: "GET",
      agent,
      headers: {
        "User-Agent": "NativeLoadTester/1.0",
        Connection: "keep-alive",
      },
    },
    (res) => {
      res.on("data", () => {}); // Consume body stream
      res.on("end", () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;

        stats.totalRequests++;
        stats.statusCodes[res.statusCode] = (stats.statusCodes[res.statusCode] || 0) + 1;
        stats.latencies.push(durationMs);

        if (res.statusCode >= 200 && res.statusCode < 400) {
          stats.successfulRequests++;
        } else {
          stats.failedRequests++;
        }

        if (isRunning) {
          setImmediate(sendRequest);
        }
      });
    }
  );

  req.on("error", (err) => {
    stats.totalRequests++;
    stats.failedRequests++;
    stats.errors.push(err.message);
    stats.statusCodes["ERR"] = (stats.statusCodes["ERR"] || 0) + 1;

    if (isRunning) {
      setTimeout(sendRequest, 50); // slight backoff on network error
    }
  });

  req.setTimeout(8000, () => {
    req.destroy(new Error("Request timed out (8s)"));
  });

  req.end();
}

// Start worker loops for each VU
console.log(`Ramping up ${CONCURRENCY} workers...`);
for (let i = 0; i < CONCURRENCY; i++) {
  sendRequest();
}

// Progress reporter
const progressInterval = setInterval(() => {
  const elapsedSec = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const currentRps = (stats.totalRequests / elapsedSec).toFixed(1);
  process.stdout.write(`\r[Running] Elapsed: ${elapsedSec}s | Total Reqs: ${stats.totalRequests} | Current RPS: ${currentRps}   `);
}, 1000);

// Print summary upon completion
const checkCompletion = setInterval(() => {
  if (!isRunning) {
    clearInterval(progressInterval);
    clearInterval(checkCompletion);
    stats.endTime = Date.now();
    clearTimeout(stopTimer);

    setTimeout(printReport, 1000); // Allow pending requests to drain
  }
}, 200);

function printReport() {
  console.log("\n\n==========================================================");
  console.log("                  LOAD TEST SUMMARY RESULTS               ");
  console.log("==========================================================");
  const totalDurationSec = (stats.endTime - stats.startTime) / 1000;
  const rps = (stats.totalRequests / totalDurationSec).toFixed(2);

  stats.latencies.sort((a, b) => a - b);
  const count = stats.latencies.length;
  const min = count ? stats.latencies[0].toFixed(2) : 0;
  const max = count ? stats.latencies[count - 1].toFixed(2) : 0;
  const avg = count ? (stats.latencies.reduce((a, b) => a + b, 0) / count).toFixed(2) : 0;
  const p50 = count ? stats.latencies[Math.floor(count * 0.5)].toFixed(2) : 0;
  const p90 = count ? stats.latencies[Math.floor(count * 0.9)].toFixed(2) : 0;
  const p95 = count ? stats.latencies[Math.floor(count * 0.95)].toFixed(2) : 0;
  const p99 = count ? stats.latencies[Math.floor(count * 0.99)].toFixed(2) : 0;

  console.log(`Total Duration:       ${totalDurationSec.toFixed(2)}s`);
  console.log(`Total Requests:       ${stats.totalRequests}`);
  console.log(`Successful (2xx):     ${stats.successfulRequests}`);
  console.log(`Failed / Errors:      ${stats.failedRequests}`);
  console.log(`Throughput:           ${rps} requests/second`);
  console.log("----------------------------------------------------------");
  console.log("HTTP Status Code Breakdown:");
  for (const [code, count] of Object.entries(stats.statusCodes)) {
    console.log(`  - Status ${code}: ${count} (${((count / stats.totalRequests) * 100).toFixed(1)}%)`);
  }
  console.log("----------------------------------------------------------");
  console.log("Response Latency Distribution (ms):");
  console.log(`  - Min:              ${min} ms`);
  console.log(`  - Median (p50):     ${p50} ms`);
  console.log(`  - Average:          ${avg} ms`);
  console.log(`  - 90th percentile:  ${p90} ms`);
  console.log(`  - 95th percentile:  ${p95} ms`);
  console.log(`  - 99th percentile:  ${p99} ms`);
  console.log(`  - Max:              ${max} ms`);
  console.log("==========================================================\n");

  process.exit(0);
}
