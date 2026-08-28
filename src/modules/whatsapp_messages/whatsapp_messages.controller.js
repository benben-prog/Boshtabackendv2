const whatsappService = require("./whatsapp_messages.service");
const { logActivity } = require("../../utils/activityLogger");

// Create template
const createTemplate = async (req, res, next) => {
  try {
    const template = await whatsappService.createTemplate(req.body);

    if (!template) {
      throw new Error("فشل إنشاء القالب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_whatsapp_template",
      entity_type: "whatsapp_template",
      entity_id: template.id,
      description: `إنشاء قالب واتساب جديد`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء القالب بنجاح!",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Get all templates
const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await whatsappService.getAllTemplates();

    if (!templates) {
      throw new Error("فشل تحميل القوالب حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل القوالب بنجاح!",
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// Get template by ID
const getTemplateById = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const template = await whatsappService.getTemplateById(templateId);

    if (!template) {
      throw new Error("فشل تحميل القالب حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل القالب بنجاح!",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Update template
const updateTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const template = await whatsappService.updateTemplate(templateId, req.body);

    if (!template) {
      throw new Error("فشل تعديل القالب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_whatsapp_template",
      entity_type: "whatsapp_template",
      entity_id: templateId,
      description: `تعديل قالب واتساب (ID: ${templateId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل القالب بنجاح!",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle template active
const toggleTemplateActive = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const template = await whatsappService.toggleTemplateActive(templateId);

    if (!template) {
      throw new Error("فشل تغيير حالة القالب حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "toggle_whatsapp_template",
      entity_type: "whatsapp_template",
      entity_id: templateId,
      description: `تغيير حالة قالب واتساب (ID: ${templateId})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تغيير حالة القالب بنجاح!",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  toggleTemplateActive,
};
