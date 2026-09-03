/**
 * @swagger
 * tags:
 *   - name: Assistant - Profile & Dashboard
 *     description: Assistant profile, dashboard, and activity log endpoints
 *   - name: Assistant - Students
 *     description: Student management endpoints (CRUD, search, profile, stats)
 *   - name: Assistant - Grades
 *     description: Grade/Class management endpoints
 *   - name: Assistant - Download & Preview
 *     description: File download and preview endpoints
 *   - name: Assistant - Groups
 *     description: Group management endpoints
 *   - name: Assistant - Attendance
 *     description: Attendance and session management endpoints
 *   - name: Assistant - Payments
 *     description: Payment management and statistics endpoints
 *   - name: Assistant - Subscriptions
 *     description: Monthly subscription management endpoints
 *   - name: Assistant - Paper Exams
 *     description: Traditional paper exam management endpoints
 *   - name: Assistant - Exam Results
 *     description: Paper exam results management endpoints
 *   - name: Assistant - Online Exams
 *     description: Online exam management endpoints
 *   - name: Assistant - Questions
 *     description: Exam question management endpoints
 *   - name: Assistant - Options
 *     description: Question options management endpoints
 *   - name: Assistant - Student Exams
 *     description: Student online exam attempts endpoints
 *   - name: Assistant - Student Answers
 *     description: Student answers and grading endpoints
 *   - name: Assistant - Assignments
 *     description: Assignment management endpoints
 *   - name: Assistant - Assignment Submissions
 *     description: Assignment submission and grading endpoints
 *   - name: Assistant - Videos
 *     description: Video management endpoints
 *   - name: Assistant - Playlists
 *     description: Playlist management endpoints
 *   - name: Assistant - WhatsApp Templates
 *     description: WhatsApp message template endpoints
 *   - name: Assistant - Bulk Upload
 *     description: Excel bulk upload endpoints
 *   - name: Assistant - WhatsApp Messages
 *     description: WhatsApp message sending and queue management
 */

/* ============================================
   PROFILE & DASHBOARD & ACTIVITY LOG
   ============================================ */

/**
 * @swagger
 * /api/assistant/profile:
 *   get:
 *     summary: Get assistant profile
 *     description: Get current assistant profile information
 *     tags: [Assistant - Profile & Dashboard]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/dashboard:
 *   get:
 *     summary: Get assistant dashboard
 *     description: Get dashboard stats based on assistant type (online/center)
 *     tags: [Assistant - Profile & Dashboard]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/activity-log:
 *   get:
 *     summary: Get activity log
 *     description: Get activity logs based on assistant permissions
 *     tags: [Assistant - Profile & Dashboard]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: entity_type
 *         schema:
 *           type: string
 *         description: Filter by entity type
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/profile-image:
 *   put:
 *     summary: Update profile image
 *     description: Upload new profile image
 *     tags: [Assistant - Profile & Dashboard]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *   delete:
 *     summary: Delete profile image
 *     tags: [Assistant - Profile & Dashboard]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Profile image deleted successfully
 */

/**
 * @swagger
 * /api/assistant/password:
 *   put:
 *     summary: Update password
 *     tags: [Assistant - Profile & Dashboard]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - password
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */

/* ============================================
   WHATSAPP MESSAGES
   ============================================ */

/**
 * @swagger
 * /api/assistant/whatsapp/send/welcome/{studentId}:
 *   post:
 *     summary: Send welcome message to student
 *     description: Send welcome WhatsApp message to student's parent
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *       - in: query
 *         name: instant
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *         description: Send immediately or add to queue
 *     responses:
 *       201:
 *         description: Welcome message sent or added to queue
 */

/**
 * @swagger
 * /api/assistant/whatsapp/send/absence/{studentId}:
 *   post:
 *     summary: Send absence message to student
 *     description: Send absence notification WhatsApp message to student's parent
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Absence date (default: today)"
 *       - in: query
 *         name: instant
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *         description: Send immediately or add to queue
 *     responses:
 *       201:
 *         description: Absence message sent or added to queue
 */
