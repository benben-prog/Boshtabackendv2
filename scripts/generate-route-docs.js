const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const app = require("../src/app");

const root = path.resolve(__dirname, "..");
const existingSwagger = swaggerJsdoc({
  definition: { openapi: "3.0.0" },
  apis: [
    path.join(root, "src/docs/auth.docs.js"),
    path.join(root, "src/docs/student.docs.js"),
    path.join(root, "src/docs/parent.docs.js"),
    path.join(root, "src/docs/assistant.docs.js"),
    path.join(root, "src/docs/teacher.docs.js"),
    path.join(root, "src/docs/super-admin.docs.js"),
  ],
});
const prefixes = ["/api/auth", "/api/student", "/api/parent", "/api/assistant", "/api/teacher", "/api/super-admin", "/webhook"];
const normalizePath = (value) => {
  const normalized = value.replace(/:([A-Za-z0-9_]+)/g, "{$1}").replace(/\/$/, "");
  return normalized || "/";
};
const stack = app.router?.stack || app._router?.stack || [];
const operations = [];
let routerIndex = 0;

for (const layer of stack) {
  if (!layer.handle?.stack) continue;
  const prefix = prefixes[routerIndex++];
  if (!prefix) continue;
  for (const child of layer.handle.stack) {
    if (!child.route) continue;
    for (const method of Object.keys(child.route.methods || {})) {
      const fullPath = normalizePath(`${prefix}${child.route.path}`.replace(/\/+/g, "/"));
      if (fullPath.startsWith("/api/") || fullPath.startsWith("/webhook")) {
        operations.push({ method: method.toUpperCase(), path: fullPath });
      }
    }
  }
}

const uniqueOperations = [...new Map(operations.map((op) => [`${op.method} ${op.path}`, op])).values()]
  .sort((a, b) => `${a.path} ${a.method}`.localeCompare(`${b.path} ${b.method}`));

const existing = new Set();
for (const [route, item] of Object.entries(existingSwagger.paths || {})) {
  for (const method of Object.keys(item)) {
    if (!["parameters", "summary", "description"].includes(method)) existing.add(`${method.toUpperCase()} ${route}`);
  }
}

