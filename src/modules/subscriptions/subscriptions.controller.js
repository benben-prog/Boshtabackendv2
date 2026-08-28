const subscriptionService = require("./subscriptions.service");
const { logActivity } = require("../../utils/activityLogger");

// Create subscription
const createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);

    if (!subscription) {
      throw new Error("فشل إنشاء الاشتراك حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "create_subscription",
      entity_type: "subscription",
      entity_id: subscription.id,
      description: `إنشاء اشتراك للطالب (ID: ${subscription.student_id}) لشهر ${subscription.month} بمبلغ ${subscription.required_amount}`,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الاشتراك بنجاح!",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// Get student subscriptions
const getStudentSubscriptions = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const subscriptions =
      await subscriptionService.getStudentSubscriptions(studentId);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاشتراكات بنجاح!",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// Get subscriptions by month
const getSubscriptionsByMonth = async (req, res, next) => {
  try {
    const { month } = req.params;

    const subscriptions =
      await subscriptionService.getSubscriptionsByMonth(month);

    return res.status(200).json({
      success: true,
      message: "تم تحميل الاشتراكات بنجاح!",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// Get students without subscription
const getStudentsWithoutSubscriptionCurrentMonth = async (req, res, next) => {
  try {
    const students =
      await subscriptionService.getStudentsWithoutSubscriptionCurrentMonth();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الطلاب بنجاح!",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get grade subscription stats
const getGradeSubscriptionStats = async (req, res, next) => {
  try {
    const { gradeId } = req.params;

    const stats = await subscriptionService.getGradeSubscriptionStats(gradeId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get group subscription stats
const getGroupSubscriptionStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const stats = await subscriptionService.getGroupSubscriptionStats(groupId);

    if (!stats) {
      throw new Error("فشل تحميل الإحصائيات حاول مرة أخرى!");
    }

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get overall subscription stats
const getOverallSubscriptionStats = async (req, res, next) => {
  try {
    const stats = await subscriptionService.getOverallSubscriptionStats();

    return res.status(200).json({
      success: true,
      message: "تم تحميل الإحصائيات بنجاح!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Update subscription status
const updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await subscriptionService.updateSubscriptionStatus(
      id,
      status,
    );

    if (!subscription) {
      throw new Error("فشل تعديل حالة الاشتراك حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "update_subscription_status",
      entity_type: "subscription",
      entity_id: id,
      description: `تعديل حالة الاشتراك (ID: ${id}) إلى ${status}`,
    });

    return res.status(200).json({
      success: true,
      message: "تم تعديل حالة الاشتراك بنجاح!",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// Delete subscription
const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await subscriptionService.deleteSubscription(id);

    if (!subscription) {
      throw new Error("فشل حذف الاشتراك حاول مرة أخرى!");
    }

    // Log activity
    await logActivity({
      user_id: req.clientId,
      user_role: req.clientRole,
      user_permissions: req.clientPermissions,
      action: "delete_subscription",
      entity_type: "subscription",
      entity_id: id,
      description: `حذف اشتراك (ID: ${id})`,
    });

    return res.status(200).json({
      success: true,
      message: "تم حذف الاشتراك بنجاح!",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  getStudentSubscriptions,
  getSubscriptionsByMonth,
  getStudentsWithoutSubscriptionCurrentMonth,
  getGradeSubscriptionStats,
  getGroupSubscriptionStats,
  getOverallSubscriptionStats,
  updateSubscriptionStatus,
  deleteSubscription,
};
