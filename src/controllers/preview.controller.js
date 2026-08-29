const { query } = require("../config/database");
const path = require("path");

const previewAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const result = await query(
      "SELECT file_path FROM assignments WHERE id = $1 AND deleted = 0",
      [assignmentId],
    );
    const assignment = result.rows[0];

    if (!assignment || !assignment.file_path) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const previewFile = require("../middlewares/preview.middleware");
    return previewFile(assignment.file_path)(req, res);
  } catch (error) {
    next(error);
  }
};

const previewVideoFile = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const result = await query("SELECT file_url FROM videos WHERE id = $1", [videoId]);
    const video = result.rows[0];

    if (!video || !video.file_url) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const previewFile = require("../middlewares/preview.middleware");
    return previewFile(video.file_url)(req, res);
  } catch (error) {
    next(error);
  }
};

const previewQuestionFile = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const result = await query(
      "SELECT file_path FROM questions WHERE id = $1",
      [questionId],
    );
    const question = result.rows[0];

    if (!question || !question.file_path) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const previewFile = require("../middlewares/preview.middleware");
    return previewFile(question.file_path)(req, res);
  } catch (error) {
    next(error);
  }
};

const previewStudentAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const result = await query(
      "SELECT file_path FROM student_answers WHERE id = $1",
      [answerId],
    );
    const answer = result.rows[0];

    if (!answer || !answer.file_path) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const previewFile = require("../middlewares/preview.middleware");
    return previewFile(answer.file_path)(req, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  previewAssignment,
  previewVideoFile,
  previewQuestionFile,
  previewStudentAnswer,
};
