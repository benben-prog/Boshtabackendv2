const aiService = require("./ai.service");
const { cleanupUploadedFiles } = require("../../utils/fileStorage");

const getUserRole = (req) => {
  if (req.clientRole === "student") return "student";
  if (req.clientRole === "assistant") return "assistant";
  if (req.clientRole === "teacher") return "teacher";
  return "teacher"; // Default/super_admin
};

const aiController = {
  // 1. Send chat message (with optional PDF or image attachment)
  chat: async (req, res, next) => {
    try {
      const userType = getUserRole(req);
      const userId = req.clientId;
      const { message } = req.body;
      const file = req.file || null;

      const result = await aiService.sendMessage({
        userType,
        userId,
        messageText: message,
        file,
      });

      return res.status(200).json({
        success: true,
        message: "تم الرد من المساعد الذكي بنجاح",
        data: result,
      });
    } catch (error) {
      if (error.statusCode) {
        // Clean up file if business validation or quota error
        cleanupUploadedFiles(req);
      }
      next(error);
    }
  },

  // 2. Get current daily quota usage
  getQuota: async (req, res, next) => {
    try {
      const userType = getUserRole(req);
      const userId = req.clientId;
      const quota = await aiService.getQuota(userType, userId);

      return res.status(200).json({
        success: true,
        message: "تم جلب رصيد الاستهلاك اليومي بنجاح",
        data: quota,
      });
    } catch (error) {
      next(error);
    }
  },

  // 3. Get conversation history
  getHistory: async (req, res, next) => {
    try {
      const userType = getUserRole(req);
      const userId = req.clientId;
      const history = await aiService.getHistory(userType, userId);

      return res.status(200).json({
        success: true,
        message: "تم جلب سجل المحادثة بنجاح",
        data: history,
      });
    } catch (error) {
      next(error);
    }
  },

  // 4. Clear conversation history (Start new chat)
  clearHistory: async (req, res, next) => {
    try {
      const userType = getUserRole(req);
      const userId = req.clientId;
      const result = await aiService.clearHistory(userType, userId);

      return res.status(200).json({
        success: true,
        message: "تم بدء محادثة جديدة وتصفير السجل السابق بنجاح",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = aiController;