// Map each route to its precise tag
const tagFor = (route) => {
  if (route.startsWith("/api/auth")) return "Auth";
  if (route.startsWith("/api/parent")) return "Parent";
  if (route.startsWith("/webhook")) return "Webhooks";

  // Student portal
  if (route.startsWith("/api/student")) {
    if (route.includes("/attendance")) return "Student - Attendance";
    if (route.includes("/exams/online")) return "Student - Online Exams";
    if (route.includes("/exams/paper") || route.includes("/exams")) return "Student - Paper Exams";
    if (route.includes("/assignments")) return "Student - Assignments";
    if (route.includes("/videos") || route.includes("/playlists")) return "Student - Videos & Playlists";
    if (route.includes("/payments")) return "Student - Payments";
    if (route.includes("/questions") || route.includes("/options")) return "Student - Questions & Options";
    return "Student - Dashboard & Profile";
  }

  // Teacher portal
  if (route.startsWith("/api/teacher")) {
    if (route.includes("/assistants")) return "Teacher - Profile & Dashboard";
    if (route.includes("/exams")) return "Teacher - Paper Exams";
    if (route.includes("/online-exams")) return "Teacher - Online Exams";
    if (route.includes("/attendance")) return "Teacher - Attendance";
    if (route.includes("/students")) return "Teacher - Students";
    if (route.includes("/groups")) return "Teacher - Groups";
    if (route.includes("/grades")) return "Teacher - Grades";
    if (route.includes("/assignments")) return "Teacher - Assignments";
    if (route.includes("/videos") || route.includes("/playlists")) return "Teacher - Videos & Playlists";
    if (route.includes("/payments")) return "Teacher - Payments";
    if (route.includes("/subscriptions")) return "Teacher - Subscriptions";
    return "Teacher - Profile & Dashboard";
  }

  // Assistant portal
  if (route.startsWith("/api/assistant")) {
    if (route.includes("/attendance")) return "Assistant - Attendance";
    if (route.includes("/exam-results")) return "Assistant - Exam Results";
    if (route.includes("/exams")) return "Assistant - Paper Exams";
    if (route.includes("/online-exams")) return "Assistant - Online Exams";
    if (route.includes("/grades")) return "Assistant - Grades";
    if (route.includes("/groups")) return "Assistant - Groups";
    if (route.includes("/students")) return "Assistant - Students";
    if (route.includes("/student-answers")) {
      if (route.includes("/download") || route.includes("/preview")) return "Assistant - Download & Preview";
      return "Assistant - Student Answers";
    }
    if (route.includes("/whatsapp")) {
      if (route.includes("/template")) return "Assistant - WhatsApp Templates";
      return "Assistant - WhatsApp Messages";
    }
    if (route.includes("/bulk")) return "Assistant - Bulk Upload";
    if (route.includes("/payments")) return "Assistant - Payments";
    if (route.includes("/subscriptions")) return "Assistant - Subscriptions";
    if (route.includes("/videos")) return "Assistant - Videos";
    if (route.includes("/playlists")) return "Assistant - Playlists";
    if (route.includes("/download") || route.includes("/preview")) return "Assistant - Download & Preview";
    return "Assistant - Profile & Dashboard";
  }

  // Super Admin portal
  if (route.startsWith("/api/super-admin")) {
    if (route.includes("/assignment-submissions")) return "Super Admin - Assignment Submissions";
    if (route.includes("/assignments")) {
      if (route.includes("/download") || route.includes("/preview")) return "Super Admin - Download & Preview";
      return "Super Admin - Assignments";
    }
    if (route.includes("/attendance")) return "Super Admin - Attendance";
    if (route.includes("/exam-results")) return "Super Admin - Exam Results";
    if (route.includes("/exams")) return "Super Admin - Paper Exams";
    if (route.includes("/grades")) return "Super Admin - Grades";
    if (route.includes("/groups")) return "Super Admin - Groups";
    if (route.includes("/online-exams")) return "Super Admin - Online Exams";
    if (route.includes("/options")) return "Super Admin - Options";
    if (route.includes("/payments")) return "Super Admin - Payments";
    if (route.includes("/playlists")) return "Super Admin - Playlists";
    if (route.includes("/questions")) {
      if (route.includes("/download") || route.includes("/preview")) return "Super Admin - Download & Preview";
      return "Super Admin - Questions";
    }
    if (route.includes("/student-answers")) {
      if (route.includes("/preview") || route.includes("/download")) return "Super Admin - Download & Preview";
      return "Super Admin - Student Answers";
    }
    if (route.includes("/student-exams")) return "Super Admin - Student Exams";
    if (route.includes("/students")) return "Super Admin - Students";
    if (route.includes("/subscriptions")) return "Super Admin - Subscriptions";
    if (route.includes("/videos")) {
      if (route.includes("/download") || route.includes("/preview")) return "Super Admin - Download & Preview";
      return "Super Admin - Videos";
    }
    if (route.includes("/users")) return "Super Admin - Users";
    if (route.includes("/settings")) return "Super Admin - Settings";
    if (route.includes("/whatsapp")) return "Super Admin - WhatsApp";
    if (route.includes("/activity-logs")) return "Super Admin - Activity Log";
    return "Super Admin - Dashboard";
  }

  return "General";
};

const securityFor = (route) => {
  if (route.startsWith("/api/auth") || route.startsWith("/api/parent") || route.startsWith("/webhook")) return "";
  if (route.startsWith("/api/super-admin")) return "    security:\n      - ApiAuth: []\n        ClientToken: []\n      - ApiAuth: []\n        SuperAdminKey: []\n";
  return "    security:\n      - ApiAuth: []\n        ClientToken: []\n";
};

