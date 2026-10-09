const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { query, transaction } = require("../../../config/database");
const liveSessionsService = require("../../live_sessions/live_sessions.service");

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
    description: "جلب إحصائيات عامة وتفصيلية عن عدد الطلاب النشطين المسجلين في السنتر وفي كل صف دراسي أو مجموعة محددة. إذا لم يتم تمرير أي مدخلات، ترجع الأداة الإحصائية العامة لجميع الصفوف بالكامل.",
    parameters: {
      type: "OBJECT",
      properties: {
        grade_id: {
          type: "INTEGER",
          description: "معرف الصف الدراسي (اختياري)",
        },
        grade_name: {
          type: "STRING",
          description: "اسم الصف الدراسي (اختياري، مثل: 'الثالث الثانوي' أو 'الثاني بكالوريا')",
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
  {
    name: "create_student",
    description: "إضافة وتسجيل طالب جديد مباشرة في قاعدة البيانات. يتطلب اسم الطالب ومعرف الصف (grade_id) ومعرف المجموعة (group_id). يمكن تحديد الباركود ورقم الهاتف ورقم ولي الأمر والملاحظات.",
    parameters: {
      type: "OBJECT",
      properties: {
        full_name: {
          type: "STRING",
          description: "الاسم الكامل للطالب ثلاثي أو رباعي",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرف الصف الدراسي (grade_id)",
        },
        group_id: {
          type: "INTEGER",
          description: "معرف المجموعة التابع لها الطالب (group_id)",
        },
        phone: {
          type: "STRING",
          description: "رقم هاتف الطالب (اختياري)",
        },
        parent_phone: {
          type: "STRING",
          description: "رقم هاتف ولي الأمر (اختياري)",
        },
        barcode: {
          type: "STRING",
          description: "كود أو باركود الطالب (اختياري، إذا لم يُحدد يتم توليده تلقائياً)",
        },
        notes: {
          type: "STRING",
          description: "ملاحظات إضافية (اختياري)",
        },
      },
      required: ["full_name", "grade_id", "group_id"],
    },
  },
  {
    name: "record_student_attendance",
    description: "تسجيل حضور أو غياب لطالب معين في قاعدة البيانات بتاريخ اليوم أو تاريخ محدد (حاضر 'present' أو غائب 'absent').",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "اسم الطالب أو الباركود أو رقم الهاتف لتحديد الطالب المطلوب",
        },
        status: {
          type: "STRING",
          enum: ["present", "absent"],
          description: "حالة الحضور: حاضر (present) أو غائب (absent)",
        },
        attendance_date: {
          type: "STRING",
          description: "تاريخ الحضور بتنسيق YYYY-MM-DD (اختياري، الافتراضي هو تاريخ اليوم)",
        },
        notes: {
          type: "STRING",
          description: "ملاحظات إضافية على الحضور (اختياري)",
        },
      },
      required: ["student_query", "status"],
    },
  },
  {
    name: "toggle_student_status",
    description: "تفعيل (نشط) أو تجميد/إيقاف حساب طالب في المنصة مع تسجيل سبب التعطيل إن وجد.",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "اسم الطالب أو الباركود أو رقم الهاتف",
        },
        is_active: {
          type: "BOOLEAN",
          description: "true لتفعيل حساب الطالب، أو false لإيقاف وتجميد الحساب",
        },
        reason: {
          type: "STRING",
          description: "سبب الإيقاف أو التفعيل (اختياري)",
        },
      },
      required: ["student_query", "is_active"],
    },
  },
  {
    name: "record_student_payment",
    description: "تسجيل ودفع اشتراك شهر لطالب معين في السنتر (بالباركود أو الاسم أو الهاتف)، بنظام عادي (سعر الشهر الرسمي) أو بنظام مخصص (custom) بمبلغ يحدده المساعد. يُرجى عرض ملخص العملية ومطالبة المساعد بالتأكيد قبل الحفظ أو بعد تأكيده.",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "باركود أو اسم أو هاتف الطالب",
        },
        amount: {
          type: "NUMBER",
          description: "المبلغ المدفوع بالجنيه (مطلوب إذا كان النظام مخصص custom، أو اتركه فارغاً للنظام العادي)",
        },
        payment_mode: {
          type: "STRING",
          enum: ["normal", "custom"],
          description: "وضع الدفع: normal (المبلغ الكامل للشهر) أو custom (مبلغ مخصص كخصم أو إعفاء جزئي)",
        },
        month: {
          type: "STRING",
          description: "شهر الاشتراك بتنسيق YYYY-MM (اختياري، الافتراضي هو الشهر الحالي)",
        },
        notes: {
          type: "STRING",
          description: "ملاحظات الدفع (اختياري، مثل: خصم تفوق، سداد نقدي، إيصال)",
        },
      },
      required: ["student_query"],
    },
  },
  {
    name: "get_student_payment_status",
    description: "جلب السجل المالي لاشتراكات ومدفوعات طالب معين: الشهور المسددة، الشهور غير المسددة، المبالغ وتواريخ الدفع.",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "باركود أو اسم أو هاتف الطالب",
        },
      },
      required: ["student_query"],
    },
  },
  {
    name: "record_paper_exam_result",
    description: "رصد وتحديث درجة طالب في امتحان ورقي مسجل بالسنتر. يُرجى مراجعة وتأكيد الدرجة مع المساعد.",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "باركود أو اسم الطالب",
        },
        degree: {
          type: "NUMBER",
          description: "الدرجة التي حصل عليها الطالب",
        },
        exam_id: {
          type: "INTEGER",
          description: "معرّف الامتحان الورقي (اختياري إذا تم تحديد اسم الامتحان)",
        },
        exam_name: {
          type: "STRING",
          description: "اسم أو عنوان الامتحان للبحث عنه (اختياري)",
        },
        notes: {
          type: "STRING",
          description: "ملاحظات إضافية على النتيجة (اختياري)",
        },
      },
      required: ["student_query", "degree"],
    },
  },
  {
    name: "create_paper_exam",
    description: "إنشاء وحفظ امتحان ورقي جديد لصف أو مجموعة في قاعدة البيانات وتحديد العنوان والدرجة العظمى.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "عنوان الامتحان (مثال: امتحان شامل شهر أكتوبر)",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي",
        },
        group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة (اختياري، لجميع مجموعات الصف)",
        },
        total_degree: {
          type: "NUMBER",
          description: "الدرجة العظمى للامتحان (مثال: 50 أو 60)",
        },
        exam_date: {
          type: "STRING",
          description: "تاريخ الامتحان بتنسيق YYYY-MM-DD (اختياري)",
        },
        notes: {
          type: "STRING",
          description: "ملاحظات إضافية (اختياري)",
        },
      },
      required: ["title", "grade_id", "total_degree"],
    },
  },
  {
    name: "start_attendance_session",
    description: "بدء وفتح جلسة حضور جديدة لمجموعة معينة لتجهيزها لمسح الباركود واستقبال الطلاب.",
    parameters: {
      type: "OBJECT",
      properties: {
        group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة التابع لها الحضور",
        },
        lock_minutes: {
          type: "INTEGER",
          description: "مدة بقاء التسجيل مفتوحاً بالدقائق (افتراضياً 60 دقيقة)",
        },
      },
      required: ["group_id"],
    },
  },
  {
    name: "close_attendance_session",
    description: "إغلاق وقفل جلسة حضور مجموعة معينة، وترحيل جميع الطلاب غير الحاضرين كـ 'غائبين' تلقائياً.",
    parameters: {
      type: "OBJECT",
      properties: {
        group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة",
        },
      },
      required: ["group_id"],
    },
  },
  {
    name: "create_assignment",
    description: "إنشاء واجب منزلي جديد لصف أو مجموعة مع تحديد العنوان والوصف وموعد التسليم والدرجة.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "عنوان الواجب المنزلي",
        },
        description: {
          type: "STRING",
          description: "تفاصيل أو تعليمات الواجب (اختياري)",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي",
        },
        group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة (اختياري)",
        },
        deadline: {
          type: "STRING",
          description: "تاريخ ووقت انتهاء تسليم الواجب بتنسيق YYYY-MM-DD HH:mm:ss",
        },
        full_mark: {
          type: "NUMBER",
          description: "الدرجة العظمى للواجب (افتراضياً 10)",
        },
      },
      required: ["title", "grade_id", "deadline"],
    },
  },
  {
    name: "update_student_details",
    description: "تعديل وتحديث بيانات طالب مسجل (نقل لمجموعة أخرى، تغيير الصف، تعديل رقم هاتف الطالب أو ولي الأمر، أو الملاحظات).",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "باركود أو اسم أو هاتف الطالب المطلوب تعديله",
        },
        new_name: {
          type: "STRING",
          description: "الاسم الجديد للطالب (اختياري)",
        },
        new_grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي الجديد (اختياري)",
        },
        new_group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة الجديدة (اختياري)",
        },
        new_phone: {
          type: "STRING",
          description: "رقم هاتف الطالب الجديد (اختياري)",
        },
        new_parent_phone: {
          type: "STRING",
          description: "رقم هاتف ولي الأمر الجديد (اختياري)",
        },
        notes: {
          type: "STRING",
          description: "ملاحظات إضافية (اختياري)",
        },
      },
      required: ["student_query"],
    },
  },
  {
    name: "create_live_session",
    description: "إنشاء وحجز حصة بث مباشر (أونلاين / لايف) جديدة لصف دراسي أو مجموعة معينة مع توليد رابط Google Meet الرسمي تلقائياً ومشاركتها مع الطلاب في المنصة.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "عنوان الحصة (مثال: مراجعة الصف الثالث الثانوي / حل تدريبات النحو)",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي (اختياري إذا تم تحديد grade_name)",
        },
        grade_name: {
          type: "STRING",
          description: "اسم الصف الدراسي للبحث عنه وتحديده تلقائياً (مثل: 'الثالث الثانوي' أو 'الثاني بكالوريا')",
        },
        group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة (اختياري، اتركه فارغاً إذا كانت الحصة لكل مجموعات الصف)",
        },
        duration_minutes: {
          type: "INTEGER",
          description: "مدة الحصة بالدقائق (مثال: 60 أو 90 أو 45، الافتراضي 60)",
        },
        start_time: {
          type: "STRING",
          description: "موعد وتاريخ بدء الحصة بتنسيق YYYY-MM-DD HH:mm:ss أو عبارة مثل 'now' أو 'after 10 minutes' أو 'كمان عشر دقايق'",
        },
        description: {
          type: "STRING",
          description: "وصف الحصة أو الموضوعات التي سيتم تناولها (اختياري)",
        },
        target_type: {
          type: "STRING",
          enum: ["grade", "group", "student"],
          description: "نوع الاستهداف: grade (صف كامل لجميع مجموعاته - وهو الافتراضي للحصص العامة)، group (مجموعة معينة)، أو student (طالب محدد)",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_live_sessions",
    description: "استعراض قائمة حصص البث المباشر (المجدولة والقادمة والمنتهية) مع روابط Google Meet ومواعيدها والصفوف المخصصة لها.",
    parameters: {
      type: "OBJECT",
      properties: {
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي للتصفية (اختياري)",
        },
        status: {
          type: "STRING",
          enum: ["scheduled", "live", "ended", "cancelled"],
          description: "حالة الحصة للتصفية (اختياري)",
        },
        limit: {
          type: "INTEGER",
          description: "الحد الأقصى لعدد الحصص المسترجعة (افتراضياً 10)",
        },
      },
    },
  },
  {
    name: "delete_live_session",
    description: "حذف وإلغاء حصة بث مباشر محددة بالمعرّف (ID) من المنصة وتقويم Google Calendar.",
    parameters: {
      type: "OBJECT",
      properties: {
        session_id: {
          type: "INTEGER",
          description: "معرّف الحصة (ID) المراد حذفها",
        },
      },
      required: ["session_id"],
    },
  },
  {
    name: "reset_student_password",
    description: "إعادة تعيين وتغيير كلمة مرور طالب في المنصة (بالباركود أو الاسم أو الهاتف) إلى كلمة مرور جديدة أو توليد كلمة مرور قياسية له وإرجاعها للمساعد.",
    parameters: {
      type: "OBJECT",
      properties: {
        student_query: {
          type: "STRING",
          description: "باركود أو اسم أو هاتف الطالب المراد تغيير كلمة مروره",
        },
        new_password: {
          type: "STRING",
          description: "كلمة المرور الجديدة المراد تعيينها (اختياري، إذا تُركت فارغة يتم تعيينها برقم هاتف الطالب أو كود عشوائي قياسي)",
        },
      },
      required: ["student_query"],
    },
  },
  {
    name: "change_assistant_password",
    description: "تغيير وتحديث كلمة المرور الخاصة بحساب المساعد الحالي المسجل الدخول في المنصة بعد تقديم كلمة المرور الحالية للتأكيد وكلمة المرور الجديدة.",
    parameters: {
      type: "OBJECT",
      properties: {
        current_password: {
          type: "STRING",
          description: "كلمة المرور الحالية للمساعد للتحقق",
        },
        new_password: {
          type: "STRING",
          description: "كلمة المرور الجديدة المطلوبة",
        },
      },
      required: ["current_password", "new_password"],
    },
  },
  {
    name: "create_playlist",
    description: "إنشاء قائمة تشغيل فيديوهات جديدة لصف دراسي معين (مثل: مراجعات الباب الأول، شرح النحو).",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "عنوان قائمة التشغيل",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي التابعة له القائمة (اختياري إذا تم تحديد grade_name)",
        },
        grade_name: {
          type: "STRING",
          description: "اسم الصف الدراسي التابعة له القائمة (اختياري)",
        },
        description: {
          type: "STRING",
          description: "وصف محتوى قائمة التشغيل (اختياري)",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_playlists",
    description: "استعراض قوائم التشغيل الحالية المتاحة لصف دراسي معين مع عدد الفيديوهات بداخلها.",
    parameters: {
      type: "OBJECT",
      properties: {
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي (اختياري)",
        },
      },
    },
  },
  {
    name: "add_video_to_playlist",
    description: "إضافة فيديو مسجل أو تم رفعه إلى قائمة تشغيل معينة وترتيبه.",
    parameters: {
      type: "OBJECT",
      properties: {
        playlist_id: {
          type: "INTEGER",
          description: "معرّف قائمة التشغيل",
        },
        video_id: {
          type: "INTEGER",
          description: "معرّف الفيديو المراد إضافته",
        },
        order_num: {
          type: "INTEGER",
          description: "ترتيب الفيديو داخل القائمة (اختياري)",
        },
      },
      required: ["playlist_id", "video_id"],
    },
  },
  {
    name: "create_group",
    description: "إنشاء وإضافة مجموعة دراسية جديدة لصف معين في السنتر مع تحديد المواعيد والأيام والقاعة والسعة.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: {
          type: "STRING",
          description: "اسم المجموعة (مثال: مجموعة السبت والأربعاء 4 عصراً)",
        },
        grade_id: {
          type: "INTEGER",
          description: "معرّف الصف الدراسي التابعة له المجموعة (اختياري إذا تم تمرير grade_name)",
        },
        grade_name: {
          type: "STRING",
          description: "اسم الصف الدراسي لتحديده آلياً (اختياري)",
        },
        days: {
          type: "STRING",
          description: "أيام الحصص (مثال: 'السبت والأربعاء')",
        },
        start_time: {
          type: "STRING",
          description: "وقت البدء (مثال: '16:00:00' أو '04:00 PM')",
        },
        end_time: {
          type: "STRING",
          description: "وقت الانتهاء (مثال: '18:00:00' أو '06:00 PM')",
        },
        room: {
          type: "STRING",
          description: "اسم القاعة أو المكان (اختياري، مثال: 'قاعة 1')",
        },
        max_students: {
          type: "INTEGER",
          description: "الحد الأقصى لسعة المجموعة من الطلاب (اختياري)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_group",
    description: "تعديل وتحديث بيانات مجموعة دراسية مسجلة (تحديث الاسم، الأيام، المواعيد، القاعة أو السعة).",
    parameters: {
      type: "OBJECT",
      properties: {
        group_id: {
          type: "INTEGER",
          description: "معرّف المجموعة المراد تعديلها",
        },
        name: {
          type: "STRING",
          description: "الاسم الجديد للمجموعة (اختياري)",
        },
        days: {
          type: "STRING",
          description: "الأيام الجديدة (اختياري)",
        },
        start_time: {
          type: "STRING",
          description: "وقت البدء الجديد (اختياري)",
        },
        end_time: {
          type: "STRING",
          description: "وقت الانتهاء الجديد (اختياري)",
        },
        room: {
          type: "STRING",
          description: "القاعة الجديدة (اختياري)",
        },
        max_students: {
          type: "INTEGER",
          description: "السعة الجديدة (اختياري)",
        },
      },
      required: ["group_id"],
    },
  },
  {
    name: "grade_assignment_submission",
    description: "رصد وتصحيح درجة تسليم واجب لطالب مع كتابة ملاحظات وتوجيهات تشجيعية للطالب.",
    parameters: {
      type: "OBJECT",
      properties: {
        submission_id: {
          type: "INTEGER",
          description: "معرّف تسليم الواجب (submission_id)",
        },
        grade: {
          type: "NUMBER",
          description: "الدرجة المستحقة التي حصل عليها الطالب",
        },
        feedback: {
          type: "STRING",
          description: "ملاحظات التقييم والتصحيح للطالب (اختياري)",
        },
      },
      required: ["submission_id", "grade"],
    },
  },
  {
    name: "delete_online_exam",
    description: "حذف أو إلغاء امتحان إلكتروني من المنصة وقاعدة البيانات.",
    parameters: {
      type: "OBJECT",
      properties: {
        exam_id: {
          type: "INTEGER",
          description: "معرّف الامتحان الإلكتروني المراد حذفه",
        },
      },
      required: ["exam_id"],
    },
  },
  {
    name: "delete_paper_exam",
    description: "حذف امتحان ورقي مسجل بالسنتر بالمعرّف (ID).",
    parameters: {
      type: "OBJECT",
      properties: {
        exam_id: {
          type: "INTEGER",
          description: "معرّف الامتحان الورقي المراد حذفه",
        },
      },
      required: ["exam_id"],
    },
  },
];

