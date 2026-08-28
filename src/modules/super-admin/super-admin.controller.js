const superAdminService = require("./super-admin.service");
const assistantService = require("../assistant/assistant.service");

// Get dashboard
const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await superAdminService.getDashboard();

    return res.status(200).json({
      success: true,
      message: "تم تحميل لوحة التحكم بنجاح!",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get platform status
const getPlatformStatus = async (req, res, next) => {
  try {
    const status = await superAdminService.getPlatformStatus();

    return res.status(200).json({
      success: true,
      message: "تم تحميل حالة المنصة بنجاح!",
      data: status,
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
      "super_admin",
      null,
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
  getDashboard,
  getPlatformStatus,
  getActivityLog,
};
