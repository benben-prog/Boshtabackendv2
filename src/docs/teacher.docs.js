/**
 * @swagger
 * tags:
 *   - name: Teacher - Profile & Dashboard
 *     description: Teacher profile, dashboard, and activity log endpoints
 *   - name: Teacher - Students
 *     description: Student read-only endpoints
 *   - name: Teacher - Grades
 *     description: Grade read-only endpoints
 *   - name: Teacher - Groups
 *     description: Group read-only endpoints
 *   - name: Teacher - Attendance
 *     description: Attendance read-only endpoints
 *   - name: Teacher - Payments
 *     description: Payment read-only endpoints
 *   - name: Teacher - Subscriptions
 *     description: Subscription read-only endpoints
 *   - name: Teacher - Paper Exams
 *     description: Paper exam read-only endpoints
 *   - name: Teacher - Exam Results
 *     description: Exam result read-only endpoints
 *   - name: Teacher - Online Exams
 *     description: Online exam read-only endpoints
 *   - name: Teacher - Questions & Options
 *     description: Question and option read-only endpoints
 *   - name: Teacher - Student Exams
 *     description: Student exam attempts read-only endpoints
 *   - name: Teacher - Student Answers
 *     description: Student answers read-only endpoints
 *   - name: Teacher - Assignments
 *     description: Assignment read-only endpoints
 *   - name: Teacher - Assignment Submissions
 *     description: Assignment submission read-only endpoints
 *   - name: Teacher - Videos & Playlists
 *     description: Video and playlist read-only endpoints
 *   - name: Teacher - Download & Preview
 *     description: File download and preview endpoints
 */

/* ============================================
   PROFILE & DASHBOARD & ACTIVITY LOG
   ============================================ */

/**
 * @swagger
 * /api/teacher/profile:
 *   get:
 *     summary: Get teacher profile
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/dashboard:
 *   get:
 *     summary: Get teacher dashboard
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/activity-log:
 *   get:
 *     summary: Get activity log
 *     description: Get activity logs for assistants only
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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

/**
 * @swagger
 * /api/teacher/profile-image:
 *   get:
 *     summary: Get teacher profile image
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Profile image retrieved successfully
 *   put:
 *     summary: Update teacher profile image
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 *     summary: Delete teacher profile image
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Profile image deleted successfully
 */

/**
 * @swagger
 * /api/teacher/password:
 *   put:
 *     summary: Update teacher password
 *     tags: [Teacher - Profile & Dashboard]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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

/* ============================================
   DOWNLOAD & PREVIEW
   ============================================ */

/**
 * @swagger
 * /api/teacher/assignments/{assignmentId}/download:
 *   get:
 *     summary: Download assignment file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File downloaded successfully
 */

/**
 * @swagger
 * /api/teacher/assignments/{assignmentId}/preview:
 *   get:
 *     summary: Preview assignment file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/videos/{videoId}/download:
 *   get:
 *     summary: Download video file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File downloaded successfully
 */

/**
 * @swagger
 * /api/teacher/videos/{videoId}/preview:
 *   get:
 *     summary: Preview video file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/questions/{questionId}/download:
 *   get:
 *     summary: Download question file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File downloaded successfully
 */

/**
 * @swagger
 * /api/teacher/questions/{questionId}/preview:
 *   get:
 *     summary: Preview question file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/student-answers/{answerId}/preview:
 *   get:
 *     summary: Preview student answer file
 *     tags: [Teacher - Download & Preview]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Teacher - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Grades retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/grades/groups-count:
 *   get:
 *     summary: Get grades with groups count
 *     tags: [Teacher - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/grades/students-count:
 *   get:
 *     summary: Get grades with students count
 *     tags: [Teacher - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/grades/stats:
 *   get:
 *     summary: Get all grades stats
 *     tags: [Teacher - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Teacher - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/grades/{id}/stats:
 *   get:
 *     summary: Get grade stats
 *     tags: [Teacher - Grades]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/* ============================================
   GROUPS
   ============================================ */

/**
 * @swagger
 * /api/teacher/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/with-grade-name:
 *   get:
 *     summary: Get groups with grade name
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/students-count:
 *   get:
 *     summary: Get groups with students count
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/stats:
 *   get:
 *     summary: Get all groups stats
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/{id}/full-stats:
 *   get:
 *     summary: Get group full stats
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/grade/{gradeId}:
 *   get:
 *     summary: Get groups by grade
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/groups/{id}/stats:
 *   get:
 *     summary: Get group stats
 *     tags: [Teacher - Groups]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Retrieved successfully
 */

/* ============================================
   STUDENTS
   ============================================ */

/**
 * @swagger
 * /api/teacher/students:
 *   get:
 *     summary: Get all students
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 */

