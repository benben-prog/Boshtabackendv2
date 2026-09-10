const Joi = require("joi");

// Create student schema
const createStudentSchema = Joi.object({
  barcode: Joi.string().trim().min(1).max(50).required().messages({
    "any.required": "الباركود مطلوب",
    "string.empty": "الباركود مطلوب",
  }),
  full_name: Joi.string().trim().min(3).max(255).required().messages({
    "any.required": "اسم الطالب مطلوب",
    "string.empty": "اسم الطالب مطلوب",
    "string.min": "اسم الطالب يجب أن يكون 3 أحرف على الأقل",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .allow("", null)
    .messages({
      "string.pattern.base":
        "رقم الهاتف يجب أن يكون رقماً مصرياً صحيحاً (01xxxxxxxxx)",
    }),
  parent_phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .allow("", null)
    .messages({
      "string.pattern.base":
        "رقم ولي الأمر يجب أن يكون رقماً مصرياً صحيحاً (01xxxxxxxxx)",
    }),
  grade_id: Joi.number().integer().positive().required().messages({
    "any.required": "الصف الدراسي مطلوب",
  }),
  group_id: Joi.number().integer().positive().required().messages({
    "any.required": "المجموعة مطلوبة",
  }),
  notes: Joi.string().allow("", null).max(1000),
});

// Update student schema
const updateStudentSchema = Joi.object({
  barcode: Joi.string().trim().min(1).max(50),
  full_name: Joi.string().trim().min(3).max(255),
  phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .allow("", null),
  parent_phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .allow("", null),
  grade_id: Joi.number().integer().positive(),
  group_id: Joi.number().integer().positive(),
  notes: Joi.string().allow("", null).max(1000),
}).min(1);

// Update student password schema
const updateStudentPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور القديمة مطلوبة",
    "string.empty": "كلمة المرور القديمة مطلوبة",
    "string.min": "كلمة المرور القديمة يجب أن تكون 4 أحرف على الأقل",
  }),
  password: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور الجديدة مطلوبة",
    "string.empty": "كلمة المرور الجديدة مطلوبة",
    "string.min": "كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "تأكيد كلمة المرور غير مطابق",
    "any.required": "تأكيد كلمة المرور مطلوب",
  }),
});

// Update student profile image schema
const updateStudentProfileImageSchema = Joi.object({
  profile_image: Joi.string().required().max(255).messages({
    "any.required": "الصورة مطلوبة",
  }),
});

// Get students with filters schema
const getAllStudentsSchema = Joi.object({
  search: Joi.string().allow("", null).max(255),
  grade_id: Joi.number().integer().allow(null),
  group_id: Joi.number().integer().allow(null),
  page: Joi.number().integer().min(1).default(1),
});

// Get attendance history schema
const getAttendanceHistorySchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student total attendance schema
const getStudentTotalAttendanceSchema = Joi.object({
  month: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}$/)
    .messages({
      "any.required": "الشهر مطلوب",
      "string.pattern.base": "صيغة الشهر يجب أن تكون YYYY-MM",
    }),
});

// Get payment history schema
const getPaymentHistorySchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student paper exams schema
const getStudentPaperExamsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student exam results schema
const getStudentExamResultsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student online exams schema
const getStudentOnlineExamsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student assignments schema
const getStudentAssignmentsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student submissions schema
const getStudentSubmissionsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  updateStudentPasswordSchema,
  updateStudentProfileImageSchema,
  getAllStudentsSchema,
  getAttendanceHistorySchema,
  getStudentTotalAttendanceSchema,
  getPaymentHistorySchema,
  getStudentPaperExamsSchema,
  getStudentExamResultsSchema,
  getStudentOnlineExamsSchema,
  getStudentAssignmentsSchema,
  getStudentSubmissionsSchema,
};
