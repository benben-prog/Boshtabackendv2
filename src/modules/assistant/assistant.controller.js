const assistantService = require("./assistant.service");

// Get assistant profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await assistantService.getAssistantProfile(req.clientId);

    if (!profile) {
      throw new Error("المساعد غير موجود!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الملف الشخصي بنجاح!",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard
const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await assistantService.getDashboard(
      req.clientPermissions,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل لوحة التحكم بنجاح!",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get activity log
const getActivityLog = async (req, res, next) => {
  try {
    const { entity_type = "", date = null } = req.query;
    const page = parseInt(req.query.page) || 1;

    const result = await assistantService.getActivityLogs(
      { entity_type, date, page },
      req.clientRole,
      req.clientPermissions,
      req.clientId,
    );

    return res.status(200).json({
      success: true,
      message: "تم تحميل السجل بنجاح!",
      data: result.logs,
      pagination: {
        page,
        limit: 20,
        total: result.total,
        totalPages: Math.ceil(result.total / 20),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getDashboard,
  getActivityLog,
};
