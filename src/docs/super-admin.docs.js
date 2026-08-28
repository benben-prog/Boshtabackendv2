/**
 * @swagger
 * tags:
 *   name: Super Admin
 *   description: Super Admin endpoints (Full Access + Extra Protection)
 */

/* ============================================
   DASHBOARD
   ============================================ */

/**
 * @swagger
 * /api/super-admin/dashboard:
 *   get:
 *     summary: Get super admin dashboard
 *     description: Get comprehensive dashboard with all statistics
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/super-admin/platform-status:
 *   get:
 *     summary: Get platform status
 *     description: Get current platform status and settings
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Platform status retrieved successfully
 */

/* ============================================
   USERS MANAGEMENT - GET METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/users:
 *   get:
 *     summary: Get all users
 *     description: Get list of all users (assistants and teachers)
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/deleted:
 *   get:
 *     summary: Get deleted users
 *     description: Get list of all soft-deleted users
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Deleted users list retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/assistants:
 *   get:
 *     summary: Get all assistants
 *     description: Get list of all active assistants
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Assistants list retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/teachers:
 *   get:
 *     summary: Get all teachers
 *     description: Get list of all active teachers
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Teachers list retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Get specific user details
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 */

/* ============================================
   USERS MANAGEMENT - POST METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/users:
 *   post:
 *     summary: Create user (Assistant/Teacher)
 *     description: Create new assistant or teacher account
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, phone, password, role, permissions]
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "أحمد محمد"
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [assistant, teacher]
 *                 example: "assistant"
 *               permissions:
 *                 type: string
 *                 enum: [online_management, center_management]
 *                 example: "center_management"
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /api/super-admin/users/find:
 *   post:
 *     summary: Find user by phone
 *     description: Search for user by phone number
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *     responses:
 *       200:
 *         description: User found successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/restore:
 *   post:
 *     summary: Restore deleted user
 *     description: Restore soft-deleted user account
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     responses:
 *       200:
 *         description: User restored successfully
 */

/* ============================================
   USERS MANAGEMENT - PUT METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/users/{userId}:
 *   put:
 *     summary: Update user
 *     description: Update user information
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     requestBody:
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
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/password:
 *   put:
 *     summary: Update user password
 *     description: Update user password (requires old password)
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *     description: Reset user password without old password
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/toggle-active:
 *   put:
 *     summary: Toggle user active status
 *     description: Activate or deactivate user account
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User status toggled successfully
 */

/* ============================================
   USERS MANAGEMENT - DELETE METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/users/{userId}:
 *   delete:
 *     summary: Soft delete user
 *     description: Soft delete user (can be restored)
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 */

/**
 * @swagger
 * /api/super-admin/users/{userId}/permanent:
 *   delete:
 *     summary: Hard delete user
 *     description: Permanently delete user from database
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User permanently deleted
 */

/* ============================================
   PLATFORM SETTINGS - GET METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/settings:
 *   get:
 *     summary: Get platform settings
 *     description: Get all platform settings
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 */

/* ============================================
   PLATFORM SETTINGS - PUT METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/settings:
 *   put:
 *     summary: Update platform settings
 *     description: Update platform settings
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [center_name, default_lock_minutes, academic_year_status, platform_status]
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
 *     description: Toggle platform between active and paused
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Platform status toggled successfully
 */

/**
 * @swagger
 * /api/super-admin/settings/academic-year:
 *   put:
 *     summary: Update academic year status
 *     description: Update academic year status
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [academic_year_status]
 *             properties:
 *               academic_year_status:
 *                 type: string
 *                 enum: [active, paused, ended]
 *     responses:
 *       200:
 *         description: Academic year status updated successfully
 */

