const questionService = require("./questions.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");

// Get questions by exam
const getQuestionsByExamId = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const questions = await questionService.getQuestionsByExamId(examId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الأسئلة بنجاح!",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// Get question by ID
const getQuestionById = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(questionId);

    if (!question) {
      throw new Error("فشل تحميل السؤال حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل السؤال بنجاح!",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Create question
const createQuestion = async (req, res, next) => {
  try {
    const file_path = req.file ? req.file.path : null;
    const question = await questionService.createQuestion({
      ...req.body,
      file_path,
    });

    if (!question) {
      throw new Error("فشل إنشاء السؤال حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم إنشاء السؤال بنجاح!",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Update question
const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const file_path = req.file ? req.file.path : null;
    const question = await questionService.updateQuestion(questionId, {
      ...req.body,
      file_path,
    });

    if (!question) {
      throw new Error("فشل تعديل السؤال حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم تعديل السؤال بنجاح!",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Delete question
const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await questionService.deleteQuestion(questionId);

    if (!question) {
      throw new Error("فشل حذف السؤال حاول مرة أخرى!");
    }

    // Log activity
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
      message: "تم حذف السؤال بنجاح!",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Download question file
const downloadQuestionFile = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(questionId);

    if (!question || !question.file_path) {
      throw new Error("الملف غير موجود");
    }

    const filePath = path.join(__dirname, "../../../", question.file_path);
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
