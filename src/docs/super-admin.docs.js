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
 *   - name: Super Admin - Attendance Sessions
 *     description: Attendance session endpoints
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
 *   - name: Super Admin - Download & Preview
 *     description: File download and preview endpoints
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
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
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
 *               full_name: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
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
 *               phone: { type: string }
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               phone: { type: string }
 *               role: { type: string }
 *               permissions: { type: string }
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
 *               academic_year_status: { type: string }
 *               platform_status: { type: string }
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
 *               academic_year_status: { type: string }
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
 *               barcode: { type: string }
 *               full_name: { type: string }
 *               phone: { type: string }
 *               parent_phone: { type: string }
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
 * /api/super-admin/students/generate-passwords:
 *   post:
 *     summary: Generate passwords for all students
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
 *               file: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: File processed successfully
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
 *               file: { type: string, format: binary }
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
 *               file: { type: string, format: binary }
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
 *               file: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/* ============================================
   DOWNLOAD & PREVIEW
   ============================================ */

/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/preview:
 *   get:
 *     summary: Preview assignment file
 *     tags: [Super Admin - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File previewed successfully
 */

/**
 * @swagger
 * /api/super-admin/videos/{videoId}/preview:
 *   get:
 *     summary: Preview video file
 *     tags: [Super Admin - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File previewed successfully
 */

/**
 * @swagger
 * /api/super-admin/questions/{questionId}/preview:
 *   get:
 *     summary: Preview question file
 *     tags: [Super Admin - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File previewed successfully
 */

/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/preview:
 *   get:
 *     summary: Preview student answer file
 *     tags: [Super Admin - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File previewed successfully
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
 *     responses: { 200: { description: Grades list } }
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
 *               name: { type: string }
 *               monthlyPrice: { type: number }
 *     responses: { 201: { description: Grade created } }
 */

/**
 * @swagger
 * /api/super-admin/grades/groups-count:
 *   get:
 *     summary: Get grades with groups count
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/grades/students-count:
 *   get:
 *     summary: Get grades with students count
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/grades/stats:
 *   get:
 *     summary: Get all grades stats
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
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
 *     responses: { 200: { description: Grade data } }
 *   put:
 *     summary: Update grade
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Grade updated } }
 *   delete:
 *     summary: Soft delete grade
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Grade deleted } }
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
 *     responses: { 200: { description: Grade permanently deleted } }
 */

/**
 * @swagger
 * /api/super-admin/grades/{id}/stats:
 *   get:
 *     summary: Get grade stats
 *     tags: [Super Admin - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Retrieved successfully } }
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
 *     responses: { 200: { description: Groups list } }
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
 *               name: { type: string }
 *               grade_id: { type: integer }
 *               days: { type: string }
 *               start_time: { type: string }
 *               end_time: { type: string }
 *               room: { type: string }
 *     responses: { 201: { description: Group created } }
 */

/**
 * @swagger
 * /api/super-admin/groups/with-grade-name:
 *   get:
 *     summary: Get groups with grade name
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/groups/students-count:
 *   get:
 *     summary: Get groups with students count
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/groups/stats:
 *   get:
 *     summary: Get all groups stats
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/groups/grade/{gradeId}:
 *   get:
 *     summary: Get groups by grade
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Groups list } }
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
 *     responses: { 200: { description: Group data } }
 *   put:
 *     summary: Update group
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Group updated } }
 *   delete:
 *     summary: Soft delete group
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Group deleted } }
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
 *     responses: { 200: { description: Group permanently deleted } }
 */

/**
 * @swagger
 * /api/super-admin/groups/{id}/stats:
 *   get:
 *     summary: Get group stats
 *     tags: [Super Admin - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Retrieved successfully } }
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
 *     responses: { 201: { description: Attendance created } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/dashboard:
 *   get:
 *     summary: Get attendance dashboard
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/overall-stats:
 *   get:
 *     summary: Get overall attendance stats
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/consecutive-absences:
 *   get:
 *     summary: Get students with 3+ consecutive absences
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade attendance stats
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance by group and date
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/month/{month}:
 *   get:
 *     summary: Get attendance by group and month
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: string, example: "2026-08" }
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/summary/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance summary
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses: { 200: { description: Retrieved successfully } }
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
 *     responses: { 200: { description: Retrieved successfully } }
 *   put:
 *     summary: Update attendance
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Attendance updated } }
 *   delete:
 *     summary: Delete attendance
 *     tags: [Super Admin - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Attendance deleted } }
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
 *     responses: { 200: { description: Students marked as absent } }
 */

/* ============================================
   ATTENDANCE SESSIONS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/start:
 *   post:
 *     summary: Start attendance session
 *     tags: [Super Admin - Attendance Sessions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [group_id, grade_id]
 *             properties:
 *               group_id: { type: integer }
 *               grade_id: { type: integer }
 *     responses: { 201: { description: Session started } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/active/{groupId}:
 *   get:
 *     summary: Get active session
 *     tags: [Super Admin - Attendance Sessions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Active session retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/{id}/toggle-makeup:
 *   put:
 *     summary: Toggle makeup mode
 *     tags: [Super Admin - Attendance Sessions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Makeup mode toggled } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/scan-barcode:
 *   post:
 *     summary: Scan barcode for attendance
 *     tags: [Super Admin - Attendance Sessions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barcode, group_id, grade_id, session_id]
 *             properties:
 *               barcode: { type: string }
 *               group_id: { type: integer }
 *               grade_id: { type: integer }
 *               session_id: { type: integer }
 *     responses: { 200: { description: Attendance recorded } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/lock:
 *   post:
 *     summary: Lock session
 *     tags: [Super Admin - Attendance Sessions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, groupId]
 *             properties:
 *               id: { type: integer }
 *               groupId: { type: integer }
 *     responses: { 200: { description: Session locked } }
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
 *     responses: { 200: { description: Payments list } }
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
 *     responses: { 201: { description: Payment created } }
 */

/**
 * @swagger
 * /api/super-admin/payments/collections:
 *   get:
 *     summary: Get monthly collections
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/payments/unpaid:
 *   get:
 *     summary: Get unpaid students
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/payments/overall:
 *   get:
 *     summary: Get overall payment stats
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/payments/students-status:
 *   get:
 *     summary: Get all students payment status
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
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
 *     responses: { 200: { description: Payment data } }
 *   put:
 *     summary: Update payment
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Payment updated } }
 *   delete:
 *     summary: Delete payment
 *     tags: [Super Admin - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Payment deleted } }
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
 *     responses: { 201: { description: Subscription created } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/overall:
 *   get:
 *     summary: Get overall subscription stats
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/without-current:
 *   get:
 *     summary: Get students without current subscription
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/month/{month}:
 *   get:
 *     summary: Get subscriptions by month
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: string, example: "2026-08" }
 *     responses: { 200: { description: Retrieved successfully } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/student/{studentId}:
 *   get:
 *     summary: Get student subscriptions
 *     tags: [Super Admin - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Retrieved successfully } }
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
 *     responses: { 200: { description: Status updated } }
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
 *     responses: { 200: { description: Subscription deleted } }
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
 *     responses: { 200: { description: Exams list } }
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
 *     responses: { 201: { description: Exam created } }
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
 *     responses: { 200: { description: Exam data } }
 *   put:
 *     summary: Update exam
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Exam updated } }
 *   delete:
 *     summary: Soft delete exam
 *     tags: [Super Admin - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Exam deleted } }
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
 *     responses: { 201: { description: Result created } }
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
 *     responses: { 200: { description: Result upserted } }
 */

/**
 * @swagger
 * /api/super-admin/exam-results/upsert-batch/{examId}:
 *   post:
 *     summary: Upsert batch exam results
 *     tags: [Super Admin - Exam Results]
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
 *             required: [records]
 *             properties:
 *               records:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     barcode: { type: string }
 *                     degree: { type: number }
 *                     notes: { type: string }
 *     responses: { 200: { description: Batch processed } }
 */

/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}:
 *   get:
 *     summary: Get exam results
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Results retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}/stats:
 *   get:
 *     summary: Get exam result stats
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam results stats
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam results stats
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
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
 *     responses: { 200: { description: Result updated } }
 *   delete:
 *     summary: Delete exam result
 *     tags: [Super Admin - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Result deleted } }
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
 *     responses: { 200: { description: Online exams list } }
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
 *     responses: { 201: { description: Online exam created } }
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
 *     responses: { 200: { description: Online exam data } }
 *   put:
 *     summary: Update online exam
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Online exam updated } }
 *   delete:
 *     summary: Soft delete online exam
 *     tags: [Super Admin - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Online exam deleted } }
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
 *     responses: { 201: { description: Question created } }
 */