/**
 * @swagger
 * /api/assistant/whatsapp/send/payment/{paymentId}:
 *   post:
 *     summary: Send payment confirmation message
 *     description: Send payment confirmation WhatsApp message to student's parent
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *       - in: query
 *         name: instant
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *         description: Send immediately or add to queue
 *     responses:
 *       201:
 *         description: Payment message sent or added to queue
 */

/**
 * @swagger
 * /api/assistant/whatsapp/send/exam/{resultId}:
 *   post:
 *     summary: Send exam result message
 *     description: Send exam result WhatsApp message to student's parent
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam result ID
 *       - in: query
 *         name: instant
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *         description: Send immediately or add to queue
 *     responses:
 *       201:
 *         description: Exam result message sent or added to queue
 */

/**
 * @swagger
 * /api/assistant/whatsapp/queue/send:
 *   post:
 *     summary: Send all pending messages
 *     description: Process and send all pending WhatsApp messages in queue
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delaySeconds:
 *                 type: integer
 *                 default: 5
 *                 description: Delay between messages in seconds
 *               limit:
 *                 type: integer
 *                 default: 100
 *                 description: Max number of messages to send
 *               statuses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [pending]
 *                 default: ["pending"]
 *     responses:
 *       200:
 *         description: Queue processed successfully
 */

/**
 * @swagger
 * /api/assistant/whatsapp/queue/stats:
 *   get:
 *     summary: Get queue statistics
 *     description: Get statistics about WhatsApp messages in queue
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Queue statistics retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/whatsapp/queue/reset-failed:
 *   post:
 *     summary: Reset failed messages
 *     description: Reset failed messages to pending status for retry
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Failed messages reset successfully
 */

/**
 * @swagger
 * /api/assistant/whatsapp/messages:
 *   get:
 *     summary: Get all messages
 *     description: Get paginated list of WhatsApp messages with filters
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, sent, failed]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [welcome, absence, payment, exam]
 *         description: Filter by message type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/whatsapp/messages/{messageId}:
 *   get:
 *     summary: Get message by ID
 *     description: Get specific WhatsApp message details
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *   delete:
 *     summary: Delete message
 *     description: Delete specific WhatsApp message
 *     tags: [Assistant - WhatsApp Messages]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */

/* ============================================
   BULK UPLOAD ENDPOINTS
   ============================================ */

/**
 * @swagger
 * /api/assistant/students/template:
 *   get:
 *     summary: Download students Excel template
 *     description: Download Excel template for bulk student upload
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
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
 * /api/assistant/students/bulk-upload:
 *   post:
 *     summary: Bulk upload students
 *     description: Upload Excel file to add multiple students at once
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with student data columns
 *     responses:
 *       200:
 *         description: File processed successfully
 */

/**
 * @swagger
 * /api/assistant/grades/template:
 *   get:
 *     summary: Download grades Excel template
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 */

/**
 * @swagger
 * /api/assistant/grades/bulk-upload:
 *   post:
 *     summary: Bulk upload grades
 *     description: Upload Excel file to add multiple grades
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "Excel file with columns - name, monthly_price"
 *     responses:
 *       200:
 *         description: File processed successfully
 */
/**
 * @swagger
 * /api/assistant/groups/template:
 *   get:
 *     summary: Download groups Excel template
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 */

/**
 * @swagger
 * /api/assistant/groups/bulk-upload:
 *   post:
 *     summary: Bulk upload groups
 *     description: Upload Excel file to add multiple groups
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "Excel file with columns - name, grade_name, days, start_time, end_time, room"
 *     responses:
 *       200:
 *         description: File processed successfully
 */
/**
 * @swagger
 * /api/assistant/exam-results/template:
 *   get:
 *     summary: Download exam results Excel template
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Template downloaded successfully
 */