/* ============================================
   STUDENTS MANAGEMENT - GET METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students:
 *   get:
 *     summary: Get all students
 *     description: Get all students with filters
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, barcode or phone
 *       - in: query
 *         name: grade_id
 *         schema: { type: integer }
 *         description: Filter by grade
 *       - in: query
 *         name: group_id
 *         schema: { type: integer }
 *         description: Filter by group
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *     responses:
 *       200:
 *         description: Students list retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/deleted:
 *   get:
 *     summary: Get deleted students
 *     description: Get all soft-deleted students
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Deleted students retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/without-password:
 *   get:
 *     summary: Get students without password
 *     description: Get all students who don't have password set
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Students without password retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/search/barcode:
 *   get:
 *     summary: Search student by barcode
 *     description: Find student by barcode
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *     description: Find student by phone number
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *     description: Find students by parent phone number
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *     description: Get all students in specific grade
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *     description: Get all students in specific group
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *     description: Get specific student details
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/profile:
 *   get:
 *     summary: Get student full profile
 *     description: Get student profile with all details
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/stats:
 *   get:
 *     summary: Get student quick stats
 *     description: Get student statistics (attendance, exams, payments)
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student stats retrieved successfully
 */

/* ============================================
   STUDENTS MANAGEMENT - POST METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students:
 *   post:
 *     summary: Create student
 *     description: Create new student
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barcode, full_name, parent_token, grade_id, group_id]
 *             properties:
 *               barcode: { type: string }
 *               full_name: { type: string }
 *               phone: { type: string }
 *               parent_phone: { type: string }
 *               parent_token: { type: string }
 *               grade_id: { type: integer }
 *               group_id: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Student created successfully
 */

/**
 * @swagger
 * /api/super-admin/students/generate-passwords:
 *   post:
 *     summary: Generate passwords for all students
 *     description:" Generate passwords for all students without password (format: barcode@jupiter.com)"
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     responses:
 *       200:
 *         description: Passwords generated successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/restore:
 *   post:
 *     summary: Restore deleted student
 *     description: Restore soft-deleted student
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
   STUDENTS MANAGEMENT - PUT METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students/{studentId}:
 *   put:
 *     summary: Update student
 *     description: Update student information
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
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
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/reset-password:
 *   put:
 *     summary: Reset student password
 *     description: Set new password for student
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
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
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

/* ============================================
   STUDENTS MANAGEMENT - DELETE METHODS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students/{studentId}:
 *   delete:
 *     summary: Soft delete student
 *     description: Soft delete student (can be restored)
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student soft deleted successfully
 */

/**
 * @swagger
 * /api/super-admin/students/{studentId}/permanent:
 *   delete:
 *     summary: Hard delete student
 *     description: Permanently delete student
 *     tags: [Super Admin]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *       - SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student permanently deleted
 */

/* ============================================
   GRADES MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Grades list } }
 *   post:
 *     summary: Create grade
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Grades with groups count } }
 */

/**
 * @swagger
 * /api/super-admin/grades/students-count:
 *   get:
 *     summary: Get grades with students count
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Grades with students count } }
 */

/**
 * @swagger
 * /api/super-admin/grades/stats:
 *   get:
 *     summary: Get all grades stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Grades statistics } }
 */

/**
 * @swagger
 * /api/super-admin/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Grade data } }
 *   put:
 *     summary: Update grade
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Grade updated } }
 *   delete:
 *     summary: Soft delete grade
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Grade statistics } }
 */

/* ============================================
   GROUPS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Groups list } }
 *   post:
 *     summary: Create group
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Groups with grade names } }
 */

/**
 * @swagger
 * /api/super-admin/groups/students-count:
 *   get:
 *     summary: Get groups with students count
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Groups with students count } }
 */

/**
 * @swagger
 * /api/super-admin/groups/stats:
 *   get:
 *     summary: Get all groups stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Groups statistics } }
 */

/**
 * @swagger
 * /api/super-admin/groups/grade/{gradeId}:
 *   get:
 *     summary: Get groups by grade
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Group data } }
 *   put:
 *     summary: Update group
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Group updated } }
 *   delete:
 *     summary: Soft delete group
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Group statistics } }
 */