/**
 * @swagger
 * /api/super-admin/questions/exam/{examId}:
 *   get:
 *     summary: Get questions by exam
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Questions retrieved } }
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
 *     responses: { 200: { description: Question retrieved } }
 *   put:
 *     summary: Update question
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Question updated } }
 *   delete:
 *     summary: Delete question
 *     tags: [Super Admin - Questions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Question deleted } }
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
 *     responses: { 201: { description: Option created } }
 */

/**
 * @swagger
 * /api/super-admin/options/question/{questionId}:
 *   get:
 *     summary: Get options by question
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Options retrieved } }
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
 *     responses: { 200: { description: Option retrieved } }
 *   put:
 *     summary: Update option
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Option updated } }
 *   delete:
 *     summary: Delete option
 *     tags: [Super Admin - Options]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Option deleted } }
 */

/* ============================================
   STUDENT EXAMS & ANSWERS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}:
 *   get:
 *     summary: Get student exams by exam
 *     tags: [Super Admin - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Student exams retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}/stats:
 *   get:
 *     summary: Get exam attempt stats
 *     tags: [Super Admin - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-exams/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam attempts stats
 *     tags: [Super Admin - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-exams/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam attempts stats
 *     tags: [Super Admin - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/stats:
 *   get:
 *     summary: Get question answer stats
 *     tags: [Super Admin - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Stats retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/options:
 *   get:
 *     summary: Get most selected options
 *     tags: [Super Admin - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Options retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-answers/essay/pending:
 *   get:
 *     summary: Get pending essay answers
 *     tags: [Super Admin - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Pending answers retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-answers/essay/exam/{examId}:
 *   get:
 *     summary: Get essay answers by exam
 *     tags: [Super Admin - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Essay answers retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/grade:
 *   put:
 *     summary: Grade essay answer
 *     tags: [Super Admin - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [is_correct]
 *             properties:
 *               is_correct: { type: integer, enum: [0, 1] }
 *     responses: { 200: { description: Answer graded } }
 */