/**
 * @swagger
 * /api/teacher/students/search/barcode:
 *   get:
 *     summary: Search student by barcode
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/students/search/phone:
 *   get:
 *     summary: Search student by phone
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/students/grade/{gradeId}:
 *   get:
 *     summary: Get students by grade
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/students/group/{groupId}:
 *   get:
 *     summary: Get students by group
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/students/{studentId}/profile:
 *   get:
 *     summary: Get student full profile
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/students/{studentId}/stats:
 *   get:
 *     summary: Get student quick stats
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 * /api/teacher/students/{studentId}/attendance:
 *   get:
 *     summary: Get student attendance history
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Attendance history retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/attendance/monthly:
 *   get:
 *     summary: Get student monthly attendance stats
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Monthly stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/payments:
 *   get:
 *     summary: Get student payment history
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/payments/balance:
 *   get:
 *     summary: Get student remaining balance
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/exams/paper:
 *   get:
 *     summary: Get student paper exams
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paper exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/exams/results:
 *   get:
 *     summary: Get student exam results
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam results retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/exams/online/history:
 *   get:
 *     summary: Get student online exams history
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Online exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/assignments:
 *   get:
 *     summary: Get student assignments
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}/submissions:
 *   get:
 *     summary: Get student submissions
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Submissions retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/students/{studentId}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Teacher - Students]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 */

/* ============================================
   ATTENDANCE
   ============================================ */

/**
 * @swagger
 * /api/teacher/attendance/dashboard:
 *   get:
 *     summary: Get attendance dashboard
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/attendance/overall-stats:
 *   get:
 *     summary: Get overall attendance stats
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/attendance/consecutive-absences:
 *   get:
 *     summary: Get students with 3 consecutive absences
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/attendance/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade attendance stats
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/attendance/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance by group and date
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/attendance/group/{groupId}/month/{month}:
 *   get:
 *     summary: Get attendance by group and month
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: string, example: "2026-08" }
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/attendance/summary/group/{groupId}/date/{date}:
 *   get:
 *     summary: Get attendance summary
 *     tags: [Teacher - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Summary retrieved successfully
 */

/* ============================================
   PAYMENTS
   ============================================ */

/**
 * @swagger
 * /api/teacher/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 *         description: Payments retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/payments/collections:
 *   get:
 *     summary: Get monthly collections
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Collections retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/payments/unpaid:
 *   get:
 *     summary: Get unpaid students
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Unpaid students retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/payments/overall:
 *   get:
 *     summary: Get overall payment stats
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/payments/students-status:
 *   get:
 *     summary: Get all students payment status
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Students status retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/payments/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade payment stats
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/payments/group/{groupId}/stats:
 *   get:
 *     summary: Get group payment stats
 *     tags: [Teacher - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group stats retrieved successfully
 */

/* ============================================
   SUBSCRIPTIONS
   ============================================ */

/**
 * @swagger
 * /api/teacher/subscriptions/overall:
 *   get:
 *     summary: Get overall subscription stats
 *     tags: [Teacher - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/subscriptions/without-current:
 *   get:
 *     summary: Get students without subscription
 *     tags: [Teacher - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/subscriptions/month/{month}:
 *   get:
 *     summary: Get subscriptions by month
 *     tags: [Teacher - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: string, example: "2026-08" }
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/subscriptions/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade subscription stats
 *     tags: [Teacher - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/subscriptions/group/{groupId}/stats:
 *   get:
 *     summary: Get group subscription stats
 *     tags: [Teacher - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/subscriptions/student/{studentId}:
 *   get:
 *     summary: Get student subscriptions
 *     tags: [Teacher - Subscriptions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student subscriptions retrieved successfully
 */

/* ============================================
   PAPER EXAMS
   ============================================ */

/**
 * @swagger
 * /api/teacher/exams:
 *   get:
 *     summary: Get all paper exams
 *     tags: [Teacher - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exams/grade/{gradeId}:
 *   get:
 *     summary: Get exams by grade
 *     tags: [Teacher - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exams/group/{groupId}:
 *   get:
 *     summary: Get exams by group
 *     tags: [Teacher - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Teacher - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exams/{id}/stats:
 *   get:
 *     summary: Get exam stats
 *     tags: [Teacher - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam stats retrieved successfully
 */

/* ============================================
   EXAM RESULTS
   ============================================ */

/**
 * @swagger
 * /api/teacher/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam results stats
 *     tags: [Teacher - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam results stats
 *     tags: [Teacher - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exam-results/exam/{examId}:
 *   get:
 *     summary: Get exam results
 *     tags: [Teacher - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam results retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/exam-results/exam/{examId}/stats:
 *   get:
 *     summary: Get exam result stats
 *     tags: [Teacher - Exam Results]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Result stats retrieved successfully
 */

