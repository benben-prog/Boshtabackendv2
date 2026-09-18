/**
 * @swagger
 * tags:
 *   name: Parent
 *   description: Parent dashboard endpoints
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
 *       404:
 *         description: Parent token not found
 */

/**
 * @swagger
 * /api/parent:
 *   post:
 *     summary: Get parent token by parent phone
 *     description: Returns the parent_token associated with the given parent phone number
 *     tags: [Parent]
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
 *                 description: Parent phone number
 *                 example: "01012345678"
 *     responses:
 *       200:
 *         description: Parent token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "تم جلب التوكن بنجاح"
 *                 data:
 *                   type: object
 *                   properties:
 *                     parent_token:
 *                       type: string
 *                       example: "abc123xyz789"
 *       400:
 *         description: Validation error (phone is required)
 *       404:
 *         description: Parent not found
 */
