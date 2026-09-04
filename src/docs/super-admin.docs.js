/**
 * @swagger
 * tags:
 *   - name: Super Admin - Dashboard
 *     description: Dashboard and platform status endpoints
 *   - name: Super Admin - Users
 *     description: User management endpoints (CRUD, search, password)
 *   - name: Super Admin - Settings
 *     description: Platform settings endpoints
 *   - name: Super Admin - Students
 *     description: Student management endpoints
 *   - name: Super Admin - Bulk Upload
 *     description: Excel bulk upload endpoints
 *   - name: Super Admin - Grades
 *     description: Grade management endpoints
 *   - name: Super Admin - Groups
 *     description: Group management endpoints
 *   - name: Super Admin - Attendance
 *     description: Attendance management endpoints
 *   - name: Super Admin - Payments
 *     description: Payment management endpoints
 *   - name: Super Admin - Subscriptions
 *     description: Subscription management endpoints
 *   - name: Super Admin - Paper Exams
 *     description: Paper exam management endpoints
 *   - name: Super Admin - Exam Results
 *     description: Exam result management endpoints
 *   - name: Super Admin - Online Exams
 *     description: Online exam management endpoints
 *   - name: Super Admin - Questions
 *     description: Question management endpoints
 *   - name: Super Admin - Options
 *     description: Option management endpoints
 *   - name: Super Admin - Student Exams
 *     description: Student exam attempts endpoints
 *   - name: Super Admin - Student Answers
 *     description: Student answers and grading endpoints
 *   - name: Super Admin - Assignments
 *     description: Assignment management endpoints
 *   - name: Super Admin - Assignment Submissions
 *     description: Assignment submission endpoints
 *   - name: Super Admin - Videos
 *     description: Video management endpoints
 *   - name: Super Admin - Playlists
 *     description: Playlist management endpoints
 *   - name: Super Admin - Playlist Videos
 *     description: Playlist video endpoints
 *   - name: Super Admin - WhatsApp
 *     description: WhatsApp template endpoints
 *   - name: Super Admin - Activity Log
 *     description: Activity log endpoints
 */

/* ============================================
   DASHBOARD
   ============================================ */

/**
 * @swagger
 * /api/super-admin/dashboard:
 *   get:
 *     summary: Get super admin dashboard
 *     tags: [Super Admin - Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         total_students: { type: integer }
 *                         new_students_this_month: { type: integer }
 *                         total_assistants: { type: integer }
 *                         total_teachers: { type: integer }
 *                         total_grades: { type: integer }
 *                         total_groups: { type: integer }
 *                     attendance_today:
 *                       type: object
 *                       properties:
 *                         total_students: { type: integer }
 *                         present_count: { type: integer }
 *                         absent_count: { type: integer }
 *                         not_marked_count: { type: integer }
 *                     payments_month:
 *                       type: object
 *                       properties:
 *                         total_required: { type: number }
 *                         total_paid: { type: number }
 *                         total_remaining: { type: number }
 *                         fully_paid_students: { type: integer }
 *                         unpaid_students: { type: integer }
 *                     exams:
 *                       type: object
 *                       properties:
 *                         upcoming_paper_exams: { type: integer }
 *                         active_online_exams: { type: integer }
 *                         upcoming_online_exams: { type: integer }
 *                         active_assignments: { type: integer }
 *                         pending_grading: { type: integer }
 *                     platform:
 *                       type: object
 *                       properties:
 *                         center_name: { type: string }
 *                         phone: { type: string }
 *                         address: { type: string }
 *                         platform_status: { type: string }
 *                     students_with_3_absences: { type: integer }
 *                     recent_activities:
 *                       type: array
 *                       items:
 *                         type: object
 */

/**
 * @swagger
 * /api/super-admin/platform-status:
 *   get:
 *     summary: Get platform status
 *     tags: [Super Admin - Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Platform status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     center_name: { type: string }
 *                     phone: { type: string }
 *                     address: { type: string }
 *                     platform_status: { type: string }
 *                     academic_year_status: { type: string }
 */