/* ============================================
   ATTENDANCE MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/attendance:
 *   post:
 *     summary: Create attendance
 *     tags: [Super Admin]
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
 *               is_makeup: { type: integer, enum: [0, 1], default: 0 }
 *               makeup_group_id: { type: integer }
 *               notes: { type: string }
 *     responses: { 201: { description: Attendance created } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/dashboard:
 *   get:
 *     summary: Get attendance dashboard
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Attendance dashboard } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/overall-stats:
 *   get:
 *     summary: Get overall attendance stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Overall attendance statistics } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/consecutive-absences:
 *   get:
 *     summary: Get students with 3+ consecutive absences
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Students with consecutive absences } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade attendance stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Grade attendance statistics } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance by group and date
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Attendance list } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/month/{month}:
 *   get:
 *     summary: Get attendance by group and month
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Attendance list } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/summary/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance summary
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Attendance summary } }
 */

/**
 * @swagger
 * /api/super-admin/attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Attendance record } }
 *   put:
 *     summary: Update attendance
 *     tags: [Super Admin]
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
 *               status: { type: string, enum: [present, absent] }
 *               attendance_time: { type: string }
 *               method: { type: string, enum: [manual, barcode] }
 *               is_makeup: { type: integer, enum: [0, 1] }
 *               makeup_group_id: { type: integer }
 *               notes: { type: string }
 *     responses: { 200: { description: Attendance updated } }
 *   delete:
 *     summary: Delete attendance
 *     tags: [Super Admin]
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
 *     description: Mark all unmarked students as absent for a group
 *     tags: [Super Admin]
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
   PAYMENTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/payments:
 *   get:
 *     summary: Get all payments
 *     description: Get all payments with filters
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subscription_id, student_id, amount]
 *             properties:
 *               subscription_id: { type: integer }
 *               student_id: { type: integer }
 *               amount: { type: number }
 *               payment_date: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses: { 201: { description: Payment created } }
 */

/**
 * @swagger
 * /api/super-admin/payments/collections:
 *   get:
 *     summary: Get monthly collections
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Monthly collections } }
 */

/**
 * @swagger
 * /api/super-admin/payments/unpaid:
 *   get:
 *     summary: Get unpaid students current month
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Unpaid students list } }
 */

/**
 * @swagger
 * /api/super-admin/payments/overall:
 *   get:
 *     summary: Get overall payment stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Overall payment statistics } }
 */

/**
 * @swagger
 * /api/super-admin/payments/students-status:
 *   get:
 *     summary: Get all students payment status
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Students payment status } }
 */

/**
 * @swagger
 * /api/super-admin/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Payment data } }
 *   put:
 *     summary: Update payment
 *     tags: [Super Admin]
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
 *             required: [amount, payment_date]
 *             properties:
 *               amount: { type: number }
 *               payment_date: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses: { 200: { description: Payment updated } }
 *   delete:
 *     summary: Delete payment
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Payment deleted } }
 */

/* ============================================
   SUBSCRIPTIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/subscriptions:
 *   post:
 *     summary: Create subscription
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id, month, required_amount]
 *             properties:
 *               student_id: { type: integer }
 *               month: { type: string, example: "2026-08" }
 *               required_amount: { type: number }
 *     responses: { 201: { description: Subscription created } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/overall:
 *   get:
 *     summary: Get overall subscription stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Overall subscription statistics } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/without-current:
 *   get:
 *     summary: Get students without current subscription
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Students without subscription } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/month/{month}:
 *   get:
 *     summary: Get subscriptions by month
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: string, example: "2026-08" }
 *     responses: { 200: { description: Subscriptions list } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/student/{studentId}:
 *   get:
 *     summary: Get student subscriptions
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Student subscriptions } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/{id}/status:
 *   put:
 *     summary: Update subscription status
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Subscription status updated } }
 */

/**
 * @swagger
 * /api/super-admin/subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Subscription deleted } }
 */

/* ============================================
   EXAMS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/exams:
 *   get:
 *     summary: Get all paper exams
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Exams list } }
 *   post:
 *     summary: Create paper exam
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Exam data } }
 *   put:
 *     summary: Update exam
 *     tags: [Super Admin]
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
 *     responses: { 200: { description: Exam updated } }
 *   delete:
 *     summary: Soft delete exam
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Exam deleted } }
 */

