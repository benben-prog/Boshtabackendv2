const credential =
  "Abdelrhman_Elshaer@jupiterLearn.com:Elshaer@jupiterLearn2026";
const API_TOKEN = btoa(credential);
const BASE_URL = "http://localhost:3000";
const API_AUTH = `Basic ${API_TOKEN}`;
const ASSISTANT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFzc2lzdGFudCIsImlhdCI6MTc4NjM1MjQ2MCwiZXhwIjoxNzg2OTU3MjYwfQ.Vhtek_vh_P5jghiLTycLEf-vIjjZn9NU1z6L2xC4nt8";

const headers = {
  Authorization: API_AUTH,
  "x-client-key": ASSISTANT_TOKEN,
  "Content-Type": "application/json",
};

const endpoints = [
  { method: "GET", url: "/api/assistant/grades", name: "All Grades" },
  { method: "GET", url: "/api/assistant/grades/active", name: "Active Grades" },
  {
    method: "GET",
    url: "/api/assistant/grades/inactive",
    name: "Inactive Grades",
  },
  { method: "GET", url: "/api/assistant/grades/1", name: "Grade By ID" },
  { method: "GET", url: "/api/assistant/grades/1/stats", name: "Grade Stats" },
  {
    method: "GET",
    url: "/api/assistant/grades/stats/all",
    name: "All Grades Stats",
  },

  { method: "GET", url: "/api/assistant/groups", name: "All Groups" },
  { method: "GET", url: "/api/assistant/groups/1", name: "Group By ID" },
  {
    method: "GET",
    url: "/api/assistant/groups/grade/1",
    name: "Groups By Grade",
  },
  { method: "GET", url: "/api/assistant/groups/1/stats", name: "Group Stats" },
  {
    method: "GET",
    url: "/api/assistant/groups/stats/all",
    name: "All Groups Stats",
  },

  { method: "GET", url: "/api/assistant/students", name: "All Students" },
  {
    method: "GET",
    url: "/api/assistant/students/search?barcode=300015",
    name: "Search Student by Barcode",
  },
  { method: "GET", url: "/api/assistant/students/15", name: "Student By ID" },
  {
    method: "GET",
    url: "/api/assistant/students/15/profile",
    name: "Student Profile",
  },
  {
    method: "GET",
    url: "/api/assistant/students/15/stats",
    name: "Student Stats",
  },

  {
    method: "GET",
    url: "/api/assistant/attendance/overall",
    name: "Attendance Overall",
  },
  {
    method: "GET",
    url: "/api/assistant/attendance/consecutive-absences",
    name: "Consecutive Absences",
  },
  {
    method: "GET",
    url: "/api/assistant/attendance/grade/1/stats",
    name: "Grade Attendance Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/attendance/group/1/date/2026-09-01",
    name: "Group Attendance Date",
  },
  {
    method: "GET",
    url: "/api/assistant/attendance/group/1/month/2026-09",
    name: "Group Attendance Month",
  },

  {
    method: "GET",
    url: "/api/assistant/payments/collections",
    name: "Payment Collections",
  },
  {
    method: "GET",
    url: "/api/assistant/payments/unpaid",
    name: "Unpaid Students",
  },
  {
    method: "GET",
    url: "/api/assistant/payments/overall",
    name: "Payment Overall",
  },
  {
    method: "GET",
    url: "/api/assistant/payments/grade/1/stats",
    name: "Grade Payment Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/payments/group/1/stats",
    name: "Group Payment Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/payments/grade/1/month/2026-09",
    name: "Grade Payment Month",
  },
  {
    method: "GET",
    url: "/api/assistant/payments/group/1/month/2026-09",
    name: "Group Payment Month",
  },

  {
    method: "GET",
    url: "/api/assistant/subscriptions/student/15",
    name: "Student Subscriptions",
  },
  {
    method: "GET",
    url: "/api/assistant/subscriptions/month/2026-09",
    name: "Month Subscriptions",
  },
  {
    method: "GET",
    url: "/api/assistant/subscriptions/without-current",
    name: "Without Subscription",
  },
  {
    method: "GET",
    url: "/api/assistant/subscriptions/grade/1/stats",
    name: "Grade Subscription Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/subscriptions/group/1/stats",
    name: "Group Subscription Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/subscriptions/overall",
    name: "Subscription Overall",
  },

  { method: "GET", url: "/api/assistant/exams", name: "All Exams" },
  { method: "GET", url: "/api/assistant/exams/1", name: "Exam By ID" },
  {
    method: "GET",
    url: "/api/assistant/exams/grade/1",
    name: "Exams By Grade",
  },
  {
    method: "GET",
    url: "/api/assistant/exams/group/1",
    name: "Exams By Group",
  },
  { method: "GET", url: "/api/assistant/exams/1/stats", name: "Exam Stats" },
  {
    method: "GET",
    url: "/api/assistant/exams/grade/1/stats",
    name: "Grade Exam Stats",
  },

  { method: "GET", url: "/api/assistant/exam-results/1", name: "Exam Results" },
  {
    method: "GET",
    url: "/api/assistant/exam-results/1/stats",
    name: "Exam Result Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/exam-results/grade/1/stats",
    name: "Grade Exam Results",
  },
  {
    method: "GET",
    url: "/api/assistant/exam-results/group/1/stats",
    name: "Group Exam Results",
  },

  {
    method: "GET",
    url: "/api/assistant/online-exams",
    name: "All Online Exams",
  },
  {
    method: "GET",
    url: "/api/assistant/online-exams/1",
    name: "Online Exam By ID",
  },
  {
    method: "GET",
    url: "/api/assistant/online-exams/grade/1",
    name: "Online Exams Grade",
  },
  {
    method: "GET",
    url: "/api/assistant/online-exams/group/1",
    name: "Online Exams Group",
  },
  {
    method: "GET",
    url: "/api/assistant/online-exams/stats/1",
    name: "Online Exam Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/online-exams/stats/grade/1",
    name: "Grade Online Exam Stats",
  },

  {
    method: "POST",
    url: "/api/assistant/online-exams",
    name: "Create Online Exam",
    body: {
      title: "Test Exam",
      description: "Test",
      gradeId: 1,
      durationMinutes: 30,
      startAt: "2026-08-10T00:00:00.000Z",
      endAt: "2026-12-31T23:59:59.000Z",
      fullMark: 100,
      randomizeQuestions: 0,
    },
  },
  {
    method: "PUT",
    url: "/api/assistant/online-exams/1",
    name: "Update Online Exam",
    body: { title: "Updated Exam", durationMinutes: 45 },
  },
  {
    method: "DELETE",
    url: "/api/assistant/online-exams/5",
    name: "Delete Online Exam",
  },

  {
    method: "GET",
    url: "/api/assistant/questions/exam/1",
    name: "Questions By Exam",
  },
  { method: "GET", url: "/api/assistant/questions/1", name: "Question By ID" },
  {
    method: "POST",
    url: "/api/assistant/questions",
    name: "Create Question",
    body: { examId: 1, questionText: "Test question?", type: "mcq", order: 1 },
  },
  {
    method: "PUT",
    url: "/api/assistant/questions/1",
    name: "Update Question",
    body: { questionText: "Updated question?" },
  },

  {
    method: "GET",
    url: "/api/assistant/options/question/1",
    name: "Options By Question",
  },
  { method: "GET", url: "/api/assistant/options/1", name: "Option By ID" },
  {
    method: "POST",
    url: "/api/assistant/options",
    name: "Create Option",
    body: { questionId: 1, optionText: "Yes", isCorrect: 1, order: 1 },
  },
  {
    method: "PUT",
    url: "/api/assistant/options/1",
    name: "Update Option",
    body: { optionText: "No", isCorrect: 0 },
  },

  {
    method: "GET",
    url: "/api/assistant/student-exams/1",
    name: "Student Exams",
  },
  {
    method: "GET",
    url: "/api/assistant/student-exams/1/stats",
    name: "Student Exam Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/student-exams/grade/1/stats",
    name: "Grade Student Exam Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/student-exams/group/1/stats",
    name: "Group Student Exam Stats",
  },

  {
    method: "GET",
    url: "/api/assistant/student-answers/question/1/stats",
    name: "Question Answer Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/student-answers/question/1/options",
    name: "Most Selected Options",
  },

  { method: "GET", url: "/api/assistant/assignments", name: "All Assignments" },
  {
    method: "GET",
    url: "/api/assistant/assignments/1",
    name: "Assignment By ID",
  },
  {
    method: "GET",
    url: "/api/assistant/assignments/grade/1",
    name: "Assignments By Grade",
  },
  {
    method: "GET",
    url: "/api/assistant/assignments/group/1",
    name: "Assignments By Group",
  },
  {
    method: "POST",
    url: "/api/assistant/assignments",
    name: "Create Assignment",
    body: {
      title: "Test Assignment",
      description: "Test",
      gradeId: 1,
      fullMark: 100,
      deadline: "2026-12-31T23:59:59.000Z",
    },
  },
  {
    method: "PUT",
    url: "/api/assistant/assignments/1",
    name: "Update Assignment",
    body: { title: "Updated Assignment" },
  },

  {
    method: "GET",
    url: "/api/assistant/assignment-submissions/assignment/1",
    name: "Submissions",
  },
  {
    method: "GET",
    url: "/api/assistant/assignment-submissions/assignment/1/student/15",
    name: "Student Submission",
  },
  {
    method: "PUT",
    url: "/api/assistant/assignment-submissions/1/grade",
    name: "Grade Submission",
    body: { score: 85, feedback: "Good work!" },
  },
  {
    method: "GET",
    url: "/api/assistant/assignment-submissions/stats/assignment/1",
    name: "Assignment Submission Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/assignment-submissions/stats/grade/1",
    name: "Grade Submission Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/assignment-submissions/stats/group/1",
    name: "Group Submission Stats",
  },

  { method: "GET", url: "/api/assistant/videos", name: "All Videos" },
  { method: "GET", url: "/api/assistant/videos/active", name: "Active Videos" },
  {
    method: "GET",
    url: "/api/assistant/videos/inactive",
    name: "Inactive Videos",
  },
  {
    method: "GET",
    url: "/api/assistant/videos/grade/1",
    name: "Videos By Grade",
  },
  { method: "GET", url: "/api/assistant/videos/1", name: "Video By ID" },
  {
    method: "POST",
    url: "/api/assistant/videos",
    name: "Create Video",
    body: {
      title: "Test Video",
      description: "Test",
      gradeId: 1,
      youtubeUrl: "https://youtube.com/watch?v=test123",
    },
  },
  {
    method: "PUT",
    url: "/api/assistant/videos/1",
    name: "Update Video",
    body: { title: "Updated Video" },
  },

  { method: "GET", url: "/api/assistant/playlists", name: "All Playlists" },
  {
    method: "GET",
    url: "/api/assistant/playlists/active",
    name: "Active Playlists",
  },
  {
    method: "GET",
    url: "/api/assistant/playlists/inactive",
    name: "Inactive Playlists",
  },
  {
    method: "GET",
    url: "/api/assistant/playlists/grade/1",
    name: "Playlists By Grade",
  },
  { method: "GET", url: "/api/assistant/playlists/1", name: "Playlist By ID" },
  {
    method: "GET",
    url: "/api/assistant/playlists/stats/1",
    name: "Playlist Stats",
  },
  {
    method: "GET",
    url: "/api/assistant/playlists/stats/grade/1",
    name: "Grade Playlists Stats",
  },
  {
    method: "POST",
    url: "/api/assistant/playlists",
    name: "Create Playlist",
    body: { title: "Test Playlist", description: "Test", gradeId: 1 },
  },
  {
    method: "PUT",
    url: "/api/assistant/playlists/1",
    name: "Update Playlist",
    body: { title: "Updated Playlist" },
  },

  {
    method: "GET",
    url: "/api/assistant/playlist-videos/playlist/1",
    name: "Playlist Videos",
  },
  {
    method: "POST",
    url: "/api/assistant/playlist-videos",
    name: "Add Video To Playlist",
    body: { playlistId: 1, videoId: 1 },
  },

  {
    method: "PUT",
    url: "/api/assistant/settings/change-password",
    name: "Change Password",
    body: {
      oldPassword: "abc@123",
      newPassword: "newpass",
      confirmPassword: "newpass",
    },
  },
];

async function testAllEndpoints() {
  console.log("Testing ASSISTANT endpoints...\n");
  const results = [];

  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: { ...headers },
      };

      if (endpoint.body && endpoint.method !== "GET") {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(`${BASE_URL}${endpoint.url}`, options);
      const status = response.status;
      const data = await response.json().catch(() => null);

      if (status >= 200 && status < 300) {
        console.log(`[PASS] ${endpoint.name} (${status})`);
        results.push({ name: endpoint.name, status: "PASS", code: status });
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
  const failed = results.filter((r) => r.status === "FAIL").length;
  const errors = results.filter((r) => r.status === "ERROR").length;

  console.log("\n==========================================");
  console.log("ASSISTANT TEST REPORT");
  console.log("==========================================");
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Errors: ${errors}`);

  if (failed > 0 || errors > 0) {
    console.log("\nFailed/Error Endpoints:");
    results
      .filter((r) => r.status !== "PASS")
      .forEach((r) => {
        console.log(`- ${r.name} (${r.status}): ${r.error || "N/A"}`);
      });
  }
}

testAllEndpoints();