/**
 * @swagger
 * /api/super-admin/activity-log:
 *   get:
 *     summary: Get activity log
 *     tags: [Super Admin - Activity Log]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: entity_type
 *         schema: { type: string }
 *         description: Filter by entity type
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Filter by date
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 */

/* ============================================
   USERS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 *   post:
 *     summary: Create user
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, phone, password, role, permissions]
 *             properties:
 *               full_name: { type: string, example: "أحمد محمد" }
 *               phone: { type: string, example: "01012345678" }
 *               password: { type: string, example: "123456" }
 *               role: { type: string, enum: [assistant, teacher] }
 *               permissions: { type: string, enum: [online_management, center_management] }
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /api/super-admin/users/deleted:
 *   get:
 *     summary: Get deleted users
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Deleted users retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/assistants:
 *   get:
 *     summary: Get all assistants
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Assistants retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Teachers retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/find:
 *   post:
 *     summary: Find user by phone
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone: { type: string, example: "01012345678" }
 *     responses:
 *       200:
 *         description: User found successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *   put:
 *     summary: Update user
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [assistant, teacher] }
 *               permissions: { type: string, enum: [online_management, center_management] }
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Soft delete user
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/password:
 *   put:
 *     summary: Update user password
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, password, confirmPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password updated successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/reset-password:
 *   put:
 *     summary: Reset user password
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/toggle-active:
 *   put:
 *     summary: Toggle user active status
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/permanent:
 *   delete:
 *     summary: Hard delete user
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User permanently deleted
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/restore:
 *   post:
 *     summary: Restore deleted user
 *     tags: [Super Admin - Users]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User restored successfully
 */

/* ============================================
   SETTINGS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/settings:
 *   get:
 *     summary: Get platform settings
 *     tags: [Super Admin - Settings]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *   put:
 *     summary: Update platform settings
 *     tags: [Super Admin - Settings]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               center_name: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               default_lock_minutes: { type: integer }
 *               academic_year_status: { type: string, enum: [active, paused, ended] }
 *               platform_status: { type: string, enum: [active, paused] }
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */

/**
 * @swagger
 * /api/super-admin/settings/toggle-platform:
 *   put:
 *     summary: Toggle platform status
 *     tags: [Super Admin - Settings]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */

/**
 * @swagger
 * /api/super-admin/settings/academic-year:
 *   put:
 *     summary: Update academic year status
 *     tags: [Super Admin - Settings]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [academic_year_status]
 *             properties:
 *               academic_year_status: { type: string, enum: [active, paused, ended] }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */

/* ============================================
   STUDENTS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: grade_id
 *         schema: { type: integer }
 *       - in: query
 *         name: group_id
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *   post:
 *     summary: Create student
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barcode, full_name, grade_id, group_id]
 *             properties:
 *               barcode: { type: string, example: "1001" }
 *               full_name: { type: string, example: "أحمد محمد" }
 *               phone: { type: string, example: "01012345678" }
 *               parent_phone: { type: string, example: "01098765432" }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Student created successfully
 */

/**
 * @swagger
 * /api/super-admin/students/deleted:
 *   get:
 *     summary: Get deleted students
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Deleted students retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/without-password:
 *   get:
 *     summary: Get students without password
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/grade/{gradeId}:
 *   post:
 *     summary: Generate passwords for students in a specific grade
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *         description: Grade ID
 *     responses:
 *       200:
 *         description: Passwords generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     generated_count: { type: integer }
 *                     passwords:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           student_id: { type: integer }
 *                           barcode: { type: string }
 *                           full_name: { type: string }
 *                           password: { type: string }
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords:
 *   post:
 *     summary: Generate passwords for all students without password
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Passwords generated successfully
 */

/**
 * @swagger
 * /api/super-admin/students/search/barcode:
 *   get:
 *     summary: Search student by barcode
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: barcode
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student found successfully
 */

/**
 * @swagger
 * /api/super-admin/students/search/phone:
 *   get:
 *     summary: Search student by phone
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: phone
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student found successfully
 */

/**
 * @swagger
 * /api/super-admin/students/search/parent-phone:
 *   get:
 *     summary: Search students by parent phone
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: parent_phone
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Students found successfully
 */

