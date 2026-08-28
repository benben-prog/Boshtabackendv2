const optionService = require("./options.service");
const { logActivity } = require("../../utils/activityLogger");

// Get options by question
const getOptionsByQuestionId = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const options = await optionService.getOptionsByQuestionId(questionId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاختيارات بنجاح!",
      data: options,
    });
  } catch (error) {
    next(error);
  }
};

// Get option by ID
const getOptionById = async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const option = await optionService.getOptionById(optionId);

    if (!option) {
      throw new Error("فشل تحميل الاختيار حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاختيار بنجاح!",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

// Create option
const createOption = async (req, res, next) => {
  try {
    const option = await optionService.createOption(req.body);

    if (!option) {
      throw new Error("فشل إنشاء الاختيار حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_option",
      entity_type: "option",
      entity_id: option.id,
      description: `إنشاء اختيار (سؤال: ${option.question_id})`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الاختيار بنجاح!",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

// Update option
const updateOption = async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const option = await optionService.updateOption(optionId, req.body);

    if (!option) {
      throw new Error("فشل تعديل الاختيار حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_option",
      entity_type: "option",
      entity_id: optionId,
      description: `تعديل اختيار (ID: ${optionId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل الاختيار بنجاح!",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

// Delete option
const deleteOption = async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const option = await optionService.deleteOption(optionId);

    if (!option) {
      throw new Error("فشل حذف الاختيار حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_option",
      entity_type: "option",
      entity_id: optionId,
      description: `حذف اختيار (ID: ${optionId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الاختيار بنجاح!",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOptionsByQuestionId,
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
};
