/**
 * Automatically generated coverage documentation for routes that are not
 * represented by a hand-written Swagger block. Keep this file in sync by
 * running: node scripts/generate-route-docs.js
 */
/**
 * @swagger
 * /api/assistant/attendance/{id}:
 *   delete:
 *     summary: "Delete attendance record (حذف سجل حضور)"
 *     description: "Delete attendance record (حذف سجل حضور)"
 *     tags:
 *       - "Assistant - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/attendance/{id}:
 *   put:
 *     summary: "Update attendance record (تعديل سجل حضور)"
 *     description: "Update attendance record (تعديل سجل حضور)"
 *     tags:
 *       - "Assistant - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 enum: [present, absent]
 *                 example: "present"
 *               method:
 *                 type: string
 *                 enum: [manual, barcode]
 *                 example: "manual"
 *               is_makeup:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 0
 *               makeup_group_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               notes:
 *                 type: string
 *                 example: "تم التعديل يدوياً"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/attendance/absent:
 *   get:
 *     summary: "GET assistant attendance absent"
 *     description: "GET assistant attendance absent"
 *     tags:
 *       - "Assistant - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/exam-results/exam/{examId}/export/excel:
 *   get:
 *     summary: "GET assistant exam-results exam examId export excel"
 *     description: "GET assistant exam-results exam examId export excel"
 *     tags:
 *       - "Assistant - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/exam-results/exam/{examId}/export/pdf:
 *   get:
 *     summary: "GET assistant exam-results exam examId export pdf"
 *     description: "GET assistant exam-results exam examId export pdf"
 *     tags:
 *       - "Assistant - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: "GET assistant exam-results grade gradeId stats"
 *     description: "GET assistant exam-results grade gradeId stats"
 *     tags:
 *       - "Assistant - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: "GET assistant exam-results group groupId stats"
 *     description: "GET assistant exam-results group groupId stats"
 *     tags:
 *       - "Assistant - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/exams/{id}/export/excel:
 *   get:
 *     summary: "GET assistant exams id export excel"
 *     description: "GET assistant exams id export excel"
 *     tags:
 *       - "Assistant - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/exams/{id}/export/pdf:
 *   get:
 *     summary: "GET assistant exams id export pdf"
 *     description: "GET assistant exams id export pdf"
 *     tags:
 *       - "Assistant - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/exams/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get exam statistics by grade (إحصائيات الامتحانات لصف دراسي)"
 *     description: "Get exam statistics by grade (إحصائيات الامتحانات لصف دراسي)"
 *     tags:
 *       - "Assistant - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/google/auth-url:
 *   get:
 *     summary: "GET assistant google auth-url"
 *     description: "GET assistant google auth-url"
 *     tags:
 *       - "Assistant - Profile & Dashboard"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/google/disconnect:
 *   post:
 *     summary: "POST assistant google disconnect"
 *     description: "POST assistant google disconnect"
 *     tags:
 *       - "Assistant - Profile & Dashboard"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/google/exchange-code:
 *   post:
 *     summary: "POST assistant google exchange-code"
 *     description: "POST assistant google exchange-code"
 *     tags:
 *       - "Assistant - Profile & Dashboard"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/google/status:
 *   get:
 *     summary: "GET assistant google status"
 *     description: "GET assistant google status"
 *     tags:
 *       - "Assistant - Profile & Dashboard"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/grades/{id}/details:
 *   get:
 *     summary: "Get grade full details with groups (تفاصيل الصف الدراسي مع المجموعات)"
 *     description: "Get grade full details with groups (تفاصيل الصف الدراسي مع المجموعات)"
 *     tags:
 *       - "Assistant - Grades"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions:
 *   get:
 *     summary: "GET assistant live-sessions"
 *     description: "GET assistant live-sessions"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions:
 *   post:
 *     summary: "POST assistant live-sessions"
 *     description: "POST assistant live-sessions"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}:
 *   delete:
 *     summary: "DELETE assistant live-sessions id"
 *     description: "DELETE assistant live-sessions id"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}:
 *   get:
 *     summary: "GET assistant live-sessions id"
 *     description: "GET assistant live-sessions id"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}:
 *   put:
 *     summary: "PUT assistant live-sessions id"
 *     description: "PUT assistant live-sessions id"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}/download:
 *   get:
 *     summary: "GET assistant live-sessions id download"
 *     description: "GET assistant live-sessions id download"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}/download-material:
 *   get:
 *     summary: "GET assistant live-sessions id download-material"
 *     description: "GET assistant live-sessions id download-material"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}/preview:
 *   get:
 *     summary: "GET assistant live-sessions id preview"
 *     description: "GET assistant live-sessions id preview"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}/recording:
 *   put:
 *     summary: "PUT assistant live-sessions id recording"
 *     description: "PUT assistant live-sessions id recording"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/live-sessions/{id}/sync-recording:
 *   post:
 *     summary: "POST assistant live-sessions id sync-recording"
 *     description: "POST assistant live-sessions id sync-recording"
 *     tags:
 *       - "Assistant - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/payments/export/excel:
 *   get:
 *     summary: "GET assistant payments export excel"
 *     description: "GET assistant payments export excel"
 *     tags:
 *       - "Assistant - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/payments/export/pdf:
 *   get:
 *     summary: "GET assistant payments export pdf"
 *     description: "GET assistant payments export pdf"
 *     tags:
 *       - "Assistant - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/student-answers/{answerId}/download:
 *   get:
 *     summary: "Download student essay answer file (تنزيل ملف إجابة الطالب المقالية)"
 *     description: "Download student essay answer file (تنزيل ملف إجابة الطالب المقالية)"
 *     tags:
 *       - "Assistant - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         description: "Student Answer ID (معرف إجابة الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/students/{studentId}/activate:
 *   post:
 *     summary: "POST assistant students studentId activate"
 *     description: "POST assistant students studentId activate"
 *     tags:
 *       - "Assistant - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/students/{studentId}/deactivate:
 *   post:
 *     summary: "POST assistant students studentId deactivate"
 *     description: "POST assistant students studentId deactivate"
 *     tags:
 *       - "Assistant - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/students/{studentId}/status:
 *   patch:
 *     summary: "PATCH assistant students studentId status"
 *     description: "PATCH assistant students studentId status"
 *     tags:
 *       - "Assistant - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/students/export/excel:
 *   get:
 *     summary: "GET assistant students export excel"
 *     description: "GET assistant students export excel"
 *     tags:
 *       - "Assistant - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/students/export/pdf:
 *   get:
 *     summary: "GET assistant students export pdf"
 *     description: "GET assistant students export pdf"
 *     tags:
 *       - "Assistant - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/assistant/whatsapp/dashboard:
 *   get:
 *     summary: "Get WhatsApp dashboard statistics (إحصائيات رسائل الواتساب)"
 *     description: "Get WhatsApp dashboard statistics (إحصائيات رسائل الواتساب)"
 *     tags:
 *       - "Assistant - WhatsApp Messages"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/whatsapp/queue/force-process:
 *   post:
 *     summary: "Force process WhatsApp queue (معالجة طابور رسائل الواتساب فورياً)"
 *     description: "Force process WhatsApp queue (معالجة طابور رسائل الواتساب فورياً)"
 *     tags:
 *       - "Assistant - WhatsApp Messages"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/whatsapp/settings:
 *   put:
 *     summary: "Update WhatsApp sending settings (تحديث إعدادات إرسال الواتساب)"
 *     description: "Update WhatsApp sending settings (تحديث إعدادات إرسال الواتساب)"
 *     tags:
 *       - "Assistant - WhatsApp Messages"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsapp_daily_limit:
 *                 type: integer
 *                 example: 250
 *               whatsapp_delay_seconds:
 *                 type: integer
 *                 example: 45
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/youtube/channel,/videos/youtube/channel:
 *   get:
 *     summary: "GET assistant youtube channel, videos youtube channel"
 *     description: "GET assistant youtube channel, videos youtube channel"
 *     tags:
 *       - "Assistant - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/youtube/confirm-upload,/videos/youtube/confirm-upload:
 *   post:
 *     summary: "POST assistant youtube confirm-upload, videos youtube confirm-upload"
 *     description: "POST assistant youtube confirm-upload, videos youtube confirm-upload"
 *     tags:
 *       - "Assistant - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/youtube/init-upload,/videos/youtube/init-upload:
 *   post:
 *     summary: "POST assistant youtube init-upload, videos youtube init-upload"
 *     description: "POST assistant youtube init-upload, videos youtube init-upload"
 *     tags:
 *       - "Assistant - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/assistant/youtube/validate,/videos/youtube/validate:
 *   post:
 *     summary: "POST assistant youtube validate, videos youtube validate"
 *     description: "POST assistant youtube validate, videos youtube validate"
 *     tags:
 *       - "Assistant - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/attendance/consecutive-absences:
 *   get:
 *     summary: "Get student consecutive absences count (عدد مرات الغياب المتتالي للطالب)"
 *     description: "Get student consecutive absences count (عدد مرات الغياب المتتالي للطالب)"
 *     tags:
 *       - "Student - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/exams/online/{attemptId}/review:
 *   get:
 *     summary: "Review online exam attempt details (مراجعة تفاصيل محاولة الامتحان الإلكتروني)"
 *     description: "Review online exam attempt details (مراجعة تفاصيل محاولة الامتحان الإلكتروني)"
 *     tags:
 *       - "Student - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         description: "Online Exam Attempt ID (معرف محاولة الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/exams/online/{examId}/check-attempt:
 *   get:
 *     summary: "Check student exam attempt status (فحص حالة محاولة الامتحان)"
 *     description: "Check student exam attempt status (فحص حالة محاولة الامتحان)"
 *     tags:
 *       - "Student - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/exams/online/{examId}/resume:
 *   get:
 *     summary: "Resume in-progress online exam attempt (استئناف محاولة الامتحان الإلكتروني الجارية)"
 *     description: "Resume in-progress online exam attempt (استئناف محاولة الامتحان الإلكتروني الجارية)"
 *     tags:
 *       - "Student - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/live-sessions:
 *   get:
 *     summary: "GET student live-sessions"
 *     description: "GET student live-sessions"
 *     tags:
 *       - "Student - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/live-sessions/{id}:
 *   get:
 *     summary: "GET student live-sessions id"
 *     description: "GET student live-sessions id"
 *     tags:
 *       - "Student - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/live-sessions/{id}/download:
 *   get:
 *     summary: "GET student live-sessions id download"
 *     description: "GET student live-sessions id download"
 *     tags:
 *       - "Student - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/live-sessions/{id}/download-material:
 *   get:
 *     summary: "GET student live-sessions id download-material"
 *     description: "GET student live-sessions id download-material"
 *     tags:
 *       - "Student - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/live-sessions/{id}/join:
 *   get:
 *     summary: "GET student live-sessions id join"
 *     description: "GET student live-sessions id join"
 *     tags:
 *       - "Student - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/live-sessions/{id}/preview:
 *   get:
 *     summary: "GET student live-sessions id preview"
 *     description: "GET student live-sessions id preview"
 *     tags:
 *       - "Student - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/student/profile-image:
 *   delete:
 *     summary: "Remove student profile image (حذف الصورة الشخصية للطالب)"
 *     description: "Remove student profile image (حذف الصورة الشخصية للطالب)"
 *     tags:
 *       - "Student - Dashboard & Profile"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/{submissionId}/grade:
 *   put:
 *     summary: "Grade student assignment submission (تقييم ورصد درجة تسليم الواجب)"
 *     description: "Grade student assignment submission (تقييم ورصد درجة تسليم الواجب)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         description: "Assignment Submission ID (معرف تسليم الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 example: 18.5
 *               feedback:
 *                 type: string
 *                 example: "عمل ممتاز، برجاء مراجعة المسألة الأخيرة"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}:
 *   get:
 *     summary: "Get submissions for assignment (عرض تسليمات الواجب)"
 *     description: "Get submissions for assignment (عرض تسليمات الواجب)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/not-submitted-students:
 *   get:
 *     summary: "Get students who did not submit assignment (الطلاب الذين لم يسلموا الواجب)"
 *     description: "Get students who did not submit assignment (الطلاب الذين لم يسلموا الواجب)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/student/{studentId}:
 *   get:
 *     summary: "Get specific student submission for assignment (تسليم طالب لواجب محدد)"
 *     description: "Get specific student submission for assignment (تسليم طالب لواجب محدد)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/assignment/{assignmentId}/submitted-students:
 *   get:
 *     summary: "Get students who submitted assignment (الطلاب الذين سلموا الواجب)"
 *     description: "Get students who submitted assignment (الطلاب الذين سلموا الواجب)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/assignment/{assignmentId}:
 *   get:
 *     summary: "Get assignment submission statistics (إحصائيات تسليمات الواجب)"
 *     description: "Get assignment submission statistics (إحصائيات تسليمات الواجب)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/grade/{gradeId}:
 *   get:
 *     summary: "Get submission stats by grade (إحصائيات تسليمات الواجبات لصف دراسي)"
 *     description: "Get submission stats by grade (إحصائيات تسليمات الواجبات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignment-submissions/stats/group/{groupId}:
 *   get:
 *     summary: "Get submission stats by group (إحصائيات تسليمات الواجبات لمجموعة)"
 *     description: "Get submission stats by group (إحصائيات تسليمات الواجبات لمجموعة)"
 *     tags:
 *       - "Super Admin - Assignment Submissions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/download:
 *   get:
 *     summary: "Download assignment file (تنزيل ملف الواجب)"
 *     description: "Download assignment file (تنزيل ملف الواجب)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/permanent:
 *   delete:
 *     summary: "Permanently delete assignment (حذف نهائي للواجب)"
 *     description: "Permanently delete assignment (حذف نهائي للواجب)"
 *     tags:
 *       - "Super Admin - Assignments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignments/{assignmentId}/preview:
 *   get:
 *     summary: "Preview assignment file (معاينة ملف الواجب)"
 *     description: "Preview assignment file (معاينة ملف الواجب)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignments/grade/{gradeId}:
 *   get:
 *     summary: "Get assignments by grade (عرض واجبات صف دراسي)"
 *     description: "Get assignments by grade (عرض واجبات صف دراسي)"
 *     tags:
 *       - "Super Admin - Assignments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/assignments/group/{groupId}:
 *   get:
 *     summary: "Get assignments by group (عرض واجبات مجموعة)"
 *     description: "Get assignments by group (عرض واجبات مجموعة)"
 *     tags:
 *       - "Super Admin - Assignments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/consecutive-absences:
 *   get:
 *     summary: "Get students with consecutive absences (عرض الطلاب الغائبين حصص متتالية)"
 *     description: "Get students with consecutive absences (عرض الطلاب الغائبين حصص متتالية)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/dashboard:
 *   get:
 *     summary: "Get attendance dashboard statistics (لوحة إحصائيات الحضور العامة)"
 *     description: "Get attendance dashboard statistics (لوحة إحصائيات الحضور العامة)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get attendance stats by grade (إحصائيات الحضور لصف دراسي)"
 *     description: "Get attendance stats by grade (إحصائيات الحضور لصف دراسي)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/date/{date}:
 *   get:
 *     summary: "Get group attendance for specific date (حضور المجموعة في تاريخ محدد)"
 *     description: "Get group attendance for specific date (حضور المجموعة في تاريخ محدد)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: date
 *         required: true
 *         description: "Date in YYYY-MM-DD format (التاريخ بصيغة YYYY-MM-DD)"
 *         schema:
 *           type: string
 *           example: "2026-09-25"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/group/{groupId}/month/{month}:
 *   get:
 *     summary: "Get group attendance for specific month (حضور المجموعة خلال شهر محدد)"
 *     description: "Get group attendance for specific month (حضور المجموعة خلال شهر محدد)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: month
 *         required: true
 *         description: "Month in YYYY-MM format (الشهر بصيغة YYYY-MM)"
 *         schema:
 *           type: string
 *           example: "2026-09"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/overall-stats:
 *   get:
 *     summary: "Get overall attendance statistics (إحصائيات الحضور الإجمالية)"
 *     description: "Get overall attendance statistics (إحصائيات الحضور الإجمالية)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/scan-barcode:
 *   post:
 *     summary: "Record attendance by barcode scan (تسجيل الحضور بالباركود)"
 *     description: "Record attendance by barcode scan (تسجيل الحضور بالباركود)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
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
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: "STD-2026-001"
 *               group_id:
 *                 type: integer
 *                 example: 1
 *               grade_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/{id}/toggle-makeup:
 *   put:
 *     summary: "Toggle session makeup mode (تفعيل/إلغاء وضع الحضور التعويضي)"
 *     description: "Toggle session makeup mode (تفعيل/إلغاء وضع الحضور التعويضي)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/active/{groupId}:
 *   get:
 *     summary: "Get active session for group (عرض الجلسة النشطة للمجموعة)"
 *     description: "Get active session for group (عرض الجلسة النشطة للمجموعة)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/lock:
 *   post:
 *     summary: "Lock attendance recording for session (قفل تسجيل الحضور للجلسة)"
 *     description: "Lock attendance recording for session (قفل تسجيل الحضور للجلسة)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
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
 *                 description: Session ID
 *                 example: 12
 *               groupId:
 *                 type: integer
 *                 description: Group ID
 *                 example: 3
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/sessions/start:
 *   post:
 *     summary: "Start new attendance session (بدء جلسة حضور لمجموعة)"
 *     description: "Start new attendance session (بدء جلسة حضور لمجموعة)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
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
 *                 example: 1
 *               grade_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/attendance/summary/group/{groupId}/date/{date}:
 *   get:
 *     summary: "Get attendance summary for group and date (ملخص حضور المجموعة في تاريخ معين)"
 *     description: "Get attendance summary for group and date (ملخص حضور المجموعة في تاريخ معين)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: date
 *         required: true
 *         description: "Date in YYYY-MM-DD format (التاريخ بصيغة YYYY-MM-DD)"
 *         schema:
 *           type: string
 *           example: "2026-09-25"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}:
 *   get:
 *     summary: "Get exam results list (عرض نتائج الامتحان الورقي)"
 *     description: "Get exam results list (عرض نتائج الامتحان الورقي)"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}/export/excel:
 *   get:
 *     summary: "GET super-admin exam-results exam examId export excel"
 *     description: "GET super-admin exam-results exam examId export excel"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}/export/pdf:
 *   get:
 *     summary: "GET super-admin exam-results exam examId export pdf"
 *     description: "GET super-admin exam-results exam examId export pdf"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/exam-results/exam/{examId}/stats:
 *   get:
 *     summary: "Get exam results statistics (إحصائيات نتائج الامتحان)"
 *     description: "Get exam results statistics (إحصائيات نتائج الامتحان)"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exam-results/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get exam results stats by grade (إحصائيات نتائج الامتحانات لصف دراسي)"
 *     description: "Get exam results stats by grade (إحصائيات نتائج الامتحانات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exam-results/group/{groupId}/stats:
 *   get:
 *     summary: "Get exam results stats by group (إحصائيات نتائج الامتحانات لمجموعة)"
 *     description: "Get exam results stats by group (إحصائيات نتائج الامتحانات لمجموعة)"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exam-results/upsert-batch/{examId}:
 *   post:
 *     summary: "Batch upsert exam results (إدخال وتحديث نتائج امتحان جماعياً)"
 *     description: "Batch upsert exam results (إدخال وتحديث نتائج امتحان جماعياً)"
 *     tags:
 *       - "Super Admin - Exam Results"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
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
 *                     - student_id
 *                     - degree
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                       example: 5
 *                     degree:
 *                       type: number
 *                       example: 48.5
 *                     notes:
 *                       type: string
 *                       example: "ممتاز"
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exams/{id}/export/excel:
 *   get:
 *     summary: "GET super-admin exams id export excel"
 *     description: "GET super-admin exams id export excel"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/exams/{id}/export/pdf:
 *   get:
 *     summary: "GET super-admin exams id export pdf"
 *     description: "GET super-admin exams id export pdf"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/exams/{id}/stats:
 *   get:
 *     summary: "Get paper exam detailed stats (إحصائيات الامتحان الورقي)"
 *     description: "Get paper exam detailed stats (إحصائيات الامتحان الورقي)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exams/grade/{gradeId}:
 *   get:
 *     summary: "Get exams by grade (عرض الامتحانات لصف دراسي)"
 *     description: "Get exams by grade (عرض الامتحانات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exams/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get exam statistics by grade (إحصائيات الامتحانات لصف دراسي)"
 *     description: "Get exam statistics by grade (إحصائيات الامتحانات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/exams/group/{groupId}:
 *   get:
 *     summary: "Get exams by group (عرض الامتحانات لمجموعة)"
 *     description: "Get exams by group (عرض الامتحانات لمجموعة)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/google/auth-url:
 *   get:
 *     summary: "GET super-admin google auth-url"
 *     description: "GET super-admin google auth-url"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/google/disconnect:
 *   post:
 *     summary: "POST super-admin google disconnect"
 *     description: "POST super-admin google disconnect"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/google/exchange-code:
 *   post:
 *     summary: "POST super-admin google exchange-code"
 *     description: "POST super-admin google exchange-code"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/google/status:
 *   get:
 *     summary: "GET super-admin google status"
 *     description: "GET super-admin google status"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/grades/{id}/stats:
 *   get:
 *     summary: "Get grade statistics (إحصائيات الصف الدراسي)"
 *     description: "Get grade statistics (إحصائيات الصف الدراسي)"
 *     tags:
 *       - "Super Admin - Grades"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/grades/find:
 *   post:
 *     summary: "Find grade by name (البحث عن صف دراسي بالاسم)"
 *     description: "Find grade by name (البحث عن صف دراسي بالاسم)"
 *     tags:
 *       - "Super Admin - Grades"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
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
 *                 example: "الصف الأول الثانوي"
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/grades/groups-count:
 *   get:
 *     summary: "Get groups count per grade (عدد المجموعات في كل صف دراسي)"
 *     description: "Get groups count per grade (عدد المجموعات في كل صف دراسي)"
 *     tags:
 *       - "Super Admin - Grades"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/grades/stats:
 *   get:
 *     summary: "Get overall grades statistics (إحصائيات الصفوف الدراسية العامة)"
 *     description: "Get overall grades statistics (إحصائيات الصفوف الدراسية العامة)"
 *     tags:
 *       - "Super Admin - Grades"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/grades/students-count:
 *   get:
 *     summary: "Get students count per grade (عدد الطلاب في كل صف دراسي)"
 *     description: "Get students count per grade (عدد الطلاب في كل صف دراسي)"
 *     tags:
 *       - "Super Admin - Grades"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/{id}/full-stats:
 *   get:
 *     summary: "Get group full statistics (إحصائيات تفصيلية شاملة للمجموعة)"
 *     description: "Get group full statistics (إحصائيات تفصيلية شاملة للمجموعة)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/{id}/stats:
 *   get:
 *     summary: "Get group statistics (إحصائيات المجموعة)"
 *     description: "Get group statistics (إحصائيات المجموعة)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/find:
 *   post:
 *     summary: "Find group by name and grade (البحث عن مجموعة بالاسم والصف)"
 *     description: "Find group by name and grade (البحث عن مجموعة بالاسم والصف)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
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
 *                 example: "مجموعة السبت 10 صباحاً"
 *               grade_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/grade/{gradeId}:
 *   get:
 *     summary: "Get groups by grade (عرض مجموعات صف دراسي)"
 *     description: "Get groups by grade (عرض مجموعات صف دراسي)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/stats:
 *   get:
 *     summary: "Get overall groups statistics (إحصائيات المجموعات العامة)"
 *     description: "Get overall groups statistics (إحصائيات المجموعات العامة)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/students-count:
 *   get:
 *     summary: "Get students count per group (عدد الطلاب في كل مجموعة)"
 *     description: "Get students count per group (عدد الطلاب في كل مجموعة)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/groups/with-grade-name:
 *   get:
 *     summary: "Get groups with grade name (عرض المجموعات مع اسم الصف)"
 *     description: "Get groups with grade name (عرض المجموعات مع اسم الصف)"
 *     tags:
 *       - "Super Admin - Groups"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions:
 *   get:
 *     summary: "GET super-admin live-sessions"
 *     description: "GET super-admin live-sessions"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions:
 *   post:
 *     summary: "POST super-admin live-sessions"
 *     description: "POST super-admin live-sessions"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}:
 *   delete:
 *     summary: "DELETE super-admin live-sessions id"
 *     description: "DELETE super-admin live-sessions id"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}:
 *   get:
 *     summary: "GET super-admin live-sessions id"
 *     description: "GET super-admin live-sessions id"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}:
 *   put:
 *     summary: "PUT super-admin live-sessions id"
 *     description: "PUT super-admin live-sessions id"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}/download:
 *   get:
 *     summary: "GET super-admin live-sessions id download"
 *     description: "GET super-admin live-sessions id download"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}/download-material:
 *   get:
 *     summary: "GET super-admin live-sessions id download-material"
 *     description: "GET super-admin live-sessions id download-material"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}/preview:
 *   get:
 *     summary: "GET super-admin live-sessions id preview"
 *     description: "GET super-admin live-sessions id preview"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}/recording:
 *   put:
 *     summary: "PUT super-admin live-sessions id recording"
 *     description: "PUT super-admin live-sessions id recording"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/live-sessions/{id}/sync-recording:
 *   post:
 *     summary: "POST super-admin live-sessions id sync-recording"
 *     description: "POST super-admin live-sessions id sync-recording"
 *     tags:
 *       - "Super Admin - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/{examId}/permanent:
 *   delete:
 *     summary: "Permanently delete online exam (حذف نهائي للامتحان الإلكتروني)"
 *     description: "Permanently delete online exam (حذف نهائي للامتحان الإلكتروني)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/available:
 *   get:
 *     summary: "Get available online exams (عرض الامتحانات الإلكترونية المتاحة)"
 *     description: "Get available online exams (عرض الامتحانات الإلكترونية المتاحة)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/expired:
 *   get:
 *     summary: "Get expired online exams (عرض الامتحانات الإلكترونية المنتهية)"
 *     description: "Get expired online exams (عرض الامتحانات الإلكترونية المنتهية)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/grade/{gradeId}:
 *   get:
 *     summary: "Get online exams by grade (عرض الامتحانات الإلكترونية لصف دراسي)"
 *     description: "Get online exams by grade (عرض الامتحانات الإلكترونية لصف دراسي)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/group/{groupId}:
 *   get:
 *     summary: "Get online exams by group (عرض الامتحانات الإلكترونية لمجموعة)"
 *     description: "Get online exams by group (عرض الامتحانات الإلكترونية لمجموعة)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/stats/{examId}:
 *   get:
 *     summary: "Get online exam detailed statistics (إحصائيات الامتحان الإلكتروني)"
 *     description: "Get online exam detailed statistics (إحصائيات الامتحان الإلكتروني)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/online-exams/stats/grade/{gradeId}:
 *   get:
 *     summary: "Get online exam stats by grade (إحصائيات الامتحانات الإلكترونية لصف)"
 *     description: "Get online exam stats by grade (إحصائيات الامتحانات الإلكترونية لصف)"
 *     tags:
 *       - "Super Admin - Online Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/options/question/{questionId}:
 *   get:
 *     summary: "Get options by question ID (عرض خيارات السؤال)"
 *     description: "Get options by question ID (عرض خيارات السؤال)"
 *     tags:
 *       - "Super Admin - Options"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: "Question ID (معرف السؤال)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/collections:
 *   get:
 *     summary: "Get payment collection overview (ملخص تحصيل المدفوعات)"
 *     description: "Get payment collection overview (ملخص تحصيل المدفوعات)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/export/excel:
 *   get:
 *     summary: "GET super-admin payments export excel"
 *     description: "GET super-admin payments export excel"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/payments/export/pdf:
 *   get:
 *     summary: "GET super-admin payments export pdf"
 *     description: "GET super-admin payments export pdf"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/payments/grade/{gradeId}/month/{month}:
 *   get:
 *     summary: "Get payments by grade and month (مدفوعات صف دراسي خلال شهر)"
 *     description: "Get payments by grade and month (مدفوعات صف دراسي خلال شهر)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: month
 *         required: true
 *         description: "Month in YYYY-MM format (الشهر بصيغة YYYY-MM)"
 *         schema:
 *           type: string
 *           example: "2026-09"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get payment statistics by grade (إحصائيات المدفوعات لصف دراسي)"
 *     description: "Get payment statistics by grade (إحصائيات المدفوعات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/group/{groupId}/month/{month}:
 *   get:
 *     summary: "Get payments by group and month (مدفوعات مجموعة خلال شهر)"
 *     description: "Get payments by group and month (مدفوعات مجموعة خلال شهر)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: month
 *         required: true
 *         description: "Month in YYYY-MM format (الشهر بصيغة YYYY-MM)"
 *         schema:
 *           type: string
 *           example: "2026-09"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/group/{groupId}/stats:
 *   get:
 *     summary: "Get payment statistics by group (إحصائيات المدفوعات لمجموعة)"
 *     description: "Get payment statistics by group (إحصائيات المدفوعات لمجموعة)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/overall:
 *   get:
 *     summary: "Get overall payment stats (إحصائيات المدفوعات العامة)"
 *     description: "Get overall payment stats (إحصائيات المدفوعات العامة)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/students-status:
 *   get:
 *     summary: "Get payment status for all students (حالة السداد لجميع الطلاب)"
 *     description: "Get payment status for all students (حالة السداد لجميع الطلاب)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/payments/unpaid:
 *   get:
 *     summary: "Get unpaid students list (قائمة الطلاب غير المسددين)"
 *     description: "Get unpaid students list (قائمة الطلاب غير المسددين)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/playlists/grade/{gradeId}:
 *   get:
 *     summary: "Get playlists by grade (عرض قوائم التشغيل لصف دراسي)"
 *     description: "Get playlists by grade (عرض قوائم التشغيل لصف دراسي)"
 *     tags:
 *       - "Super Admin - Playlists"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/questions/{questionId}/download:
 *   get:
 *     summary: "Download question attachment (تنزيل ملف مرفق بالسؤال)"
 *     description: "Download question attachment (تنزيل ملف مرفق بالسؤال)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: "Question ID (معرف السؤال)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/questions/{questionId}/preview:
 *   get:
 *     summary: "Preview question attachment (معاينة ملف السؤال)"
 *     description: "Preview question attachment (معاينة ملف السؤال)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: "Question ID (معرف السؤال)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/questions/exam/{examId}:
 *   get:
 *     summary: "Get questions for exam (عرض أسئلة الامتحان)"
 *     description: "Get questions for exam (عرض أسئلة الامتحان)"
 *     tags:
 *       - "Super Admin - Questions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/grade:
 *   put:
 *     summary: "Grade essay answer (تصحيح إجابة مقالية لطالب)"
 *     description: "Grade essay answer (تصحيح إجابة مقالية لطالب)"
 *     tags:
 *       - "Super Admin - Student Answers"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         description: "Student Answer ID (معرف إجابة الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 description: "1 for correct, 0 for incorrect"
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-answers/{answerId}/preview:
 *   get:
 *     summary: "Preview student essay answer file (معاينة ملف إجابة الطالب)"
 *     description: "Preview student essay answer file (معاينة ملف إجابة الطالب)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         description: "Student Answer ID (معرف إجابة الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-answers/essay/exam/{examId}:
 *   get:
 *     summary: "Get essay answers for exam (عرض الإجابات المقالية للامتحان)"
 *     description: "Get essay answers for exam (عرض الإجابات المقالية للامتحان)"
 *     tags:
 *       - "Super Admin - Student Answers"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-answers/essay/pending:
 *   get:
 *     summary: "Get pending essay answers for grading (عرض الإجابات المقالية المعلقة للتصحيح)"
 *     description: "Get pending essay answers for grading (عرض الإجابات المقالية المعلقة للتصحيح)"
 *     tags:
 *       - "Super Admin - Student Answers"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/options:
 *   get:
 *     summary: "Get most selected options for question (الخيارات الأكثر اختياراً)"
 *     description: "Get most selected options for question (الخيارات الأكثر اختياراً)"
 *     tags:
 *       - "Super Admin - Options"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: "Question ID (معرف السؤال)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-answers/question/{questionId}/stats:
 *   get:
 *     summary: "Get answer statistics for question (إحصائيات إجابات السؤال)"
 *     description: "Get answer statistics for question (إحصائيات إجابات السؤال)"
 *     tags:
 *       - "Super Admin - Student Answers"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: "Question ID (معرف السؤال)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}:
 *   get:
 *     summary: "Get student attempts for exam (عرض محاولات الطلاب للامتحان)"
 *     description: "Get student attempts for exam (عرض محاولات الطلاب للامتحان)"
 *     tags:
 *       - "Super Admin - Student Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-exams/exam/{examId}/stats:
 *   get:
 *     summary: "Get student exam attempts stats (إحصائيات محاولات الامتحان)"
 *     description: "Get student exam attempts stats (إحصائيات محاولات الامتحان)"
 *     tags:
 *       - "Super Admin - Student Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-exams/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get exam attempts stats by grade (إحصائيات محاولات الامتحانات لصف)"
 *     description: "Get exam attempts stats by grade (إحصائيات محاولات الامتحانات لصف)"
 *     tags:
 *       - "Super Admin - Student Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/student-exams/group/{groupId}/stats:
 *   get:
 *     summary: "Get exam attempts stats by group (إحصائيات محاولات الامتحانات لمجموعة)"
 *     description: "Get exam attempts stats by group (إحصائيات محاولات الامتحانات لمجموعة)"
 *     tags:
 *       - "Super Admin - Student Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/activate:
 *   post:
 *     summary: "POST super-admin students studentId activate"
 *     description: "POST super-admin students studentId activate"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/assignments:
 *   get:
 *     summary: "Get student assignments list (عرض واجبات الطالب)"
 *     description: "Get student assignments list (عرض واجبات الطالب)"
 *     tags:
 *       - "Super Admin - Assignments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/assignments/{assignmentId}:
 *   get:
 *     summary: "Get student assignment details (تفاصيل واجب للطالب)"
 *     description: "Get student assignment details (تفاصيل واجب للطالب)"
 *     tags:
 *       - "Super Admin - Assignments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: "Assignment ID (معرف الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance:
 *   get:
 *     summary: "Get student attendance record (سجل حضور الطالب بالكامل)"
 *     description: "Get student attendance record (سجل حضور الطالب بالكامل)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance/consecutive-absences:
 *   get:
 *     summary: "Get student consecutive absences (عدد الغياب المتتالي للطالب)"
 *     description: "Get student consecutive absences (عدد الغياب المتتالي للطالب)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance/monthly:
 *   get:
 *     summary: "Get student monthly attendance stats (إحصائيات حضور الطالب الشهرية)"
 *     description: "Get student monthly attendance stats (إحصائيات حضور الطالب الشهرية)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/attendance/total:
 *   get:
 *     summary: "Get student total attendance stats (إجمالي حضور وغياب الطالب)"
 *     description: "Get student total attendance stats (إجمالي حضور وغياب الطالب)"
 *     tags:
 *       - "Super Admin - Attendance"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/deactivate:
 *   post:
 *     summary: "POST super-admin students studentId deactivate"
 *     description: "POST super-admin students studentId deactivate"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/online/{attemptId}:
 *   get:
 *     summary: "Get student online exam attempt details (تفاصيل محاولة امتحان إلكتروني)"
 *     description: "Get student online exam attempt details (تفاصيل محاولة امتحان إلكتروني)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: attemptId
 *         required: true
 *         description: "Online Exam Attempt ID (معرف محاولة الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/online/history:
 *   get:
 *     summary: "Get student online exam history (سجل الامتحانات الإلكترونية للطالب)"
 *     description: "Get student online exam history (سجل الامتحانات الإلكترونية للطالب)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/paper:
 *   get:
 *     summary: "Get student paper exam results (نتائج الامتحانات الورقية للطالب)"
 *     description: "Get student paper exam results (نتائج الامتحانات الورقية للطالب)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/paper/{examId}:
 *   get:
 *     summary: "Get student result for paper exam (نتيجة الطالب في امتحان ورقي محدد)"
 *     description: "Get student result for paper exam (نتيجة الطالب في امتحان ورقي محدد)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/exams/results:
 *   get:
 *     summary: "Get all exam results for student (كافة نتائج امتحانات الطالب)"
 *     description: "Get all exam results for student (كافة نتائج امتحانات الطالب)"
 *     tags:
 *       - "Super Admin - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/payments:
 *   get:
 *     summary: "Get student payment history (سجل مدفوعات الطالب)"
 *     description: "Get student payment history (سجل مدفوعات الطالب)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/payments/current-subscription:
 *   get:
 *     summary: "Get student current month subscription (اشتراك الطالب للشهر الحالي)"
 *     description: "Get student current month subscription (اشتراك الطالب للشهر الحالي)"
 *     tags:
 *       - "Super Admin - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/playlists:
 *   get:
 *     summary: "Get playlists assigned to student (قوائم التشغيل المخصصة للطالب)"
 *     description: "Get playlists assigned to student (قوائم التشغيل المخصصة للطالب)"
 *     tags:
 *       - "Super Admin - Playlists"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/status:
 *   patch:
 *     summary: "PATCH super-admin students studentId status"
 *     description: "PATCH super-admin students studentId status"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/submissions:
 *   get:
 *     summary: "Get student assignment submissions (تسليمات واجبات الطالب)"
 *     description: "Get student assignment submissions (تسليمات واجبات الطالب)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/{studentId}/submissions/{submissionId}:
 *   get:
 *     summary: "Get student assignment submission details (تفاصيل تسليم واجب للطالب)"
 *     description: "Get student assignment submission details (تفاصيل تسليم واجب للطالب)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: submissionId
 *         required: true
 *         description: "Assignment Submission ID (معرف تسليم الواجب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/export/excel:
 *   get:
 *     summary: "GET super-admin students export excel"
 *     description: "GET super-admin students export excel"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/export/pdf:
 *   get:
 *     summary: "GET super-admin students export pdf"
 *     description: "GET super-admin students export pdf"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/barcode/{barcode}:
 *   post:
 *     summary: "Generate student password by barcode (توليد وتعيين كلمة مرور للطالب بالباركود)"
 *     description: "Generate student password by barcode (توليد وتعيين كلمة مرور للطالب بالباركود)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         description: "Student Barcode (باركود الطالب)"
 *         schema:
 *           type: string
 *           example: "STU1024"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/barcode/{barcode}/excel:
 *   get:
 *     summary: "Export student password to Excel by barcode (تصدير بيانات حساب الطالب بالباركود Excel)"
 *     description: "Export student password to Excel by barcode (تصدير بيانات حساب الطالب بالباركود Excel)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         description: "Student Barcode (باركود الطالب)"
 *         schema:
 *           type: string
 *           example: "STU1024"
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/barcode/{barcode}/pdf:
 *   get:
 *     summary: "Get printable PDF of student password by barcode (عرض وطباعة كارت كلمة مرور الطالب بالباركود PDF)"
 *     description: "Get printable PDF of student password by barcode (عرض وطباعة كارت كلمة مرور الطالب بالباركود PDF)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         description: "Student Barcode (باركود الطالب)"
 *         schema:
 *           type: string
 *           example: "STU1024"
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/excel:
 *   get:
 *     summary: "Export all student passwords to Excel (تصدير كلمات مرور جميع الطلاب Excel)"
 *     description: "Export all student passwords to Excel (تصدير كلمات مرور جميع الطلاب Excel)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/grade/{gradeId}/excel:
 *   get:
 *     summary: "Export grade passwords to Excel (تصدير كلمات مرور طلاب الصف Excel)"
 *     description: "Export grade passwords to Excel (تصدير كلمات مرور طلاب الصف Excel)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/grade/{gradeId}/pdf:
 *   get:
 *     summary: "Get printable PDF of grade passwords (عرض وطباعة كشف كلمات مرور الصف PDF)"
 *     description: "Get printable PDF of grade passwords (عرض وطباعة كشف كلمات مرور الصف PDF)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/group/{groupId}:
 *   post:
 *     summary: "POST super-admin students generate-passwords group groupId"
 *     description: "POST super-admin students generate-passwords group groupId"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/group/{groupId}/excel:
 *   get:
 *     summary: "Export group passwords to Excel (تصدير كلمات مرور طلاب المجموعة Excel)"
 *     description: "Export group passwords to Excel (تصدير كلمات مرور طلاب المجموعة Excel)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/group/{groupId}/pdf:
 *   get:
 *     summary: "Get printable PDF of group passwords (عرض وطباعة كشف كلمات مرور المجموعة PDF)"
 *     description: "Get printable PDF of group passwords (عرض وطباعة كشف كلمات مرور المجموعة PDF)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/pdf:
 *   get:
 *     summary: "Get printable PDF of all student passwords (عرض وطباعة كشف كلمات مرور جميع الطلاب PDF)"
 *     description: "Get printable PDF of all student passwords (عرض وطباعة كشف كلمات مرور جميع الطلاب PDF)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/student/{studentId}:
 *   post:
 *     summary: "POST super-admin students generate-passwords student studentId"
 *     description: "POST super-admin students generate-passwords student studentId"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/student/{studentId}/excel:
 *   get:
 *     summary: "GET super-admin students generate-passwords student studentId excel"
 *     description: "GET super-admin students generate-passwords student studentId excel"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/generate-passwords/student/{studentId}/pdf:
 *   get:
 *     summary: "Get printable PDF of student password (عرض وطباعة كلمة مرور الطالب PDF)"
 *     description: "Get printable PDF of student password (عرض وطباعة كلمة مرور الطالب PDF)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/passwords/export/excel:
 *   post:
 *     summary: "Export custom passwords list to Excel (تصدير كشف مخصص لكلمات المرور Excel)"
 *     description: "Export custom passwords list to Excel (تصدير كشف مخصص لكلمات المرور Excel)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "عنوان الكشف"
 *                 example: "كشف كلمات مرور الطلاب"
 *               passwords:
 *                 type: array
 *                 description: "قائمة الطلاب وكلمات المرور"
 *                 items:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                       example: 15
 *                     full_name:
 *                       type: string
 *                       example: "أحمد علي محمد"
 *                     barcode:
 *                       type: string
 *                       example: "STU1024"
 *                     phone:
 *                       type: string
 *                       example: "01012345678"
 *                     grade_name:
 *                       type: string
 *                       example: "الصف الأول الثانوي"
 *                     group_name:
 *                       type: string
 *                       example: "مجموعة أ"
 *                     password:
 *                       type: string
 *                       example: "STU1024@5821"
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/students/passwords/export/pdf:
 *   post:
 *     summary: "Export custom passwords list to printable PDF (تصدير كشف مخصص لكلمات المرور PDF)"
 *     description: "Export custom passwords list to printable PDF (تصدير كشف مخصص لكلمات المرور PDF)"
 *     tags:
 *       - "Super Admin - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "عنوان الكشف"
 *                 example: "كشف كلمات مرور الطلاب"
 *               passwords:
 *                 type: array
 *                 description: "قائمة الطلاب وكلمات المرور"
 *                 items:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                       example: 15
 *                     full_name:
 *                       type: string
 *                       example: "أحمد علي محمد"
 *                     barcode:
 *                       type: string
 *                       example: "STU1024"
 *                     phone:
 *                       type: string
 *                       example: "01012345678"
 *                     grade_name:
 *                       type: string
 *                       example: "الصف الأول الثانوي"
 *                     group_name:
 *                       type: string
 *                       example: "مجموعة أ"
 *                     password:
 *                       type: string
 *                       example: "STU1024@5821"
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get subscriptions stats by grade (إحصائيات الاشتراكات لصف دراسي)"
 *     description: "Get subscriptions stats by grade (إحصائيات الاشتراكات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Subscriptions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/group/{groupId}/stats:
 *   get:
 *     summary: "Get subscriptions stats by group (إحصائيات الاشتراكات لمجموعة)"
 *     description: "Get subscriptions stats by group (إحصائيات الاشتراكات لمجموعة)"
 *     tags:
 *       - "Super Admin - Subscriptions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: "Group ID (معرف المجموعة)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/month/{month}:
 *   get:
 *     summary: "Get subscriptions for specific month (اشتراكات شهر محدد)"
 *     description: "Get subscriptions for specific month (اشتراكات شهر محدد)"
 *     tags:
 *       - "Super Admin - Subscriptions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         description: "Month in YYYY-MM format (الشهر بصيغة YYYY-MM)"
 *         schema:
 *           type: string
 *           example: "2026-09"
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/overall:
 *   get:
 *     summary: "Get overall subscriptions summary (ملخص الاشتراكات العام)"
 *     description: "Get overall subscriptions summary (ملخص الاشتراكات العام)"
 *     tags:
 *       - "Super Admin - Subscriptions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/student/{studentId}:
 *   get:
 *     summary: "Get subscription history for student (سجل اشتراكات الطالب)"
 *     description: "Get subscription history for student (سجل اشتراكات الطالب)"
 *     tags:
 *       - "Super Admin - Subscriptions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: "Student ID (معرف الطالب)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/subscriptions/without-current:
 *   get:
 *     summary: "Get students without current month subscription (الطلاب بدون اشتراك للشهر الحالي)"
 *     description: "Get students without current month subscription (الطلاب بدون اشتراك للشهر الحالي)"
 *     tags:
 *       - "Super Admin - Subscriptions"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/videos/{videoId}/download:
 *   get:
 *     summary: "Download video file (تنزيل ملف الفيديو)"
 *     description: "Download video file (تنزيل ملف الفيديو)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: "Video ID (معرف الفيديو)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/videos/{videoId}/preview:
 *   get:
 *     summary: "Preview video file (معاينة الفيديو)"
 *     description: "Preview video file (معاينة الفيديو)"
 *     tags:
 *       - "Super Admin - Download & Preview"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: "Video ID (معرف الفيديو)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/videos/grade/{gradeId}:
 *   get:
 *     summary: "Get videos by grade (عرض الفيديوهات لصف دراسي)"
 *     description: "Get videos by grade (عرض الفيديوهات لصف دراسي)"
 *     tags:
 *       - "Super Admin - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/youtube/channel,/videos/youtube/channel:
 *   get:
 *     summary: "GET super-admin youtube channel, videos youtube channel"
 *     description: "GET super-admin youtube channel, videos youtube channel"
 *     tags:
 *       - "Super Admin - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/youtube/confirm-upload,/videos/youtube/confirm-upload:
 *   post:
 *     summary: "POST super-admin youtube confirm-upload, videos youtube confirm-upload"
 *     description: "POST super-admin youtube confirm-upload, videos youtube confirm-upload"
 *     tags:
 *       - "Super Admin - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/youtube/init-upload,/videos/youtube/init-upload:
 *   post:
 *     summary: "POST super-admin youtube init-upload, videos youtube init-upload"
 *     description: "POST super-admin youtube init-upload, videos youtube init-upload"
 *     tags:
 *       - "Super Admin - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/super-admin/youtube/validate,/videos/youtube/validate:
 *   post:
 *     summary: "POST super-admin youtube validate, videos youtube validate"
 *     description: "POST super-admin youtube validate, videos youtube validate"
 *     tags:
 *       - "Super Admin - Videos"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *       - ApiAuth: []
 *         SuperAdminKey: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/assistants:
 *   get:
 *     summary: "Get all active assistants (عرض قائمة المساعدين المتاحين)"
 *     description: "Get all active assistants (عرض قائمة المساعدين المتاحين)"
 *     tags:
 *       - "Teacher - Profile & Dashboard"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/assistants/{userId}:
 *   get:
 *     summary: "Get assistant details by ID (تفاصيل المساعد)"
 *     description: "Get assistant details by ID (تفاصيل المساعد)"
 *     tags:
 *       - "Teacher - Profile & Dashboard"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: "User ID (معرف المستخدم)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/exam-results/exam/{examId}/export/excel:
 *   get:
 *     summary: "GET teacher exam-results exam examId export excel"
 *     description: "GET teacher exam-results exam examId export excel"
 *     tags:
 *       - "Teacher - Profile & Dashboard"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/exam-results/exam/{examId}/export/pdf:
 *   get:
 *     summary: "GET teacher exam-results exam examId export pdf"
 *     description: "GET teacher exam-results exam examId export pdf"
 *     tags:
 *       - "Teacher - Profile & Dashboard"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: "Exam ID (معرف الامتحان)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/exams/{id}/export/excel:
 *   get:
 *     summary: "GET teacher exams id export excel"
 *     description: "GET teacher exams id export excel"
 *     tags:
 *       - "Teacher - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/exams/{id}/export/pdf:
 *   get:
 *     summary: "GET teacher exams id export pdf"
 *     description: "GET teacher exams id export pdf"
 *     tags:
 *       - "Teacher - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/exams/grade/{gradeId}/stats:
 *   get:
 *     summary: "Get paper exam stats by grade (إحصائيات الامتحانات الورقية لصف دراسي)"
 *     description: "Get paper exam stats by grade (إحصائيات الامتحانات الورقية لصف دراسي)"
 *     tags:
 *       - "Teacher - Paper Exams"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         description: "Grade ID (معرف الصف الدراسي)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/google/auth-url:
 *   get:
 *     summary: "GET teacher google auth-url"
 *     description: "GET teacher google auth-url"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/google/disconnect:
 *   post:
 *     summary: "POST teacher google disconnect"
 *     description: "POST teacher google disconnect"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/google/exchange-code:
 *   post:
 *     summary: "POST teacher google exchange-code"
 *     description: "POST teacher google exchange-code"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/google/status:
 *   get:
 *     summary: "GET teacher google status"
 *     description: "GET teacher google status"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions:
 *   get:
 *     summary: "GET teacher live-sessions"
 *     description: "GET teacher live-sessions"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions:
 *   post:
 *     summary: "POST teacher live-sessions"
 *     description: "POST teacher live-sessions"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
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
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}:
 *   delete:
 *     summary: "DELETE teacher live-sessions id"
 *     description: "DELETE teacher live-sessions id"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}:
 *   get:
 *     summary: "GET teacher live-sessions id"
 *     description: "GET teacher live-sessions id"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}:
 *   put:
 *     summary: "PUT teacher live-sessions id"
 *     description: "PUT teacher live-sessions id"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}/download:
 *   get:
 *     summary: "GET teacher live-sessions id download"
 *     description: "GET teacher live-sessions id download"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}/download-material:
 *   get:
 *     summary: "GET teacher live-sessions id download-material"
 *     description: "GET teacher live-sessions id download-material"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}/preview:
 *   get:
 *     summary: "GET teacher live-sessions id preview"
 *     description: "GET teacher live-sessions id preview"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}/recording:
 *   put:
 *     summary: "PUT teacher live-sessions id recording"
 *     description: "PUT teacher live-sessions id recording"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/live-sessions/{id}/sync-recording:
 *   post:
 *     summary: "POST teacher live-sessions id sync-recording"
 *     description: "POST teacher live-sessions id sync-recording"
 *     tags:
 *       - "Teacher - Live Sessions (Google Meet)"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "Resource ID (المعرف)"
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/payments/export/excel:
 *   get:
 *     summary: "GET teacher payments export excel"
 *     description: "GET teacher payments export excel"
 *     tags:
 *       - "Teacher - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/payments/export/pdf:
 *   get:
 *     summary: "GET teacher payments export pdf"
 *     description: "GET teacher payments export pdf"
 *     tags:
 *       - "Teacher - Payments"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/students/export/excel:
 *   get:
 *     summary: "GET teacher students export excel"
 *     description: "GET teacher students export excel"
 *     tags:
 *       - "Teacher - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "ملف إكسيل قابل للتنزيل (Downloadable Excel Workbook)"
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/students/export/pdf:
 *   get:
 *     summary: "GET teacher students export pdf"
 *     description: "GET teacher students export pdf"
 *     tags:
 *       - "Teacher - Students"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: "تقرير HTML قابل للطباعة والحفظ كـ PDF (Printable HTML / PDF Report)"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized / Token required
 *       '404':
 *         description: Resource not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/teacher/youtube/channel,/videos/youtube/channel:
 *   get:
 *     summary: "GET teacher youtube channel, videos youtube channel"
 *     description: "GET teacher youtube channel, videos youtube channel"
 *     tags:
 *       - "Teacher - Videos & Playlists"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     responses:
 *       '200':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/youtube/confirm-upload,/videos/youtube/confirm-upload:
 *   post:
 *     summary: "POST teacher youtube confirm-upload, videos youtube confirm-upload"
 *     description: "POST teacher youtube confirm-upload, videos youtube confirm-upload"
 *     tags:
 *       - "Teacher - Videos & Playlists"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/youtube/init-upload,/videos/youtube/init-upload:
 *   post:
 *     summary: "POST teacher youtube init-upload, videos youtube init-upload"
 *     description: "POST teacher youtube init-upload, videos youtube init-upload"
 *     tags:
 *       - "Teacher - Videos & Playlists"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /api/teacher/youtube/validate,/videos/youtube/validate:
 *   post:
 *     summary: "POST teacher youtube validate, videos youtube validate"
 *     description: "POST teacher youtube validate, videos youtube validate"
 *     tags:
 *       - "Teacher - Videos & Playlists"
 *     security:
 *       - ApiAuth: []
 *         ClientToken: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Operation completed successfully (تمت العملية بنجاح)
 *       '400':
 *         description: Bad Request / Validation Error (بيانات غير صحيحة)
 *       '401':
 *         description: Unauthorized / Token required (غير مصرح - مطلوب تسجيل الدخول)
 *       '403':
 *         description: Forbidden / Insufficient permissions (غير مصرح بالوصول لهذا الإجراء)
 *       '404':
 *         description: Resource Not Found (العنصر غير موجود)
 *       '500':
 *         description: Internal Server Error (خطأ داخلي في السيرفر)
 */
/**
 * @swagger
 * /webhook/webhook:
 *   get:
 *     summary: "Verify WhatsApp webhook (التحقق من ويب هوك الواتساب)"
 *     description: "Verify WhatsApp webhook (التحقق من ويب هوك الواتساب)"
 *     tags:
 *       - "Webhooks"
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         description: Webhook subscription mode (subscribe)
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         description: Webhook verification token
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         description: Verification challenge string from Meta
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
 *     summary: "Receive WhatsApp webhook notification (استلام أحداث ويب هوك الواتساب)"
 *     description: "Receive WhatsApp webhook notification (استلام أحداث ويب هوك الواتساب)"
 *     tags:
 *       - "Webhooks"
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         description: Webhook subscription mode (subscribe)
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         description: Webhook verification token
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         description: Verification challenge string from Meta
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