/**
 * @swagger
 * /api/super-admin/students/grade/{gradeId}:
 *   get:
 *     summary: Get students by grade
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/group/{groupId}:
 *   get:
 *     summary: Get students by group
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *   put:
 *     summary: Update student
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode: { type: string }
 *               full_name: { type: string }
 *               phone: { type: string }
 *               parent_phone: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Student updated successfully
 *   delete:
 *     summary: Soft delete student
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student deleted successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/profile:
 *   get:
 *     summary: Get student full profile
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/stats:
 *   get:
 *     summary: Get student quick stats
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/reset-password:
 *   put:
 *     summary: Reset student password
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/permanent:
 *   delete:
 *     summary: Hard delete student
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student permanently deleted
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/restore:
 *   post:
 *     summary: Restore deleted student
 *     tags: [Super Admin - Students]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student restored successfully
 */

/* ============================================
   BULK UPLOAD
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students/template:
 *   get:
 *     summary: Download students Excel template
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /api/super-admin/students/bulk-upload:
 *   post:
 *     summary: Bulk upload students
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with columns (barcode, full_name, grade_name, group_name, phone, parent_phone, notes)
 *     responses:
 *       200:
 *         description: File processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     success_count: { type: integer }
 *                     error_count: { type: integer }
 *                     success_records:
 *                       type: array
 *                       items: { type: object }
 *                     error_records:
 *                       type: array
 *                       items: { type: object }
 */

/**
 * @swagger
 * /api/super-admin/grades/template:
 *   get:
 *     summary: Download grades Excel template
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /api/super-admin/grades/bulk-upload:
 *   post:
 *     summary: Bulk upload grades
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with columns (name, monthly_price)
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/**
 * @swagger
 * /api/super-admin/groups/template:
 *   get:
 *     summary: Download groups Excel template
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /api/super-admin/groups/bulk-upload:
 *   post:
 *     summary: Bulk upload groups
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with columns (name, grade_name, days, start_time, end_time, room)
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/**
 * @swagger
 * /api/super-admin/exam-results/template:
 *   get:
 *     summary: Download exam results Excel template
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /api/super-admin/exam-results/bulk-upload/{examId}:
 *   post:
 *     summary: Bulk upload exam results
 *     tags: [Super Admin - Bulk Upload]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with columns (barcode, degree, notes)
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/* ============================================
   GRADES
   ============================================ */

/**
 * @swagger
 * /api/super-admin/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Grades list retrieved
 *   post:
 *     summary: Create grade
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, monthlyPrice]
 *             properties:
 *               name: { type: string, example: "الصف الأول" }
 *               monthlyPrice: { type: number, example: 500 }
 *     responses:
 *       201:
 *         description: Grade created successfully
 */

/**
 * @swagger
 * /api/super-admin/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade retrieved
 *   put:
 *     summary: Update grade
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, monthlyPrice]
 *             properties:
 *               name: { type: string }
 *               monthlyPrice: { type: number }
 *     responses:
 *       200:
 *         description: Grade updated
 *   delete:
 *     summary: Soft delete grade
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade deleted
 */

/**
 * @swagger
 * /api/super-admin/grades/{id}/permanent:
 *   delete:
 *     summary: Hard delete grade
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade permanently deleted
 */

/* ============================================
   GROUPS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Groups list retrieved
 *   post:
 *     summary: Create group
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, grade_id, days, start_time, end_time]
 *             properties:
 *               name: { type: string, example: "مجموعة أ" }
 *               grade_id: { type: integer }
 *               days: { type: string, example: "السبت,الأحد" }
 *               start_time: { type: string, example: "10:00" }
 *               end_time: { type: string, example: "12:00" }
 *               room: { type: string }
 *     responses:
 *       201:
 *         description: Group created successfully
 */

/**
 * @swagger
 * /api/super-admin/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group retrieved
 *   put:
 *     summary: Update group
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               days: { type: string }
 *               start_time: { type: string }
 *               end_time: { type: string }
 *               room: { type: string }
 *     responses:
 *       200:
 *         description: Group updated
 *   delete:
 *     summary: Soft delete group
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group deleted
 */

