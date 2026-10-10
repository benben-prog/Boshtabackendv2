const { query } = require("../../../config/database");
const {
  formatEgyptTime,
  normalizeDate,
  getTodayEgypt,
} = require("../../../utils/timezone");

// ============================================
// STUDENT FUNCTION DECLARATIONS (Gemini Schema)
// ============================================

const studentFunctionDeclarations = [
  {
    name: "review_my_last_exam_answers",
    description:
      "تحليل ومراجعة إجابات آخر امتحان إلكتروني قام الطالب بتسليمه (أو امتحان محدد بالرقم)، لعرض الأسئلة التي أخطأ فيها مع المقارنة بين إجابته والإجابة النموذجية الصحيحة لتقديم نصائح وشرح تربوي لأسباب الخطأ وتصحيح المفاهيم.",
    parameters: {
      type: "OBJECT",
      properties: {
        exam_id: {
          type: "INTEGER",
          description:
            "معرف الامتحان المراد مراجعته (اختياري، إذا تُرك فارغاً يتم جلب آخر امتحان تم تسليمه تلقائياً)",
        },
        attempt_id: {
          type: "INTEGER",
          description: "معرف محاولة الامتحان المحددة (اختياري)",
        },
      },
    },
  },
  {
    name: "get_my_academic_evaluation",
    description:
      "تقييم المستوى الأكاديمي الشامل للطالب وتحديد نقاط القوة ونقاط الضعف والدروس والوحدات التي يحتاج لمراجعتها بناءً على تحليل نتائج امتحاناته الإلكترونية والورقية، ونسب حضوره، والأسئلة التي تكرر خطؤه فيها.",
    parameters: {
      type: "OBJECT",
      properties: {
        limit_exams: {
          type: "INTEGER",
          description:
            "عدد الامتحانات السابقة المراد تضمينها في التقييم (افتراضياً 5)",
        },
      },
    },
  },
  {
    name: "get_my_pending_homework",
    description:
      "استعراض الواجبات المنزلية المطلوبة من الطالب، ومواعيد التسليم المتبقية، والواجبات التي تم تسليمها وتصحيحها وملاحظات المساعدين ودرجاتها.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "get_my_upcoming_schedule",
    description:
      "استعراض جدول الطالب الأكاديمي القادم: مواعيد حصص البث المباشر (Google Meet)، مواعيد مجموعته في السنتر، والامتحانات القادمة المجدولة.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "get_my_exams_history",
    description:
      "عرض سجل جميع الامتحانات السابقة التي خاضها الطالب (سواء إلكترونية أو ورقية) بدرجاتها ونسبها المئوية وتواريخها لتتبع تطور مستواه ومقارنة أدائه عبر الشهور.",
    parameters: {
      type: "OBJECT",
      properties: {
        limit: {
          type: "INTEGER",
          description: "عدد الامتحانات المراد استرجاعها (افتراضياً 10)",
        },
      },
    },
  },
];

// ============================================
// TOOL IMPLEMENTATIONS
// ============================================

/**
 * 1. Review last exam answers (Detailed mistake breakdown)
 */
