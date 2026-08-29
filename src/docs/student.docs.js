/**
 * @swagger
 * tags:
 *   - name: Student - Dashboard & Profile
 *     description: Student dashboard, profile, and account endpoints
 *   - name: Student - Attendance
 *     description: Student attendance endpoints
 *   - name: Student - Paper Exams
 *     description: Paper exam endpoints for student
 *   - name: Student - Online Exams
 *     description: Online exam endpoints for student
 *   - name: Student - Questions & Options
 *     description: Question and option endpoints for student
 *   - name: Student - Assignments
 *     description: Assignment and submission endpoints for student
 *   - name: Student - Videos & Playlists
 *     description: Video and playlist endpoints for student
 *   - name: Student - Payments
 *     description: Payment and subscription endpoints for student
 */

/* ============================================
   DASHBOARD & PROFILE
   ============================================ */

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get student dashboard
 *     description: Get comprehensive dashboard with student info, group details, attendance, upcoming exams, and assignments
 *     tags: [Student - Dashboard & Profile]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */

/**
 * @swagger
 * /api/student/profile:
 *   get:
 *     summary: Get student profile
 *     description: Get current student full profile with grade and group details
 *     tags: [Student - Dashboard & Profile]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */

/**
 * @swagger
 * /api/student/stats:
 *   get:
 *     summary: Get student quick stats
 *     description: Get attendance summary, exam averages, and payment totals
 *     tags: [Student - Dashboard & Profile]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */

/**
 * @swagger
 * /api/student/profile-image:
 *   put:
 *     summary: Update profile image
 *     description: Upload new profile image
 *     tags: [Student - Dashboard & Profile]
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
 */

/**
 * @swagger
 * /api/student/password:
 *   put:
 *     summary: Change password
 *     description: Update student password (requires old password)
 *     tags: [Student - Dashboard & Profile]
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
   ATTENDANCE
   ============================================ */

/**
 * @swagger
 * /api/student/attendance:
 *   get:
 *     summary: Get attendance history
 *     description: Get paginated attendance records with month filter
 *     tags: [Student - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Attendance list retrieved successfully
 */

/**
 * @swagger
 * /api/student/attendance/monthly:
 *   get:
 *     summary: Get monthly attendance stats
 *     tags: [Student - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Monthly stats retrieved successfully
 */

/**
 * @swagger
 * /api/student/attendance/consecutive:
 *   get:
 *     summary: Get consecutive absences
 *     tags: [Student - Attendance]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Consecutive absences retrieved successfully
 */

/* ============================================
   PAPER EXAMS
   ============================================ */

/**
 * @swagger
 * /api/student/exams/paper:
 *   get:
 *     summary: Get paper exams
 *     tags: [Student - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Paper exams retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/paper/{examId}:
 *   get:
 *     summary: Get paper exam details
 *     tags: [Student - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam details retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/results:
 *   get:
 *     summary: Get exam results
 *     tags: [Student - Paper Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Results retrieved successfully
 */

/* ============================================
   ONLINE EXAMS
   ============================================ */

/**
 * @swagger
 * /api/student/exams/online/available:
 *   get:
 *     summary: Get available online exams
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Available exams retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/history:
 *   get:
 *     summary: Get online exams history
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: History retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{attemptId}:
 *   get:
 *     summary: Get online exam details
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Exam details retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{examId}/start:
 *   post:
 *     summary: Start online exam
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201:
 *         description: Exam started successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{attemptId}/submit:
 *   put:
 *     summary: Submit online exam
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: attemptId
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
 *     responses:
 *       200:
 *         description: Exam submitted successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{examId}/answer:
 *   post:
 *     summary: Submit MCQ/True-False answer
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 *             required: [question_id, selected_option_id]
 *             properties:
 *               question_id: { type: integer }
 *               selected_option_id: { type: integer }
 *     responses:
 *       200:
 *         description: Answer saved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{examId}/essay:
 *   post:
 *     summary: Submit essay answer
 *     tags: [Student - Online Exams]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
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
 *             required: [question_id, file]
 *             properties:
 *               question_id: { type: integer }
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Essay answer saved successfully
 */

/* ============================================
   QUESTIONS & OPTIONS
   ============================================ */

/**
 * @swagger
 * /api/student/exams/online/{examId}/questions:
 *   get:
 *     summary: Get exam questions
 *     tags: [Student - Questions & Options]
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
 * /api/student/exams/online/question/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Student - Questions & Options]
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
 * /api/student/options/question/{questionId}:
 *   get:
 *     summary: Get options by question
 *     tags: [Student - Questions & Options]
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
 * /api/student/assignments:
 *   get:
 *     summary: Get assignments
 *     tags: [Student - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 */

/**
 * @swagger
 * /api/student/assignments/{assignmentId}:
 *   get:
 *     summary: Get assignment details
 *     tags: [Student - Assignments]
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

/**
 * @swagger
 * /api/student/assignments/{assignmentId}/download:
 *   get:
 *     summary: Download assignment file
 *     tags: [Student - Assignments]
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
 * /api/student/assignments/{assignmentId}/submit:
 *   post:
 *     summary: Submit assignment
 *     tags: [Student - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
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
 *       201:
 *         description: Assignment submitted successfully
 */

/**
 * @swagger
 * /api/student/assignments/{assignmentId}/update:
 *   put:
 *     summary: Update assignment submission
 *     tags: [Student - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
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
 *         description: Submission updated successfully
 */

/**
 * @swagger
 * /api/student/homeWorkSubmission/{assignmentId}/download:
 *   get:
 *     summary: Download own submission
 *     tags: [Student - Assignments]
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
 * /api/student/submissions:
 *   get:
 *     summary: Get submissions
 *     tags: [Student - Assignments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Submissions retrieved successfully
 */

/* ============================================
   VIDEOS & PLAYLISTS
   ============================================ */

/**
 * @swagger
 * /api/student/playlists:
 *   get:
 *     summary: Get playlists
 *     tags: [Student - Videos & Playlists]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Playlists retrieved successfully
 */

/**
 * @swagger
 * /api/student/playlists/{playlistId}/videos:
 *   get:
 *     summary: Get playlist videos
 *     tags: [Student - Videos & Playlists]
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

/* ============================================
   PAYMENTS
   ============================================ */

/**
 * @swagger
 * /api/student/payments:
 *   get:
 *     summary: Get payment history
 *     tags: [Student - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: string, example: "2026-08" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 */

/**
 * @swagger
 * /api/student/payments/balance:
 *   get:
 *     summary: Get remaining balance
 *     tags: [Student - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 */

/**
 * @swagger
 * /api/student/payments/current-subscription:
 *   get:
 *     summary: Get current subscription
 *     tags: [Student - Payments]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Subscription retrieved successfully
 */
