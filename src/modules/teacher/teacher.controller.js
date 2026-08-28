const teacherService = require("./teacher.service");

// Get teacher profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await teacherService.getTeacherProfile(req.clientId);

    if (!profile) {
      throw new Error("المدرس غير موجود!");
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
    const dashboard = await teacherService.getDashboard();

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

    const result = await teacherService.getActivityLogs(
      { entity_type, date, page },
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
