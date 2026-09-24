/**
 * Automatically generated coverage documentation for routes that are not
 * represented by a hand-written Swagger block. Keep this file in sync by
 * running: node scripts/generate-route-docs.js
 */
/**
 * @swagger
 * /api/assistant/attendance/{id}:
 *   delete:
 *     summary: DELETE assistant attendance id
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/attendance/{id}:
 *   put:
 *     summary: PUT assistant attendance id
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/attendance/absent:
 *   get:
 *     summary: GET assistant attendance absent
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: GET assistant exam-results grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: GET assistant exam-results group groupId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/exams/grade/{gradeId}/stats:
 *   get:
 *     summary: GET assistant exams grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/grades/{id}/details:
 *   get:
 *     summary: GET assistant grades id details
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/student-answers/{answerId}/download:
 *   get:
 *     summary: GET assistant student-answers answerId download
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/whatsapp/dashboard:
 *   get:
 *     summary: GET assistant whatsapp dashboard
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/whatsapp/queue/force-process:
 *   post:
 *     summary: POST assistant whatsapp queue force-process
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/assistant/whatsapp/settings:
 *   put:
 *     summary: PUT assistant whatsapp settings
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Assistant - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/student/attendance/consecutive-absences:
 *   get:
 *     summary: GET student attendance consecutive-absences
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Student - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/student/exams/online/{attemptId}/review:
 *   get:
 *     summary: GET student exams online attemptId review
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Student - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/student/exams/online/{examId}/check-attempt:
 *   get:
 *     summary: GET student exams online examId check-attempt
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Student - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/student/exams/online/{examId}/resume:
 *   get:
 *     summary: GET student exams online examId resume
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Student - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/student/profile-image:
 *   delete:
 *     summary: DELETE student profile-image
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Student - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/{submissionId}/grade:
 *   put:
 *     summary: PUT super-admin assignment-submissions submissionId grade
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}:
 *   get:
 *     summary: GET super-admin assignment-submissions assignment assignmentId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/not-submitted-students:
 *   get:
 *     summary: GET super-admin assignment-submissions assignment assignmentId not-submitted-students
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/student/{studentId}:
 *   get:
 *     summary: GET super-admin assignment-submissions assignment assignmentId student studentId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/submitted-students:
 *   get:
 *     summary: GET super-admin assignment-submissions assignment assignmentId submitted-students
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/assignment/{assignmentId}:
 *   get:
 *     summary: GET super-admin assignment-submissions stats assignment assignmentId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin assignment-submissions stats grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/group/{groupId}:
 *   get:
 *     summary: GET super-admin assignment-submissions stats group groupId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/download:
 *   get:
 *     summary: GET super-admin assignments assignmentId download
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/permanent:
 *   delete:
 *     summary: DELETE super-admin assignments assignmentId permanent
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/preview:
 *   get:
 *     summary: GET super-admin assignments assignmentId preview
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignments/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin assignments grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/assignments/group/{groupId}:
 *   get:
 *     summary: GET super-admin assignments group groupId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/consecutive-absences:
 *   get:
 *     summary: GET super-admin attendance consecutive-absences
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/dashboard:
 *   get:
 *     summary: GET super-admin attendance dashboard
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/grade/{gradeId}/stats:
 *   get:
 *     summary: GET super-admin attendance grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/date/{date}:
 *   get:
 *     summary: GET super-admin attendance group groupId date date
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/month/{month}:
 *   get:
 *     summary: GET super-admin attendance group groupId month month
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/overall-stats:
 *   get:
 *     summary: GET super-admin attendance overall-stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/scan-barcode:
 *   post:
 *     summary: POST super-admin attendance scan-barcode
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/{id}/toggle-makeup:
 *   put:
 *     summary: PUT super-admin attendance sessions id toggle-makeup
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/active/{groupId}:
 *   get:
 *     summary: GET super-admin attendance sessions active groupId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/lock:
 *   post:
 *     summary: POST super-admin attendance sessions lock
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/start:
 *   post:
 *     summary: POST super-admin attendance sessions start
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/attendance/summary/group/{groupId}/date/{date}:
 *   get:
 *     summary: GET super-admin attendance summary group groupId date date
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}:
 *   get:
 *     summary: GET super-admin exam-results exam examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}/stats:
 *   get:
 *     summary: GET super-admin exam-results exam examId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: GET super-admin exam-results grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: GET super-admin exam-results group groupId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/upsert-batch/{examId}:
 *   post:
 *     summary: POST super-admin exam-results upsert-batch examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exams/{id}/stats:
 *   get:
 *     summary: GET super-admin exams id stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exams/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin exams grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exams/grade/{gradeId}/stats:
 *   get:
 *     summary: GET super-admin exams grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/exams/group/{groupId}:
 *   get:
 *     summary: GET super-admin exams group groupId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/grades/{id}/stats:
 *   get:
 *     summary: GET super-admin grades id stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/grades/find:
 *   post:
 *     summary: POST super-admin grades find
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/grades/groups-count:
 *   get:
 *     summary: GET super-admin grades groups-count
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/grades/stats:
 *   get:
 *     summary: GET super-admin grades stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/grades/students-count:
 *   get:
 *     summary: GET super-admin grades students-count
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/{id}/full-stats:
 *   get:
 *     summary: GET super-admin groups id full-stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/{id}/stats:
 *   get:
 *     summary: GET super-admin groups id stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/find:
 *   post:
 *     summary: POST super-admin groups find
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin groups grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/stats:
 *   get:
 *     summary: GET super-admin groups stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/students-count:
 *   get:
 *     summary: GET super-admin groups students-count
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/groups/with-grade-name:
 *   get:
 *     summary: GET super-admin groups with-grade-name
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/{examId}/permanent:
 *   delete:
 *     summary: DELETE super-admin online-exams examId permanent
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/available:
 *   get:
 *     summary: GET super-admin online-exams available
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/expired:
 *   get:
 *     summary: GET super-admin online-exams expired
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin online-exams grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/group/{groupId}:
 *   get:
 *     summary: GET super-admin online-exams group groupId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/stats/{examId}:
 *   get:
 *     summary: GET super-admin online-exams stats examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/online-exams/stats/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin online-exams stats grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/options/question/{questionId}:
 *   get:
 *     summary: GET super-admin options question questionId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/collections:
 *   get:
 *     summary: GET super-admin payments collections
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/grade/{gradeId}/month/{month}:
 *   get:
 *     summary: GET super-admin payments grade gradeId month month
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/grade/{gradeId}/stats:
 *   get:
 *     summary: GET super-admin payments grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/group/{groupId}/month/{month}:
 *   get:
 *     summary: GET super-admin payments group groupId month month
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/group/{groupId}/stats:
 *   get:
 *     summary: GET super-admin payments group groupId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/overall:
 *   get:
 *     summary: GET super-admin payments overall
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/students-status:
 *   get:
 *     summary: GET super-admin payments students-status
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/payments/unpaid:
 *   get:
 *     summary: GET super-admin payments unpaid
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/playlists/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin playlists grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/questions/{questionId}/download:
 *   get:
 *     summary: GET super-admin questions questionId download
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/questions/{questionId}/preview:
 *   get:
 *     summary: GET super-admin questions questionId preview
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/questions/exam/{examId}:
 *   get:
 *     summary: GET super-admin questions exam examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/grade:
 *   put:
 *     summary: PUT super-admin student-answers answerId grade
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/preview:
 *   get:
 *     summary: GET super-admin student-answers answerId preview
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-answers/essay/exam/{examId}:
 *   get:
 *     summary: GET super-admin student-answers essay exam examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-answers/essay/pending:
 *   get:
 *     summary: GET super-admin student-answers essay pending
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/options:
 *   get:
 *     summary: GET super-admin student-answers question questionId options
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/stats:
 *   get:
 *     summary: GET super-admin student-answers question questionId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}:
 *   get:
 *     summary: GET super-admin student-exams exam examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}/stats:
 *   get:
 *     summary: GET super-admin student-exams exam examId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-exams/grade/{gradeId}/stats:
 *   get:
 *     summary: GET super-admin student-exams grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/student-exams/group/{groupId}/stats:
 *   get:
 *     summary: GET super-admin student-exams group groupId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/assignments:
 *   get:
 *     summary: GET super-admin students studentId assignments
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/assignments/{assignmentId}:
 *   get:
 *     summary: GET super-admin students studentId assignments assignmentId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance:
 *   get:
 *     summary: GET super-admin students studentId attendance
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance/consecutive-absences:
 *   get:
 *     summary: GET super-admin students studentId attendance consecutive-absences
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance/monthly:
 *   get:
 *     summary: GET super-admin students studentId attendance monthly
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance/total:
 *   get:
 *     summary: GET super-admin students studentId attendance total
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/online/{attemptId}:
 *   get:
 *     summary: GET super-admin students studentId exams online attemptId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/online/history:
 *   get:
 *     summary: GET super-admin students studentId exams online history
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/paper:
 *   get:
 *     summary: GET super-admin students studentId exams paper
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/paper/{examId}:
 *   get:
 *     summary: GET super-admin students studentId exams paper examId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/results:
 *   get:
 *     summary: GET super-admin students studentId exams results
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/payments:
 *   get:
 *     summary: GET super-admin students studentId payments
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/payments/current-subscription:
 *   get:
 *     summary: GET super-admin students studentId payments current-subscription
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/playlists:
 *   get:
 *     summary: GET super-admin students studentId playlists
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/submissions:
 *   get:
 *     summary: GET super-admin students studentId submissions
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/submissions/{submissionId}:
 *   get:
 *     summary: GET super-admin students studentId submissions submissionId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/grade/{gradeId}/stats:
 *   get:
 *     summary: GET super-admin subscriptions grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/group/{groupId}/stats:
 *   get:
 *     summary: GET super-admin subscriptions group groupId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/month/{month}:
 *   get:
 *     summary: GET super-admin subscriptions month month
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/overall:
 *   get:
 *     summary: GET super-admin subscriptions overall
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/student/{studentId}:
 *   get:
 *     summary: GET super-admin subscriptions student studentId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/without-current:
 *   get:
 *     summary: GET super-admin subscriptions without-current
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/videos/{videoId}/download:
 *   get:
 *     summary: GET super-admin videos videoId download
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/videos/{videoId}/preview:
 *   get:
 *     summary: GET super-admin videos videoId preview
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/super-admin/videos/grade/{gradeId}:
 *   get:
 *     summary: GET super-admin videos grade gradeId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Super Admin - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/teacher/assistants:
 *   get:
 *     summary: GET teacher assistants
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Teacher - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/teacher/assistants/{userId}:
 *   get:
 *     summary: GET teacher assistants userId
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Teacher - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/teacher/exams/grade/{gradeId}/stats:
 *   get:
 *     summary: GET teacher exams grade gradeId stats
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Teacher - Generated Routes
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Request completed successfully
 *       '400':
 *         description: Invalid request or validation error
 *       '401':
 *         description: Authentication required or invalid credentials
 *       '403':
 *         description: Insufficient permissions
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /webhook/webhook:
 *   get:
 *     summary: GET  webhook webhook
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Webhooks
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Webhook accepted or verification challenge returned
 *       '403':
 *         description: Webhook verification failed
 *       '500':
 *         description: Webhook processing failed
 */
/**
 * @swagger
 * /webhook/webhook:
 *   post:
 *     summary: POST  webhook webhook
 *     description: Generated from the currently mounted Express route.
 *     tags:
 *       - Webhooks
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Webhook accepted or verification challenge returned
 *       '403':
 *         description: Webhook verification failed
 *       '500':
 *         description: Webhook processing failed
 */