// Generate clear human-friendly summaries (Arabic & English)
const humanize = (method, route) => {
  const dictionary = {
    // Student
    "GET /api/student/attendance/consecutive-absences": "Get student consecutive absences count (عدد مرات الغياب المتتالي للطالب)",
    "GET /api/student/exams/online/{attemptId}/review": "Review online exam attempt details (مراجعة تفاصيل محاولة الامتحان الإلكتروني)",
    "GET /api/student/exams/online/{examId}/check-attempt": "Check student exam attempt status (فحص حالة محاولة الامتحان)",
    "GET /api/student/exams/online/{examId}/resume": "Resume in-progress online exam attempt (استئناف محاولة الامتحان الإلكتروني الجارية)",
    "DELETE /api/student/profile-image": "Remove student profile image (حذف الصورة الشخصية للطالب)",

    // Teacher
    "GET /api/teacher/assistants": "Get all active assistants (عرض قائمة المساعدين المتاحين)",
    "GET /api/teacher/assistants/{userId}": "Get assistant details by ID (تفاصيل المساعد)",
    "GET /api/teacher/exams/grade/{gradeId}/stats": "Get paper exam stats by grade (إحصائيات الامتحانات الورقية لصف دراسي)",

    // Assistant
    "DELETE /api/assistant/attendance/{id}": "Delete attendance record (حذف سجل حضور)",
    "PUT /api/assistant/attendance/{id}": "Update attendance record (تعديل سجل حضور)",
    "GET /api/assistant/attendance/summary/group/{groupId}/date/{date}": "Get group attendance summary by date (ملخص حضور المجموعة في تاريخ معين)",
    "GET /api/assistant/exam-results/exam/{examId}": "Get exam results list (عرض نتائج الامتحان الورقي)",
    "GET /api/assistant/exams/{id}/stats": "Get paper exam statistics (إحصائيات الامتحان الورقي)",
    "GET /api/assistant/exams/grade/{gradeId}/stats": "Get exam statistics by grade (إحصائيات الامتحانات لصف دراسي)",
    "GET /api/assistant/grades/{id}/details": "Get grade full details with groups (تفاصيل الصف الدراسي مع المجموعات)",
    "GET /api/assistant/student-answers/{answerId}/download": "Download student essay answer file (تنزيل ملف إجابة الطالب المقالية)",
    "GET /api/assistant/whatsapp/dashboard": "Get WhatsApp dashboard statistics (إحصائيات رسائل الواتساب)",
    "POST /api/assistant/whatsapp/queue/force-process": "Force process WhatsApp queue (معالجة طابور رسائل الواتساب فورياً)",
    "PUT /api/assistant/whatsapp/settings": "Update WhatsApp sending settings (تحديث إعدادات إرسال الواتساب)",

    // Super Admin - Attendance
    "GET /api/super-admin/attendance/consecutive-absences": "Get students with consecutive absences (عرض الطلاب الغائبين حصص متتالية)",
    "GET /api/super-admin/attendance/dashboard": "Get attendance dashboard statistics (لوحة إحصائيات الحضور العامة)",
    "GET /api/super-admin/attendance/grade/{gradeId}/stats": "Get attendance stats by grade (إحصائيات الحضور لصف دراسي)",
    "GET /api/super-admin/attendance/group/{groupId}/date/{date}": "Get group attendance for specific date (حضور المجموعة في تاريخ محدد)",
    "GET /api/super-admin/attendance/group/{groupId}/month/{month}": "Get group attendance for specific month (حضور المجموعة خلال شهر محدد)",
    "GET /api/super-admin/attendance/overall-stats": "Get overall attendance statistics (إحصائيات الحضور الإجمالية)",
    "POST /api/super-admin/attendance/scan-barcode": "Record attendance by barcode scan (تسجيل الحضور بالباركود)",
    "PUT /api/super-admin/attendance/sessions/{id}/toggle-makeup": "Toggle session makeup mode (تفعيل/إلغاء وضع الحضور التعويضي)",
    "GET /api/super-admin/attendance/sessions/active/{groupId}": "Get active session for group (عرض الجلسة النشطة للمجموعة)",
    "POST /api/super-admin/attendance/sessions/lock": "Lock attendance recording for session (قفل تسجيل الحضور للجلسة)",
    "POST /api/super-admin/attendance/sessions/start": "Start new attendance session (بدء جلسة حضور لمجموعة)",
    "GET /api/super-admin/attendance/summary/group/{groupId}/date/{date}": "Get attendance summary for group and date (ملخص حضور المجموعة في تاريخ معين)",

    // Super Admin - Exam Results
    "GET /api/super-admin/exam-results/exam/{examId}": "Get exam results list (عرض نتائج الامتحان الورقي)",
    "GET /api/super-admin/exam-results/exam/{examId}/stats": "Get exam results statistics (إحصائيات نتائج الامتحان)",
    "GET /api/super-admin/exam-results/grade/{gradeId}/stats": "Get exam results stats by grade (إحصائيات نتائج الامتحانات لصف دراسي)",
    "GET /api/super-admin/exam-results/group/{groupId}/stats": "Get exam results stats by group (إحصائيات نتائج الامتحانات لمجموعة)",
    "POST /api/super-admin/exam-results/upsert-batch/{examId}": "Batch upsert exam results (إدخال وتحديث نتائج امتحان جماعياً)",

    // Super Admin - Paper Exams
    "GET /api/super-admin/exams/{id}/stats": "Get paper exam detailed stats (إحصائيات الامتحان الورقي)",
    "GET /api/super-admin/exams/grade/{gradeId}": "Get exams by grade (عرض الامتحانات لصف دراسي)",
    "GET /api/super-admin/exams/grade/{gradeId}/stats": "Get exam statistics by grade (إحصائيات الامتحانات لصف دراسي)",
    "GET /api/super-admin/exams/group/{groupId}": "Get exams by group (عرض الامتحانات لمجموعة)",

    // Super Admin - Grades
    "GET /api/super-admin/grades/{id}/stats": "Get grade statistics (إحصائيات الصف الدراسي)",
    "POST /api/super-admin/grades/find": "Find grade by name (البحث عن صف دراسي بالاسم)",
    "GET /api/super-admin/grades/groups-count": "Get groups count per grade (عدد المجموعات في كل صف دراسي)",
    "GET /api/super-admin/grades/stats": "Get overall grades statistics (إحصائيات الصفوف الدراسية العامة)",
    "GET /api/super-admin/grades/students-count": "Get students count per grade (عدد الطلاب في كل صف دراسي)",

    // Super Admin - Groups
    "GET /api/super-admin/groups/{id}/full-stats": "Get group full statistics (إحصائيات تفصيلية شاملة للمجموعة)",
    "GET /api/super-admin/groups/{id}/stats": "Get group statistics (إحصائيات المجموعة)",
    "POST /api/super-admin/groups/find": "Find group by name and grade (البحث عن مجموعة بالاسم والصف)",
    "GET /api/super-admin/groups/grade/{gradeId}": "Get groups by grade (عرض مجموعات صف دراسي)",
    "GET /api/super-admin/groups/stats": "Get overall groups statistics (إحصائيات المجموعات العامة)",
    "GET /api/super-admin/groups/students-count": "Get students count per group (عدد الطلاب في كل مجموعة)",
    "GET /api/super-admin/groups/with-grade-name": "Get groups with grade name (عرض المجموعات مع اسم الصف)",

    // Super Admin - Online Exams
    "DELETE /api/super-admin/online-exams/{examId}/permanent": "Permanently delete online exam (حذف نهائي للامتحان الإلكتروني)",
    "GET /api/super-admin/online-exams/available": "Get available online exams (عرض الامتحانات الإلكترونية المتاحة)",
    "GET /api/super-admin/online-exams/expired": "Get expired online exams (عرض الامتحانات الإلكترونية المنتهية)",
    "GET /api/super-admin/online-exams/grade/{gradeId}": "Get online exams by grade (عرض الامتحانات الإلكترونية لصف دراسي)",
    "GET /api/super-admin/online-exams/group/{groupId}": "Get online exams by group (عرض الامتحانات الإلكترونية لمجموعة)",
    "GET /api/super-admin/online-exams/stats/{examId}": "Get online exam detailed statistics (إحصائيات الامتحان الإلكتروني)",
    "GET /api/super-admin/online-exams/stats/grade/{gradeId}": "Get online exam stats by grade (إحصائيات الامتحانات الإلكترونية لصف)",

    // Super Admin - Questions & Options
    "GET /api/super-admin/options/question/{questionId}": "Get options by question ID (عرض خيارات السؤال)",
    "GET /api/super-admin/questions/{questionId}/download": "Download question attachment (تنزيل ملف مرفق بالسؤال)",
    "GET /api/super-admin/questions/{questionId}/preview": "Preview question attachment (معاينة ملف السؤال)",
    "GET /api/super-admin/questions/exam/{examId}": "Get questions for exam (عرض أسئلة الامتحان)",

    // Super Admin - Student Answers & Exams
    "PUT /api/super-admin/student-answers/{answerId}/grade": "Grade essay answer (تصحيح إجابة مقالية لطالب)",
    "GET /api/super-admin/student-answers/{answerId}/preview": "Preview student essay answer file (معاينة ملف إجابة الطالب)",
    "GET /api/super-admin/student-answers/essay/exam/{examId}": "Get essay answers for exam (عرض الإجابات المقالية للامتحان)",
    "GET /api/super-admin/student-answers/essay/pending": "Get pending essay answers for grading (عرض الإجابات المقالية المعلقة للتصحيح)",
    "GET /api/super-admin/student-answers/question/{questionId}/options": "Get most selected options for question (الخيارات الأكثر اختياراً)",
    "GET /api/super-admin/student-answers/question/{questionId}/stats": "Get answer statistics for question (إحصائيات إجابات السؤال)",
    "GET /api/super-admin/student-exams/exam/{examId}": "Get student attempts for exam (عرض محاولات الطلاب للامتحان)",
    "GET /api/super-admin/student-exams/exam/{examId}/stats": "Get student exam attempts stats (إحصائيات محاولات الامتحان)",
    "GET /api/super-admin/student-exams/grade/{gradeId}/stats": "Get exam attempts stats by grade (إحصائيات محاولات الامتحانات لصف)",
    "GET /api/super-admin/student-exams/group/{groupId}/stats": "Get exam attempts stats by group (إحصائيات محاولات الامتحانات لمجموعة)",

    // Super Admin - Student Details
    "GET /api/super-admin/students/{studentId}/assignments": "Get student assignments list (عرض واجبات الطالب)",
    "GET /api/super-admin/students/{studentId}/assignments/{assignmentId}": "Get student assignment details (تفاصيل واجب للطالب)",
    "GET /api/super-admin/students/{studentId}/attendance": "Get student attendance record (سجل حضور الطالب بالكامل)",
    "GET /api/super-admin/students/{studentId}/attendance/consecutive-absences": "Get student consecutive absences (عدد الغياب المتتالي للطالب)",
    "GET /api/super-admin/students/{studentId}/attendance/monthly": "Get student monthly attendance stats (إحصائيات حضور الطالب الشهرية)",
    "GET /api/super-admin/students/{studentId}/attendance/total": "Get student total attendance stats (إجمالي حضور وغياب الطالب)",
    "GET /api/super-admin/students/{studentId}/exams/online/{attemptId}": "Get student online exam attempt details (تفاصيل محاولة امتحان إلكتروني)",
    "GET /api/super-admin/students/{studentId}/exams/online/history": "Get student online exam history (سجل الامتحانات الإلكترونية للطالب)",
    "GET /api/super-admin/students/{studentId}/exams/paper": "Get student paper exam results (نتائج الامتحانات الورقية للطالب)",
    "GET /api/super-admin/students/{studentId}/exams/paper/{examId}": "Get student result for paper exam (نتيجة الطالب في امتحان ورقي محدد)",
    "GET /api/super-admin/students/{studentId}/exams/results": "Get all exam results for student (كافة نتائج امتحانات الطالب)",
    "GET /api/super-admin/students/{studentId}/payments": "Get student payment history (سجل مدفوعات الطالب)",
    "GET /api/super-admin/students/{studentId}/payments/current-subscription": "Get student current month subscription (اشتراك الطالب للشهر الحالي)",
    "GET /api/super-admin/students/{studentId}/playlists": "Get playlists assigned to student (قوائم التشغيل المخصصة للطالب)",
    "GET /api/super-admin/students/{studentId}/submissions": "Get student assignment submissions (تسليمات واجبات الطالب)",
    "GET /api/super-admin/students/{studentId}/submissions/{submissionId}": "Get student assignment submission details (تفاصيل تسليم واجب للطالب)",

    // Super Admin - Payments & Subscriptions
    "GET /api/super-admin/payments/collections": "Get payment collection overview (ملخص تحصيل المدفوعات)",
    "GET /api/super-admin/payments/grade/{gradeId}/month/{month}": "Get payments by grade and month (مدفوعات صف دراسي خلال شهر)",
    "GET /api/super-admin/payments/grade/{gradeId}/stats": "Get payment statistics by grade (إحصائيات المدفوعات لصف دراسي)",
    "GET /api/super-admin/payments/group/{groupId}/month/{month}": "Get payments by group and month (مدفوعات مجموعة خلال شهر)",
    "GET /api/super-admin/payments/group/{groupId}/stats": "Get payment statistics by group (إحصائيات المدفوعات لمجموعة)",
    "GET /api/super-admin/payments/overall": "Get overall payment stats (إحصائيات المدفوعات العامة)",
    "GET /api/super-admin/payments/students-status": "Get payment status for all students (حالة السداد لجميع الطلاب)",
    "GET /api/super-admin/payments/unpaid": "Get unpaid students list (قائمة الطلاب غير المسددين)",
    "GET /api/super-admin/subscriptions/grade/{gradeId}/stats": "Get subscriptions stats by grade (إحصائيات الاشتراكات لصف دراسي)",
    "GET /api/super-admin/subscriptions/group/{groupId}/stats": "Get subscriptions stats by group (إحصائيات الاشتراكات لمجموعة)",
    "GET /api/super-admin/subscriptions/month/{month}": "Get subscriptions for specific month (اشتراكات شهر محدد)",
    "GET /api/super-admin/subscriptions/overall": "Get overall subscriptions summary (ملخص الاشتراكات العام)",
    "GET /api/super-admin/subscriptions/student/{studentId}": "Get subscription history for student (سجل اشتراكات الطالب)",
    "GET /api/super-admin/subscriptions/without-current": "Get students without current month subscription (الطلاب بدون اشتراك للشهر الحالي)",

    // Super Admin - Assignments & Submissions
    "PUT /api/super-admin/assignment-submissions/{submissionId}/grade": "Grade student assignment submission (تقييم ورصد درجة تسليم الواجب)",
    "GET /api/super-admin/assignment-submissions/assignment/{assignmentId}": "Get submissions for assignment (عرض تسليمات الواجب)",
    "GET /api/super-admin/assignment-submissions/assignment/{assignmentId}/not-submitted-students": "Get students who did not submit assignment (الطلاب الذين لم يسلموا الواجب)",
    "GET /api/super-admin/assignment-submissions/assignment/{assignmentId}/student/{studentId}": "Get specific student submission for assignment (تسليم طالب لواجب محدد)",
    "GET /api/super-admin/assignment-submissions/assignment/{assignmentId}/submitted-students": "Get students who submitted assignment (الطلاب الذين سلموا الواجب)",
    "GET /api/super-admin/assignment-submissions/stats/assignment/{assignmentId}": "Get assignment submission statistics (إحصائيات تسليمات الواجب)",
    "GET /api/super-admin/assignment-submissions/stats/grade/{gradeId}": "Get submission stats by grade (إحصائيات تسليمات الواجبات لصف دراسي)",
    "GET /api/super-admin/assignment-submissions/stats/group/{groupId}": "Get submission stats by group (إحصائيات تسليمات الواجبات لمجموعة)",
    "GET /api/super-admin/assignments/{assignmentId}/download": "Download assignment file (تنزيل ملف الواجب)",
    "DELETE /api/super-admin/assignments/{assignmentId}/permanent": "Permanently delete assignment (حذف نهائي للواجب)",
    "GET /api/super-admin/assignments/{assignmentId}/preview": "Preview assignment file (معاينة ملف الواجب)",
    "GET /api/super-admin/assignments/grade/{gradeId}": "Get assignments by grade (عرض واجبات صف دراسي)",
    "GET /api/super-admin/assignments/group/{groupId}": "Get assignments by group (عرض واجبات مجموعة)",

    // Super Admin - Videos & Playlists
    "GET /api/super-admin/playlists/grade/{gradeId}": "Get playlists by grade (عرض قوائم التشغيل لصف دراسي)",
    "GET /api/super-admin/videos/{videoId}/download": "Download video file (تنزيل ملف الفيديو)",
    "GET /api/super-admin/videos/{videoId}/preview": "Preview video file (معاينة الفيديو)",
    "GET /api/super-admin/videos/grade/{gradeId}": "Get videos by grade (عرض الفيديوهات لصف دراسي)",

    // Webhooks
    "GET /webhook/webhook": "Verify WhatsApp webhook (التحقق من ويب هوك الواتساب)",
    "POST /webhook/webhook": "Receive WhatsApp webhook notification (استلام أحداث ويب هوك الواتساب)",
  };

  const key = `${method} ${route}`;
  if (dictionary[key]) return dictionary[key];

  return `${method} ${route.replace(/^\/api\//, "").replace(/[{}]/g, "").replaceAll("/", " ")}`;
};

