const createGradesTable = require("./tables/grades.table");
const createGroupsTable = require("./tables/groups.table");
const createStudentsTable = require("./tables/students.table");
const createUsersTable = require("./tables/users.table");
const createSubscriptionsTable = require("./tables/subscriptions.table");
const createPaymentsTable = require("./tables/payments.table");
const createAttendanceTable = require("./tables/attendance.table");
const createExamsTable = require("./tables/exams.table");
const createExamResultsTable = require("./tables/exam_results.table");
const createMessagesTable = require("./tables/messages.table");
const createWhatsappMessagesTable = require("./tables/whatsapp.table");
const createSettingsTable = require("./tables/settings.table");
const createVideosTable = require("./tables/videos.table");
const createPlaylistsTable = require("./tables/playlists.table");
const createPlaylistVideosTable = require("./tables/playlist_videos.table");
const createOnlineExamsTable = require("./tables/online_exams.table");
const createQuestionsTable = require("./tables/questions.table");
const createOptionsTable = require("./tables/options.table");
const createStudentExamsTable = require("./tables/student_exams.table");
const createStudentAnswersTable = require("./tables/student_answers.table");
const createAssignmentsTable = require("./tables/assignments.table");
const createAssignmentSubmissionsTable = require("./tables/assignment_submissions.table");
const createActivityLogsTable = require("./tables/activity_logs.table");
const createAttendanceSessionsTable = require("./tables/attendance_sessions.table");

async function runMigrations() {
  await createGradesTable();
  await createGroupsTable();
  await createStudentsTable();
  await createUsersTable();
  await createSubscriptionsTable();
  await createPaymentsTable();
  await createAttendanceTable();
  await createExamsTable();
  await createExamResultsTable();
  await createMessagesTable();
  await createWhatsappMessagesTable();
  await createSettingsTable();
  await createVideosTable();
  await createPlaylistsTable();
  await createPlaylistVideosTable();
  await createOnlineExamsTable();
  await createQuestionsTable();
  await createOptionsTable();
  await createStudentExamsTable();
  await createStudentAnswersTable();
  await createAssignmentsTable();
  await createAssignmentSubmissionsTable();
  await createActivityLogsTable();
  await createAttendanceSessionsTable();
  console.log("All 24 tables created successfully");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
