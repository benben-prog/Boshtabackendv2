const studentService = require("./students.service");
const { logActivity } = require("../../utils/activityLogger");
const {
  exportStudentsToExcel,
  sendExcelResponse,
  exportPasswordsToExcel,
} = require("../../utils/excelExporter");
const {
  renderStudentsReportHtml,
  renderPasswordsReportHtml,
  sendReportHtml,
} = require("../../utils/pdfHtmlExporter");

// ============================================
// PART 1: CRUD & SEARCH
// ============================================

const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_student",
      entity_type: "student",
      entity_id: student.id,
      description: `إنشاء طالب جديد: ${student.full_name}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الطالب بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null, all } = req.query;
    const isAll =
      all === "true" ||
      req.query.limit === "all" ||
      parseInt(req.query.limit) >= 500;

    const filters = {
      search,
      grade_id: parseInt(grade_id) || null,
      group_id: parseInt(group_id) || null,
    };

    if (isAll) {
      const students = await studentService.getAllStudentsForExport(filters);
      return res.status(200).json({
        success: true,
        message: "تم تحميل البيانات بنجاح",
        data: students,
        pagination: {
          page: 1,
          limit: students.length,
          total: students.length,
          totalPages: 1,
          is_all: true,
        },
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    filters.page = page;
    filters.limit = limit;

    const students = await studentService.getAllStudents(filters);
    const { count } = await studentService.getStudentsCount(filters);

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
      pagination: {
        page,
        limit,
        total: parseInt(count),
        totalPages: Math.ceil(parseInt(count) / limit),
        is_all: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

const exportStudentsExcel = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null } = req.query;
    const filters = {
      search,
      grade_id: parseInt(grade_id) || null,
      group_id: parseInt(group_id) || null,
    };

    const students = await studentService.getAllStudentsForExport(filters);
    const meta = {
      gradeName:
        students[0]?.grade_name || (grade_id ? `الصف ${grade_id}` : null),
      groupName:
        students[0]?.group_name || (group_id ? `المجموعة ${group_id}` : null),
      search: search || null,
    };

    const { buffer, fileName } = exportStudentsToExcel(students, meta);
    return sendExcelResponse(res, buffer, fileName);
  } catch (error) {
    next(error);
  }
};

const exportStudentsPdf = async (req, res, next) => {
  try {
    const { search = "", grade_id = null, group_id = null } = req.query;
    const filters = {
      search,
      grade_id: parseInt(grade_id) || null,
      group_id: parseInt(group_id) || null,
    };

    const students = await studentService.getAllStudentsForExport(filters);
    const meta = {
      gradeName:
        students[0]?.grade_name || (grade_id ? `الصف ${grade_id}` : null),
      groupName:
        students[0]?.group_name || (group_id ? `المجموعة ${group_id}` : null),
      search: search || null,
    };

    const excelUrl = req.originalUrl.replace("/export/pdf", "/export/excel");
    const html = renderStudentsReportHtml({ students, meta, excelUrl });
    return sendReportHtml(res, html);
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(
      req.params.studentId || req.clientId,
    );
    if (!student) throw new Error("الطالب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentByBarcode = async (req, res, next) => {
  try {
    const student = await studentService.getStudentByBarcode(req.query.barcode);
    if (!student) throw new Error("الطالب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const findStudentByPhone = async (req, res, next) => {
  try {
    const student = await studentService.findStudentByPhone(req.query.phone);
    if (!student) throw new Error("الطالب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const findStudentByParentPhone = async (req, res, next) => {
  try {
    const students = await studentService.findStudentByParentPhone(
      req.query.parent_phone,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentsByGradeId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const students = await studentService.getStudentsByGradeId(
      req.params.gradeId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentsByGroupId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const students = await studentService.getStudentsByGroupId(
      req.params.groupId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getDeletedStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const students = await studentService.getDeletedStudents(page);

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(
      req.params.studentId,
      req.body,
    );
    if (!student) throw new Error("الطالب غير موجود");

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_student",
      entity_type: "student",
      entity_id: student.id,
      description: `تعديل بيانات الطالب: ${student.full_name}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الطالب بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const updateStudentProfileImage = async (req, res, next) => {
  try {
    const profileImage = req.file ? req.file.path : req.body.profile_image;

    const student = await studentService.updateStudentProfileImage(
      req.clientId,
      profileImage,
    );

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_student_image",
      entity_type: "student",
      entity_id: student.id,
      description: "تعديل الصورة الشخصية للطالب",
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الصورة الشخصية بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudentProfileImage = async (req, res, next) => {
  try {
    const student = await studentService.deleteStudentProfileImage(
      req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم حذف الصورة الشخصية بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentProfileImage = async (req, res, next) => {
  try {
    const image = await studentService.getStudentProfileImage(
      req.params.studentId || req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

const updateStudentPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const student = await studentService.updateStudentPassword(
      req.clientId,
      oldPassword,
      newPassword,
    );

    if (!student) {
      throw new Error("فشل تعديل كلمة المرور - الطالب غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_student_password",
      entity_type: "student",
      entity_id: req.clientId,
      description: "تغيير كلمة المرور",
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل كلمة المرور بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteStudent = async (req, res, next) => {
  try {
    const student = await studentService.softDeleteStudent(
      req.params.studentId,
    );
    if (!student) throw new Error("الطالب غير موجود");

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "soft_delete_student",
      entity_type: "student",
      entity_id: req.params.studentId,
      description: `حذف مؤقت لطالب (ID: ${req.params.studentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الطالب بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const hardDeleteStudent = async (req, res, next) => {
  try {
    const student = await studentService.hardDeleteStudent(
      req.params.studentId,
    );
    if (!student) throw new Error("الطالب غير موجود");

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "hard_delete_student",
      entity_type: "student",
      entity_id: req.params.studentId,
      description: `حذف نهائي لطالب (ID: ${req.params.studentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الطالب نهائياً بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const restoreStudent = async (req, res, next) => {
  try {
    const student = await studentService.restoreStudent(req.params.studentId);
    if (!student) throw new Error("الطالب غير موجود");

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "restore_student",
      entity_type: "student",
      entity_id: req.params.studentId,
      description: `استرجاع طالب محذوف (ID: ${req.params.studentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم استرجاع الطالب بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PART 2: PROFILE & STATISTICS
// ============================================

const getStudentProfile = async (req, res, next) => {
  try {
    const student = await studentService.getStudentProfile(
      req.params.studentId || req.clientId,
    );
    if (!student) throw new Error("الطالب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentQuickStats = async (req, res, next) => {
  try {
    const stats = await studentService.getStudentQuickStats(
      req.params.studentId || req.clientId,
    );
    if (!stats) throw new Error("الطالب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceHistory = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const attendance = await studentService.getAttendanceHistory(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyAttendanceStats = async (req, res, next) => {
  try {
    const stats = await studentService.getMonthlyAttendanceStats(
      req.params.studentId || req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentTotalAttendance = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month) throw new Error("الشهر مطلوب");

    const stats = await studentService.getStudentTotalAttendance(
      req.params.studentId || req.clientId,
      month,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getConsecutiveAbsences = async (req, res, next) => {
  try {
    const absences = await studentService.getConsecutiveAbsences(
      req.params.studentId || req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: absences,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const payments = await studentService.getPaymentHistory(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};



const getCurrentSubscription = async (req, res, next) => {
  try {
    const subscription = await studentService.getCurrentSubscription(
      req.params.studentId || req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PART 3: EXAMS, ASSIGNMENTS & CONTENT
// ============================================

const getStudentPaperExams = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const exams = await studentService.getStudentPaperExams(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentExamResults = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const results = await studentService.getStudentExamResults(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableOnlineExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const exams = await studentService.getAvailableOnlineExams(
      req.clientId,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentOnlineExams = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const exams = await studentService.getStudentOnlineExams(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentExamAnswers = async (req, res, next) => {
  try {
    const answers = await studentService.getStudentExamAnswers(
      req.params.examId,
      req.params.studentId || req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentAssignments = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const assignments = await studentService.getStudentAssignments(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentSubmissions = async (req, res, next) => {
  try {
    const { month = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const submissions = await studentService.getStudentSubmissions(
      req.params.studentId || req.clientId,
      month,
      page,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentPlaylists = async (req, res, next) => {
  try {
    const playlists = await studentService.getStudentPlaylists(
      req.params.studentId || req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

const getPlaylistVideos = async (req, res, next) => {
  try {
    const videos = await studentService.getPlaylistVideos(
      req.params.playlistId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentPaperExamById = async (req, res, next) => {
  try {
    const exam = await studentService.getStudentPaperExamById(
      req.params.studentId || req.clientId,
      req.params.examId,
    );
    if (!exam) throw new Error("الامتحان غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentOnlineExamById = async (req, res, next) => {
  try {
    const exam = await studentService.getStudentOnlineExamById(
      req.params.studentId || req.clientId,
      req.params.attemptId,
    );
    if (!exam) throw new Error("محاولة الامتحان غير موجودة");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentAssignmentById = async (req, res, next) => {
  try {
    const assignment = await studentService.getStudentAssignmentById(
      req.params.studentId || req.clientId,
      req.params.assignmentId,
    );
    if (!assignment) throw new Error("الواجب غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentSubmissionById = async (req, res, next) => {
  try {
    const submission = await studentService.getStudentSubmissionById(
      req.params.submissionId,
      req.params.studentId || req.clientId,
    );
    if (!submission) throw new Error("التسليم غير موجود");

    return res.status(200).json({
      success: true,
      message: "تم تحميل البيانات بنجاح",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================

const getStudentsWithoutPassword = async (req, res, next) => {
  try {
    const students = await studentService.getStudentsWithoutPassword();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بدون باسورد بنجاح",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const resetStudentPassword = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new Error("كلمة المرور مطلوبة");
    }

    const result = await studentService.resetStudentPassword(
      studentId,
      password,
    );

    if (!result) {
      throw new Error("الطالب غير موجود");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "reset_student_password",
      entity_type: "student",
      entity_id: studentId,
      description: `إعادة تعيين باسورد لطالب (ID: ${studentId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعيين الباسورد بنجاح",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generatePasswordsForAllStudents = async (req, res, next) => {
  try {
    const result = await studentService.generatePasswordsForAllStudents();

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "generate_student_passwords",
      entity_type: "student",
      entity_id: null,
      description: `توليد باسوردات لجميع الطلاب بدون باسورد - ${result.generated_count} طالب`,
    });

    const isPdf = req.query.format === "pdf" || req.query.pdf === "true" || req.path?.endsWith("/pdf");
    const isExcel = req.query.format === "excel" || req.query.excel === "true" || req.path?.endsWith("/excel");

    if (isPdf) {
      const excelUrl = req.originalUrl.replace("/pdf", "/excel").replace("format=pdf", "format=excel");
      const html = renderPasswordsReportHtml({
        passwords: result.passwords,
        meta: { title: "كشف كلمات مرور جميع الطلاب" },
        excelUrl,
      });
      return sendReportHtml(res, html);
    }

    if (isExcel) {
      const { buffer, fileName } = exportPasswordsToExcel(result.passwords, {
        fileName: "كشف_كلمات_مرور_جميع_الطلاب.xlsx",
      });
      return sendExcelResponse(res, buffer, fileName);
    }

    return res.status(200).json({
      success: true,
      message: `تم توليد ${result.generated_count} باسورد بنجاح`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generatePasswordsForGrade = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    if (!gradeId) {
      throw new Error("معرف الصف مطلوب");
    }

    const result = await studentService.generatePasswordsForGrade(gradeId);

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "generate_passwords_for_grade",
      entity_type: "student",
      entity_id: gradeId,
      description: `توليد باسوردات لطلاب الصف (ID: ${gradeId}) - ${result.generated_count} طالب`,
    });

    const isPdf = req.query.format === "pdf" || req.query.pdf === "true" || req.path?.endsWith("/pdf");
    const isExcel = req.query.format === "excel" || req.query.excel === "true" || req.path?.endsWith("/excel");

    if (isPdf) {
      const gradeName = result.passwords[0]?.grade_name || `الصف ${gradeId}`;
      const excelUrl = req.originalUrl.replace("/pdf", "/excel").replace("format=pdf", "format=excel");
      const html = renderPasswordsReportHtml({
        passwords: result.passwords,
        meta: {
          title: `كشف كلمات مرور طلاب ${gradeName}`,
          gradeName,
        },
        excelUrl,
      });
      return sendReportHtml(res, html);
    }

    if (isExcel) {
      const gradeName = result.passwords[0]?.grade_name || `الصف_${gradeId}`;
      const { buffer, fileName } = exportPasswordsToExcel(result.passwords, {
        fileName: `كشف_كلمات_مرور_${gradeName}.xlsx`,
      });
      return sendExcelResponse(res, buffer, fileName);
    }

    return res.status(200).json({
      success: true,
      message: `تم توليد ${result.generated_count} باسورد بنجاح`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generatePasswordsForGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      throw new Error("معرف المجموعة مطلوب");
    }

    const result = await studentService.generatePasswordsForGroup(groupId);

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "generate_passwords_for_group",
      entity_type: "student",
      entity_id: groupId,
      description: `توليد باسوردات لطلاب المجموعة (ID: ${groupId}) - ${result.generated_count} طالب`,
    });

    const isPdf = req.query.format === "pdf" || req.query.pdf === "true" || req.path?.endsWith("/pdf");
    const isExcel = req.query.format === "excel" || req.query.excel === "true" || req.path?.endsWith("/excel");

    if (isPdf) {
      const groupName = result.passwords[0]?.group_name || `المجموعة ${groupId}`;
      const gradeName = result.passwords[0]?.grade_name || null;
      const excelUrl = req.originalUrl.replace("/pdf", "/excel").replace("format=pdf", "format=excel");
      const html = renderPasswordsReportHtml({
        passwords: result.passwords,
        meta: {
          title: `كشف كلمات مرور طلاب ${groupName}`,
          gradeName,
          groupName,
        },
        excelUrl,
      });
      return sendReportHtml(res, html);
    }

    if (isExcel) {
      const groupName = result.passwords[0]?.group_name || `المجموعة_${groupId}`;
      const { buffer, fileName } = exportPasswordsToExcel(result.passwords, {
        fileName: `كشف_كلمات_مرور_${groupName}.xlsx`,
      });
      return sendExcelResponse(res, buffer, fileName);
    }

    return res.status(200).json({
      success: true,
      message: `تم توليد ${result.generated_count} باسورد بنجاح`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generatePasswordForSingleStudent = async (req, res, next) => {
  try {
    const identifier =
      req.params.barcode ||
      req.params.studentId ||
      req.params.id ||
      req.body?.barcode ||
      req.body?.student_id;

    if (!identifier) {
      throw new Error("معرف الطالب أو الباركود مطلوب");
    }

    const result = await studentService.generatePasswordForSingleStudent(identifier);

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "generate_password_for_student",
      entity_type: "student",
      entity_id: result.student_id,
      description: `توليد باسورد للطالب ${result.full_name} (Barcode: ${result.barcode})`,
    });

    const isPdf = req.query.format === "pdf" || req.query.pdf === "true" || req.path?.endsWith("/pdf");
    const isExcel = req.query.format === "excel" || req.query.excel === "true" || req.path?.endsWith("/excel");

    if (isPdf) {
      const html = renderPasswordsReportHtml({
        passwords: [result],
        meta: {
          title: `بيانات حساب الطالب - ${result.full_name}`,
          gradeName: result.grade_name,
          groupName: result.group_name,
        },
      });
      return sendReportHtml(res, html);
    }

    if (isExcel) {
      const { buffer, fileName } = exportPasswordsToExcel([result], {
        fileName: `بيانات_حساب_${result.barcode}.xlsx`,
      });
      return sendExcelResponse(res, buffer, fileName);
    }

    return res.status(200).json({
      success: true,
      message: "تم توليد كلمة المرور بنجاح",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const exportPasswordsPdf = async (req, res, next) => {
  try {
    const passwords = Array.isArray(req.body?.passwords) ? req.body.passwords : [];
    const meta = {
      title: req.body?.title || "كشف كلمات مرور الطلاب",
      gradeName: req.body?.grade_name || null,
      groupName: req.body?.group_name || null,
    };

    const html = renderPasswordsReportHtml({
      passwords,
      meta,
    });
    return sendReportHtml(res, html);
  } catch (error) {
    next(error);
  }
};

const exportPasswordsExcel = async (req, res, next) => {
  try {
    const passwords = Array.isArray(req.body?.passwords) ? req.body.passwords : [];
    const meta = {
      fileName: req.body?.file_name || `كشف_كلمات_مرور_${Date.now()}.xlsx`,
      gradeName: req.body?.grade_name || null,
      groupName: req.body?.group_name || null,
    };

    const { buffer, fileName } = exportPasswordsToExcel(passwords, meta);
    return sendExcelResponse(res, buffer, fileName);
  } catch (error) {
    next(error);
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Part 1: CRUD & Search
  createStudent,
  getAllStudents,
  exportStudentsExcel,
  exportStudentsPdf,
  getStudentById,
  getStudentByBarcode,
  findStudentByPhone,
  findStudentByParentPhone,
  getStudentsByGradeId,
  getStudentsByGroupId,
  getDeletedStudents,
  updateStudent,
  updateStudentProfileImage,
  deleteStudentProfileImage,
  getStudentProfileImage,
  updateStudentPassword,
  softDeleteStudent,
  hardDeleteStudent,
  restoreStudent,
  // Part 2: Profile & Statistics
  getStudentProfile,
  getStudentQuickStats,
  getAttendanceHistory,
  getMonthlyAttendanceStats,
  getStudentTotalAttendance,
  getConsecutiveAbsences,
  getPaymentHistory,
  getCurrentSubscription,
  // Part 3: Exams, Assignments & Content
  getStudentPaperExams,
  getStudentExamResults,
  getAvailableOnlineExams,
  getStudentOnlineExams,
  getStudentExamAnswers,
  getStudentAssignments,
  getStudentSubmissions,
  getStudentPlaylists,
  getPlaylistVideos,
  getStudentPaperExamById,
  getStudentOnlineExamById,
  getStudentAssignmentById,
  getStudentSubmissionById,
  // Password Management
  getStudentsWithoutPassword,
  resetStudentPassword,
  generatePasswordsForAllStudents,
  generatePasswordsForGrade,
  generatePasswordsForGroup,
  generatePasswordForSingleStudent,
  exportPasswordsPdf,
  exportPasswordsExcel,
};
