/**
 * @swagger
 * tags:
 *   name: Parent
 *   description: Parent dashboard endpoint
 */

/**
 * @swagger
 * /api/parent/{token}:
 *   get:
 *     summary: Get parent dashboard
 *     description: Returns full student dashboard for parent (profile, attendance, payments, exams, assignments)
 *     tags: [Parent]
 *     security:
 *       - ApiAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent token from student record
 *     responses:
 *       200:
 *         description: Parent dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     student:
 *                       type: object
 *                     attendance:
 *                       type: object
 *                     lastAbsences:
 *                       type: array
 *                     payments:
 *                       type: object
 *                     lastPayment:
 *                       type: object
 *                     paperExams:
 *                       type: array
 *                     onlineExams:
 *                       type: array
 *                     assignments:
 *                       type: array
 *                     groupInfo:
 *                       type: object
 */