async function reviewMyLastExamAnswers(args, context) {
  const studentId = context.userId;
  const { exam_id, attempt_id } = args;

  let attempt = null;
  if (attempt_id) {
    const res = await query(
      `SELECT se.id, se.exam_id, se.score, se.started_at, se.submitted_at, oe.title AS exam_title, oe.full_mark
       FROM student_exams se
       JOIN online_exams oe ON se.exam_id = oe.id
       WHERE se.id = $1 AND se.student_id = $2 AND se.submitted_at IS NOT NULL AND oe.deleted = 0`,
      [attempt_id, studentId],
    );
    attempt = res.rows[0];
  } else if (exam_id) {
    const res = await query(
      `SELECT se.id, se.exam_id, se.score, se.started_at, se.submitted_at, oe.title AS exam_title, oe.full_mark
       FROM student_exams se
       JOIN online_exams oe ON se.exam_id = oe.id
       WHERE se.exam_id = $1 AND se.student_id = $2 AND se.submitted_at IS NOT NULL AND oe.deleted = 0
       ORDER BY se.submitted_at DESC LIMIT 1`,
      [exam_id, studentId],
    );
    attempt = res.rows[0];
  } else {
    const res = await query(
      `SELECT se.id, se.exam_id, se.score, se.started_at, se.submitted_at, oe.title AS exam_title, oe.full_mark
       FROM student_exams se
       JOIN online_exams oe ON se.exam_id = oe.id
       WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL AND oe.deleted = 0
       ORDER BY se.submitted_at DESC LIMIT 1`,
      [studentId],
    );
    attempt = res.rows[0];
  }

  if (!attempt) {
    return {
      success: false,
      message:
        "لم يتم العثور على أي امتحان إلكتروني تم تسليمه حتى الآن. بمجرد أن تسلم أول امتحان، ستتمكن من مراجعة إجاباتك هنا بالتفصيل!",
    };
  }

  // Fetch all questions, options, student answers for this exam attempt
  const detailsRes = await query(
    `SELECT 
      q.id AS question_id,
      q.question_text,
      q.type AS question_type,
      q."order" AS question_order,
      o.id AS option_id,
      o.option_text,
      o.is_correct AS option_is_correct,
      sa.selected_option_id,
      sa.file_path AS student_file_path,
      sa.is_correct AS student_is_correct
    FROM questions q
    LEFT JOIN options o ON q.id = o.question_id
    LEFT JOIN student_answers sa ON q.id = sa.question_id 
      AND sa.exam_id = $1 
      AND sa.student_id = $2
    WHERE q.exam_id = $1
    ORDER BY q."order" ASC, o."order" ASC`,
    [attempt.exam_id, studentId],
  );

  // Group by question
  const questionsMap = new Map();
  for (const row of detailsRes.rows) {
    if (!questionsMap.has(row.question_id)) {
      questionsMap.set(row.question_id, {
        question_number: row.question_order,
        question_text: row.question_text,
        question_type: row.question_type,
        student_is_correct: row.student_is_correct === 1,
        student_answer: null,
        correct_answer: null,
        options: [],
      });
    }
    const q = questionsMap.get(row.question_id);
    if (row.option_id) {
      q.options.push({
        id: row.option_id,
        text: row.option_text,
        is_correct: row.option_is_correct === 1,
      });
      if (row.option_is_correct === 1) {
        q.correct_answer = row.option_text;
      }
      if (row.selected_option_id === row.option_id) {
        q.student_answer = row.option_text;
      }
    }
  }

  const allQuestions = Array.from(questionsMap.values());
  const wrongQuestions = allQuestions.filter((q) => !q.student_is_correct);
  const correctQuestions = allQuestions.filter((q) => q.student_is_correct);

  const percentage =
    attempt.full_mark > 0
      ? Math.round((Number(attempt.score) / Number(attempt.full_mark)) * 100)
      : 0;

  return {
    success: true,
    exam_summary: {
      exam_id: attempt.exam_id,
      attempt_id: attempt.id,
      exam_title: attempt.exam_title,
      score: Number(attempt.score),
      full_mark: Number(attempt.full_mark),
      percentage: `${percentage}%`,
      submitted_at: formatEgyptTime(attempt.submitted_at),
      total_questions: allQuestions.length,
      correct_count: correctQuestions.length,
      wrong_count: wrongQuestions.length,
    },
    wrong_answers_analysis: wrongQuestions.map((q) => ({
      question_number: q.question_number,
      question_text: q.question_text,
      student_answer: q.student_answer || "لم يتم اختيار إجابة (متروك)",
      correct_answer: q.correct_answer,
      all_options: q.options.map((o) => o.text),
    })),
    correct_answers_sample: correctQuestions.map((q) => ({
      question_number: q.question_number,
      question_text: q.question_text,
    })),
  };
}

/**
 * 2. Academic evaluation & remedial analysis
 */
