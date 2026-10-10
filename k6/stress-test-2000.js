// k6/stress-test-2000.js
// Stress & Capacity Breakpoint Test: 500 -> 1,000 -> 2,000 Virtual Users
// NOTE: Run during scheduled maintenance windows or on staging environments.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('failure_rate');
const latencyTrend = new Trend('request_latency');

export const options = {
  stages: [
    { duration: '1m', target: 200 },   // Warm-up to 200 users
    { duration: '2m', target: 500 },   // Ramp to 500 users
    { duration: '2m', target: 1000 },  // Ramp to 1,000 users
    { duration: '3m', target: 2000 },  // Peak stress: 2,000 users
    { duration: '2m', target: 2000 },  // Soak at 2,000 users
    { duration: '2m', target: 0 },     // Cool-down
  ],
  thresholds: {
    // Breakpoint tripwire:
    'failure_rate': [{ threshold: 'rate<0.10', abortOnFail: true }], // Abort if failure rate exceeds 10%
    'http_req_duration': [{ threshold: 'p(95)<4000', abortOnFail: true }], // Abort if p95 exceeds 4 seconds
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://backend.benb3n.cloud';

export default function () {
  const res = http.get(`${BASE_URL}/health`);
  latencyTrend.add(res.timings.duration);
  const ok = check(res, {
    'health 200': (r) => r.status === 200,
    'latency under 2s': (r) => r.timings.duration < 2000,
  });
  errorRate.add(!ok);

  sleep(Math.random() * 2 + 1);
}
