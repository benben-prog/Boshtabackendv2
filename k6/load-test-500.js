// k6/load-test-500.js
// Staged Load Test: 50 -> 250 -> 500 Virtual Users
// Includes automatic safety circuit breakers to protect server stability

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('http_errors');
const apiLatency = new Trend('api_latency');

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Warm-up ramp: 0 to 50 users
    { duration: '1m',  target: 50 },   // Steady state: 50 users
    { duration: '30s', target: 250 },  // Ramp-up: 50 to 250 users
    { duration: '1m',  target: 250 },  // Steady state: 250 users
    { duration: '30s', target: 500 },  // Ramp-up: 250 to 500 users
    { duration: '1m',  target: 500 },  // Peak load: 500 users
    { duration: '30s', target: 0 },    // Cool-down ramp
  ],
  thresholds: {
    // Safety Circuit Breakers:
    'http_req_duration': [
      { threshold: 'p(95)<1500', abortOnFail: false }, // Alert if p95 > 1.5s
      { threshold: 'p(99)<3000', abortOnFail: true },  // EMERGENCY STOP if p99 > 3.0s
    ],
    'http_errors': [
      { threshold: 'rate<0.05', abortOnFail: true },   // EMERGENCY STOP if error rate > 5%
    ],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://backend.benb3n.cloud';

export default function () {
  // Scenario A: Student Health & Heartbeat
  const resHealth = http.get(`${BASE_URL}/health`, {
    tags: { endpoint: 'health' },
  });
  apiLatency.add(resHealth.timings.duration);
  const healthOk = check(resHealth, {
    'health returns 200': (r) => r.status === 200,
  });
  errorRate.add(!healthOk);

  sleep(Math.random() * 2 + 1); // Random think time: 1-3 seconds

  // Scenario B: Public Documentation & Schema Exploration
  const resDocs = http.get(`${BASE_URL}/api-docs-json`, {
    tags: { endpoint: 'api-docs-json' },
  });
  apiLatency.add(resDocs.timings.duration);
  const docsOk = check(resDocs, {
    'docs returns 200': (r) => r.status === 200,
  });
  errorRate.add(!docsOk);

  sleep(Math.random() * 2 + 1);

  // Scenario C: Non-destructive Auth Endpoint Check
  // Sending invalid credentials to check server handling under load
  const payload = JSON.stringify({
    phone: '01000000000',
    password: 'SyntheticTestPassword123!',
  });
  const resAuth = http.post(`${BASE_URL}/api/auth/student/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'auth_validation' },
  });
  apiLatency.add(resAuth.timings.duration);
  const authHandled = check(resAuth, {
    'auth returns handled response': (r) => r.status === 400 || r.status === 401 || r.status === 500,
  });
  errorRate.add(!authHandled);

  sleep(Math.random() * 3 + 2); // Think time: 2-5 seconds
}