// Rich request bodies for specific POST/PUT endpoints
const bodyFor = (method, route) => {
  if (["GET", "DELETE"].includes(method)) return "";

  // Attendance update
  if (route === "/api/assistant/attendance/{id}") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - status
            properties:
              status:
                type: string
                enum: [present, absent]
                example: "present"
              method:
                type: string
                enum: [manual, barcode]
                example: "manual"
              is_makeup:
                type: integer
                enum: [0, 1]
                example: 0
              makeup_group_id:
                type: integer
                nullable: true
                example: null
              notes:
                type: string
                example: "تم التعديل يدوياً"
`;
  }

  // Scan barcode
  if (route === "/api/super-admin/attendance/scan-barcode") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - barcode
              - group_id
              - grade_id
            properties:
              barcode:
                type: string
                example: "STD-2026-001"
              group_id:
                type: integer
                example: 1
              grade_id:
                type: integer
                example: 1
`;
  }

  // Start attendance session
  if (route === "/api/super-admin/attendance/sessions/start") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - group_id
              - grade_id
            properties:
              group_id:
                type: integer
                example: 1
              grade_id:
                type: integer
                example: 1
`;
  }

  // Lock attendance session
  if (route === "/api/super-admin/attendance/sessions/lock") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - id
              - groupId
            properties:
              id:
                type: integer
                description: Session ID
                example: 12
              groupId:
                type: integer
                description: Group ID
                example: 3
`;
  }

  // Upsert batch exam results
  if (route === "/api/super-admin/exam-results/upsert-batch/{examId}") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - records
            properties:
              records:
                type: array
                items:
                  type: object
                  required:
                    - student_id
                    - degree
                  properties:
                    student_id:
                      type: integer
                      example: 5
                    degree:
                      type: number
                      example: 48.5
                    notes:
                      type: string
                      example: "ممتاز"