/* ============================================
   ASSIGNMENTS & SUBMISSIONS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Assignments list } }
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
 *     responses: { 201: { description: Assignment created } }
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
 *     responses: { 200: { description: Assignment data } }
 *   put:
 *     summary: Update assignment
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Assignment updated } }
 *   delete:
 *     summary: Soft delete assignment
 *     tags: [Super Admin - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Assignment deleted } }
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Get submissions by assignment
 *     tags: [Super Admin - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Submissions retrieved } }
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/{submissionId}/grade:
 *   put:
 *     summary: Grade assignment submission
 *     tags: [Super Admin - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score: { type: number }
 *               feedback: { type: string }
 *     responses: { 200: { description: Submission graded } }
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
 *     responses: { 200: { description: Videos list } }
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
 *               grade_id: { type: integer }
 *               video_url: { type: string }
 *     responses: { 201: { description: Video created } }
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
 *     responses: { 200: { description: Video data } }
 *   put:
 *     summary: Update video
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Video updated } }
 *   delete:
 *     summary: Delete video
 *     tags: [Super Admin - Videos]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Video deleted } }
 */

/**
 * @swagger
 * /api/super-admin/playlists:
 *   get:
 *     summary: Get all playlists
 *     tags: [Super Admin - Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Playlists list } }
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
 *               grade_id: { type: integer }
 *     responses: { 201: { description: Playlist created } }
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
 *     responses: { 200: { description: Videos retrieved } }
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
 *     responses: { 201: { description: Video added } }
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
 *     responses: { 200: { description: Templates list } }
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
 *               sent_to: { type: string, enum: [students, parents, both] }
 *               delay: { type: integer, default: 60 }
 *     responses: { 201: { description: Template created } }
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
 *     responses: { 200: { description: Template data } }
 *   put:
 *     summary: Update whatsapp template
 *     tags: [Super Admin - WhatsApp]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Template updated } }
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
 *     responses: { 200: { description: Status toggled } }
 */