/* ============================================
   ONLINE EXAMS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/online-exams:
 *   get:
 *     summary: Get all online exams
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Online exams list } }
 *   post:
 *     summary: Create online exam
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Online exam data } }
 *   put:
 *     summary: Update online exam
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
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
 *     responses: { 200: { description: Online exam updated } }
 *   delete:
 *     summary: Soft delete online exam
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Online exam deleted } }
 */

/* ============================================
   ASSIGNMENTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Assignments list } }
 *   post:
 *     summary: Create assignment
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Assignment data } }
 *   put:
 *     summary: Update assignment
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
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
 *               is_closed: { type: integer, enum: [0, 1] }
 *     responses: { 200: { description: Assignment updated } }
 *   delete:
 *     summary: Soft delete assignment
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Assignment deleted } }
 */

/* ============================================
   VIDEOS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Videos list } }
 *   post:
 *     summary: Create video
 *     tags: [Super Admin]
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
 *     responses: { 201: { description: Video created } }
 */

/**
 * @swagger
 * /api/super-admin/videos/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Video data } }
 *   put:
 *     summary: Update video
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *               video_url: { type: string }
 *     responses: { 200: { description: Video updated } }
 *   delete:
 *     summary: Delete video
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Video deleted } }
 */

/* ============================================
   PLAYLISTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/playlists:
 *   get:
 *     summary: Get all playlists
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Playlists list } }
 *   post:
 *     summary: Create playlist
 *     tags: [Super Admin]
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
 *     responses: { 201: { description: Playlist created } }
 */

/**
 * @swagger
 * /api/super-admin/playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Playlist data } }
 *   put:
 *     summary: Update playlist
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               grade_id: { type: integer }
 *     responses: { 200: { description: Playlist updated } }
 *   delete:
 *     summary: Delete playlist
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Playlist deleted } }
 */

/* ============================================
   WHATSAPP TEMPLATES
   ============================================ */

/**
 * @swagger
 * /api/super-admin/whatsapp-messages:
 *   get:
 *     summary: Get all whatsapp templates
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses: { 200: { description: Templates list } }
 *   post:
 *     summary: Create whatsapp template
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Template data } }
 *   put:
 *     summary: Update whatsapp template
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template: { type: string }
 *               sent_to: { type: string, enum: [students, parents, both] }
 *               delay: { type: integer }
 *     responses: { 200: { description: Template updated } }
 */

/**
 * @swagger
 * /api/super-admin/whatsapp-messages/{templateId}/toggle:
 *   put:
 *     summary: Toggle whatsapp template active status
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema: { type: integer }
 *     responses: { 200: { description: Template status toggled } }
 */
/* ============================================
   BULK UPLOAD ENDPOINTS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/students/template:
 *   get:
 *     summary: Download students Excel template
 *     tags: [Super Admin]
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
 *     description: Upload Excel file to add multiple students
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/**
 * @swagger
 * /api/super-admin/grades/template:
 *   get:
 *     summary: Download grades Excel template
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/**
 * @swagger
 * /api/super-admin/groups/template:
 *   get:
 *     summary: Download groups Excel template
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/**
 * @swagger
 * /api/super-admin/exam-results/template:
 *   get:
 *     summary: Download exam results Excel template
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: File processed successfully
 */ /* ============================================
   ACTIVITY LOG
   ============================================ */

/**
 * @swagger
 * /api/super-admin/activity-log:
 *   get:
 *     summary: Get activity log
 *     description: Get all activity logs with filters
 *     tags: [Super Admin]
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
 */ /* ============================================
   ATTENDANCE SESSIONS
   ============================================ */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/start:
 *   post:
 *     summary: Start attendance session
 *     tags: [Super Admin]
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
 *               lock_at: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Session started
 */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/active/{groupId}:
 *   get:
 *     summary: Get active session
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Active session retrieved
 */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/{id}/toggle-makeup:
 *   put:
 *     summary: Toggle makeup mode
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Makeup mode toggled
 */

/**
 * @swagger
 * /api/super-admin/attendance/scan-barcode:
 *   post:
 *     summary: Scan barcode for attendance
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: Attendance recorded
 */