/**
 * @swagger
 * /api/assistant/exam-results/bulk-upload/{examId}:
 *   post:
 *     summary: Bulk upload exam results
 *     description: Upload Excel file to add exam results
 *     tags: [Assistant - Bulk Upload]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "Excel file with columns - barcode, degree, notes"
 *     responses:
 *       200:
 *         description: File processed successfully
 */
/* ============================================
   GRADES MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Grades retrieved successfully
 *   post:
 *     summary: Create grade
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - monthlyPrice
 *             properties:
 *               name:
 *                 type: string
 *               monthlyPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Grade created successfully
 */

/**
 * @swagger
 * /api/assistant/grades/groups-count:
 *   get:
 *     summary: Get grades with groups count
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/grades/students-count:
 *   get:
 *     summary: Get grades with students count
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/grades/stats:
 *   get:
 *     summary: Get all grades stats
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/grades/find:
 *   post:
 *     summary: Find grade by name
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grade found
 */

/**
 * @swagger
 * /api/assistant/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grade retrieved
 *   put:
 *     summary: Update grade
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               monthlyPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Grade updated
 *   delete:
 *     summary: Soft delete grade
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grade deleted
 */

/**
 * @swagger
 * /api/assistant/grades/{id}/stats:
 *   get:
 *     summary: Get grade stats
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/grades/{id}/permanent:
 *   delete:
 *     summary: Hard delete grade
 *     tags: [Assistant - Grades]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grade permanently deleted
 */

/* ============================================
   GROUPS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Groups retrieved
 *   post:
 *     summary: Create group
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - grade_id
 *               - days
 *               - start_time
 *               - end_time
 *             properties:
 *               name:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               days:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               room:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created
 */

/**
 * @swagger
 * /api/assistant/groups/with-grade-name:
 *   get:
 *     summary: Get groups with grade name
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/groups/students-count:
 *   get:
 *     summary: Get groups with students count
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/groups/stats:
 *   get:
 *     summary: Get all groups stats
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/groups/find:
 *   post:
 *     summary: Find group by name and grade
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - grade_id
 *             properties:
 *               name:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Group found
 */

/**
 * @swagger
 * /api/assistant/groups/grade/{gradeId}:
 *   get:
 *     summary: Get groups by grade
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Groups retrieved
 */

/**
 * @swagger
 * /api/assistant/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group retrieved
 *   put:
 *     summary: Update group
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               days:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               room:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated
 *   delete:
 *     summary: Soft delete group
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group deleted
 */

/**
 * @swagger
 * /api/assistant/groups/{id}/stats:
 *   get:
 *     summary: Get group stats
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/groups/{id}/full-stats:
 *   get:
 *     summary: Get group full stats
 *     description: Comprehensive statistics including attendance, payments, exams
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/groups/{id}/permanent:
 *   delete:
 *     summary: Hard delete group
 *     tags: [Assistant - Groups]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group permanently deleted
 */

/* ============================================
   STUDENTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/students:
 *   get:
 *     summary: Get all students with filters
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: grade_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Students retrieved
 *   post:
 *     summary: Create student
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *               - full_name
 *               - grade_id
 *               - group_id
 *             properties:
 *               barcode:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               parent_phone:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created
 */

/**
 * @swagger
 * /api/assistant/students/deleted:
 *   get:
 *     summary: Get deleted students
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/search/barcode:
 *   get:
 *     summary: Search student by barcode
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 */

/**
 * @swagger
 * /api/assistant/students/search/phone:
 *   get:
 *     summary: Search student by phone
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 */

/**
 * @swagger
 * /api/assistant/students/search/parent-phone:
 *   get:
 *     summary: Search students by parent phone
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: parent_phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Students found
 */

/**
 * @swagger
 * /api/assistant/students/grade/{gradeId}:
 *   get:
 *     summary: Get students by grade
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Students retrieved
 */