`;
  }

  // Grade student assignment submission
  if (route === "/api/super-admin/assignment-submissions/{submissionId}/grade") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - score
            properties:
              score:
                type: number
                example: 18.5
              feedback:
                type: string
                example: "عمل ممتاز، برجاء مراجعة المسألة الأخيرة"
`;
  }

  // Grade essay answer
  if (route === "/api/super-admin/student-answers/{answerId}/grade") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - is_correct
            properties:
              is_correct:
                type: integer
                enum: [0, 1]
                description: "1 for correct, 0 for incorrect"
                example: 1
`;
  }

  // Find grade by name
  if (route === "/api/super-admin/grades/find") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - name
            properties:
              name:
                type: string
                example: "الصف الأول الثانوي"
`;
  }

  // Find group by name and grade
  if (route === "/api/super-admin/groups/find") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - name
              - grade_id
            properties:
              name:
                type: string
                example: "مجموعة السبت 10 صباحاً"
              grade_id:
                type: integer
                example: 1
`;
  }

  // WhatsApp settings
  if (route === "/api/assistant/whatsapp/settings") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              whatsapp_daily_limit:
                type: integer
                example: 250
              whatsapp_delay_seconds:
                type: integer
                example: 45
`;
  }

  // Webhook
  if (route === "/webhook/webhook") {
    return `    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            additionalProperties: true
`;
  }

  const upload = /(upload|profile-image|submit|essay|questions|assignments|videos|playlists|students\/bulk|grades\/bulk|groups\/bulk)/i.test(route);
  if (upload) {
    return `    requestBody:
      content:
        multipart/form-data:
          schema:
            type: object
            additionalProperties: true
            properties:
              file:
                type: string
                format: binary
              image:
                type: string
                format: binary
              thumbnail:
                type: string
                format: binary
`;
  }

  return `    requestBody:
      content:
        application/json:
          schema:
            type: object
            additionalProperties: true
`;
};