/**
 * @swagger
 * /api/super-admin/attendance/sessions/lock:
 *   post:
 *     summary: Lock session
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: Session locked
 */ /* ============================================
   QUESTIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/questions:
 *   post:
 *     summary: Create question
 *     tags: [Super Admin]
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
 * /api/super-admin/questions/exam/{examId}:
 *   get:
 *     summary: Get questions by exam
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Questions retrieved
 */

/**
 * @swagger
 * /api/super-admin/questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Question updated
 *   delete:
 *     summary: Delete question
 *     tags: [Super Admin]
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
 * /api/super-admin/questions/{questionId}/download:
 *   get:
 *     summary: Download question file
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File downloaded
 */ /* ============================================
   OPTIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/options:
 *   post:
 *     summary: Create option
 *     tags: [Super Admin]
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
 * /api/super-admin/options/question/{questionId}:
 *   get:
 *     summary: Get options by question
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Options retrieved
 */

/**
 * @swagger
 * /api/super-admin/options/{optionId}:
 *   get:
 *     summary: Get option by ID
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Option updated
 *   delete:
 *     summary: Delete option
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Option deleted
 */ /* ============================================
   EXAM RESULTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/exam-results:
 *   post:
 *     summary: Create exam result
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 * /api/super-admin/exam-results/upsert-batch/{examId}:
 *   post:
 *     summary: Upsert batch exam results
 *     tags: [Super Admin]
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
 *                   required: [barcode, degree]
 *                   properties:
 *                     barcode: { type: string }
 *                     degree: { type: number }
 *                     notes: { type: string }
 *     responses:
 *       200:
 *         description: Batch processed
 */

/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}:
 *   get:
 *     summary: Get exam results
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Results retrieved
 */

/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}/stats:
 *   get:
 *     summary: Get exam result stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam results stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam results stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/exam-results/{id}:
 *   put:
 *     summary: Update exam result
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Result updated
 *   delete:
 *     summary: Delete exam result
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Result deleted
 */ /* ============================================
   STUDENT EXAMS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}:
 *   get:
 *     summary: Get student exams by exam
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student exams retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}/stats:
 *   get:
 *     summary: Get exam attempt stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-exams/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam attempts stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-exams/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam attempts stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */ /* ============================================
   STUDENT ANSWERS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/stats:
 *   get:
 *     summary: Get question answer stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/options:
 *   get:
 *     summary: Get most selected options
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Options retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-answers/essay/pending:
 *   get:
 *     summary: Get pending essay answers
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     responses:
 *       200:
 *         description: Pending answers retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-answers/essay/exam/{examId}:
 *   get:
 *     summary: Get essay answers by exam
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Essay answers retrieved
 */

/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/grade:
 *   put:
 *     summary: Grade essay answer
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: Answer graded
 */ /* ============================================
   ASSIGNMENT SUBMISSIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Get submissions by assignment
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Submissions retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/student/{studentId}:
 *   get:
 *     summary: Get student submission
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Submission retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/submitted-students:
 *   get:
 *     summary: Get submitted students
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Students retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/not-submitted-students:
 *   get:
 *     summary: Get not submitted students
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Students retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/assignment/{assignmentId}:
 *   get:
 *     summary: Get assignment submission stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/grade/{gradeId}:
 *   get:
 *     summary: Get grade assignment submissions stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/group/{groupId}:
 *   get:
 *     summary: Get group assignment submissions stats
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/super-admin/assignment-submissions/{submissionId}/grade:
 *   put:
 *     summary: Grade assignment submission
 *     tags: [Super Admin]
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
 *     responses:
 *       200:
 *         description: Submission graded
 */ /* ============================================
   PLAYLIST VIDEOS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/super-admin/playlist-videos/playlist/{playlistId}:
 *   get:
 *     summary: Get playlist videos
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
 *     security: [{ ApiAuth: [], ClientToken: [], SuperAdminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Video removed
 */ /* ============================================
   DOWNLOAD & PREVIEW
   ============================================ */

/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/preview:
 *   get:
 *     summary: Preview assignment file
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
 *     tags: [Super Admin]
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