/**
 * @swagger
 * /api/assistant/students/group/{groupId}:
 *   get:
 *     summary: Get students by group
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Students retrieved
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student retrieved
 *   put:
 *     summary: Update student
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               parent_phone:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated
 *   delete:
 *     summary: Soft delete student
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/permanent:
 *   delete:
 *     summary: Hard delete student
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student permanently deleted
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/restore:
 *   post:
 *     summary: Restore deleted student
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student restored
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/profile:
 *   get:
 *     summary: Get student full profile
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile retrieved
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/stats:
 *   get:
 *     summary: Get student quick stats
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stats retrieved
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/attendance:
 *   get:
 *     summary: Get student attendance history
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/attendance/monthly:
 *   get:
 *     summary: Get student monthly attendance stats
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/attendance/total:
 *   get:
 *     summary: Get student total attendance for month
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-08"
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/attendance/consecutive-absences:
 *   get:
 *     summary: Get student consecutive absences
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/payments:
 *   get:
 *     summary: Get student payment history
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/payments/balance:
 *   get:
 *     summary: Get student remaining balance
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/payments/current-subscription:
 *   get:
 *     summary: Get student current subscription
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/exams/paper:
 *   get:
 *     summary: Get student paper exams
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/exams/paper/{examId}:
 *   get:
 *     summary: Get student paper exam details
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/exams/results:
 *   get:
 *     summary: Get student exam results
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/exams/online/history:
 *   get:
 *     summary: Get student online exams history
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/exams/online/{attemptId}:
 *   get:
 *     summary: Get student online exam details
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/assignments:
 *   get:
 *     summary: Get student assignments
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/assignments/{assignmentId}:
 *   get:
 *     summary: Get student assignment details
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/submissions:
 *   get:
 *     summary: Get student submissions
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/submissions/{submissionId}:
 *   get:
 *     summary: Get student submission details
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/students/{studentId}/playlists:
 *   get:
 *     summary: Get student playlists
 *     tags: [Assistant - Students]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/* ============================================
   ATTENDANCE MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/attendance:
 *   post:
 *     summary: Create attendance record
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - group_id
 *               - grade_id
 *               - attendance_date
 *               - status
 *             properties:
 *               student_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               grade_id:
 *                 type: integer
 *               attendance_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [present, absent]
 *               attendance_time:
 *                 type: string
 *               method:
 *                 type: string
 *                 enum: [manual, barcode]
 *               is_makeup:
 *                 type: integer
 *                 enum: [0, 1]
 *               makeup_group_id:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attendance created
 */

/**
 * @swagger
 * /api/assistant/attendance/mark-rest-absent:
 *   post:
 *     summary: Mark rest as absent
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - date
 *             properties:
 *               groupId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Students marked as absent
 */

/**
 * @swagger
 * /api/assistant/attendance/dashboard:
 *   get:
 *     summary: Get attendance dashboard
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/overall-stats:
 *   get:
 *     summary: Get overall attendance stats
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/consecutive-absences:
 *   get:
 *     summary: Get students with 3+ consecutive absences
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade attendance stats
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance by group and date
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/group/{groupId}/month/{month}:
 *   get:
 *     summary: Get attendance by group and month
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-08"
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/summary/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance summary
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     description: Get specific attendance record details
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attendance record ID
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/sessions/start:
 *   post:
 *     summary: Start attendance session
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - grade_id
 *             properties:
 *               group_id:
 *                 type: integer
 *               grade_id:
 *                 type: integer
 *               lock_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Session started
 */

/**
 * @swagger
 * /api/assistant/attendance/sessions/active/{groupId}:
 *   get:
 *     summary: Get active session
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/attendance/sessions/{id}/toggle-makeup:
 *   put:
 *     summary: Toggle makeup mode
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Makeup mode toggled
 */