/**
 * @swagger
 * /api/super-admin/groups/{id}/permanent:
 *   delete:
 *     summary: Hard delete group
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group permanently deleted
 */

/* ============================================
   ATTENDANCE
   ============================================ */

/**
 * @swagger
 * /api/super-admin/attendance:
 *   post:
 *     summary: Create attendance
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id, group_id, grade_id, attendance_date, status]
 *             properties:
 *               student_id: { type: integer }
 *               group_id: { type: integer }
 *               grade_id: { type: integer }
 *               attendance_date: { type: string, format: date }
 *               status: { type: string, enum: [present, absent] }
 *               attendance_time: { type: string }
 *               method: { type: string, enum: [manual, barcode], default: manual }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Attendance created
 */

/**
 * @swagger
 * /api/super-admin/attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Attendance retrieved
 *   put:
 *     summary: Update attendance
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [present, absent] }
 *               attendance_time: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Attendance updated
 *   delete:
 *     summary: Delete attendance
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Attendance deleted
 */

/**
 * @swagger
 * /api/super-admin/attendance/mark-rest-absent:
 *   post:
 *     summary: Mark rest as absent
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, date]
 *             properties:
 *               groupId: { type: integer }
 *               date: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Students marked as absent
 */

/* ============================================
   PAYMENTS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: grade_id
 *         schema: { type: integer }
 *       - in: query
 *         name: group_id
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Payments list retrieved
 *   post:
 *     summary: Create payment
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subscription_id, student_id]
 *             properties:
 *               subscription_id: { type: integer }
 *               student_id: { type: integer }
 *               payment_date: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Payment created
 */

/**
 * @swagger
 * /api/super-admin/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Payment retrieved
 *   put:
 *     summary: Update payment
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               payment_date: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Payment updated
 *   delete:
 *     summary: Delete payment
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Payment deleted
 */

/* ============================================
   SUBSCRIPTIONS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/subscriptions:
 *   post:
 *     summary: Create subscription
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id, month]
 *             properties:
 *               student_id: { type: integer }
 *               month: { type: string, example: "2026-08" }
 *     responses:
 *       201:
 *         description: Subscription created
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/{id}/status:
 *   put:
 *     summary: Update subscription status
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [paid, unpaid] }
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Subscription deleted
 */

/* ============================================
   PAPER EXAMS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/exams:
 *   get:
 *     summary: Get all paper exams
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Exams list retrieved
 *   post:
 *     summary: Create paper exam
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, grade_id, total_degree, exam_date]
 *             properties:
 *               title: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               total_degree: { type: number }
 *               exam_date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Exam created
 */

/**
 * @swagger
 * /api/super-admin/exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam retrieved
 *   put:
 *     summary: Update exam
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               total_degree: { type: number }
 *               exam_date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Exam updated
 *   delete:
 *     summary: Soft delete exam
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam deleted
 */

/**
 * @swagger
 * /api/super-admin/exams/{id}/permanent:
 *   delete:
 *     summary: Hard delete exam
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam permanently deleted
 */

/* ============================================
   EXAM RESULTS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/exam-results:
 *   post:
 *     summary: Create exam result
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exam_id, student_id, degree]
 *             properties:
 *               exam_id: { type: integer }
 *               student_id: { type: integer }
 *               degree: { type: number }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Result created
 */

/**
 * @swagger
 * /api/super-admin/exam-results/upsert:
 *   post:
 *     summary: Upsert exam result
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exam_id, student_id, degree]
 *             properties:
 *               exam_id: { type: integer }
 *               student_id: { type: integer }
 *               degree: { type: number }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Result upserted
 */

/**
 * @swagger
 * /api/super-admin/exam-results/{id}:
 *   put:
 *     summary: Update exam result
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               degree: { type: number }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Result updated
 *   delete:
 *     summary: Delete exam result
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Result deleted
 */