/* ============================================
   ONLINE EXAMS
   ============================================ */

/**
 * @swagger
 * /api/teacher/online-exams:
 *   get:
 *     summary: Get all online exams
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Online exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/available:
 *   get:
 *     summary: Get available online exams
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Available exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/expired:
 *   get:
 *     summary: Get expired online exams
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Expired exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/grade/{gradeId}:
 *   get:
 *     summary: Get online exams by grade
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/group/{groupId}:
 *   get:
 *     summary: Get online exams by group
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/stats/grade/{gradeId}:
 *   get:
 *     summary: Get grade online exam stats
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/stats/{examId}:
 *   get:
 *     summary: Get online exam stats
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/online-exams/{examId}:
 *   get:
 *     summary: Get online exam by ID
 *     tags: [Teacher - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam retrieved successfully
 */

/* ============================================
   QUESTIONS & OPTIONS
   ============================================ */

/**
 * @swagger
 * /api/teacher/questions/exam/{examId}:
 *   get:
 *     summary: Get questions by exam
 *     tags: [Teacher - Questions & Options]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Teacher - Questions & Options]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/options/question/{questionId}:
 *   get:
 *     summary: Get options by question
 *     tags: [Teacher - Questions & Options]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Options retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/options/{optionId}:
 *   get:
 *     summary: Get option by ID
 *     tags: [Teacher - Questions & Options]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Option retrieved successfully
 */

/* ============================================
   STUDENT EXAMS
   ============================================ */

/**
 * @swagger
 * /api/teacher/student-exams/exam/{examId}:
 *   get:
 *     summary: Get student exams by exam
 *     tags: [Teacher - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student exams retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/student-exams/exam/{examId}/stats:
 *   get:
 *     summary: Get exam attempt stats
 *     tags: [Teacher - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/student-exams/grade/{gradeId}/stats:
 *   get:
 *     summary: Get grade exam attempts stats
 *     tags: [Teacher - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Grade stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/student-exams/group/{groupId}/stats:
 *   get:
 *     summary: Get group exam attempts stats
 *     tags: [Teacher - Student Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group stats retrieved successfully
 */

/* ============================================
   STUDENT ANSWERS
   ============================================ */

/**
 * @swagger
 * /api/teacher/student-answers/question/{questionId}/stats:
 *   get:
 *     summary: Get question answer stats
 *     tags: [Teacher - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Question stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/student-answers/question/{questionId}/options:
 *   get:
 *     summary: Get most selected options
 *     tags: [Teacher - Student Answers]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Options retrieved successfully
 */

/* ============================================
   ASSIGNMENTS
   ============================================ */

/**
 * @swagger
 * /api/teacher/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Teacher - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignments/grade/{gradeId}:
 *   get:
 *     summary: Get assignments by grade
 *     tags: [Teacher - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignments/group/{groupId}:
 *   get:
 *     summary: Get assignments by group
 *     tags: [Teacher - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignments/{assignmentId}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Teacher - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Assignment retrieved successfully
 */

/* ============================================
   ASSIGNMENT SUBMISSIONS
   ============================================ */

/**
 * @swagger
 * /api/teacher/assignment-submissions/stats/grade/{gradeId}:
 *   get:
 *     summary: Get grade assignment submissions stats
 *     tags: [Teacher - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignment-submissions/stats/group/{groupId}:
 *   get:
 *     summary: Get group assignment submissions stats
 *     tags: [Teacher - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignment-submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Get submissions by assignment
 *     tags: [Teacher - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Submissions retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignment-submissions/assignment/{assignmentId}/student/{studentId}:
 *   get:
 *     summary: Get student submission
 *     tags: [Teacher - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 *         description: Submission retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/assignment-submissions/stats/assignment/{assignmentId}:
 *   get:
 *     summary: Get assignment submission stats
 *     tags: [Teacher - Assignment Submissions]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/* ============================================
   VIDEOS & PLAYLISTS
   ============================================ */

/**
 * @swagger
 * /api/teacher/videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/videos/grade/{gradeId}:
 *   get:
 *     summary: Get videos by grade
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/videos/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Video retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/playlists:
 *   get:
 *     summary: Get all playlists
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Playlists retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/playlists/grade/{gradeId}:
 *   get:
 *     summary: Get playlists by grade
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Playlists retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Playlist retrieved successfully
 */

/**
 * @swagger
 * /api/teacher/playlist-videos/playlist/{playlistId}:
 *   get:
 *     summary: Get playlist videos
 *     tags: [Teacher - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 */