/**
 * @swagger
 * /api/assistant/attendance/scan-barcode:
 *   post:
 *     summary: Scan barcode for attendance
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *               - group_id
 *               - grade_id
 *               - session_id
 *             properties:
 *               barcode:
 *                 type: string
 *               group_id:
 *                 type: integer
 *               grade_id:
 *                 type: integer
 *               session_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Attendance recorded
 */

/**
 * @swagger
 * /api/assistant/attendance/sessions/lock:
 *   post:
 *     summary: Lock session
 *     tags: [Assistant - Attendance]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - groupId
 *             properties:
 *               id:
 *                 type: integer
 *               groupId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Session locked
 */

/* ============================================
   PAYMENTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: grade_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create payment
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription_id
 *               - student_id
 *             properties:
 *               subscription_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created
 */

/**
 * @swagger
 * /api/assistant/payments/collections:
 *   get:
 *     summary: Get monthly collections
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/unpaid:
 *   get:
 *     summary: Get unpaid students current month
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/overall:
 *   get:
 *     summary: Get overall payment stats
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/students-status:
 *   get:
 *     summary: Get all students payment status
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade payment stats
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/group/{groupId}/stats:
 *   get:
 *     summary: Get group payment stats
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/grade/{gradeId}/month/{month}:
 *   get:
 *     summary: Get payments by grade and month
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-08"
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/group/{groupId}/month/{month}:
 *   get:
 *     summary: Get payments by group and month
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-08"
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     description: Get specific payment details
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *   put:
 *     summary: Update payment
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated
 *   delete:
 *     summary: Delete payment
 *     tags: [Assistant - Payments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment deleted
 */

/* ============================================
   SUBSCRIPTIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/subscriptions:
 *   post:
 *     summary: Create subscription
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - month
 *             properties:
 *               student_id:
 *                 type: integer
 *               month:
 *                 type: string
 *                 example: "2026-08"
 *     responses:
 *       201:
 *         description: Subscription created
 */

/**
 * @swagger
 * /api/assistant/subscriptions/overall:
 *   get:
 *     summary: Get overall subscription stats
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/subscriptions/without-current:
 *   get:
 *     summary: Get students without current subscription
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/subscriptions/month/{month}:
 *   get:
 *     summary: Get subscriptions by month
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-08"
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/subscriptions/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade subscription stats
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/subscriptions/group/{groupId}/stats:
 *   get:
 *     summary: Get group subscription stats
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/subscriptions/student/{studentId}:
 *   get:
 *     summary: Get student subscriptions
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/subscriptions/{id}/status:
 *   put:
 *     summary: Update subscription status
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [paid, unpaid]
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/assistant/subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription
 *     tags: [Assistant - Subscriptions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subscription deleted
 */

/* ============================================
   PAPER EXAMS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/exams:
 *   get:
 *     summary: Get all paper exams
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create paper exam
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - grade_id
 *               - total_degree
 *               - exam_date
 *             properties:
 *               title:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               total_degree:
 *                 type: number
 *               exam_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exam created
 */

/**
 * @swagger
 * /api/assistant/exams/grade/{gradeId}:
 *   get:
 *     summary: Get exams by grade
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/exams/group/{groupId}:
 *   get:
 *     summary: Get exams by group
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   put:
 *     summary: Update exam
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exam updated
 *   delete:
 *     summary: Soft delete exam
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exam deleted
 */

/**
 * @swagger
 * /api/assistant/exams/{id}/stats:
 *   get:
 *     summary: Get exam stats
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/exams/{id}/permanent:
 *   delete:
 *     summary: Hard delete exam
 *     tags: [Assistant - Paper Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exam permanently deleted
 */

/* ============================================
   EXAM RESULTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/exam-results:
 *   post:
 *     summary: Create exam result
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *               - student_id
 *               - degree
 *             properties:
 *               exam_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               degree:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Result created
 */

