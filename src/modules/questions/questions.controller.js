const questionService = require("./questions.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");

// ============================================
// HELPER: Delete file from disk
// ============================================

const deleteFileFromDisk = (filePath) => {
  if (!filePath) return;

  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Failed to delete file:", error.message);
  }
};

// ============================================
// CREATE
// ============================================

const createQuestion = async (req, res, next) => {
  try {
    const file_path = req.file ? req.file.path : null;

    const question = await questionService.createQuestion({
      ...req.body,
      file_path,
    });

    if (!question) {
      throw new Error("فشل إنشاء السؤال حاول مرة أخرى");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_question",
      entity_type: "question",
      entity_id: question.id,
      description: `إنشاء سؤال (امتحان: ${question.exam_id})`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء السؤال بنجاح",
      data: question,
    });
  } catch (error) {
    // Delete uploaded file if operation failed
    if (req.file && req.file.path) {
      deleteFileFromDisk(req.file.path);
    }
    next(error);
  }
};

// ============================================
// GETTERS
// ============================================

const getQuestionsByExamId = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const questions = await questionService.getQuestionsByExamId(examId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الأسئلة بنجاح",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(questionId);

    if (!question) {
      throw new Error("السؤال غير موجود");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل السؤال بنجاح",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE
// ============================================

const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    // Get old question to know old file
    const oldQuestion = await questionService.getQuestionById(questionId);

    if (!oldQuestion) {
      throw new Error("السؤال غير موجود");
    }

    const newFile_path = req.file ? req.file.path : null;

    const question = await questionService.updateQuestion(questionId, {
      ...req.body,
      file_path: newFile_path,
    });

    if (!question) {
      throw new Error("فشل تعديل السؤال حاول مرة أخرى");
    }

    // Delete old file if new one was uploaded
    if (newFile_path && oldQuestion.file_path) {
      deleteFileFromDisk(oldQuestion.file_path);
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_question",
      entity_type: "question",
      entity_id: questionId,
      description: `تعديل سؤال (ID: ${questionId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل السؤال بنجاح",
      data: question,
    });
  } catch (error) {
    // Delete uploaded file if operation failed
    if (req.file && req.file.path) {
      deleteFileFromDisk(req.file.path);
    }
    next(error);
  }
};

// ============================================
// DELETE
// ============================================

const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    // Get old question to know old file
    const oldQuestion = await questionService.getQuestionById(questionId);

    if (!oldQuestion) {
      throw new Error("السؤال غير موجود");
    }

    const question = await questionService.deleteQuestion(questionId);

    if (!question) {
      throw new Error("فشل حذف السؤال حاول مرة أخرى");
    }

    // Delete file from disk
    if (oldQuestion.file_path) {
      deleteFileFromDisk(oldQuestion.file_path);
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_question",
      entity_type: "question",
      entity_id: questionId,
      description: `حذف سؤال (ID: ${questionId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف السؤال بنجاح",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DOWNLOAD
// ============================================

const downloadQuestionFile = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(questionId);

    if (!question || !question.file_path) {
      throw new Error("الملف غير موجود");
    }

    const filePath = path.join(__dirname, "../../../", question.file_path);

    if (!fs.existsSync(filePath)) {
      throw new Error("الملف غير موجود");
    }

    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestionsByExamId,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  downloadQuestionFile,
};
