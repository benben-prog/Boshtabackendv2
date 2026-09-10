const studentAnswerService = require("./student_answers.service");
const { logActivity } = require("../../utils/activityLogger");
const fs = require("fs");
const path = require("path");

// ============================================
// SUBMIT MCQ/TRUE-FALSE ANSWER
// ============================================

const submitAnswer = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { question_id, selected_option_id } = req.body;
    const studentId = req.clientId;

    const existing = await studentAnswerService.checkExistingAnswer(
      examId,
      studentId,
      question_id,
    );

    let answer;
    if (existing) {
      answer = await studentAnswerService.updateAnswer(existing.id, {
        selected_option_id,
      });
    } else {
      answer = await studentAnswerService.insertAnswer({
        exam_id: examId,
        student_id: studentId,
        question_id,
        selected_option_id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم حفظ الإجابة بنجاح",
      data: {
        answer_id: answer.id,
        question_id: answer.question_id,
        selected_option_id: answer.selected_option_id,
        is_correct: answer.is_correct,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// SUBMIT ESSAY ANSWER WITH FILE
// ============================================

const submitEssayAnswer = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { question_id } = req.body;
    const file_path = req.file ? req.file.path : null;
    const studentId = req.clientId;

    if (!file_path) {
      throw new Error("يجب رفع ملف الإجابة");
    }

    const existing = await studentAnswerService.checkExistingAnswer(
      examId,
      studentId,
      question_id,
    );

    // Save old file path for cleanup after successful update
    let oldFilePath = null;

    let answer;
    if (existing) {
      // Get old answer to check for old file
      const oldAnswers = await studentAnswerService.getStudentAnswersByExam(
        examId,
        studentId,
      );
      const oldAnswer = oldAnswers.find(
        (a) => a.question_id === parseInt(question_id),
      );

      if (oldAnswer && oldAnswer.file_path) {
        oldFilePath = oldAnswer.file_path;
      }

      answer = await studentAnswerService.updateEssayAnswer(
        existing.id,
        file_path,
      );

      // Delete old file AFTER successful update
      if (oldFilePath) {
        const fullOldPath = path.join(__dirname, "../../../", oldFilePath);
        if (fs.existsSync(fullOldPath)) {
          fs.unlinkSync(fullOldPath);
        }
      }
    } else {
      answer = await studentAnswerService.insertEssayAnswer({
        exam_id: examId,
        student_id: studentId,
        question_id,
        file_path,
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم حفظ الإجابة بنجاح",
      data: answer,
    });
  } catch (error) {
    // Delete uploaded file if operation failed
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError.message);
      }
    }
    next(error);
  }
};

// ============================================
// DELETE ANSWER
// ============================================

const deleteAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const answer = await studentAnswerService.deleteAnswer(answerId);

    if (!answer) {
      throw new Error("فشل حذف الإجابة");
    }

    return res.status(200).json({
      success: true,
      message: "تم حذف الإجابة بنجاح",
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET STUDENT ANSWERS
// ============================================

const getStudentAnswersByExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.clientId;

    const answers = await studentAnswerService.getStudentAnswersByExam(
      examId,
      studentId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإجابات بنجاح",
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET QUESTION STATS
// ============================================

const getQuestionAnswerStats = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const stats = await studentAnswerService.getQuestionAnswerStats(questionId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET MOST SELECTED OPTIONS
// ============================================

const getMostSelectedOptions = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const options =
      await studentAnswerService.getMostSelectedOptions(questionId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاختيارات بنجاح",
      data: options,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GRADE ESSAY ANSWER
// ============================================

const gradeEssayAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const { is_correct } = req.body;

    const answer = await studentAnswerService.gradeEssayAnswer(
      answerId,
      is_correct,
    );

    if (!answer) {
      throw new Error("فشل تصحيح الإجابة - قد تكون مصححة مسبقاً");
    }

    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "grade_essay_answer",
      entity_type: "student_answer",
      entity_id: answerId,
      description: `تصحيح إجابة مقالية (ID: ${answerId}) - ${is_correct ? "صح" : "غلط"}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تصحيح الإجابة بنجاح",
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ESSAY ANSWERS FOR GRADING
// ============================================

const getEssayAnswersForGrading = async (req, res, next) => {
  try {
    const answers = await studentAnswerService.getEssayAnswersForGrading();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإجابات المقالية بنجاح",
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ESSAY ANSWERS BY EXAM
// ============================================

const getEssayAnswersByExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const answers = await studentAnswerService.getEssayAnswersByExam(examId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإجابات المقالية بنجاح",
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DOWNLOAD ANSWER FILE
// ============================================

const downloadAnswerFile = async (req, res, next) => {
  try {
    const { answerId } = req.params;

    const answer = await studentAnswerService.getAnswerFilePath(answerId);

    if (!answer || !answer.file_path) {
      return res.status(404).json({
        success: false,
        message: "الملف غير موجود",
      });
    }

    const filePath = path.join(__dirname, "../../../", answer.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "الملف غير موجود",
      });
    }

    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAnswer,
  submitEssayAnswer,
  deleteAnswer,
  getStudentAnswersByExam,
  getQuestionAnswerStats,
  getMostSelectedOptions,
  gradeEssayAnswer,
  getEssayAnswersForGrading,
  getEssayAnswersByExam,
  downloadAnswerFile,
};
