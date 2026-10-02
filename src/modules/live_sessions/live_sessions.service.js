const liveSessionsQueries = require("./live_sessions.queries");
const googleAuth = require("../../utils/googleAuth");
require("../../utils/timezone");

const parseSessionDateTime = (input) => {
  if (!input) return null;
  if (input instanceof Date) return input;
  let str = String(input).trim();
  const hasTimezone = /Z|[+-]\d{2}(:?\d{2})?$/i.test(str);
  if (hasTimezone) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  }
  if (!str.includes("T") && str.includes(" ")) str = str.replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) str = `${str}:00`;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return new Date(input);
};

const liveSessionsService = {
  // 1. Google OAuth URL
  getGoogleAuthUrl: (userId, redirectTo = null) => {
    return googleAuth.generateAuthUrl(userId, redirectTo);
  },

  // 2. Handle Google OAuth Callback
  handleGoogleCallback: async (code, state) => {
    const verified = googleAuth.verifyOAuthState(state);
    const tokens = await googleAuth.exchangeCodeForTokens(code);
    await googleAuth.saveUserTokens(verified.userId, tokens);
    return { userId: verified.userId, redirectTo: verified.redirectTo, success: true };
  },

  // 2b. Direct exchange code from API
  exchangeCode: async (userId, code) => {
    const tokens = await googleAuth.exchangeCodeForTokens(code);
    await googleAuth.saveUserTokens(userId, tokens);
    return { success: true, message: "تم ربط حساب Google بنجاح" };
  },

  // 3. Google Connection Status
  getGoogleStatus: async (userId) => {
    const tokenRecord = await googleAuth.getUserTokens(userId);
    if (!tokenRecord) {
      return { is_connected: false };
    }

    const isExpired = tokenRecord.expiry_date
      ? Date.now() > Number(tokenRecord.expiry_date)
      : false;

    return {
      is_connected: true,
      has_refresh_token: !!tokenRecord.refresh_token,
      is_expired: isExpired,
      connected_at: tokenRecord.created_at,
      updated_at: tokenRecord.updated_at,
    };
  },

  // 4. Disconnect Google
  disconnectGoogle: async (userId) => {
    await googleAuth.deleteUserTokens(userId);
    return { success: true, message: "تم إلغاء ربط حساب Google بنجاح" };
  },

  // 5. Create Live Session
  createLiveSession: async (userId, data, file) => {
    const {
      title,
      description,
      start_time,
      duration_minutes,
      target_type,
      student_barcode,
    } = data;

    let grade_id = data.grade_id ? Number(data.grade_id) : null;
    let group_id = data.group_id ? Number(data.group_id) : null;
    let student_id = data.student_id ? Number(data.student_id) : null;

    // Validate Audience Targeting
    if (target_type === "grade") {
      if (!grade_id) {
        const error = new Error("الصف الدراسي مطلوب عند اختيار استهداف صف كامل");
        error.statusCode = 400;
        throw error;
      }
      const grade = await liveSessionsQueries.checkGradeExists(grade_id);
      if (!grade) {
        const error = new Error("الصف الدراسي المحدد غير موجود");
        error.statusCode = 404;
        throw error;
      }
      group_id = null;
      student_id = null;
    } else if (target_type === "group") {
      if (!group_id) {
        const error = new Error("المجموعة مطلوبة عند اختيار استهداف مجموعة");
        error.statusCode = 400;
        throw error;
      }
      const group = await liveSessionsQueries.checkGroupExists(group_id);
      if (!group) {
        const error = new Error("المجموعة المحددة غير موجودة");
        error.statusCode = 404;
        throw error;
      }
      grade_id = group.grade_id;
      student_id = null;
    } else if (target_type === "student") {
      let targetStudent = null;
      if (student_id) {
        targetStudent = await liveSessionsQueries.checkStudentExists(student_id);
      } else if (student_barcode) {
        targetStudent = await liveSessionsQueries.findStudentByBarcode(student_barcode);
      }

      if (!targetStudent) {
        const error = new Error("الطالب المستهدف غير موجود (بالـ ID أو الباركود)");
        error.statusCode = 404;
        throw error;
      }

      student_id = targetStudent.id;
      grade_id = targetStudent.grade_id;
      group_id = targetStudent.group_id;
    }

    // Calculate End Time
    const startTimeObj = parseSessionDateTime(start_time);
    const endTimeObj = new Date(startTimeObj.getTime() + Number(duration_minutes) * 60000);

    // Create Meeting on Google Calendar & Generate Google Meet Link
    const { meet_link, google_event_id } = await googleAuth.createMeetEvent(userId, {
      title,
      description,
      startTime: startTimeObj.toISOString(),
      endTime: endTimeObj.toISOString(),
    });

    // Handle Uploaded File
    const material_file_path = file ? file.path : null;
    const material_name = file ? file.originalname : null;

    // Save to Database
    const newSession = await liveSessionsQueries.insertLiveSession({
      title,
      description,
      start_time: startTimeObj.toISOString(),
      end_time: endTimeObj.toISOString(),
      duration_minutes: Number(duration_minutes),
      meet_link,
      google_event_id,
      target_type,
      grade_id,
      group_id,
      student_id,
      material_file_path,
      material_name,
      created_by: userId,
    });

    return newSession;
  },

  // 6. List Live Sessions (Admin / Teacher)
  getLiveSessions: async (queryParams) => {
    const page = Math.max(1, parseInt(queryParams.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(queryParams.limit) || 20));
    const offset = (page - 1) * limit;

    const filters = {
      grade_id: queryParams.grade_id ? Number(queryParams.grade_id) : null,
      group_id: queryParams.group_id ? Number(queryParams.group_id) : null,
      target_type: queryParams.target_type || null,
      status: queryParams.status || null,
      search: queryParams.search || null,
      limit,
      offset,
    };

    const [sessions, total] = await Promise.all([
      liveSessionsQueries.getLiveSessions(filters),
      liveSessionsQueries.countLiveSessions(filters),
    ]);

    return {
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // 7. Get Live Session By ID
  getLiveSessionById: async (id) => {
    const session = await liveSessionsQueries.getLiveSessionById(id);
    if (!session) {
      const error = new Error("حصة البث المباشر غير موجودة");
      error.statusCode = 404;
      throw error;
    }
    return session;
  },

  // 8. Update Live Session
  updateLiveSession: async (id, data, file) => {
    const existing = await liveSessionsQueries.getLiveSessionById(id);
    if (!existing) {
      const error = new Error("حصة البث المباشر غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.status !== undefined) updates.status = data.status;
    if (data.recording_url !== undefined) updates.recording_url = data.recording_url;

    // Recalculate duration / end_time if start_time or duration_minutes provided
    if (data.start_time !== undefined || data.duration_minutes !== undefined) {
      const start = data.start_time
        ? parseSessionDateTime(data.start_time)
        : new Date(existing.start_time);
      const duration = Number(data.duration_minutes || existing.duration_minutes);
      const end = new Date(start.getTime() + duration * 60000);

      updates.start_time = start.toISOString();
      updates.end_time = end.toISOString();
      updates.duration_minutes = duration;
    }

    if (file) {
      if (existing.material_file_path) {
        const { resolveStoredPath } = require("../../utils/fileStorage");
        const fs = require("fs");
        const oldPath = resolveStoredPath(existing.material_file_path);
        if (oldPath && fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (_) {}
        }
      }
      updates.material_file_path = file.path;
      updates.material_name = file.originalname;
    } else if (data.remove_material === true || data.remove_material === "true") {
      if (existing.material_file_path) {
        const { resolveStoredPath } = require("../../utils/fileStorage");
        const fs = require("fs");
        const oldPath = resolveStoredPath(existing.material_file_path);
        if (oldPath && fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (_) {}
        }
      }
      updates.material_file_path = null;
      updates.material_name = null;
    }

    const updated = await liveSessionsQueries.updateLiveSession(id, updates);
    return updated;
  },

  // 9. Delete Live Session
  deleteLiveSession: async (id, userId) => {
    const deletedRecord = await liveSessionsQueries.deleteLiveSession(id);
    if (!deletedRecord) {
      const error = new Error("حصة البث المباشر غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    if (deletedRecord.google_event_id) {
      await googleAuth.deleteMeetEvent(userId, deletedRecord.google_event_id);
    }

    return { success: true, message: "تم حذف الحصة بنجاح" };
  },

  // 10. Sync Recording from Google Drive
  syncRecording: async (id, userId) => {
    const session = await liveSessionsQueries.getLiveSessionById(id);
    if (!session) {
      const error = new Error("حصة البث المباشر غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    const driveRecording = await googleAuth.findDriveRecording(
      userId,
      session.title,
      session.start_time,
    );

    if (!driveRecording) {
      return {
        synced: false,
        message:
          "لم يتم العثور على تسجيل للحصة في Google Drive بعد. يرجى الانتظار بضع دقائق حتى يكتمل معالجة الفيديو من جوجل أو إدخال الرابط يدوياً.",
        recording_url: session.recording_url || null,
      };
    }

    const recordingUrl = driveRecording.webViewLink || driveRecording.webContentLink;
    await liveSessionsQueries.updateLiveSession(id, { recording_url: recordingUrl });

    return {
      synced: true,
      message: "تم مزامنة رابط التسجيل من Google Drive بنجاح",
      recording_url: recordingUrl,
      file_name: driveRecording.name,
    };
  },

  // 11. Manually update recording URL
  updateRecordingUrl: async (id, recordingUrl) => {
    const existing = await liveSessionsQueries.getLiveSessionById(id);
    if (!existing) {
      const error = new Error("حصة البث المباشر غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    const updated = await liveSessionsQueries.updateLiveSession(id, {
      recording_url: recordingUrl,
      status: "ended",
    });

    return updated;
  },

  // 12. Student View - List sessions targeting this student
  getLiveSessionsForStudent: async (studentId, queryParams) => {
    const student = await liveSessionsQueries.checkStudentExists(studentId);
    if (!student) {
      const error = new Error("بيانات الطالب غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    const page = Math.max(1, parseInt(queryParams.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(queryParams.limit) || 20));
    const offset = (page - 1) * limit;

    const filters = {
      grade_id: student.grade_id,
      group_id: student.group_id,
      student_id: student.id,
      status: queryParams.status || null,
      limit,
      offset,
    };

    const [sessions, total] = await Promise.all([
      liveSessionsQueries.getLiveSessionsForStudent(filters),
      liveSessionsQueries.countLiveSessionsForStudent(filters),
    ]);

    return {
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // 13. Student View - Get single session details
  getStudentLiveSessionById: async (studentId, sessionId) => {
    const student = await liveSessionsQueries.checkStudentExists(studentId);
    if (!student) {
      const error = new Error("بيانات الطالب غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    const session = await liveSessionsQueries.getLiveSessionById(sessionId);
    if (!session) {
      const error = new Error("حصة البث المباشر غير موجودة");
      error.statusCode = 404;
      throw error;
    }

    // Check if student is in audience
    const isTargeted =
      (session.target_type === "grade" && Number(session.grade_id) === Number(student.grade_id)) ||
      (session.target_type === "group" && Number(session.group_id) === Number(student.group_id)) ||
      (session.target_type === "student" && Number(session.student_id) === Number(student.id));

    if (!isTargeted) {
      const error = new Error("غير مصرح لك بالوصول إلى هذه الحصة");
      error.statusCode = 403;
      throw error;
    }

    return session;
  },

  // Backward compatibility aliases
  getLiveSessionByIdForStudent: async function (studentId, sessionId) {
    return this.getStudentLiveSessionById(studentId, sessionId);
  },

  getStudentLiveSessions: async function (studentId, queryParams) {
    return this.getLiveSessionsForStudent(studentId, queryParams);
  },
};

module.exports = liveSessionsService;