/**
 * @swagger
 * /api/assistant/exam-results/upsert:
 *   post:
 *     summary: Upsert exam result
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *               - student_id
 *               - degree
 *             properties:
 *               exam_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               degree:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Result upserted
 */

/**
 * @swagger
 * /api/assistant/exam-results/upsert-batch/{examId}:
 *   post:
 *     summary: Upsert batch exam results
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - records
 *             properties:
 *               records:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - barcode
 *                     - degree
 *                   properties:
 *                     barcode:
 *                       type: string
 *                     degree:
 *                       type: number
 *                     notes:
 *                       type: string
 *     responses:
 *       200:
 *         description: Batch processed
 */

/**
 * @swagger
 * /api/assistant/exam-results/exam/{examId}:
 *   get:
 *     summary: Get exam results
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/exam-results/exam/{examId}/stats:
 *   get:
 *     summary: Get exam result stats
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/exam-results/{id}:
 *   put:
 *     summary: Update exam result
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Result updated
 *   delete:
 *     summary: Delete exam result
 *     tags: [Assistant - Exam Results]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Result deleted
 */

/* ============================================
   ONLINE EXAMS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/online-exams:
 *   get:
 *     summary: Get all online exams
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create online exam
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - grade_id
 *               - duration_minutes
 *               - start_at
 *               - end_at
 *               - full_mark
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               duration_minutes:
 *                 type: integer
 *               start_at:
 *                 type: string
 *                 format: date-time
 *               end_at:
 *                 type: string
 *                 format: date-time
 *               full_mark:
 *                 type: number
 *               randomize_questions:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       201:
 *         description: Exam created
 */

/**
 * @swagger
 * /api/assistant/online-exams/available:
 *   get:
 *     summary: Get available online exams
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/online-exams/expired:
 *   get:
 *     summary: Get expired online exams
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/online-exams/grade/{gradeId}:
 *   get:
 *     summary: Get online exams by grade
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/online-exams/group/{groupId}:
 *   get:
 *     summary: Get online exams by group
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/online-exams/stats/{examId}:
 *   get:
 *     summary: Get online exam stats
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/online-exams/stats/grade/{gradeId}:
 *   get:
 *     summary: Get grade online exam stats
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/online-exams/{examId}:
 *   get:
 *     summary: Get online exam by ID
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   put:
 *     summary: Update online exam
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exam updated
 *   delete:
 *     summary: Soft delete online exam
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exam deleted
 */

/**
 * @swagger
 * /api/assistant/online-exams/{examId}/permanent:
 *   delete:
 *     summary: Hard delete online exam
 *     tags: [Assistant - Online Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exam permanently deleted
 */

/* ============================================
   QUESTIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/questions:
 *   post:
 *     summary: Create question
 *     tags: [Assistant - Questions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *               - question_text
 *               - type
 *               - order
 *             properties:
 *               exam_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [mcq, true_false, essay]
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Question created
 */

/**
 * @swagger
 * /api/assistant/questions/exam/{examId}:
 *   get:
 *     summary: Get questions by exam
 *     tags: [Assistant - Questions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     description: Get specific question details
 *     tags: [Assistant - Questions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *   put:
 *     summary: Update question
 *     tags: [Assistant - Questions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question updated
 *   delete:
 *     summary: Delete question
 *     tags: [Assistant - Questions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted
 */

/**
 * @swagger
 * /api/assistant/questions/{questionId}/download:
 *   get:
 *     summary: Download question file
 *     tags: [Assistant - Questions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File downloaded
 */

/* ============================================
   OPTIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/options:
 *   post:
 *     summary: Create option
 *     tags: [Assistant - Options]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *               - option_text
 *               - is_correct
 *               - order
 *             properties:
 *               question_id:
 *                 type: integer
 *               option_text:
 *                 type: string
 *               is_correct:
 *                 type: integer
 *                 enum: [0, 1]
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Option created
 */

