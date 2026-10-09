const { query, transaction } = require("../../../config/database");

const assistantFunctionDeclarations = [
  {
    name: "get_platform_info",
    description: "جلب معلومات السنتر والصفوف الدراسية والمجموعات المتاحة مع معرفاتها (IDs) ومواعيدها لتحديد الصف والمجموعة المناسبة.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "get_online_exams_list",
    description: "استرجاع قائمة الامتحانات الإلكترونية الحالية في السنتر مع معرفاتها ومواعيدها والصفوف المخصصة لها وحالتها.",
    parameters: {
      type: "OBJECT",
      properties: {
        grade_id: {
          type: "INTEGER",
          description: "معرف الصف الدراسي لتصفية الامتحانات (اختياري)",
        },
        limit: {
          type: "INTEGER",
          description: "الحد الأقصى لعدد الامتحانات المسترجعة (افتراضياً 10)",
        },
      },
    },
  },
  {
    name: "get_students_summary",
    description: "جلب إحصائيات عامة عن عدد الطلاب النشطين المسجلين في السنتر أو في صف دراسي أو مجموعة محددة.",
    parameters: {
      type: "OBJECT",
      properties: {
        grade_id: {
          type: "INTEGER",
          description: "معرف الصف الدراسي (اختياري)",
        },
        group_id: {
          type: "INTEGER",
          description: "معرف المجموعة (اختياري)",
        },
      },
    },
  },
  {
    name: "search_student_details",
    description: "البحث عن طالب معين في السنتر بالاسم أو الباركود أو رقم الهاتف لمعرفة بياناته وصفه ومجموعته وهاتفه وهاتف ولي أمره وحالته.",
    parameters: {
      type: "OBJECT",
      properties: {
        search_query: {
          type: "STRING",
          description: "اسم الطالب أو الباركود أو رقم الهاتف للبحث",
        },
      },
      required: ["search_query"],
    },
  },
  {
    name: "get_exam_results_stats",
    description: "جلب تقرير إحصائي لنتائج امتحان إلكتروني معين: عدد الطلاب الذين تقدموا للامتحان، أعلى درجة، متوسط الدرجات، وقائمة بأوائل الطلاب ودرجاتهم.",
    parameters: {
      type: "OBJECT",
      properties: {
        exam_id: {
          type: "INTEGER",
          description: "معرف الامتحان الإلكتروني (ID)",
        },
      },
      required: ["exam_id"],
    },
  },
  {
    name: "get_attendance_report",
    description: "جلب تقرير حضور وغياب الطلاب لتاريخ معين أو مجموعة معينة: عدد الحاضرين، عدد الغائبين، وقائمة بأسماء الطلاب الغائبين وأرقام هواتفهم للتواصل.",
    parameters: {
      type: "OBJECT",
      properties: {
        attendance_date: {
          type: "STRING",
          description: "تاريخ الحصة بتنسيق YYYY-MM-DD (اختياري، الافتراضي هو تاريخ اليوم)",
        },
        group_id: {
          type: "INTEGER",
          description: "معرف المجموعة لتصفية التقرير (اختياري)",
        },
      },
    },
  },
  {
    name: "create_online_exam",
    description: "إنشاء وحفظ امتحان إلكتروني في قاعدة البيانات بكامل أسئلته وخياراته. تحذير وإلزام: لا تستدعِ هذه الأداة مطلقاً في أول مرة؛ يجب أولاً عرض تفاصيل الامتحان والأسئلة المقترحة على المساعد وسؤاله إن كان يؤكد الإنشاء. استدعِ هذه الأداة فقط عندما يرد المساعد بوضوح بالتأكيد (مثل 'أكد', 'موافق', 'احفظ', 'أنشئ الآن').",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "عنوان الامتحان (مثال: امتحان أسبوعي على درس كذا)",
        },
        description: {
          type: "STRING",
          description: "وصف الامتحان أو الدرس أو تعليمات الطلاب (اختياري)",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرف الصف الدراسي (مطلوب)",
        },
        group_id: {
          type: "INTEGER",
          description: "معرف المجموعة (اختياري، اتركه null لجميع مجموعات الصف)",
        },
        duration_minutes: {
          type: "INTEGER",
          description: "مدة الامتحان بالدقائق (مثال: 30, 45, 60)",
        },
        start_at: {
          type: "STRING",
          description: "تاريخ ووقت بدء الامتحان بتنسيق YYYY-MM-DD HH:mm:ss",
        },
        end_at: {
          type: "STRING",
          description: "تاريخ ووقت انتهاء الامتحان بتنسيق YYYY-MM-DD HH:mm:ss",
        },
        randomize_questions: {
          type: "BOOLEAN",
          description: "ترتيب الأسئلة عشوائياً للطلاب (افتراضياً true)",
        },
        questions: {
          type: "ARRAY",
          description: "قائمة الأسئلة مع خياراتها",
          items: {
            type: "OBJECT",
            properties: {
              question_text: {
                type: "STRING",
                description: "نص السؤال",
              },
              type: {
                type: "STRING",
                enum: ["mcq", "true_false", "essay"],
                description: "نوع السؤال",
              },
              options: {
                type: "ARRAY",
                description: "خيارات السؤال (للأسئلة الاختيارية أو صح وخطأ)",
                items: {
                  type: "OBJECT",
                  properties: {
                    option_text: {
                      type: "STRING",
                      description: "نص الخيار",
                    },
                    is_correct: {
                      type: "BOOLEAN",
                      description: "هل هذا الخيار هو الإجابة الصحيحة",
                    },
                  },
                  required: ["option_text", "is_correct"],
                },
              },
            },
            required: ["question_text", "type"],
          },
        },
      },
      required: [
        "title",
        "grade_id",
        "duration_minutes",
        "start_at",
        "end_at",
        "questions",
      ],
    },
  },
];