function parseSessionStartTime(input) {
  const now = new Date();
  if (!input) {
    return new Date(now.getTime() + 10 * 60000);
  }

  const str = String(input).trim().toLowerCase();

  const arabicWordMap = {
    "عشر دقائق": 10,
    "عشر دقايق": 10,
    "عشر": 10,
    "عشرة": 10,
    "خمس دقائق": 5,
    "خمس دقايق": 5,
    "خمس": 5,
    "خمسة": 5,
    "ربع ساعة": 15,
    "ثلث ساعة": 20,
    "نصف ساعة": 30,
    "نص ساعة": 30,
    "ساعة": 60,
  };

  for (const [phrase, mins] of Object.entries(arabicWordMap)) {
    if (str.includes(phrase)) {
      return new Date(now.getTime() + mins * 60000);
    }
  }

  const minuteMatch = str.match(/(\d+)\s*(?:دقيقة|دقايق|دقيق|minute|min|m)/i);
  if (minuteMatch) {
    const mins = parseInt(minuteMatch[1], 10);
    return new Date(now.getTime() + mins * 60000);
  }

  const hourMatch = str.match(/(\d+)\s*(?:ساعة|ساعات|hour|hr|h)/i);
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    return new Date(now.getTime() + hours * 3600000);
  }

  if (
    str.includes("الان") ||
    str.includes("الآن") ||
    str.includes("now") ||
    str.includes("حاليا") ||
    str.includes("حالياً")
  ) {
    return new Date(now.getTime() + 5 * 60000);
  }

  let d = new Date(input);
  if (isNaN(d.getTime())) {
    const cleaned = String(input).replace(" ", "T");
    d = new Date(cleaned);
  }

  if (!isNaN(d.getTime())) {
    if (d.getTime() < now.getTime()) {
      return new Date(now.getTime() + 5 * 60000);
    }
    return d;
  }

  return new Date(now.getTime() + 10 * 60000);
}

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
      let resolvedGradeId = args.grade_id ? Number(args.grade_id) : null;

      // If grade_name passed, resolve to grade_id
      if (!resolvedGradeId && args.grade_name) {
        const gradeRes = await query(
          "SELECT id, name FROM grades WHERE name ILIKE $1 AND deleted = 0 LIMIT 1",
          [`%${args.grade_name.trim()}%`],
        );
        if (gradeRes.rows.length > 0) {
          resolvedGradeId = gradeRes.rows[0].id;
        }
      }

      const conditions = ["deleted = 0", "is_active = true"];
      const values = [];
      let paramIndex = 1;

      if (resolvedGradeId) {
        conditions.push(`grade_id = $${paramIndex++}`);
        values.push(resolvedGradeId);
      }

      if (args.group_id) {
        conditions.push(`group_id = $${paramIndex++}`);
        values.push(args.group_id);
      }

      const countRes = await query(
        `SELECT COUNT(*) AS total_students FROM students WHERE ${conditions.join(" AND ")}`,
        values,
      );

      // Always return breakdown by grades for complete instant context
      const byGradesRes = await query(`
        SELECT g.id AS grade_id, g.name AS grade_name, COUNT(s.id) AS students_count
        FROM grades g
        LEFT JOIN students s ON s.grade_id = g.id AND s.deleted = 0 AND s.is_active = true
        WHERE g.deleted = 0
        GROUP BY g.id, g.name
        ORDER BY g.id ASC
      `);

      return {
        success: true,
        total_active_students: Number(countRes.rows[0].total_students || 0),
        grades_breakdown: byGradesRes.rows.map((r) => ({
          grade_id: r.grade_id,
          grade_name: r.grade_name,
          active_students_count: Number(r.students_count),
        })),
        filters_applied: {
          grade_id: resolvedGradeId || "all",
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

    case "create_student": {
      const {
        full_name,
        grade_id,
        group_id,
        phone,
        parent_phone,
        barcode,
        notes,
      } = args;

      if (!full_name || !grade_id || !group_id) {
        return {
          success: false,
          error:
            "يجب تحديد اسم الطالب، معرف الصف الدراسي (grade_id)، ومعرف المجموعة (group_id).",
        };
      }

      // Check grade and group
      const groupCheck = await query(
        `SELECT g.id, g.name AS group_name, gr.name AS grade_name 
         FROM groups g 
         JOIN grades gr ON g.grade_id = gr.id 
         WHERE g.id = $1 AND g.grade_id = $2 AND g.deleted = 0 AND gr.deleted = 0`,
        [group_id, grade_id],
      );

      if (groupCheck.rows.length === 0) {
        return {
          success: false,
          error: `المجموعة المحددة (ID: ${group_id}) غير متوافقة مع الصف الدراسي (ID: ${grade_id}) أو غير موجودة.`,
        };
      }

      const groupName = groupCheck.rows[0].group_name;
      const gradeName = groupCheck.rows[0].grade_name;

      // Check or generate unique barcode
      let studentBarcode = (barcode || "").trim();
      if (studentBarcode) {
        const existingBarcode = await query(
          "SELECT id, full_name FROM students WHERE barcode = $1 AND deleted = 0",
          [studentBarcode],
        );
        if (existingBarcode.rows.length > 0) {
          return {
            success: false,
            error: `الباركود '${studentBarcode}' مستخدم بالفعل للطالب: ${existingBarcode.rows[0].full_name}`,
          };
        }
      } else {
        const maxBarcodeRes = await query(`
          SELECT MAX(CAST(barcode AS INTEGER)) AS max_code 
          FROM students 
          WHERE barcode ~ '^[0-9]+$' AND deleted = 0
        `);
        const maxCode = Number(maxBarcodeRes.rows[0]?.max_code) || 1000;
        studentBarcode = String(maxCode + 1).padStart(4, "0");
      }

      // Generate unique parent token (10 chars)
      const tokenChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let parentToken = "";
      for (let i = 0; i < 10; i++) {
        parentToken += tokenChars.charAt(
          crypto.randomInt(0, tokenChars.length),
        );
      }

      const insertRes = await query(
        `
        INSERT INTO students (
          barcode, full_name, phone, parent_phone, parent_token,
          grade_id, group_id, notes, is_active, deleted, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, 0, NOW(), NOW())
        RETURNING id, full_name, barcode, phone, parent_phone, parent_token, is_active
      `,
        [
          studentBarcode,
          full_name.trim(),
          phone ? phone.trim() : null,
          parent_phone ? parent_phone.trim() : null,
          parentToken,
          grade_id,
          group_id,
          notes ? notes.trim() : null,
        ],
      );

      const created = insertRes.rows[0];

      return {
        success: true,
        message: `تم تسجيل وإضافة الطالب (${created.full_name}) بنجاح في قاعدة البيانات.`,
        student: {
          student_id: created.id,
          full_name: created.full_name,
          barcode: created.barcode,
          phone: created.phone || "غير مسجل",
          parent_phone: created.parent_phone || "غير مسجل",
          parent_token: created.parent_token,
          grade_name: gradeName,
          group_name: groupName,
          status: "نشط ومفعل",
        },
      };
    }

    case "record_student_attendance": {
      const { student_query, status, attendance_date, notes } = args;

      if (!student_query || !status) {
        return {
          success: false,
          error:
            "يجب تحديد اسم أو باركود الطالب، وحالة الحضور (present أو absent).",
        };
      }

      if (!["present", "absent"].includes(status)) {
        return {
          success: false,
          error: "حالة الحضور يجب أن تكون 'present' (حاضر) أو 'absent' (غائب).",
        };
      }

      // Search student
      const q = student_query.trim();
      const stdRes = await query(
        `
        SELECT s.id, s.full_name, s.barcode, s.grade_id, s.group_id, s.is_active,
               g.name AS grade_name, gr.name AS group_name
        FROM students s
        LEFT JOIN grades g ON s.grade_id = g.id
        LEFT JOIN groups gr ON s.group_id = gr.id
        WHERE (s.barcode = $1 OR s.phone = $1 OR s.full_name ILIKE ('%' || $1 || '%'))
          AND s.deleted = 0
        LIMIT 5
      `,
        [q],
      );

      if (stdRes.rows.length === 0) {
        return {
          success: false,
          error: `لم يتم العثور على طالب يطابق البحث: '${q}'`,
        };
      }

      if (stdRes.rows.length > 1) {
        return {
          success: false,
          error: `يوجد أكثر من طالب بهذا الاسم، يرجى التحديد بالباركود أو الاسم الكامل: ${stdRes.rows
            .map((s) => `${s.full_name} (${s.barcode})`)
            .join("، ")}`,
        };
      }

      const student = stdRes.rows[0];
      const targetDate = attendance_date
        ? attendance_date.trim()
        : new Date().toISOString().split("T")[0];

      // Upsert attendance
      await query(
        `
        INSERT INTO attendance (
          student_id, group_id, grade_id, attendance_date,
          status, attendance_time, method, is_makeup, makeup_group_id, notes
        )
        VALUES (
          $1, $2, $3, $4,
          $5, NOW() AT TIME ZONE 'Africa/Cairo', 'manual', 0, NULL, $6
        )
        ON CONFLICT (student_id, attendance_date)
        DO UPDATE SET
          status = EXCLUDED.status,
          notes = EXCLUDED.notes,
          group_id = EXCLUDED.group_id,
          grade_id = EXCLUDED.grade_id,
          updated_at = NOW()
      `,
        [
          student.id,
          student.group_id,
          student.grade_id,
          targetDate,
          status,
          notes || null,
        ],
      );

      const statusArabic = status === "present" ? "حاضر" : "غائب";

      return {
        success: true,
        message: `تم تسجيل الطالب (${student.full_name}) كـ (${statusArabic}) لتاريخ ${targetDate} بنجاح.`,
        student: {
          student_id: student.id,
          full_name: student.full_name,
          barcode: student.barcode,
          status: statusArabic,
          date: targetDate,
        },
      };
    }

    case "toggle_student_status": {
      const { student_query, is_active, reason } = args;

      if (!student_query || is_active === undefined) {
        return {
          success: false,
          error: "يجب تحديد الطالب وحالة التفعيل (is_active).",
        };
      }

      const q = student_query.trim();
      const stdRes = await query(
        `
        SELECT id, full_name, barcode, is_active 
        FROM students 
        WHERE (barcode = $1 OR phone = $1 OR full_name ILIKE ('%' || $1 || '%')) 
          AND deleted = 0 
        LIMIT 5
      `,
        [q],
      );

      if (stdRes.rows.length === 0) {
        return {
          success: false,
          error: `لم يتم العثور على طالب يطابق: '${q}'`,
        };
      }

      const student = stdRes.rows[0];
      const boolActive = Boolean(is_active);

      await query(
        `
        UPDATE students 
        SET is_active = $1, deactivation_reason = $2, updated_at = NOW() 
        WHERE id = $3
      `,
        [boolActive, boolActive ? null : reason || "إيقاف إداري", student.id],
      );

      return {
        success: true,
        message: `تم ${boolActive ? "تفعيل" : "تجميد/إيقاف"} حساب الطالب (${student.full_name}) بنجاح.`,
        student: {
          student_id: student.id,
          full_name: student.full_name,
          barcode: student.barcode,
          is_active: boolActive,
          status: boolActive
            ? "نشط ومفعل"
            : `معطل (${reason || "إيقاف إداري"})`,
        },
      };
    }

    case "record_student_payment": {
      const {
        student_query,
        amount,
        payment_mode = "normal",
        month,
        notes,
      } = args;

      if (!student_query) {
        return {
          success: false,
          error: "يرجى تحديد الطالب (بالاسم أو الباركود أو رقم الهاتف).",
        };
      }

      const q = String(student_query).trim();
      const stdRes = await query(
        `SELECT s.id, s.full_name, s.barcode, s.grade_id, g.name AS grade_name, g.monthly_price
         FROM students s
         JOIN grades g ON s.grade_id = g.id
         WHERE (s.barcode = $1 OR s.phone = $1 OR s.full_name ILIKE ('%' || $1 || '%'))
           AND s.deleted = 0
         LIMIT 1`,
        [q],
      );

      if (stdRes.rows.length === 0) {
        return {
          success: false,
          error: `لم يتم العثور على طالب يطابق البحث: '${q}'`,
        };
      }

      const student = stdRes.rows[0];
      const targetMonth = month
        ? String(month).trim()
        : new Date().toISOString().slice(0, 7);

      const isCustom = payment_mode === "custom";
      let finalAmount;
      if (isCustom) {
        if (!amount || Number(amount) <= 0) {
          return {
            success: false,
            error: "في الوضع المخصص (custom) يجب تحديد مبلغ صحيح أكبر من صفر.",
          };
        }
        finalAmount = Number(amount);
      } else {
        finalAmount = Number(student.monthly_price);
      }

      // Check or create subscription for this month
      let subRes = await query(
        `SELECT id, status, required_amount FROM subscriptions 
         WHERE student_id = $1 AND month = $2 AND deleted = 0 
         LIMIT 1`,
        [student.id, targetMonth],
      );

      let subscriptionId;
      if (subRes.rows.length === 0) {
        const createSubRes = await query(
          `INSERT INTO subscriptions (student_id, month, required_amount, status, created_at, deleted)
           VALUES ($1, $2, $3, 'unpaid', NOW(), 0)
           RETURNING id`,
          [student.id, targetMonth, student.monthly_price],
        );
        subscriptionId = createSubRes.rows[0].id;
      } else {
        subscriptionId = subRes.rows[0].id;
      }

      // Record payment & update subscription in transaction
      const paymentRes = await transaction(async (client) => {
        const pRes = await client.query(
          `INSERT INTO payments (subscription_id, student_id, amount, payment_date, payment_mode, notes, created_at)
           VALUES ($1, $2, $3, NOW() AT TIME ZONE 'Africa/Cairo', $4, $5, NOW())
           RETURNING id, amount, payment_mode, created_at`,
          [
            subscriptionId,
            student.id,
            finalAmount,
            isCustom ? "custom" : "normal",
            notes || null,
          ],
        );

        await client.query(
          `UPDATE subscriptions SET status = 'paid' WHERE id = $1`,
          [subscriptionId],
        );

        return pRes.rows[0];
      });

      return {
        success: true,
        message: `تم سداد اشتراك شهر (${targetMonth}) للطالب (${student.full_name}) بمبلغ (${finalAmount} ج.م) بنجاح وتفعيل حسابه!`,
        payment: {
          payment_id: paymentRes.id,
          student_id: student.id,
          full_name: student.full_name,
          barcode: student.barcode,
          month: targetMonth,
          amount: finalAmount,
          payment_mode: isCustom ? "مخصص (custom)" : "عادي (سعر الصف)",
          status: "مدفوع ومفعل",
        },
      };
    }

    case "get_student_payment_status": {
      const { student_query } = args;
      if (!student_query) {
        return { success: false, error: "يرجى تحديد الطالب للبحث." };
      }

      const q = String(student_query).trim();
      const stdRes = await query(
        `SELECT s.id, s.full_name, s.barcode, s.grade_id, g.name AS grade_name, g.monthly_price
         FROM students s
         JOIN grades g ON s.grade_id = g.id
         WHERE (s.barcode = $1 OR s.phone = $1 OR s.full_name ILIKE ('%' || $1 || '%'))
           AND s.deleted = 0
         LIMIT 1`,
        [q],
      );

      if (stdRes.rows.length === 0) {
        return { success: false, error: `لم يتم العثور على طالب: '${q}'` };
      }

      const student = stdRes.rows[0];
      const subsRes = await query(
        `SELECT sub.id, sub.month, sub.required_amount, sub.status,
                COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.subscription_id = sub.id), 0) AS paid_amount,
                (SELECT p.payment_mode FROM payments p WHERE p.subscription_id = sub.id ORDER BY p.id DESC LIMIT 1) AS payment_mode,
                (SELECT p.created_at FROM payments p WHERE p.subscription_id = sub.id ORDER BY p.id DESC LIMIT 1) AS payment_date
         FROM subscriptions sub
         WHERE sub.student_id = $1 AND sub.deleted = 0
         ORDER BY sub.month DESC
         LIMIT 6`,
        [student.id],
      );

      return {
        success: true,
        student: {
          student_id: student.id,
          full_name: student.full_name,
          barcode: student.barcode,
          grade_name: student.grade_name,
          monthly_price: student.monthly_price,
        },
        subscriptions: subsRes.rows.map((s) => ({
          month: s.month,
          required_amount: s.required_amount,
          paid_amount: s.paid_amount,
          status: s.status === "paid" ? "مسدد بالكامل" : "غير مسدد",
          payment_mode: s.payment_mode || "غير مسجل",
          payment_date: s.payment_date || null,
        })),
      };
    }

    case "record_paper_exam_result": {
      const { student_query, degree, exam_id, exam_name, notes } = args;

      if (!student_query || degree === undefined) {
        return {
          success: false,
          error: "يجب تحديد الطالب والدرجة التي حصل عليها.",
        };
      }

      const q = String(student_query).trim();
      const stdRes = await query(
        `SELECT id, full_name, barcode, grade_id FROM students 
         WHERE (barcode = $1 OR phone = $1 OR full_name ILIKE ('%' || $1 || '%')) 
           AND deleted = 0 LIMIT 1`,
        [q],
      );

      if (stdRes.rows.length === 0) {
        return { success: false, error: `لم يتم العثور على طالب: '${q}'` };
      }

      const student = stdRes.rows[0];

      let exam;
      if (exam_id) {
        const eRes = await query(
          "SELECT id, title, total_degree FROM exams WHERE id = $1 AND deleted = 0",
          [exam_id],
        );
        exam = eRes.rows[0];
      } else if (exam_name) {
        const eRes = await query(
          "SELECT id, title, total_degree FROM exams WHERE title ILIKE $1 AND deleted = 0 LIMIT 1",
          [`%${exam_name.trim()}%`],
        );
        exam = eRes.rows[0];
      } else {
        const eRes = await query(
          "SELECT id, title, total_degree FROM exams WHERE grade_id = $1 AND deleted = 0 ORDER BY id DESC LIMIT 1",
          [student.grade_id],
        );
        exam = eRes.rows[0];
      }

      if (!exam) {
        return {
          success: false,
          error: "لم يتم العثور على الامتحان الورقي المطلوب.",
        };
      }

      const numDegree = Number(degree);

      await query(
        `INSERT INTO exam_results (student_id, exam_id, degree, notes, created_at, updated_at, is_absent)
         VALUES ($1, $2, $3, $4, NOW(), NOW(), false)
         ON CONFLICT (student_id, exam_id)
         DO UPDATE SET degree = EXCLUDED.degree, notes = EXCLUDED.notes, is_absent = false, updated_at = NOW()`,
        [student.id, exam.id, numDegree, notes || null],
      );

      return {
        success: true,
        message: `تم رصد وحفظ درجة الطالب (${student.full_name}) في امتحان (${exam.title}) بنجاح: ${numDegree} من ${exam.total_degree}`,
        result: {
          student_id: student.id,
          full_name: student.full_name,
          barcode: student.barcode,
          exam_id: exam.id,
          exam_title: exam.title,
          degree: numDegree,
          total_degree: exam.total_degree,
        },
      };
    }

    case "create_paper_exam": {
      const {
        title,
        grade_id,
        group_id,
        total_degree,
        exam_date,
        notes,
      } = args;

      if (!title || !grade_id || !total_degree) {
        return {
          success: false,
          error: "يجب تحديد عنوان الامتحان ومعرف الصف والدرجة العظمى.",
        };
      }

      const targetDate = exam_date
        ? String(exam_date).trim()
        : new Date().toISOString().split("T")[0];

      const res = await query(
        `INSERT INTO exams (title, grade_id, group_id, total_degree, exam_date, notes, created_by, created_at, updated_at, deleted)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), 0)
         RETURNING id, title, total_degree, exam_date`,
        [
          title.trim(),
          grade_id,
          group_id || null,
          Number(total_degree),
          targetDate,
          notes || null,
          userId,
        ],
      );

      const created = res.rows[0];
      return {
        success: true,
        message: `تم إنشاء الامتحان الورقي (${created.title}) بنجاح برقم معرّف #${created.id}`,
        exam: created,
      };
    }

    case "start_attendance_session": {
      const { group_id, lock_minutes = 60 } = args;
      if (!group_id) {
        return { success: false, error: "يجب تحديد معرّف المجموعة." };
      }

      const grpRes = await query(
        "SELECT id, name, grade_id FROM groups WHERE id = $1 AND deleted = 0",
        [group_id],
      );
      if (grpRes.rows.length === 0) {
        return { success: false, error: "المجموعة غير موجودة." };
      }
      const group = grpRes.rows[0];

      // Check active session today
      const existing = await query(
        `SELECT id, status FROM attendance_sessions 
         WHERE group_id = $1 AND status = 'active' 
           AND DATE(started_at AT TIME ZONE 'Africa/Cairo') = DATE(NOW() AT TIME ZONE 'Africa/Cairo')`,
        [group_id],
      );

      if (existing.rows.length > 0) {
        return {
          success: true,
          message: `توجد جلسة حضور نشطة بالفعل لمجموعة (${group.name}) ومفتوحة لمسح الباركود.`,
          session_id: existing.rows[0].id,
        };
      }

      const insRes = await query(
        `INSERT INTO attendance_sessions 
          (group_id, grade_id, started_by, lock_at, is_makeup_enabled, attendance_locked, status)
         VALUES 
          ($1, $2, $3, (NOW() + ($4 || ' minutes')::interval) AT TIME ZONE 'Africa/Cairo', 0, 0, 'active')
         RETURNING id, started_at, lock_at`,
        [group.id, group.grade_id, userId, Number(lock_minutes) || 60],
      );

      return {
        success: true,
        message: `تم بدء وفتح جلسة الحضور لمجموعة (${group.name}) بنجاح! الجلسة مفتوحة لمسح الباركود الآن.`,
        session_id: insRes.rows[0].id,
      };
    }

    case "close_attendance_session": {
      const { group_id } = args;
      if (!group_id) {
        return { success: false, error: "يجب تحديد معرّف المجموعة." };
      }

      const sessRes = await query(
        `SELECT id, group_id, grade_id FROM attendance_sessions 
         WHERE group_id = $1 AND status = 'active' LIMIT 1`,
        [group_id],
      );

      if (sessRes.rows.length === 0) {
        return {
          success: false,
          error: "لا توجد جلسة حضور نشطة حالياً لهذه المجموعة لإغلاقها.",
        };
      }

      const session = sessRes.rows[0];

      // Mark rest absent
      await query(
        `INSERT INTO attendance (student_id, group_id, grade_id, attendance_date, status, attendance_time, method, is_makeup, notes)
         SELECT s.id, $1, s.grade_id, CURRENT_DATE, 'absent', NOW() AT TIME ZONE 'Africa/Cairo', 'manual', 0, 'غياب آلي عند إغلاق الجلسة'
         FROM students s
         WHERE s.group_id = $1 AND s.deleted = 0 AND s.is_active = true
           AND NOT EXISTS (
             SELECT 1 FROM attendance a WHERE a.student_id = s.id AND a.attendance_date = CURRENT_DATE
           )
         ON CONFLICT (student_id, attendance_date) DO NOTHING`,
        [group_id],
      );

      await query(
        `UPDATE attendance_sessions 
         SET status = 'locked', ended_at = NOW() AT TIME ZONE 'Africa/Cairo', attendance_locked = 1 
         WHERE id = $1`,
        [session.id],
      );

      return {
        success: true,
        message:
          "تم إغلاق الجلسة بنجاح وترحيل جميع الطلاب غير الحاضرين كـ 'غائبين' تلقائياً.",
      };
    }

    case "create_assignment": {
      const {
        title,
        description,
        grade_id,
        group_id,
        deadline,
        full_mark = 10,
      } = args;

      if (!title || !grade_id || !deadline) {
        return {
          success: false,
          error:
            "يجب تحديد عنوان الواجب ومعرف الصف الدراسي وموعد انتهاء التسليم (deadline).",
        };
      }

      const res = await query(
        `INSERT INTO assignments (title, description, grade_id, group_id, deadline, full_mark, is_closed, created_by, created_at, updated_at, deleted)
         VALUES ($1, $2, $3, $4, $5, $6, 0, $7, NOW(), NOW(), 0)
         RETURNING id, title, deadline, full_mark`,
        [
          title.trim(),
          description || null,
          grade_id,
          group_id || null,
          deadline,
          Number(full_mark) || 10,
          userId,
        ],
      );

      return {
        success: true,
        message: `تم إنشاء ونشر الواجب (${res.rows[0].title}) بنجاح للطلاب برقم معرّف #${res.rows[0].id}`,
        assignment: res.rows[0],
      };
    }

    case "update_student_details": {
      const {
        student_query,
        new_name,
        new_grade_id,
        new_group_id,
        new_phone,
        new_parent_phone,
        notes,
      } = args;

      if (!student_query) {
        return { success: false, error: "يجب تحديد الطالب المطلوب تعديله." };
      }

      const q = String(student_query).trim();
      const stdRes = await query(
        `SELECT id, full_name, barcode, phone, parent_phone, grade_id, group_id, notes 
         FROM students 
         WHERE (barcode = $1 OR phone = $1 OR full_name ILIKE ('%' || $1 || '%')) 
           AND deleted = 0 LIMIT 1`,
        [q],
      );

      if (stdRes.rows.length === 0) {
        return { success: false, error: `لم يتم العثور على طالب: '${q}'` };
      }

      const student = stdRes.rows[0];

      const updatedName = new_name ? new_name.trim() : student.full_name;
      const updatedGrade = new_grade_id
        ? Number(new_grade_id)
        : student.grade_id;
      const updatedGroup = new_group_id
        ? Number(new_group_id)
        : student.group_id;
      const updatedPhone = new_phone ? new_phone.trim() : student.phone;
      const updatedParentPhone = new_parent_phone
        ? new_parent_phone.trim()
        : student.parent_phone;
      const updatedNotes = notes !== undefined ? notes : student.notes;

      await query(
        `UPDATE students 
         SET full_name = $1, grade_id = $2, group_id = $3, phone = $4, parent_phone = $5, notes = $6, updated_at = NOW()
         WHERE id = $7`,
        [
          updatedName,
          updatedGrade,
          updatedGroup,
          updatedPhone,
          updatedParentPhone,
          updatedNotes,
          student.id,
        ],
      );

      return {
        success: true,
        message: `تم تحديث وتعديل بيانات الطالب (${updatedName}) بنجاح.`,
        student: {
          student_id: student.id,
          full_name: updatedName,
          barcode: student.barcode,
          phone: updatedPhone,
          parent_phone: updatedParentPhone,
          grade_id: updatedGrade,
          group_id: updatedGroup,
        },
      };
    }

    case "create_live_session": {
      const {
        title,
        grade_id,
        grade_name,
        group_id,
        duration_minutes = 60,
        start_time,
        description,
        target_type,
      } = args;

      if (!title) {
        return { success: false, error: "عنوان الحصة مطلوب." };
      }

      // Resolve Grade ID
      let resolvedGradeId = grade_id ? Number(grade_id) : null;
      if (!resolvedGradeId && grade_name) {
        const gRes = await query(
          "SELECT id, name FROM grades WHERE name ILIKE $1 AND deleted = 0 LIMIT 1",
          [`%${grade_name.trim()}%`],
        );
        if (gRes.rows.length > 0) {
          resolvedGradeId = gRes.rows[0].id;
        }
      }

      // Fallback: If still not resolved and no group_id, default to first active grade
      if (!resolvedGradeId && !group_id) {
        const defaultGrade = await query(
          "SELECT id FROM grades WHERE deleted = 0 ORDER BY id ASC LIMIT 1",
        );
        if (defaultGrade.rows.length > 0) {
          resolvedGradeId = defaultGrade.rows[0].id;
        }
      }

      let resolvedGroupId = group_id ? Number(group_id) : null;
      let finalTargetType = target_type;
      if (
        finalTargetType === "all" ||
        !finalTargetType ||
        !["grade", "group", "student"].includes(finalTargetType)
      ) {
        finalTargetType = resolvedGroupId ? "group" : "grade";
      }
      if (finalTargetType === "grade") {
        resolvedGroupId = null;
      }

      const startTimeObj = parseSessionStartTime(start_time);
      const durationNum = Math.max(5, Math.min(480, Number(duration_minutes) || 60));

      let effectiveUserId = userId;
      if (!effectiveUserId) {
        const uRes = await query(
          "SELECT id FROM users WHERE role IN ('assistant', 'teacher', 'super_admin') AND deleted = 0 ORDER BY id ASC LIMIT 1",
        );
        if (uRes.rows.length > 0) effectiveUserId = uRes.rows[0].id;
      }

      try {
        const newSession = await liveSessionsService.createLiveSession(
          effectiveUserId,
          {
            title: title.trim(),
            description: description || null,
            start_time: startTimeObj.toISOString(),
            duration_minutes: durationNum,
            target_type: finalTargetType,
            grade_id: resolvedGradeId,
            group_id: resolvedGroupId,
          },
        );

        return {
          success: true,
          message: `تم إنشاء وحجز حصة البث المباشر (${newSession.title}) بنجاح وتوليد رابط Google Meet الرسمي.`,
          session: {
            id: newSession.id,
            title: newSession.title,
            meet_link: newSession.meet_link,
            start_time: newSession.start_time,
            end_time: newSession.end_time,
            duration_minutes: newSession.duration_minutes,
            target_type: newSession.target_type,
            grade_id: newSession.grade_id,
            group_id: newSession.group_id,
            status: newSession.status,
          },
        };
      } catch (err) {
        console.error("Live session creation error in AI tool:", err.message);
        // Resilient fallback: direct insert into live_sessions
        const endTimeObj = new Date(startTimeObj.getTime() + durationNum * 60000);
        const fallbackMeetLink = `https://meet.google.com/new`;
        const fallbackRes = await query(
          `INSERT INTO live_sessions (
            title, description, start_time, end_time, duration_minutes,
            meet_link, target_type, grade_id, group_id, status, created_by, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'scheduled', $10, NOW(), NOW())
          RETURNING *`,
          [
            title.trim(),
            description || null,
            startTimeObj.toISOString(),
            endTimeObj.toISOString(),
            durationNum,
            fallbackMeetLink,
            finalTargetType,
            resolvedGradeId,
            resolvedGroupId,
            effectiveUserId,
          ],
        );

        return {
          success: true,
          message: `تم إنشاء حصة البث المباشر (${fallbackRes.rows[0].title}) بنجاح في جدول الحصص.`,
          session: {
            id: fallbackRes.rows[0].id,
            title: fallbackRes.rows[0].title,
            meet_link: fallbackRes.rows[0].meet_link,
            start_time: fallbackRes.rows[0].start_time,
            end_time: fallbackRes.rows[0].end_time,
            duration_minutes: fallbackRes.rows[0].duration_minutes,
            target_type: fallbackRes.rows[0].target_type,
            status: fallbackRes.rows[0].status,
          },
        };
      }
    }

    case "get_live_sessions": {
      const limit = Math.min(Number(args.limit) || 10, 20);
      const conditions = ["ls.deleted = 0"];
      const values = [];
      let paramIndex = 1;

      if (args.grade_id) {
        conditions.push(`ls.grade_id = $${paramIndex++}`);
        values.push(Number(args.grade_id));
      }
      if (args.status) {
        conditions.push(`ls.status = $${paramIndex++}`);
        values.push(args.status);
      }
      values.push(limit);

      const res = await query(
        `SELECT ls.id, ls.title, ls.description, ls.start_time, ls.end_time,
                ls.duration_minutes, ls.meet_link, ls.status, ls.target_type,
                g.name AS grade_name, gr.name AS group_name
         FROM live_sessions ls
         LEFT JOIN grades g ON g.id = ls.grade_id AND g.deleted = 0
         LEFT JOIN groups gr ON gr.id = ls.group_id AND gr.deleted = 0
         WHERE ${conditions.join(" AND ")}
         ORDER BY ls.start_time DESC
         LIMIT $${paramIndex}`,
        values,
      );

      return {
        success: true,
        sessions_count: res.rows.length,
        sessions: res.rows,
      };
    }

    case "delete_live_session": {
      const { session_id } = args;
      if (!session_id) return { success: false, error: "معرّف الحصة مطلوب لحذفها." };

      let effectiveUserId = userId;
      if (!effectiveUserId) {
        const uRes = await query(
          "SELECT id FROM users WHERE role IN ('assistant', 'teacher', 'super_admin') AND deleted = 0 ORDER BY id ASC LIMIT 1",
        );
        if (uRes.rows.length > 0) effectiveUserId = uRes.rows[0].id;
      }

      await liveSessionsService.deleteLiveSession(Number(session_id), effectiveUserId);
      return {
        success: true,
        message: `تم حذف وإلغاء حصة البث المباشر #${session_id} بنجاح.`,
      };
    }

    case "reset_student_password": {
      const { student_query, new_password } = args;
      if (!student_query) {
        return { success: false, error: "يجب تحديد الطالب (بالاسم أو الباركود أو رقم الهاتف)." };
      }
      const q = String(student_query).trim();
      const stdRes = await query(
        `SELECT id, full_name, barcode, phone, grade_id, group_id
         FROM students
         WHERE (barcode = $1 OR phone = $1 OR full_name ILIKE ('%' || $1 || '%'))
           AND deleted = 0 LIMIT 1`,
        [q],
      );
      if (stdRes.rows.length === 0) {
        return { success: false, error: `لم يتم العثور على طالب يطابق: '${q}'` };
      }
      const student = stdRes.rows[0];
      const plainPassword = new_password
        ? String(new_password).trim()
        : (student.phone || `${student.barcode || "student"}@123456`);

      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      await query("UPDATE students SET password = $1, updated_at = NOW() WHERE id = $2", [
        hashedPassword,
        student.id,
      ]);

      return {
        success: true,
        message: `تم إعادة تعيين كلمة مرور الطالب (${student.full_name}) بنجاح. كلمة المرور الجديدة هي: ${plainPassword}`,
        student: {
          id: student.id,
          full_name: student.full_name,
          barcode: student.barcode,
          phone: student.phone,
          new_password: plainPassword,
        },
      };
    }

    case "change_assistant_password": {
      const { current_password, new_password } = args;
      if (!current_password || !new_password) {
        return {
          success: false,
          error: "لتغيير كلمة مرور حسابك بأمان، يجب تزويدي بكلمة المرور الحالية وكلمة المرور الجديدة المطلوبة.",
        };
      }

      let effectiveUserId = userId;
      if (!effectiveUserId) {
        return {
          success: false,
          error: "لم يتم التعرف على معرّف حساب المساعد الحالي لتغيير كلمة المرور.",
        };
      }

      const userRes = await query(
        "SELECT id, full_name, password FROM users WHERE id = $1 AND deleted = 0",
        [effectiveUserId],
      );
      if (userRes.rows.length === 0) {
        return { success: false, error: "حساب المساعد غير موجود." };
      }
      const currentUser = userRes.rows[0];

      const isCurrentValid = await bcrypt.compare(
        String(current_password),
        currentUser.password,
      );
      if (!isCurrentValid) {
        return {
          success: false,
          error: "كلمة المرور الحالية غير صحيحة، يرجى التأكد من كتابتها بشكل صحيح.",
        };
      }

      const hashedPassword = await bcrypt.hash(String(new_password).trim(), 10);
      await query(
        "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
        [hashedPassword, effectiveUserId],
      );

      return {
        success: true,
        message: `تم تحديث وتغيير كلمة مرور حسابك (${currentUser.full_name}) بنجاح. يمكنك الآن تسجيل الدخول بها بأمان.`,
      };
    }

    case "create_playlist": {
      const { title, description, grade_id, grade_name } = args;
      let resolvedGradeId = grade_id ? Number(grade_id) : null;
      if (!resolvedGradeId && grade_name) {
        const gRes = await query(
          "SELECT id FROM grades WHERE name ILIKE $1 AND deleted = 0 LIMIT 1",
          [`%${grade_name.trim()}%`],
        );
        if (gRes.rows.length > 0) resolvedGradeId = gRes.rows[0].id;
      }
      if (!resolvedGradeId) {
        return { success: false, error: "يجب تحديد الصف الدراسي لقائمة التشغيل." };
      }
      const res = await query(
        `INSERT INTO playlists (title, description, grade_id, created_by, created_at, updated_at, deleted)
         VALUES ($1, $2, $3, $4, NOW(), NOW(), 0)
         RETURNING id, title, description, grade_id`,
        [title.trim(), description || null, resolvedGradeId, userId],
      );
      return {
        success: true,
        message: `تم إنشاء قائمة التشغيل (${res.rows[0].title}) بنجاح برقم معرّف #${res.rows[0].id}`,
        playlist: res.rows[0],
      };
    }

    case "get_playlists": {
      let gradeId = args.grade_id ? Number(args.grade_id) : null;
      const conditions = ["p.deleted = 0"];
      const values = [];
      if (gradeId) {
        conditions.push("p.grade_id = $1");
        values.push(gradeId);
      }
      const res = await query(
        `SELECT p.id, p.title, p.description, g.name AS grade_name,
                (SELECT COUNT(*) FROM playlist_videos pv WHERE pv.playlist_id = p.id) AS videos_count
         FROM playlists p
         LEFT JOIN grades g ON g.id = p.grade_id
         WHERE ${conditions.join(" AND ")}
         ORDER BY p.id DESC
         LIMIT 20`,
        values,
      );
      return {
        success: true,
        playlists_count: res.rows.length,
        playlists: res.rows,
      };
    }

    case "add_video_to_playlist": {
      const { playlist_id, video_id, order_num = 1 } = args;
      await query(
        `INSERT INTO playlist_videos (playlist_id, video_id, order_num, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (playlist_id, video_id) DO UPDATE SET order_num = $3`,
        [Number(playlist_id), Number(video_id), Number(order_num)],
      );
      return {
        success: true,
        message: `تم إضافة الفيديو (#${video_id}) إلى قائمة التشغيل (#${playlist_id}) بنجاح.`,
      };
    }

    case "create_group": {
      const {
        name,
        grade_id,
        grade_name,
        days,
        start_time,
        end_time,
        room,
        max_students,
      } = args;
      let resolvedGradeId = grade_id ? Number(grade_id) : null;
      if (!resolvedGradeId && grade_name) {
        const gRes = await query(
          "SELECT id FROM grades WHERE name ILIKE $1 AND deleted = 0 LIMIT 1",
          [`%${grade_name.trim()}%`],
        );
        if (gRes.rows.length > 0) resolvedGradeId = gRes.rows[0].id;
      }
      if (!name || !resolvedGradeId) {
        return {
          success: false,
          error: "اسم المجموعة والصف الدراسي مطلوبان لإنشاء المجموعة.",
        };
      }
      const res = await query(
        `INSERT INTO groups (name, grade_id, days, start_time, end_time, room, max_students, created_at, updated_at, deleted)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), 0)
         RETURNING id, name, grade_id, days, start_time, end_time, room, max_students`,
        [
          name.trim(),
          resolvedGradeId,
          days || null,
          start_time || null,
          end_time || null,
          room || null,
          max_students ? Number(max_students) : 50,
        ],
      );
      return {
        success: true,
        message: `تم إنشاء المجموعة الدراسية (${res.rows[0].name}) بنجاح برقم معرّف #${res.rows[0].id}`,
        group: res.rows[0],
      };
    }

    case "update_group": {
      const { group_id, name, days, start_time, end_time, room, max_students } = args;
      if (!group_id) return { success: false, error: "معرّف المجموعة مطلوب." };
      const existingRes = await query(
        "SELECT * FROM groups WHERE id = $1 AND deleted = 0",
        [Number(group_id)],
      );
      if (existingRes.rows.length === 0) {
        return { success: false, error: `المجموعة #${group_id} غير موجودة.` };
      }
      const grp = existingRes.rows[0];

      const updatedName = name ? name.trim() : grp.name;
      const updatedDays = days !== undefined ? days : grp.days;
      const updatedStartTime = start_time !== undefined ? start_time : grp.start_time;
      const updatedEndTime = end_time !== undefined ? end_time : grp.end_time;
      const updatedRoom = room !== undefined ? room : grp.room;
      const updatedMaxStudents =
        max_students !== undefined ? Number(max_students) : grp.max_students;

      await query(
        `UPDATE groups
         SET name = $1, days = $2, start_time = $3, end_time = $4, room = $5, max_students = $6, updated_at = NOW()
         WHERE id = $7`,
        [
          updatedName,
          updatedDays,
          updatedStartTime,
          updatedEndTime,
          updatedRoom,
          updatedMaxStudents,
          grp.id,
        ],
      );

      return {
        success: true,
        message: `تم تحديث بيانات المجموعة (${updatedName}) بنجاح.`,
        group: {
          id: grp.id,
          name: updatedName,
          days: updatedDays,
          start_time: updatedStartTime,
          end_time: updatedEndTime,
          room: updatedRoom,
          max_students: updatedMaxStudents,
        },
      };
    }

    case "grade_assignment_submission": {
      const { submission_id, grade, feedback } = args;
      if (!submission_id || grade === undefined) {
        return { success: false, error: "معرف تسليم الواجب والدرجة مطلوبان." };
      }
      const subRes = await query(
        `SELECT s.id, st.full_name AS student_name, a.title AS assignment_title, a.full_mark
         FROM assignment_submissions s
         JOIN students st ON st.id = s.student_id
         JOIN assignments a ON a.id = s.assignment_id
         WHERE s.id = $1`,
        [Number(submission_id)],
      );
      if (subRes.rows.length === 0) {
        return { success: false, error: `تسليم الواجب #${submission_id} غير موجود.` };
      }
      const sub = subRes.rows[0];
      await query(
        `UPDATE assignment_submissions
         SET grade = $1, feedback = $2, graded_at = NOW(), graded_by = $3
         WHERE id = $4`,
        [Number(grade), feedback || null, userId, Number(submission_id)],
      );
      return {
        success: true,
        message: `تم رصد وتصحيح درجة الواجب (${sub.assignment_title}) للطالب (${sub.student_name}) بنجاح: ${grade} من ${sub.full_mark}`,
        submission: {
          submission_id,
          student_name: sub.student_name,
          grade,
          full_mark: sub.full_mark,
          feedback,
        },
      };
    }

    case "delete_online_exam": {
      const { exam_id } = args;
      if (!exam_id) return { success: false, error: "معرّف الامتحان الإلكتروني مطلوب." };
      const res = await query(
        "UPDATE online_exams SET deleted = 1, updated_at = NOW() WHERE id = $1 RETURNING id, title",
        [Number(exam_id)],
      );
      if (res.rows.length === 0) {
        return { success: false, error: "الامتحان الإلكتروني غير موجود." };
      }
      return {
        success: true,
        message: `تم حذف الامتحان الإلكتروني (${res.rows[0].title}) بنجاح.`,
      };
    }

    case "delete_paper_exam": {
      const { exam_id } = args;
      if (!exam_id) return { success: false, error: "معرّف الامتحان الورقي مطلوب." };
      const res = await query(
        "UPDATE exams SET deleted = 1, updated_at = NOW() WHERE id = $1 RETURNING id, title",
        [Number(exam_id)],
      );
      if (res.rows.length === 0) {
        return { success: false, error: "الامتحان الورقي غير موجود." };
      }
      return {
        success: true,
        message: `تم حذف الامتحان الورقي (${res.rows[0].title}) بنجاح.`,
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
