const Joi = require("joi");

// Create a new student (assistant/super admin)
// parent_token بيتم توليده تلقائياً في الباك اند
const createStudentSchema = Joi.object({
  barcode: Joi.string().required().min(1).max(50),
  full_name: Joi.string().required().min(3).max(255),
  phone: Joi.string().allow("", null).min(8).max(20),
  parent_phone: Joi.string().allow("", null).min(8).max(20),
  grade_id: Joi.number().integer().required(),
  group_id: Joi.number().integer().required(),
  notes: Joi.string().allow("", null).max(1000),
});

// Update a student's full information (assistant/super admin)
const updateStudentSchema = Joi.object({
  barcode: Joi.string().min(1).max(50),
  full_name: Joi.string().min(3).max(255),
  phone: Joi.string().allow("", null).min(8).max(20),
  parent_phone: Joi.string().allow("", null).min(8).max(20),
  grade_id: Joi.number().integer(),
  group_id: Joi.number().integer(),
  notes: Joi.string().allow("", null).max(1000),
}).min(1);

// Update student password (self-service for student)
// All fields are required
const updateStudentPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور القديمة مطلوبة",
    "string.empty": "كلمة المرور القديمة مطلوبة",
    "string.min": "كلمة المرور القديمة يجب ألا تقل عن 4 أحرف",
  }),
  password: Joi.string().min(4).max(100).required().messages({
    "any.required": "كلمة المرور الجديدة مطلوبة",
    "string.empty": "كلمة المرور الجديدة مطلوبة",
    "string.min": "كلمة المرور الجديدة يجب ألا تقل عن 4 أحرف",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "تأكيد كلمة المرور غير مطابق",
    "any.required": "تأكيد كلمة المرور مطلوب",
  }),
});

// Update student's profile image (student self-update)
const updateStudentProfileImageSchema = Joi.object({
  profile_image: Joi.string().required().max(255),
});

// Get students with filters (assistant/super admin)
const getAllStudentsSchema = Joi.object({
  search: Joi.string().allow("", null).max(255),
  grade_id: Joi.number().integer().allow(null),
  group_id: Joi.number().integer().allow(null),
  page: Joi.number().integer().min(1).default(1),
});

// Get student attendance history (with month filter)
const getAttendanceHistorySchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student total attendance for a specific month
const getStudentTotalAttendanceSchema = Joi.object({
  month: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}$/),
});

// Get student payment history (with month filter)
const getPaymentHistorySchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student paper exams (with month filter)
const getStudentPaperExamsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student exam results (with month filter)
const getStudentExamResultsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student online exams (with month filter)
const getStudentOnlineExamsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student assignments (with month filter)
const getStudentAssignmentsSchema = Joi.object({
  month: Joi.string()
    .allow("", null)
    .pattern(/^\d{4}-\d{2}$/),
  page: Joi.number().integer().min(1).default(1),
});

// Get student submissions (with month filter)
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