async function executeAssistantTool(name, args = {}, context = {}) {
  const userId = context.userId || null;

  switch (name) {
    case "get_platform_info": {
      const gradesRes = await query(`
        SELECT id, name, monthly_price 
        FROM grades 
        WHERE deleted = 0 
        ORDER BY id ASC
      `);

      const groupsRes = await query(`
        SELECT id, name, grade_id, days, start_time, end_time, room 
        FROM groups 
        WHERE deleted = 0 
        ORDER BY grade_id, id ASC
      `);

      const grades = gradesRes.rows.map((g) => ({
        grade_id: g.id,
        grade_name: g.name,
        monthly_price: g.monthly_price,
        groups: groupsRes.rows
          .filter((grp) => grp.grade_id === g.id)
          .map((grp) => ({
            group_id: grp.id,
            group_name: grp.name,
            days: grp.days,
            time: `${grp.start_time || ""} - ${grp.end_time || ""}`,
          })),
      }));

      return {
        success: true,
        teacher: "مستر محمد بشتة",
        subject: "اللغة العربية",
        grades,
      };
    }

    case "get_online_exams_list": {
      const limit = Math.min(Number(args.limit) || 10, 20);
      const conditions = ["oe.deleted = 0"];
      const values = [];
      let paramIndex = 1;

      if (args.grade_id) {
        conditions.push(`oe.grade_id = $${paramIndex++}`);
        values.push(args.grade_id);
      }

      values.push(limit);

      const res = await query(
        `
        SELECT 
          oe.id,
          oe.title,
          oe.description,
          g.name AS grade_name,
          gr.name AS group_name,
          oe.duration_minutes,
          oe.start_at,
          oe.end_at,
          oe.full_mark,
          oe.randomize_questions,
          CASE 
            WHEN NOW() > oe.end_at THEN 'ended'
            WHEN NOW() < oe.start_at THEN 'upcoming'
            ELSE 'active'
          END AS status,
          (SELECT COUNT(*) FROM questions q WHERE q.exam_id = oe.id) AS questions_count
        FROM online_exams oe
        LEFT JOIN grades g ON g.id = oe.grade_id AND g.deleted = 0
        LEFT JOIN groups gr ON gr.id = oe.group_id AND gr.deleted = 0
        WHERE ${conditions.join(" AND ")}
        ORDER BY oe.created_at DESC
        LIMIT $${paramIndex}
      `,
        values,
      );

      return {
        success: true,
        exams_count: res.rows.length,
        exams: res.rows,
      };
    }

    case "get_students_summary": {
      const conditions = ["deleted = 0", "is_active = true"];
      const values = [];
      let paramIndex = 1;

      if (args.grade_id) {
        conditions.push(`grade_id = $${paramIndex++}`);
        values.push(args.grade_id);
      }

      if (args.group_id) {
        conditions.push(`group_id = $${paramIndex++}`);
        values.push(args.group_id);
      }

      const countRes = await query(
        `SELECT COUNT(*) AS total_students FROM students WHERE ${conditions.join(" AND ")}`,
        values,
      );

      return {
        success: true,
        total_active_students: Number(countRes.rows[0].total_students || 0),
        filters_applied: {
          grade_id: args.grade_id || "all",
          group_id: args.group_id || "all",
        },
      };
    }

    case "search_student_details": {
      const search = (args.search_query || "").trim();
      if (!search) {
        return { success: false, error: "يرجى تحديد اسم أو كود الطالب للبحث" };
      }

      const res = await query(
        `
        SELECT 
          s.id, s.full_name, s.barcode, s.phone, s.parent_phone,
          g.name AS grade_name, grp.name AS group_name,
          s.is_active, s.created_at
        FROM students s
        LEFT JOIN grades g ON g.id = s.grade_id AND g.deleted = 0
        LEFT JOIN groups grp ON grp.id = s.group_id AND grp.deleted = 0
        WHERE s.deleted = 0 
          AND (s.full_name ILIKE $1 OR s.barcode ILIKE $1 OR s.phone ILIKE $1)
        LIMIT 5
      `,
        [`%${search}%`],
      );

      return {
        success: true,
        found_count: res.rows.length,
        students: res.rows,
      };
    }

    case "get_exam_results_stats": {
      const examId = Number(args.exam_id);
      if (!examId) {
        return { success: false, error: "معرف الامتحان مطلوب" };
      }

      const examRes = await query(
        `
        SELECT oe.id, oe.title, oe.full_mark, g.name AS grade_name
        FROM online_exams oe
        LEFT JOIN grades g ON g.id = oe.grade_id
        WHERE oe.id = $1 AND oe.deleted = 0
      `,
        [examId],
      );

      if (!examRes.rows[0]) {
        return { success: false, error: "الامتحان غير موجود" };
      }

      const statsRes = await query(
        `
        SELECT 
          COUNT(*) AS total_submissions,
          ROUND(AVG(score)::numeric, 2) AS average_score,
          MAX(score) AS highest_score,
          MIN(score) AS lowest_score
        FROM student_exams
        WHERE exam_id = $1 AND is_absent = false
      `,
        [examId],
      );

      const topStudentsRes = await query(
        `
        SELECT s.full_name, s.barcode, se.score, se.submitted_at
        FROM student_exams se
        JOIN students s ON s.id = se.student_id
        WHERE se.exam_id = $1 AND se.is_absent = false
        ORDER BY se.score DESC, se.submitted_at ASC
        LIMIT 5
      `,
        [examId],
      );

      return {
        success: true,
        exam: examRes.rows[0],
        statistics: statsRes.rows[0],
        top_students: topStudentsRes.rows,
      };
    }

    case "get_attendance_report": {
      const date = args.attendance_date || new Date().toISOString().split("T")[0];
      const conditions = ["a.attendance_date = $1"];
      const values = [date];
      let paramIndex = 2;

      if (args.group_id) {
        conditions.push(`a.group_id = $${paramIndex++}`);
        values.push(args.group_id);
      }

      const summaryRes = await query(
        `
        SELECT a.status, COUNT(*) AS count
        FROM attendance a
        WHERE ${conditions.join(" AND ")}
        GROUP BY a.status
      `,
        values,
      );

      const absentRes = await query(
        `
        SELECT s.full_name, s.phone, s.parent_phone, grp.name AS group_name
        FROM attendance a
        JOIN students s ON s.id = a.student_id
        LEFT JOIN groups grp ON grp.id = a.group_id
        WHERE ${conditions.join(" AND ")} AND a.status = 'absent'
        LIMIT 10
      `,
        values,
      );

      return {
        success: true,
        date,
        summary: summaryRes.rows,
        absent_students: absentRes.rows,
      };
    }

    case "create_online_exam": {
      const {
        title,
        description,
        grade_id,
        group_id,
        duration_minutes,
        start_at,
        end_at,
        randomize_questions = true,
        questions = [],
      } = args;

      if (!title || !grade_id || !questions.length) {
        return {
          success: false,
          error: "بيانات الامتحان غير مكتملة (العنوان والصف والأسئلة مطلوبة)",
        };
      }

      const cleanStartAt = new Date(start_at);
      const cleanEndAt = new Date(end_at);

      if (isNaN(cleanStartAt.getTime()) || isNaN(cleanEndAt.getTime())) {
        return {
          success: false,
          error: "تاريخ بدء أو انتهاء الامتحان غير صالح",
        };
      }

      const fullMark = questions.length;
      const randomizeVal = randomize_questions ? 1 : 0;

      const result = await transaction(async (client) => {
        // 1. Insert exam
        const examRes = await client.query(
          `
          INSERT INTO online_exams (
            title, description, grade_id, group_id,
            duration_minutes, start_at, end_at, full_mark,
            randomize_questions, created_by, created_at, updated_at, deleted
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), 0)
          RETURNING id, title, start_at, end_at, duration_minutes
        `,
          [
            title,
            description || null,
            grade_id,
            group_id || null,
            duration_minutes,
            cleanStartAt.toISOString(),
            cleanEndAt.toISOString(),
            fullMark,
            randomizeVal,
            userId,
          ],
        );

        const examId = examRes.rows[0].id;

        // 2. Insert questions & options
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const qOrder = i + 1;
          const qRes = await client.query(
            `
            INSERT INTO questions (exam_id, question_text, type, "order", created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id
          `,
            [examId, q.question_text, q.type || "mcq", qOrder],
          );

          const questionId = qRes.rows[0].id;

          if (Array.isArray(q.options) && q.options.length > 0) {
            for (let j = 0; j < q.options.length; j++) {
              const opt = q.options[j];
              const optOrder = j + 1;
              const isCorrectVal = opt.is_correct ? 1 : 0;
              await client.query(
                `
                INSERT INTO options (question_id, option_text, is_correct, "order", created_at)
                VALUES ($1, $2, $3, $4, NOW())
              `,
                [questionId, opt.option_text, isCorrectVal, optOrder],
              );
            }
          }
        }

        return {
          success: true,
          exam_id: examId,
          title: examRes.rows[0].title,
          questions_count: questions.length,
          start_at: cleanStartAt.toISOString(),
          end_at: cleanEndAt.toISOString(),
          duration_minutes,
        };
      });

      return {
        success: true,
        message: `تم إنشاء وحفظ الامتحان بنجاح على المنصة برقم معرف #${result.exam_id}`,
        data: result,
      };
    }

    default:
      return {
        success: false,
        error: `أداة غير معروفة: ${name}`,
      };
  }
}

module.exports = {
  assistantFunctionDeclarations,
  executeAssistantTool,
};
