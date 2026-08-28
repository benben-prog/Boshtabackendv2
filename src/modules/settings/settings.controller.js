const settingsService = require("./settings.service");

// Get settings
const getSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getSettings();

    if (!settings) {
      throw new Error("فشل تحميل الإعدادات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإعدادات بنجاح!",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update settings
const updateSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.updateSettings(req.body);

    if (!settings) {
      throw new Error("فشل تعديل الإعدادات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تعديل الإعدادات بنجاح!",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle platform status
const togglePlatformStatus = async (req, res, next) => {
  try {
    const settings = await settingsService.togglePlatformStatus();

    if (!settings) {
      throw new Error("فشل تغيير حالة المنصة حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تغيير حالة المنصة بنجاح!",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update academic year status
const updateAcademicYearStatus = async (req, res, next) => {
  try {
    const { academic_year_status } = req.body;

    const settings =
      await settingsService.updateAcademicYearStatus(academic_year_status);

    if (!settings) {
      throw new Error("فشل تغيير حالة السنة الدراسية حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تغيير حالة السنة الدراسية بنجاح!",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  togglePlatformStatus,
  updateAcademicYearStatus,
};
