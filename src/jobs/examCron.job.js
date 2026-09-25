const cron = require("node-cron");
const studentExamService = require("../modules/student_exams/student_exams.service");

let examCronTask = null;

const runExamMaintenance = async () => {
  try {
    const autoSubmitted = await studentExamService.autoSubmitExpiredExams();
    if (autoSubmitted && autoSubmitted.length > 0) {
      console.log(`[Exam Cron] Auto-submitted ${autoSubmitted.length} expired exam attempt(s).`);
    }

    const absentMarked = await studentExamService.markAbsentStudents();
    if (absentMarked && absentMarked.length > 0) {
      console.log(`[Exam Cron] Marked ${absentMarked.length} absent student(s) for expired exams.`);
    }
  } catch (error) {
    console.error("[Exam Cron] Error running exam maintenance job:", error.message);
  }
};

const startExamCron = () => {
  if (examCronTask) return;

  // Run every minute
  examCronTask = cron.schedule("* * * * *", () => {
    runExamMaintenance();
  });

  // Run initial check on server startup
  runExamMaintenance();

  console.log("[Exam Cron] Scheduled exam maintenance job running every minute.");
};

const stopExamCron = () => {
  if (examCronTask) {
    examCronTask.stop();
    examCronTask = null;
    console.log("[Exam Cron] Stopped exam maintenance job.");
  }
};

module.exports = {
  startExamCron,
  stopExamCron,
  runExamMaintenance,
};