async function getMyAcademicEvaluation(args, context) {
  const studentId = context.userId;
  const limitExams = args.limit_exams || 5;

  // 1. Overall stats
  const statsRes = await query(
    `SELECT 
      (SELECT COUNT(*) FROM student_exams WHERE student_id = $1 AND submitted_at IS NOT NULL) AS online_exams_count,
      (SELECT ROUND(AVG(score)::numeric, 2) FROM student_exams WHERE student_id = $1 AND submitted_at IS NOT NULL) AS avg_online_score,
      (SELECT COUNT(*) FROM exam_results WHERE student_id = $1) AS paper_exams_count,
      (SELECT ROUND(AVG(degree)::numeric, 2) FROM exam_results WHERE student_id = $1) AS avg_paper_score,
      (SELECT COUNT(*) FROM attendance WHERE student_id = $1) AS total_attendance_sessions,
      (SELECT COUNT(*) FROM attendance WHERE student_id = $1 AND status = 'present') AS present_sessions,
      (SELECT COUNT(*) FROM assignment_submissions WHERE student_id = $1) AS homeworks_submitted,
      (SELECT ROUND(AVG(score)::numeric, 2) FROM assignment_submissions WHERE student_id = $1 AND score IS NOT NULL) AS avg_homework_score
    `,
    [studentId],
  );
  const stats = statsRes.rows[0] || {};

  // 2. Recent online exams
  const recentOnlineExams = await query(
    `SELECT se.id, oe.title, se.score, oe.full_mark, se.submitted_at,
            CASE WHEN oe.full_mark > 0 THEN ROUND((se.score / oe.full_mark * 100)::numeric, 1) ELSE 0 END AS percentage
     FROM student_exams se
     JOIN online_exams oe ON se.exam_id = oe.id
     WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL AND oe.deleted = 0
     ORDER BY se.submitted_at DESC
     LIMIT $2`,
    [studentId, limitExams],
  );

  // 3. Recent paper exams
  const recentPaperExams = await query(
    `SELECT er.id, e.title, er.degree AS score, e.total_degree AS full_mark, e.exam_date,
            CASE WHEN e.total_degree > 0 THEN ROUND((er.degree / e.total_degree * 100)::numeric, 1) ELSE 0 END AS percentage,
            er.notes
     FROM exam_results er
     JOIN exams e ON er.exam_id = e.id
     WHERE er.student_id = $1 AND e.deleted = 0
     ORDER BY e.exam_date DESC
     LIMIT $2`,
    [studentId, limitExams],
  );

  // 4. Sample of recent questions missed across all online exams (to pinpoint weak lessons!)
  const missedQuestionsRes = await query(
    `SELECT 
      oe.title AS exam_title,
      q.question_text,
      sa.selected_option_id,
      o_selected.option_text AS student_answer,
      o_correct.option_text AS correct_answer
    FROM student_answers sa
    JOIN questions q ON sa.question_id = q.id
    JOIN online_exams oe ON sa.exam_id = oe.id
    LEFT JOIN options o_selected ON sa.selected_option_id = o_selected.id
    LEFT JOIN options o_correct ON o_correct.question_id = q.id AND o_correct.is_correct = 1
    WHERE sa.student_id = $1 AND (sa.is_correct = 0 OR sa.is_correct IS NULL) AND oe.deleted = 0
    ORDER BY sa.submitted_at DESC
    LIMIT 10`,
    [studentId],
  );

  // 5. Attendance percentage
  const totalAtt = Number(stats.total_attendance_sessions) || 0;
  const presentAtt = Number(stats.present_sessions) || 0;
  const attendanceRate =
    totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

  return {
    success: true,
    academic_summary: {
      attendance_rate: `${attendanceRate}%`,
      attendance_sessions: `${presentAtt}/${totalAtt}`,
      total_online_exams: Number(stats.online_exams_count) || 0,
      average_online_score: stats.avg_online_score
        ? `${stats.avg_online_score}`
        : "لا يوجد بعد",
      total_paper_exams: Number(stats.paper_exams_count) || 0,
      average_paper_score: stats.avg_paper_score
        ? `${stats.avg_paper_score}`
        : "لا يوجد بعد",
      homeworks_submitted: Number(stats.homeworks_submitted) || 0,
      average_homework_score: stats.avg_homework_score
        ? `${stats.avg_homework_score}`
        : "لا يوجد بعد",
    },
    recent_online_exams: recentOnlineExams.rows.map((e) => ({
      title: e.title,
      score: `${e.score}/${e.full_mark}`,
      percentage: `${e.percentage}%`,
      date: formatEgyptTime(e.submitted_at, "YYYY-MM-DD"),
    })),
    recent_paper_exams: recentPaperExams.rows.map((e) => ({
      title: e.title,
      score: `${e.score}/${e.full_mark}`,
      percentage: `${e.percentage}%`,
      date: normalizeDate(e.exam_date),
      notes: e.notes,
    })),
    recent_missed_questions_samples: missedQuestionsRes.rows.map((m) => ({
      exam_title: m.exam_title,
      question_text: m.question_text,
      student_chose: m.student_answer || "متروك بدون إجابة",
      correct_answer: m.correct_answer,
    })),
  };
}

/**
 * 3. Pending & Graded Homework
 */