// Parameter descriptions
const paramDetails = {
  gradeId: { type: "integer", desc: "Grade ID (معرف الصف الدراسي)", example: 1 },
  groupId: { type: "integer", desc: "Group ID (معرف المجموعة)", example: 1 },
  examId: { type: "integer", desc: "Exam ID (معرف الامتحان)", example: 1 },
  studentId: { type: "integer", desc: "Student ID (معرف الطالب)", example: 1 },
  assignmentId: { type: "integer", desc: "Assignment ID (معرف الواجب)", example: 1 },
  submissionId: { type: "integer", desc: "Assignment Submission ID (معرف تسليم الواجب)", example: 1 },
  questionId: { type: "integer", desc: "Question ID (معرف السؤال)", example: 1 },
  answerId: { type: "integer", desc: "Student Answer ID (معرف إجابة الطالب)", example: 1 },
  attemptId: { type: "integer", desc: "Online Exam Attempt ID (معرف محاولة الامتحان)", example: 1 },
  videoId: { type: "integer", desc: "Video ID (معرف الفيديو)", example: 1 },
  userId: { type: "integer", desc: "User ID (معرف المستخدم)", example: 1 },
  id: { type: "integer", desc: "Resource ID (المعرف)", example: 1 },
  month: { type: "string", desc: "Month in YYYY-MM format (الشهر بصيغة YYYY-MM)", example: "2026-09" },
  date: { type: "string", desc: "Date in YYYY-MM-DD format (التاريخ بصيغة YYYY-MM-DD)", example: "2026-09-25" },
};

