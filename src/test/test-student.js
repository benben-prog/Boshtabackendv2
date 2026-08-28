// src/test/test-student-all-endpoints.js

const credential =
  "Abdelrhman_Elshaer@jupiterLearn.com:Elshaer@jupiterLearn2026";
const API_TOKEN = btoa(credential);
const BASE_URL = "http://localhost:3000";
const API_AUTH = `Basic ${API_TOKEN}`;
const STUDENT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImJhcmNvZGUiOiIzMDAwMTUiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4NjM1MjUzMSwiZXhwIjoxNzg2OTU3MzMxfQ.UJxRpXBdpMPeUeoFs3wKQ6U5-0w9sabFDRvv7mS-m1Q";

const headers = {
  Authorization: API_AUTH,
  "x-client-key": STUDENT_TOKEN,
  "Content-Type": "application/json",
};

let firstQuestionId = null;
let firstOptionId = null;
let activeExamId = null;

const endpoints = [
  // Profile
  { method: "GET", url: "/api/student/profile", name: "Get Profile" },

  // Stats
  { method: "GET", url: "/api/student/stats", name: "Get Quick Stats" },

  // Attendance
  { method: "GET", url: "/api/student/attendance", name: "Attendance History" },
  {
    method: "GET",
    url: "/api/student/attendance?page=2&limit=5",
    name: "Attendance History (page 2)",
  },
  {
    method: "GET",
    url: "/api/student/attendance/monthly",
    name: "Monthly Attendance Stats",
  },
  {
    method: "GET",
    url: "/api/student/attendance/consecutive-absences",
    name: "Consecutive Absences",
  },

  // Payments
  { method: "GET", url: "/api/student/payments", name: "Payment History" },
  {
    method: "GET",
    url: "/api/student/payments?page=2&limit=5",
    name: "Payment History (page 2)",
  },
  {
    method: "GET",
    url: "/api/student/payments/balance",
    name: "Remaining Balance",
  },
  {
    method: "GET",
    url: "/api/student/payments/current-subscription",
    name: "Current Subscription",
  },

  // Paper Exams
  { method: "GET", url: "/api/student/exams/paper", name: "Paper Exams" },
  {
    method: "GET",
    url: "/api/student/exams/paper?page=2&limit=5",
    name: "Paper Exams (page 2)",
  },
  { method: "GET", url: "/api/student/exams/results", name: "Exam Results" },

  // Online Exams
  {
    method: "GET",
    url: "/api/student/exams/online/available",
    name: "Available Online Exams",
  },
  {
    method: "GET",
    url: "/api/student/exams/online/available?page=2&limit=5",
    name: "Available Online Exams (page 2)",
  },
  {
    method: "GET",
    url: "/api/student/exams/online/history",
    name: "Online Exams History",
  },
  {
    method: "GET",
    url: "/api/student/exams/online/history?page=2&limit=5",
    name: "Online Exams History (page 2)",
  },
  {
    method: "GET",
    url: "/api/student/exams/online/1/answers",
    name: "Online Exam Answers (examId=1)",
  },

  // Start Exam
  {
    method: "POST",
    url: "/api/student/exams/online/3/start",
    name: "Start Online Exam",
    body: null,
  },

  // Answer Question - dynamic
  { method: "POST", url: "", name: "Answer Question", body: null },

  // Submit Exam
  { method: "POST", url: "", name: "Submit Online Exam", body: null },

  // Assignments
  { method: "GET", url: "/api/student/assignments", name: "Assignments" },
  {
    method: "GET",
    url: "/api/student/assignments?page=2&limit=5",
    name: "Assignments (page 2)",
  },

  // Submit Assignment
  {
    method: "POST",
    url: "/api/student/assignments/1/submit",
    name: "Submit Assignment",
    body: { filePath: "/uploads/test.pdf" },
  },

  // Assignment Submissions
  {
    method: "GET",
    url: "/api/student/assignments/submissions",
    name: "Assignment Submissions",
  },
  {
    method: "GET",
    url: "/api/student/assignments/submissions?page=2&limit=5",
    name: "Assignment Submissions (page 2)",
  },

  // Playlists & Videos
  { method: "GET", url: "/api/student/playlists", name: "Playlists" },
  {
    method: "GET",
    url: "/api/student/playlists/1/videos",
    name: "Playlist Videos (id=1)",
  },
];

async function testAllEndpoints() {
  console.log("Testing ALL STUDENT endpoints...\n");
  const results = [];

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    try {
      const options = { method: endpoint.method, headers: { ...headers } };

      if (endpoint.name === "Answer Question" && firstQuestionId) {
        endpoint.url = `/api/student/exams/online/3/answer`;
        endpoint.body = {
          questionId: firstQuestionId,
          selectedOptionId: firstOptionId,
        };
      }

      if (endpoint.name === "Submit Online Exam") {
        endpoint.url = `/api/student/exams/online/3/submit`;
      }

      if (endpoint.body && endpoint.method !== "GET") {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(`${BASE_URL}${endpoint.url}`, options);
      const status = response.status;
      const data = await response.json().catch(() => null);

      if (
        endpoint.name === "Start Online Exam" &&
        data?.data?.questions?.length > 0
      ) {
        firstQuestionId = data.data.questions[0].id;
        firstOptionId = data.data.questions[0].options?.[0]?.id || 2;
        console.log(
          `  -> Using questionId: ${firstQuestionId}, optionId: ${firstOptionId}`,
        );
      }

      if (status >= 200 && status < 300) {
        console.log(`[PASS] ${endpoint.name} (${status})`);
        results.push({ name: endpoint.name, status: "PASS", code: status });
      } else if (status === 404) {
        console.log(`[INFO] ${endpoint.name} (${status}) - Not Found`);
        results.push({ name: endpoint.name, status: "INFO", code: status });
      } else {
        console.log(
          `[FAIL] ${endpoint.name} (${status}) - ${data?.message || data?.error || "Unknown error"}`,
        );
        results.push({
          name: endpoint.name,
          status: "FAIL",
          code: status,
          error: data?.message || data?.error,
        });
      }
    } catch (error) {
      console.log(`[ERROR] ${endpoint.name} - ${error.message}`);
      results.push({
        name: endpoint.name,
        status: "ERROR",
        error: error.message,
      });
    }
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const info = results.filter((r) => r.status === "INFO").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const errors = results.filter((r) => r.status === "ERROR").length;

  console.log("\n==========================================");
  console.log("STUDENT ALL ENDPOINTS TEST REPORT");
  console.log("==========================================");
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Info: ${info}`);
  console.log(`Failed: ${failed}`);
  console.log(`Errors: ${errors}`);

  if (failed > 0 || errors > 0) {
    console.log("\nFailed/Error Endpoints:");
    results
      .filter((r) => r.status === "FAIL" || r.status === "ERROR")
      .forEach((r) => {
        console.log(`- ${r.name} (${r.status}): ${r.error || "N/A"}`);
      });
  }
}

testAllEndpoints();
