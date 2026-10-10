// k6/smoke-test.js
// Safe Production Smoke Test (5-10 Virtual Users)
// Purpose: Baseline latency, health verification, and zero customer impact.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const healthLatency = new Trend('health_duration');
const docsLatency = new Trend('docs_duration');

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should complete within 500ms
    'errors': ['rate<0.01'],            // Error rate must be < 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://backend.benb3n.cloud';

export default function () {
  // 1. Health Endpoint
  const resHealth = http.get(`${BASE_URL}/health`, {
    tags: { name: 'HealthCheck' },
  });
  healthLatency.add(resHealth.timings.duration);
  const healthSuccess = check(resHealth, {
    'health status is 200': (r) => r.status === 200,
    'health body has success': (r) => {
      try {
        return JSON.parse(r.body).success === true;
      } catch (e) {
        return false;
      }
    },
  });
  errorRate.add(!healthSuccess);

  sleep(1);

  // 2. Root Gateway
  const resRoot = http.get(`${BASE_URL}/`, {
    tags: { name: 'RootWelcome' },
  });
  check(resRoot, {
    'root status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 3. API Docs JSON
  const resDocs = http.get(`${BASE_URL}/api-docs-json`, {
    tags: { name: 'DocsJson' },
  });
  docsLatency.add(resDocs.timings.duration);
  check(resDocs, {
    'docs status is 200': (r) => r.status === 200,
  });

  sleep(2);
}
