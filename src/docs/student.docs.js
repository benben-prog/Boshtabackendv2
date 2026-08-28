/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student portal endpoints - All student operations (Self-Service)
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
 *     tags: [Student]
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
 *     tags: [Student]
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
 *     tags: [Student]
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
 *     tags: [Student]
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
 *                 description: Profile image file (jpg, png, webp)
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
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, password, confirmPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *               password:
 *                 type: string
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
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
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *         description: Filter by month (YYYY-MM)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Attendance list retrieved successfully
 */

/**
 * @swagger
 * /api/student/attendance/monthly:
 *   get:
 *     summary: Get monthly attendance stats
 *     description: Get attendance grouped by month
 *     tags: [Student]
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
 *     description: Get count of consecutive absences
 *     tags: [Student]
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
 *     description: Get paper exams with scores and month filter
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Paper exams retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/paper/{examId}:
 *   get:
 *     summary: Get paper exam details
 *     description: Get specific paper exam with rank and highest degree
 *     tags: [Student]
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
 *     description: Get all paper exam results
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
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
 *     description: Get online exams available for student
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Available exams retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/history:
 *   get:
 *     summary: Get online exams history
 *     description: Get submitted online exams with scores
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: History retrieved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{attemptId}:
 *   get:
 *     summary: Get online exam details
 *     description: Get specific exam attempt with answers summary
 *     tags: [Student]
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
 *     description: Start new exam attempt
 *     tags: [Student]
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
 *     description: Submit exam with final score
 *     tags: [Student]
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
 *               score:
 *                 type: number
 *                 example: 8
 *     responses:
 *       200:
 *         description: Exam submitted successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{examId}/answer:
 *   post:
 *     summary: Submit MCQ/True-False answer
 *     description: Submit answer for MCQ or True/False question
 *     tags: [Student]
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
 *               question_id:
 *                 type: integer
 *               selected_option_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answer saved successfully
 */

/**
 * @swagger
 * /api/student/exams/online/{examId}/essay:
 *   post:
 *     summary: Submit essay answer
 *     description: Submit essay answer with file upload
 *     tags: [Student]
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
 *               question_id:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Answer file (PDF/Word/Image)
 *     responses:
 *       200:
 *         description: Essay answer saved successfully
 */

/* ============================================
   ASSIGNMENTS
   ============================================ */

/**
 * @swagger
 * /api/student/assignments:
 *   get:
 *     summary: Get assignments
 *     description: Get assignments with submission status
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 */

/**
 * @swagger
 * /api/student/assignments/{assignmentId}:
 *   get:
 *     summary: Get assignment details
 *     description: Get specific assignment with submission details
 *     tags: [Student]
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
 *     description: Download assignment file
 *     tags: [Student]
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
 *     description: Submit assignment with file upload
 *     tags: [Student]
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
 *                 description: Solution file (PDF/Word/Image)
 *     responses:
 *       201:
 *         description: Assignment submitted successfully
 */

/**
 * @swagger
 * /api/student/assignments/{assignmentId}/update:
 *   put:
 *     summary: Update assignment submission
 *     description: Update submission file before deadline
 *     tags: [Student]
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
 *                 description: New solution file
 *     responses:
 *       200:
 *         description: Submission updated successfully
 */

/**
 * @swagger
 * /api/student/submissions:
 *   get:
 *     summary: Get submissions
 *     description: Get all assignment submissions
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
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
 *     description: Get playlists for student's grade
 *     tags: [Student]
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
 *     description: Get videos in specific playlist
 *     tags: [Student]
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
 *     description: Get payment records with month filter
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-08"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 */

/**
 * @swagger
 * /api/student/payments/balance:
 *   get:
 *     summary: Get remaining balance
 *     description: Get total required, paid, and remaining
 *     tags: [Student]
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
 *     description: Get current month subscription status
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     responses:
 *       200:
 *         description: Subscription retrieved successfully
 */
/**
 * @swagger
 * /api/student/exams/online/{examId}/questions:
 *   get:
 *     summary: Get exam questions
 *     description: Get all questions for specific online exam
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *//**
 * @swagger
 * /api/student/exams/online/question/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     description: Get specific question details
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *//**
 * @swagger
 * /api/student/options/question/{questionId}:
 *   get:
 *     summary: Get options by question
 *     description: Get answer options for specific question
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Options retrieved successfully
 *//**
 * @swagger
 * /api/student/assignments/{assignmentId}/download:
 *   get:
 *     summary: Download assignment file
 *     description: Download assignment file
 *     tags: [Student]
 *     security: [{ ApiAuth: [], ClientToken: [] }]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *//**
 * @swagger
 * /api/student/homeWorkSubmission/{assignmentId}/download:
 *   get:
 *     summary: Download own submission
 *     description: Download student's own submission file
 *     tags: [Student]
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