async function getMyPendingHomework(args, context) {
  const studentId = context.userId;

  // Active / Pending assignments
  const pendingRes = await query(
    `SELECT 
      a.id,
      a.title,
      a.full_mark,
      a.deadline,
      a.file_path,
      CASE 
        WHEN a.deadline > NOW() AT TIME ZONE 'Africa/Cairo' THEN 'pending'
        ELSE 'overdue'
      END AS status,
      ROUND(EXTRACT(EPOCH FROM (a.deadline - (NOW() AT TIME ZONE 'Africa/Cairo'))) / 3600 / 24, 1) AS days_remaining
    FROM assignments a
    WHERE a.grade_id = (SELECT grade_id FROM students WHERE id = $1)
      AND a.deleted = 0
      AND a.is_closed = 0
      AND NOT EXISTS (
        SELECT 1 FROM assignment_submissions asub 
        WHERE asub.assignment_id = a.id AND asub.student_id = $1
      )
    ORDER BY a.deadline ASC
    LIMIT 10`,
    [studentId],
  );

  // Recently submitted assignments
  const submittedRes = await query(
    `SELECT 
      a.title,
      a.full_mark,
      asub.submitted_at,
      asub.score,
      asub.feedback AS assistant_notes,
      CASE 
        WHEN asub.score IS NOT NULL THEN 'graded'
        ELSE 'pending_grading'
      END AS grading_status
    FROM assignment_submissions asub
    JOIN assignments a ON asub.assignment_id = a.id
    WHERE asub.student_id = $1 AND a.deleted = 0
    ORDER BY asub.submitted_at DESC
    LIMIT 5`,
    [studentId],
  );

  return {
    success: true,
    pending_homeworks_count: pendingRes.rows.filter((r) => r.status === "pending")
      .length,
    overdue_homeworks_count: pendingRes.rows.filter((r) => r.status === "overdue")
      .length,
    pending_homeworks: pendingRes.rows.map((h) => ({
      id: h.id,
      title: h.title,
      full_mark: h.full_mark,
      deadline: formatEgyptTime(h.deadline),
      status:
        h.status === "pending"
          ? "متاح للتسليم"
          : "انتهى الموعد المحدد (متأخر)",
      days_remaining:
        Number(h.days_remaining) > 0
          ? `${h.days_remaining} يوم متبقي`
          : "انتهى الوقت",
    })),
    recent_submissions: submittedRes.rows.map((s) => ({
      title: s.title,
      submitted_at: formatEgyptTime(s.submitted_at),
      status:
        s.grading_status === "graded" ? "تم التصحيح" : "قيد المراجعة والتصحيح",
      score:
        s.score !== null ? `${s.score}/${s.full_mark}` : "في انتظار الرصد",
      feedback: s.assistant_notes || "لا توجد ملاحظات مسجلة",
    })),
  };
}

/**
 * 4. Upcoming schedule (Live sessions, group classes, upcoming exams)
 */