const parametersFor = (route) => {
  if (route === "/webhook/webhook") {
    return `    parameters:
      - in: query
        name: hub.mode
        required: true
        description: Webhook subscription mode (subscribe)
        schema:
          type: string
      - in: query
        name: hub.verify_token
        required: true
        description: Webhook verification token
        schema:
          type: string
      - in: query
        name: hub.challenge
        required: true
        description: Verification challenge string from Meta
        schema:
          type: string
`;
  }
  const params = [...route.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  if (!params.length) return "";
  return `    parameters:\n${params.map((name) => {
    const detail = paramDetails[name] || { type: "string", desc: `${name} parameter`, example: "1" };
    return `      - in: path
        name: ${name}
        required: true
        description: "${detail.desc}"
        schema:
          type: ${detail.type}
          example: ${typeof detail.example === "number" ? detail.example : `"${detail.example}"`}
`;
  }).join("")}`;
};

const responsesFor = (route, method) => {
  if (route === "/webhook/webhook") {
    return `    responses:
      '200':
        description: Webhook accepted or verification challenge returned
      '403':
        description: Webhook verification failed
      '500':
        description: Webhook processing failed
`;
  }
  const successCode = method === "POST" ? "201" : "200";
  return `    responses:
      '${successCode}':
        description: Operation completed successfully (تمت العملية بنجاح)
      '400':
        description: Bad Request / Validation Error (بيانات غير صحيحة)
      '401':
        description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
      '403':
        description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
      '404':
        description: Resource Not Found (العنصر غير موجود)
      '500':
        description: Internal Server Error (خطأ داخلي في السيرفر)
`;
};

const missing = uniqueOperations.filter((op) => !existing.has(`${op.method} ${op.path}`));
let output = `/**
 * Automatically generated coverage documentation for routes that are not
 * represented by a hand-written Swagger block. Keep this file in sync by
 * running: node scripts/generate-route-docs.js
 */
`;

for (const { method, path: route } of missing) {
  output += `/**
 * @swagger
 * ${route}:
 *   ${method.toLowerCase()}:
 *     summary: "${humanize(method, route)}"
 *     description: "${humanize(method, route)}"
 *     tags:
 *       - "${tagFor(route)}"
`;
  output += securityFor(route);
  output += parametersFor(route);
  output += bodyFor(method, route);
  output += responsesFor(route, method);
  output += ` */\n`;
}

output = output
  .split("\n")
  .map((line) => {
    if (line && !line.startsWith("/*") && !line.startsWith(" *") && line !== " */") {
      return ` * ${line}`;
    }
    return line;
  })
  .join("\n");

fs.writeFileSync(path.join(root, "src/docs/generated-routes.docs.js"), output);
fs.writeFileSync(path.join(root, "src/docs/route-catalog.json"), JSON.stringify(uniqueOperations, null, 2) + "\n");
console.log(JSON.stringify({ totalMountedOperations: uniqueOperations.length, existingDocumentedOperations: existing.size, generatedOperations: missing.length }, null, 2));
setImmediate(() => process.exit(0));
