// src/test/test-teacher.js
const credential =
  "Abdelrhman_Elshaer@jupiterLearn.com:Elshaer@jupiterLearn2026";
const API_TOKEN = btoa(credential);
const BASE_URL = "http://localhost:3000";
const API_AUTH = `Basic ${API_TOKEN}`;
const TEACHER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3ODYzNTI0NzEsImV4cCI6MTc4Njk1NzI3MX0._CC1YKYdAP3yJZwfQsXMaEqNc5CKdEvQedsTFxQswHo";

const headers = {
  Authorization: API_AUTH,
  "x-client-key": TEACHER_TOKEN,
  "Content-Type": "application/json",
};

const endpoints = [
  // Grades
  { method: "GET", url: "/api/teacher/grades", name: "All Grades" },
  { method: "GET", url: "/api/teacher/grades/active", name: "Active Grades" },
  {
    method: "GET",
    url: "/api/teacher/grades/inactive",
    name: "Inactive Grades",
  },
  { method: "GET", url: "/api/teacher/grades/1", name: "Grade By ID" },
  { method: "GET", url: "/api/teacher/grades/1/stats", name: "Grade Stats" },
  {
    method: "GET",
    url: "/api/teacher/grades/stats/all",
    name: "All Grades Stats",
  },

  // Groups
  { method: "GET", url: "/api/teacher/groups", name: "All Groups" },
  { method: "GET", url: "/api/teacher/groups/1", name: "Group By ID" },
  {
    method: "GET",
    url: "/api/teacher/groups/grade/1",
    name: "Groups By Grade",
  },
  { method: "GET", url: "/api/teacher/groups/1/stats", name: "Group Stats" },
  {
    method: "GET",
    url: "/api/teacher/groups/stats/all",
    name: "All Groups Stats",
  },

  // Students
  { method: "GET", url: "/api/teacher/students", name: "All Students" },
  {
    method: "GET",
    url: "/api/teacher/students/search?barcode=300015",
    name: "Search Student by Barcode",
  },
  { method: "GET", url: "/api/teacher/students/15", name: "Student By ID" },
  {
    method: "GET",
    url: "/api/teacher/students/15/profile",
    name: "Student Profile",
  },
  {
    method: "GET",
    url: "/api/teacher/students/15/stats",
    name: "Student Stats",
  },

  // Attendance
  {
    method: "GET",
    url: "/api/teacher/attendance/overall",
    name: "Attendance Overall",
  },
  {
    method: "GET",
    url: "/api/teacher/attendance/consecutive-absences",
    name: "Consecutive Absences",
  },
  {
    method: "GET",
    url: "/api/teacher/attendance/grade/1/stats",
    name: "Grade Attendance Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/attendance/group/1/date/2026-09-01",
    name: "Group Attendance Date",
  },
  {
    method: "GET",
    url: "/api/teacher/attendance/group/1/month/2026-09",
    name: "Group Attendance Month",
  },

  // Payments
  {
    method: "GET",
    url: "/api/teacher/payments/collections",
    name: "Payment Collections",
  },
  {
    method: "GET",
    url: "/api/teacher/payments/unpaid",
    name: "Unpaid Students",
  },
  {
    method: "GET",
    url: "/api/teacher/payments/overall",
    name: "Payment Overall",
  },
  {
    method: "GET",
    url: "/api/teacher/payments/grade/1/stats",
    name: "Grade Payment Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/payments/group/1/stats",
    name: "Group Payment Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/payments/grade/1/month/2026-09",
    name: "Grade Payment Month",
  },
  {
    method: "GET",
    url: "/api/teacher/payments/group/1/month/2026-09",
    name: "Group Payment Month",
  },

  // Subscriptions
  {
    method: "GET",
    url: "/api/teacher/subscriptions/student/15",
    name: "Student Subscriptions",
  },
  {
    method: "GET",
    url: "/api/teacher/subscriptions/month/2026-09",
    name: "Month Subscriptions",
  },
  {
    method: "GET",
    url: "/api/teacher/subscriptions/without-current",
    name: "Without Subscription",
  },
  {
    method: "GET",
    url: "/api/teacher/subscriptions/grade/1/stats",
    name: "Grade Subscription Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/subscriptions/group/1/stats",
    name: "Group Subscription Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/subscriptions/overall",
    name: "Subscription Overall",
  },

  // Paper Exams
  { method: "GET", url: "/api/teacher/exams", name: "All Exams" },
  { method: "GET", url: "/api/teacher/exams/1", name: "Exam By ID" },
  { method: "GET", url: "/api/teacher/exams/grade/1", name: "Exams By Grade" },
  { method: "GET", url: "/api/teacher/exams/group/1", name: "Exams By Group" },
  { method: "GET", url: "/api/teacher/exams/1/stats", name: "Exam Stats" },
  {
    method: "GET",
    url: "/api/teacher/exams/grade/1/stats",
    name: "Grade Exam Stats",
  },

  // Exam Results
  { method: "GET", url: "/api/teacher/exam-results/1", name: "Exam Results" },
  {
    method: "GET",
    url: "/api/teacher/exam-results/1/stats",
    name: "Exam Result Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/exam-results/grade/1/stats",
    name: "Grade Exam Results",
  },
  {
    method: "GET",
    url: "/api/teacher/exam-results/group/1/stats",
    name: "Group Exam Results",
  },

  // Online Exams (READ ONLY)
  { method: "GET", url: "/api/teacher/online-exams", name: "All Online Exams" },
  {
    method: "GET",
    url: "/api/teacher/online-exams/1",
    name: "Online Exam By ID",
  },
  {
    method: "GET",
    url: "/api/teacher/online-exams/grade/1",
    name: "Online Exams Grade",
  },
  {
    method: "GET",
    url: "/api/teacher/online-exams/group/1",
    name: "Online Exams Group",
  },
  {
    method: "GET",
    url: "/api/teacher/online-exams/stats/1",
    name: "Online Exam Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/online-exams/stats/grade/1",
    name: "Grade Online Exam Stats",
  },

  // Questions (READ ONLY)
  {
    method: "GET",
    url: "/api/teacher/questions/exam/1",
    name: "Questions By Exam",
  },
  { method: "GET", url: "/api/teacher/questions/1", name: "Question By ID" },

  // Options (READ ONLY)
  {
    method: "GET",
    url: "/api/teacher/options/question/1",
    name: "Options By Question",
  },
  { method: "GET", url: "/api/teacher/options/1", name: "Option By ID" },

  // Student Exams
  { method: "GET", url: "/api/teacher/student-exams/1", name: "Student Exams" },
  {
    method: "GET",
    url: "/api/teacher/student-exams/1/stats",
    name: "Student Exam Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/student-exams/grade/1/stats",
    name: "Grade Student Exam Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/student-exams/group/1/stats",
    name: "Group Student Exam Stats",
  },

  // Student Answers
  {
    method: "GET",
    url: "/api/teacher/student-answers/question/1/stats",
    name: "Question Answer Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/student-answers/question/1/options",
    name: "Most Selected Options",
  },

  // Assignments (READ ONLY)
  { method: "GET", url: "/api/teacher/assignments", name: "All Assignments" },
  {
    method: "GET",
    url: "/api/teacher/assignments/1",
    name: "Assignment By ID",
  },
  {
    method: "GET",
    url: "/api/teacher/assignments/grade/1",
    name: "Assignments By Grade",
  },
  {
    method: "GET",
    url: "/api/teacher/assignments/group/1",
    name: "Assignments By Group",
  },

  // Assignment Submissions (READ ONLY)
  {
    method: "GET",
    url: "/api/teacher/assignment-submissions/assignment/1",
    name: "Submissions",
  },
  {
    method: "GET",
    url: "/api/teacher/assignment-submissions/assignment/1/student/15",
    name: "Student Submission",
  },
  {
    method: "GET",
    url: "/api/teacher/assignment-submissions/stats/assignment/1",
    name: "Assignment Submission Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/assignment-submissions/stats/grade/1",
    name: "Grade Submission Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/assignment-submissions/stats/group/1",
    name: "Group Submission Stats",
  },

  // Videos (READ ONLY)
  { method: "GET", url: "/api/teacher/videos", name: "All Videos" },
  { method: "GET", url: "/api/teacher/videos/active", name: "Active Videos" },
  {
    method: "GET",
    url: "/api/teacher/videos/inactive",
    name: "Inactive Videos",
  },
  {
    method: "GET",
    url: "/api/teacher/videos/grade/1",
    name: "Videos By Grade",
  },
  { method: "GET", url: "/api/teacher/videos/1", name: "Video By ID" },

  // Playlists (READ ONLY)
  { method: "GET", url: "/api/teacher/playlists", name: "All Playlists" },
  {
    method: "GET",
    url: "/api/teacher/playlists/active",
    name: "Active Playlists",
  },
  {
    method: "GET",
    url: "/api/teacher/playlists/inactive",
    name: "Inactive Playlists",
  },
  {
    method: "GET",
    url: "/api/teacher/playlists/grade/1",
    name: "Playlists By Grade",
  },
  { method: "GET", url: "/api/teacher/playlists/1", name: "Playlist By ID" },
  {
    method: "GET",
    url: "/api/teacher/playlists/stats/1",
    name: "Playlist Stats",
  },
  {
    method: "GET",
    url: "/api/teacher/playlists/stats/grade/1",
    name: "Grade Playlists Stats",
  },

  // Playlist Videos (READ ONLY)
  {
    method: "GET",
    url: "/api/teacher/playlist-videos/playlist/1",
    name: "Playlist Videos",
  },

  // Settings
  {
    method: "PUT",
    url: "/api/teacher/settings/change-password",
    name: "Change Password",
    body: {
      oldPassword: "admin123",
      newPassword: "newpass",
      confirmPassword: "newpass",
    },
  },
];

async function testAllEndpoints() {
  console.log("Testing TEACHER endpoints...\n");
  const results = [];

  for (const endpoint of endpoints) {
    try {
      const options = { method: endpoint.method, headers: { ...headers } };
      if (endpoint.body && endpoint.method !== "GET") {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(`${BASE_URL}${endpoint.url}`, options);
      const status = response.status;
      const data = await response.json().catch(() => null);

      if (status >= 200 && status < 300) {
        console.log(`[PASS] ${endpoint.name} (${status})`);
        results.push({ name: endpoint.name, status: "PASS", code: status });
      } else if (status === 403 || status === 404) {
        console.log(
          `[INFO] ${endpoint.name} (${status}) - ${data?.message || "Forbidden/Not Found"}`,
        );
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
  console.log("TEACHER TEST REPORT");
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