/* ============================================
   ONLINE EXAMS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/online-exams:
 *   get:
 *     summary: Get all online exams
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Online exams list retrieved
 *   post:
 *     summary: Create online exam
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, grade_id, duration_minutes, start_at, end_at, full_mark]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               duration_minutes: { type: integer }
 *               start_at: { type: string, format: date-time }
 *               end_at: { type: string, format: date-time }
 *               full_mark: { type: number }
 *               randomize_questions: { type: integer, enum: [0, 1] }
 *     responses:
 *       201:
 *         description: Online exam created
 */

/**
 * @swagger
 * /api/super-admin/online-exams/{examId}:
 *   get:
 *     summary: Get online exam by ID
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Online exam retrieved
 *   put:
 *     summary: Update online exam
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               duration_minutes: { type: integer }
 *               start_at: { type: string, format: date-time }
 *               end_at: { type: string, format: date-time }
 *               full_mark: { type: number }
 *               randomize_questions: { type: integer, enum: [0, 1] }
 *     responses:
 *       200:
 *         description: Online exam updated
 *   delete:
 *     summary: Soft delete online exam
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Online exam deleted
 */

/* ============================================
   QUESTIONS & OPTIONS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/questions:
 *   post:
 *     summary: Create question
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exam_id, question_text, type, order]
 *             properties:
 *               exam_id: { type: integer }
 *               question_text: { type: string }
 *               type: { type: string, enum: [mcq, true_false, essay] }
 *               order: { type: integer }
 *     responses:
 *       201:
 *         description: Question created
 */

/**
 * @swagger
 * /api/super-admin/questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Question retrieved
 *   put:
 *     summary: Update question
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_text: { type: string }
 *               type: { type: string, enum: [mcq, true_false, essay] }
 *               order: { type: integer }
 *     responses:
 *       200:
 *         description: Question updated
 *   delete:
 *     summary: Delete question
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Question deleted
 */

/**
 * @swagger
 * /api/super-admin/options:
 *   post:
 *     summary: Create option
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question_id, option_text, is_correct, order]
 *             properties:
 *               question_id: { type: integer }
 *               option_text: { type: string }
 *               is_correct: { type: integer, enum: [0, 1] }
 *               order: { type: integer }
 *     responses:
 *       201:
 *         description: Option created
 */

/**
 * @swagger
 * /api/super-admin/options/{optionId}:
 *   get:
 *     summary: Get option by ID
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Option retrieved
 *   put:
 *     summary: Update option
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option_text: { type: string }
 *               is_correct: { type: integer, enum: [0, 1] }
 *               order: { type: integer }
 *     responses:
 *       200:
 *         description: Option updated
 *   delete:
 *     summary: Delete option
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Option deleted
 */

/* ============================================
   ASSIGNMENTS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Assignments list retrieved
 *   post:
 *     summary: Create assignment
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, grade_id, full_mark, deadline]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               full_mark: { type: number }
 *               deadline: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Assignment created
 */

/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Assignment retrieved
 *   put:
 *     summary: Update assignment
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               full_mark: { type: number }
 *               deadline: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Assignment updated
 *   delete:
 *     summary: Soft delete assignment
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Assignment deleted
 */

/* ============================================
   VIDEOS & PLAYLISTS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Videos list retrieved
 *   post:
 *     summary: Create video
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, grade_id, video_url]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               video_url: { type: string }
 *     responses:
 *       201:
 *         description: Video created
 */

/**
 * @swagger
 * /api/super-admin/videos/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Video retrieved
 *   put:
 *     summary: Update video
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               video_url: { type: string }
 *     responses:
 *       200:
 *         description: Video updated
 *   delete:
 *     summary: Delete video
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Video deleted
 */

/**
 * @swagger
 * /api/super-admin/playlists:
 *   get:
 *     summary: Get all playlists
 *     tags: [Super Admin - Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Playlists list retrieved
 *   post:
 *     summary: Create playlist
 *     tags: [Super Admin - Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, grade_id]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *     responses:
 *       201:
 *         description: Playlist created
 */

/**
 * @swagger
 * /api/super-admin/playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Super Admin - Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Playlist retrieved
 *   put:
 *     summary: Update playlist
 *     tags: [Super Admin - Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *     responses:
 *       200:
 *         description: Playlist updated
 *   delete:
 *     summary: Delete playlist
 *     tags: [Super Admin - Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Playlist deleted
 */