async function getMyUpcomingSchedule(args, context) {
  const studentId = context.userId;

  // Student details (grade & group)
  const stRes = await query(
    `SELECT s.id, s.grade_id, s.group_id, g.name AS grade_name, gr.name AS group_name,
            gr.days, gr.start_time, gr.end_time, gr.room
     FROM students s
     LEFT JOIN grades g ON s.grade_id = g.id
     LEFT JOIN groups gr ON s.group_id = gr.id
     WHERE s.id = $1`,
    [studentId],
  );
  const student = stRes.rows[0];

  if (!student) {
    return { success: false, message: "تعذر العثور على بيانات الطالب." };
  }

  // Upcoming Live sessions (Google Meet)
  const liveRes = await query(
    `SELECT id, title, start_time, end_time, duration_minutes, meet_link, status
     FROM live_sessions
     WHERE (
       (target_type = 'grade' AND grade_id = $1)
       OR (target_type = 'group' AND group_id = $2)
       OR (target_type = 'student' AND student_id = $3)
     )
     AND status IN ('scheduled', 'live')
     AND deleted = 0
     AND end_time >= NOW() AT TIME ZONE 'Africa/Cairo'
     ORDER BY start_time ASC
     LIMIT 5`,
    [student.grade_id, student.group_id, studentId],
  );

  // Upcoming Online Exams
  const onlineExamsRes = await query(
    `SELECT id, title, start_at, end_at, duration_minutes, full_mark
     FROM online_exams
     WHERE grade_id = $1
       AND (group_id IS NULL OR group_id = $2)
       AND deleted = 0
       AND end_at >= NOW() AT TIME ZONE 'Africa/Cairo'
       AND NOT EXISTS (
         SELECT 1 FROM student_exams se WHERE se.exam_id = online_exams.id AND se.student_id = $3 AND se.submitted_at IS NOT NULL
       )
     ORDER BY start_at ASC
     LIMIT 5`,
    [student.grade_id, student.group_id, studentId],
  );

  // Upcoming Paper Exams
  const paperExamsRes = await query(
    `SELECT id, title, exam_date, total_degree
     FROM exams
     WHERE grade_id = $1
       AND (group_id IS NULL OR group_id = $2)
       AND deleted = 0
       AND exam_date >= CURRENT_DATE
     ORDER BY exam_date ASC
     LIMIT 5`,
    [student.grade_id, student.group_id],
  );

  return {
    success: true,
    center_group_schedule: {
      group_name: student.group_name || "غير محدد",
      days: student.days || "غير محدد",
      time: student.start_time
        ? `${student.start_time} إلى ${student.end_time || ""}`
        : "غير محدد",
      room: student.room || "قاعة السنتر الرئيسية",
    },
    upcoming_live_sessions: liveRes.rows.map((l) => ({
      title: l.title,
      start_time: formatEgyptTime(l.start_time),
      status: l.status === "live" ? "🔴 البث مباشر الآن!" : "مجدول",
      meet_link: l.meet_link,
      duration: `${l.duration_minutes} دقيقة`,
    })),
    upcoming_online_exams: onlineExamsRes.rows.map((o) => ({
      title: o.title,
      start_at: formatEgyptTime(o.start_at),
      end_at: formatEgyptTime(o.end_at),
      duration: `${o.duration_minutes} دقيقة`,
      full_mark: o.full_mark,
    })),
    upcoming_paper_exams: paperExamsRes.rows.map((p) => ({
      title: p.title,
      date: normalizeDate(p.exam_date),
      full_mark: p.total_degree,
    })),
  };
}

/**
 * 5. Complete exams history
 */
async function getMyExamsHistory(args, context) {
  const studentId = context.userId;
  const limit = args.limit || 10;

  const onlineRes = await query(
    `SELECT se.id, oe.title, se.score, oe.full_mark, se.submitted_at,
            CASE WHEN oe.full_mark > 0 THEN ROUND((se.score / oe.full_mark * 100)::numeric, 1) ELSE 0 END AS percentage
     FROM student_exams se
     JOIN online_exams oe ON se.exam_id = oe.id
     WHERE se.student_id = $1 AND se.submitted_at IS NOT NULL AND oe.deleted = 0
     ORDER BY se.submitted_at DESC
     LIMIT $2`,
    [studentId, limit],
  );

  const paperRes = await query(
    `SELECT er.id, e.title, er.degree AS score, e.total_degree AS full_mark, e.exam_date,
            CASE WHEN e.total_degree > 0 THEN ROUND((er.degree / e.total_degree * 100)::numeric, 1) ELSE 0 END AS percentage,
            er.notes
     FROM exam_results er
     JOIN exams e ON er.exam_id = e.id
     WHERE er.student_id = $1 AND e.deleted = 0
     ORDER BY e.exam_date DESC
     LIMIT $2`,
    [studentId, limit],
  );

  return {
    success: true,
    online_exams: onlineRes.rows.map((e) => ({
      title: e.title,
      score: `${e.score}/${e.full_mark}`,
      percentage: `${e.percentage}%`,
      date: formatEgyptTime(e.submitted_at),
    })),
    paper_exams: paperRes.rows.map((e) => ({
      title: e.title,
      score: `${e.score}/${e.full_mark}`,
      percentage: `${e.percentage}%`,
      date: normalizeDate(e.exam_date),
      notes: e.notes || null,
    })),
  };
}

// ============================================
// MAIN DISPATCHER
// ============================================

async function executeStudentTool(toolName, args, context) {
  switch (toolName) {
    case "review_my_last_exam_answers":
      return await reviewMyLastExamAnswers(args, context);

    case "get_my_academic_evaluation":
      return await getMyAcademicEvaluation(args, context);

    case "get_my_pending_homework":
      return await getMyPendingHomework(args, context);

    case "get_my_upcoming_schedule":
      return await getMyUpcomingSchedule(args, context);

    case "get_my_exams_history":
      return await getMyExamsHistory(args, context);

    default:
      return {
        success: false,
        error: `الأداة [${toolName}] غير متوفرة لحساب الطالب.`,
      };
  }
}

module.exports = {
  studentFunctionDeclarations,
  executeStudentTool,
};