/**
 * @swagger
 * /api/assistant/options/question/{questionId}:
 *   get:
 *     summary: Get options by question
 *     tags: [Assistant - Options]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/options/{optionId}:
 *   get:
 *     summary: Get option by ID
 *     description: Get specific option details
 *     tags: [Assistant - Options]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Option ID
 *     responses:
 *       200:
 *         description: Option retrieved successfully
 *   put:
 *     summary: Update option
 *     tags: [Assistant - Options]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Option updated
 *   delete:
 *     summary: Delete option
 *     tags: [Assistant - Options]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Option deleted
 */

/* ============================================
   STUDENT EXAMS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/student-exams/exam/{examId}:
 *   get:
 *     summary: Get student exams by exam
 *     tags: [Assistant - Student Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-exams/exam/{examId}/stats:
 *   get:
 *     summary: Get exam attempt stats
 *     tags: [Assistant - Student Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-exams/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam attempts stats
 *     tags: [Assistant - Student Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-exams/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam attempts stats
 *     tags: [Assistant - Student Exams]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/* ============================================
   STUDENT ANSWERS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/student-answers/question/{questionId}/stats:
 *   get:
 *     summary: Get question answer stats
 *     tags: [Assistant - Student Answers]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-answers/question/{questionId}/options:
 *   get:
 *     summary: Get most selected options
 *     tags: [Assistant - Student Answers]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-answers/essay/pending:
 *   get:
 *     summary: Get pending essay answers
 *     tags: [Assistant - Student Answers]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-answers/essay/exam/{examId}:
 *   get:
 *     summary: Get essay answers by exam
 *     tags: [Assistant - Student Answers]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/student-answers/{answerId}/grade:
 *   put:
 *     summary: Grade essay answer
 *     tags: [Assistant - Student Answers]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_correct
 *             properties:
 *               is_correct:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: Answer graded
 */

/* ============================================
   ASSIGNMENTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create assignment
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - grade_id
 *               - full_mark
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               full_mark:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Assignment created
 */

/**
 * @swagger
 * /api/assistant/assignments/grade/{gradeId}:
 *   get:
 *     summary: Get assignments by grade
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignments/group/{groupId}:
 *   get:
 *     summary: Get assignments by group
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignments/{assignmentId}:
 *   get:
 *     summary: Get assignment by ID
 *     description: Get specific assignment details
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment retrieved successfully
 *   put:
 *     summary: Update assignment
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment updated
 *   delete:
 *     summary: Soft delete assignment
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment deleted
 */

/**
 * @swagger
 * /api/assistant/assignments/{assignmentId}/download:
 *   get:
 *     summary: Download assignment file
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File downloaded
 */

/**
 * @swagger
 * /api/assistant/assignments/{assignmentId}/permanent:
 *   delete:
 *     summary: Hard delete assignment
 *     tags: [Assistant - Assignments]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment permanently deleted
 */

/* ============================================
   ASSIGNMENT SUBMISSIONS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/assignment-submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Get submissions by assignment
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/assignment/{assignmentId}/student/{studentId}:
 *   get:
 *     summary: Get student submission
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/assignment/{assignmentId}/submitted-students:
 *   get:
 *     summary: Get submitted students
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/assignment/{assignmentId}/not-submitted-students:
 *   get:
 *     summary: Get not submitted students
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/stats/assignment/{assignmentId}:
 *   get:
 *     summary: Get assignment submission stats
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/stats/grade/{gradeId}:
 *   get:
 *     summary: Get grade assignment submissions stats
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/stats/group/{groupId}:
 *   get:
 *     summary: Get group assignment submissions stats
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/assignment-submissions/{submissionId}/grade:
 *   put:
 *     summary: Grade assignment submission
 *     tags: [Assistant - Assignment Submissions]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission graded
 */

/* ============================================
   VIDEOS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create video
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - grade_id
 *               - video_url
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               video_url:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Video created
 */