/**
 * @swagger
 * /api/super-admin/playlist-videos/playlist/{playlistId}:
 *   get:
 *     summary: Get playlist videos
 *     tags: [Super Admin - Playlist Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Videos retrieved
 */

/**
 * @swagger
 * /api/super-admin/playlist-videos:
 *   post:
 *     summary: Add video to playlist
 *     tags: [Super Admin - Playlist Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [playlist_id, video_id]
 *             properties:
 *               playlist_id: { type: integer }
 *               video_id: { type: integer }
 *     responses:
 *       201:
 *         description: Video added
 */

/**
 * @swagger
 * /api/super-admin/playlist-videos/{id}:
 *   delete:
 *     summary: Remove video from playlist
 *     tags: [Super Admin - Playlist Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Video removed
 */

/* ============================================
   WHATSAPP
   ============================================ */

/**
 * @swagger
 * /api/super-admin/whatsapp-messages:
 *   get:
 *     summary: Get all whatsapp templates
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Templates list retrieved
 *   post:
 *     summary: Create whatsapp template
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [template, sent_to]
 *             properties:
 *               template: { type: string }
 *               sent_to: { type: string, enum: [parents, both] }
 *               delay: { type: integer, default: 45 }
 *     responses:
 *       201:
 *         description: Template created
 */

/**
 * @swagger
 * /api/super-admin/whatsapp-messages/{templateId}:
 *   get:
 *     summary: Get whatsapp template by ID
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Template retrieved
 *   put:
 *     summary: Update whatsapp template
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template: { type: string }
 *               sent_to: { type: string, enum: [parents, both] }
 *               delay: { type: integer }
 *     responses:
 *       200:
 *         description: Template updated
 */

/**
 * @swagger
 * /api/super-admin/whatsapp-messages/{templateId}/toggle:
 *   put:
 *     summary: Toggle whatsapp template active status
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Status toggled
 */
/* ============================================
   WHATSAPP SETTINGS & DASHBOARD & QUEUE & MESSAGES
   ============================================ */

/**
 * @swagger
 * /api/super-admin/whatsapp/settings:
 *   put:
 *     summary: Update WhatsApp settings
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsapp_daily_limit: { type: integer, example: 250 }
 *               whatsapp_delay_seconds: { type: integer, example: 45 }
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     whatsapp_daily_limit: { type: integer }
 *                     whatsapp_delay_seconds: { type: integer }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp/dashboard:
 *   get:
 *     summary: Get WhatsApp dashboard
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         pending: { type: integer }
 *                         sent: { type: integer }
 *                         failed: { type: integer }
 *                         delivered: { type: integer }
 *                         sent_today: { type: integer }
 *                         daily_limit: { type: integer }
 *                         delay_seconds: { type: integer }
 *                     templates:
 *                       type: array
 *                       items: { type: object }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp/queue/stats:
 *   get:
 *     summary: Get WhatsApp queue statistics
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Queue statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     pending: { type: integer }
 *                     sent: { type: integer }
 *                     failed: { type: integer }
 *                     delivered: { type: integer }
 *                     sent_today: { type: integer }
 *                     daily_limit: { type: integer }
 *                     remaining_today: { type: integer }
 *                     delay_seconds: { type: integer }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp/queue/send:
 *   post:
 *     summary: Send WhatsApp queue
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Queue processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     sent: { type: integer }
 *                     failed: { type: integer }
 *                     total: { type: integer }
 *                     dailyLimitReached: { type: boolean }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp/queue/reset-failed:
 *   post:
 *     summary: Reset failed WhatsApp messages
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Failed messages reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { type: object }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp/messages:
 *   get:
 *     summary: Get all WhatsApp messages
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, sent, failed, delivered] }
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [welcome, absence, payment, exam] }
 *         description: Filter by message type
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { type: object }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp/messages/{messageId}:
 *   get:
 *     summary: Get WhatsApp message by ID
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *   delete:
 *     summary: Delete WhatsApp message
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 */