/**
 * @swagger
 * /api/assistant/videos/grade/{gradeId}:
 *   get:
 *     summary: Get videos by grade
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/videos/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     description: Get specific video details
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video retrieved successfully
 *   put:
 *     summary: Update video
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video updated
 *   delete:
 *     summary: Delete video
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video deleted
 */

/**
 * @swagger
 * /api/assistant/videos/{videoId}/download:
 *   get:
 *     summary: Download video file
 *     tags: [Assistant - Videos]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File downloaded
 */

/* ============================================
   PLAYLISTS MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/playlists:
 *   get:
 *     summary: Get all playlists
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create playlist
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - grade_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               grade_id:
 *                 type: integer
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Playlist created
 */

/**
 * @swagger
 * /api/assistant/playlists/grade/{gradeId}:
 *   get:
 *     summary: Get playlists by grade
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     description: Get specific playlist details
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist retrieved successfully
 *   put:
 *     summary: Update playlist
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist updated
 *   delete:
 *     summary: Delete playlist
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist deleted
 */

/**
 * @swagger
 * /api/assistant/playlist-videos/playlist/{playlistId}:
 *   get:
 *     summary: Get playlist videos
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/assistant/playlist-videos:
 *   post:
 *     summary: Add video to playlist
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlist_id
 *               - video_id
 *             properties:
 *               playlist_id:
 *                 type: integer
 *               video_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Video added
 */

/**
 * @swagger
 * /api/assistant/playlist-videos/{id}:
 *   delete:
 *     summary: Remove video from playlist
 *     tags: [Assistant - Playlists]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video removed
 */

/* ============================================
   WHATSAPP TEMPLATES MANAGEMENT
   ============================================ */

/**
 * @swagger
 * /api/assistant/whatsapp-messages:
 *   get:
 *     summary: Get all whatsapp templates
 *     tags: [Assistant - WhatsApp Templates]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *   post:
 *     summary: Create whatsapp template
 *     tags: [Assistant - WhatsApp Templates]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - template
 *               - sent_to
 *             properties:
 *               template:
 *                 type: string
 *               sent_to:
 *                 type: string
 *                 enum: [students, parents, both]
 *               delay:
 *                 type: integer
 *                 default: 60
 *     responses:
 *       201:
 *         description: Template created
 */

/**
 * @swagger
 * /api/assistant/whatsapp-messages/{templateId}:
 *   get:
 *     summary: Get template by ID
 *     description: Get specific template details
 *     tags: [Assistant - WhatsApp Templates]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *   put:
 *     summary: Update template
 *     tags: [Assistant - WhatsApp Templates]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template updated
 */

/**
 * @swagger
 * /api/assistant/whatsapp-messages/{templateId}/toggle:
 *   put:
 *     summary: Toggle template active status
 *     tags: [Assistant - WhatsApp Templates]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status toggled
 */

/* ============================================
   DOWNLOAD & PREVIEW
   ============================================ */

/**
 * @swagger
 * /api/assistant/assignments/{assignmentId}/preview:
 *   get:
 *     summary: Preview assignment file
 *     description: Open assignment file in browser
 *     tags: [Assistant - Download & Preview]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File previewed successfully
 */

/**
 * @swagger
 * /api/assistant/videos/{videoId}/preview:
 *   get:
 *     summary: Preview video file
 *     description: Open video file in browser
 *     tags: [Assistant - Download & Preview]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File previewed successfully
 */

/**
 * @swagger
 * /api/assistant/questions/{questionId}/preview:
 *   get:
 *     summary: Preview question file
 *     description: Open question file in browser
 *     tags: [Assistant - Download & Preview]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File previewed successfully
 */

/**
 * @swagger
 * /api/assistant/student-answers/{answerId}/preview:
 *   get:
 *     summary: Preview student answer file
 *     description: Open student answer file in browser
 *     tags: [Assistant - Download & Preview]
 *     security:
 *       - ApiAuth: []
 *       - ClientToken: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File previewed successfully
 */
