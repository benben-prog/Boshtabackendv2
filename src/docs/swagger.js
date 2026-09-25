const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const routeCatalog = require("./route-catalog.json");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "منصة بشتة التعليمية | Boshta Learn Platform API",
      version: "1.0.0",
      description:
        "التوثيق الشامل والرسمي لجميع واجهات برمجة التطبيقات (RESTful API) لمنصة بوشطة التعليمية.\n" +
        "يشمل التوثيق بوابات: الطلاب، أولياء الأمور، المساعدين، المدرسين، والإدارة العامة مع تفاصيل المعاملات، مسارات الاستدعاء، جسم الطلبات (Request Bodies)، ونماذج البيانات لفرق الفرونت إند والتطبيقات.",
    },
    servers: [
      { url: "http://localhost:3000", description: "السيرفر المحلي والتطوير (Local Development)" },
      { url: "https://backend.benb3n.cloud", description: "سيرفر الإنتاج الحي (Production Server)" },
    ],
    tags: [
      // 1. المصادقة والوصول الأساسي
      { name: "Auth", description: "المصادقة وتسجيل الدخول لكافة المستخدمين والطلاب (Authentication & Login)" },
      { name: "Parent", description: "بوابة ولي الأمر لمتابعة الطالب (Parent Portal)" },
      { name: "Webhooks", description: "استقبال ومعالجة أحداث الويب هوك الخارجية (External Webhooks)" },

      // 2. بوابة الطالب (Student Portal)
      { name: "Student - Dashboard & Profile", description: "بوابة الطالب: الصفحة الرئيسية والملف الشخصي (Student Profile & Dashboard)" },
      { name: "Student - Attendance", description: "بوابة الطالب: سجل الحضور والغياب (Student Attendance)" },
      { name: "Student - Online Exams", description: "بوابة الطالب: الامتحانات الإلكترونية والحلول والمراجعات (Student Online Exams)" },
      { name: "Student - Paper Exams", description: "بوابة الطالب: نتائج الامتحانات الورقية (Student Paper Exams)" },
      { name: "Student - Questions & Options", description: "بوابة الطالب: استعراض الأسئلة والخيارات (Student Questions & Options)" },
      { name: "Student - Assignments", description: "بوابة الطالب: الواجبات المدرسية وتسليم الحلول (Student Assignments)" },
      { name: "Student - Videos & Playlists", description: "بوابة الطالب: الفيديوهات التعليمية وقوائم التشغيل (Student Videos & Playlists)" },
      { name: "Student - Payments", description: "بوابة الطالب: الاشتراكات الشهرية والمدفوعات (Student Payments & Subscriptions)" },

      // 3. بوابة المدرس (Teacher Portal)
      { name: "Teacher - Profile & Dashboard", description: "لوحة المدرس: الملف الشخصي والإحصائيات والمساعدين (Teacher Profile & Assistants)" },
      { name: "Teacher - Grades", description: "لوحة المدرس: المراحل والصفوف الدراسية (Teacher Grades)" },
      { name: "Teacher - Groups", description: "لوحة المدرس: المجموعات والمواعيد (Teacher Groups)" },
      { name: "Teacher - Students", description: "لوحة المدرس: إدارة وعرض الطلاب (Teacher Students)" },
      { name: "Teacher - Attendance", description: "لوحة المدرس: جلسات وإحصائيات الحضور (Teacher Attendance)" },
      { name: "Teacher - Paper Exams", description: "لوحة المدرس: الامتحانات الورقية (Teacher Paper Exams)" },
      { name: "Teacher - Exam Results", description: "لوحة المدرس: نتائج الامتحانات الورقية (Teacher Exam Results)" },
      { name: "Teacher - Online Exams", description: "لوحة المدرس: الامتحانات الإلكترونية (Teacher Online Exams)" },
      { name: "Teacher - Questions & Options", description: "لوحة المدرس: بنك الأسئلة وخيارات الامتحان (Teacher Questions & Options)" },
      { name: "Teacher - Student Exams", description: "لوحة المدرس: محاولات الطلاب في الامتحانات الإلكترونية (Teacher Student Exams)" },
      { name: "Teacher - Student Answers", description: "لوحة المدرس: إجابات الطلاب وتصحيح المقالي (Teacher Student Answers)" },
      { name: "Teacher - Assignments", description: "لوحة المدرس: إدارة الواجبات المدرسية (Teacher Assignments)" },
      { name: "Teacher - Assignment Submissions", description: "لوحة المدرس: تسليمات الواجبات ورصد الدرجات (Teacher Assignment Submissions)" },
      { name: "Teacher - Videos & Playlists", description: "لوحة المدرس: الفيديوهات وقوائم التشغيل (Teacher Videos & Playlists)" },
      { name: "Teacher - Payments", description: "لوحة المدرس: متابعة المدفوعات والتحصيل (Teacher Payments)" },
      { name: "Teacher - Subscriptions", description: "لوحة المدرس: الاشتراكات الشهرية للطلاب (Teacher Subscriptions)" },
      { name: "Teacher - Download & Preview", description: "لوحة المدرس: معاينة وتنزيل المرفقات والملفات (Teacher File Downloads)" },

      // 4. بوابة المساعدين (Assistant Portal)
      { name: "Assistant - Profile & Dashboard", description: "لوحة المساعد: الملف الشخصي والإحصائيات العامة (Assistant Profile & Dashboard)" },
      { name: "Assistant - Grades", description: "لوحة المساعد: الصفوف والمراحل الدراسية (Assistant Grades)" },
      { name: "Assistant - Groups", description: "لوحة المساعد: المجموعات والمواعيد (Assistant Groups)" },
      { name: "Assistant - Students", description: "لوحة المساعد: إدارة شؤون الطلاب وبياناتهم (Assistant Students Management)" },
      { name: "Assistant - Bulk Upload", description: "لوحة المساعد: الرفع الجماعي لملفات الإكسيل (Assistant Bulk Excel Upload)" },
      { name: "Assistant - Attendance", description: "لوحة المساعد: تسجيل الحضور بالباركود وإدارة الجلسات (Assistant Attendance & Barcode)" },
      { name: "Assistant - Paper Exams", description: "لوحة المساعد: الامتحانات الورقية (Assistant Paper Exams)" },
      { name: "Assistant - Exam Results", description: "لوحة المساعد: نتائج الامتحانات الورقية ورصد الدرجات (Assistant Exam Results)" },
      { name: "Assistant - Online Exams", description: "لوحة المساعد: الامتحانات الإلكترونية (Assistant Online Exams)" },
      { name: "Assistant - Questions", description: "لوحة المساعد: أسئلة الامتحانات الإلكترونية (Assistant Questions)" },
      { name: "Assistant - Options", description: "لوحة المساعد: خيارات الأسئلة (Assistant Options)" },
      { name: "Assistant - Student Exams", description: "لوحة المساعد: محاولات الطلاب في الامتحانات الإلكترونية (Assistant Student Exams)" },
      { name: "Assistant - Student Answers", description: "لوحة المساعد: إجابات الطلاب وتصحيح المقالي (Assistant Student Answers)" },
      { name: "Assistant - Assignments", description: "لوحة المساعد: إدارة الواجبات المدرسية (Assistant Assignments)" },
      { name: "Assistant - Assignment Submissions", description: "لوحة المساعد: تسليمات الواجبات وتصحيحها (Assistant Assignment Submissions)" },
      { name: "Assistant - Videos", description: "لوحة المساعد: إدارة مكتبة الفيديوهات (Assistant Videos)" },
      { name: "Assistant - Playlists", description: "لوحة المساعد: إدارة قوائم التشغيل (Assistant Playlists)" },
      { name: "Assistant - Payments", description: "لوحة المساعد: تسجيل ومتابعة المدفوعات (Assistant Payments)" },
      { name: "Assistant - Subscriptions", description: "لوحة المساعد: إدارة الاشتراكات الشهرية (Assistant Subscriptions)" },
      { name: "Assistant - WhatsApp Messages", description: "لوحة المساعد: إدارة طابور وسجل رسائل الواتساب (Assistant WhatsApp Messages)" },
      { name: "Assistant - WhatsApp Templates", description: "لوحة المساعد: قوالب رسائل الواتساب (Assistant WhatsApp Templates)" },
      { name: "Assistant - Download & Preview", description: "لوحة المساعد: معاينة وتنزيل الملفات والمرفقات (Assistant File Downloads)" },

      // 5. بوابة الإدارة العامة (Super Admin Portal)
      { name: "Super Admin - Dashboard", description: "الإدارة العامة: لوحة الإحصائيات والمؤشرات الكلية (Super Admin Dashboard)" },
      { name: "Super Admin - Users", description: "الإدارة العامة: إدارة المستخدمين والمساعدين والمدرسين (Super Admin Users & Permissions)" },
      { name: "Super Admin - Settings", description: "الإدارة العامة: إعدادات المنصة وحالة النظام (Super Admin Platform Settings)" },
      { name: "Super Admin - Activity Log", description: "الإدارة العامة: سجل الأنشطة والعمليات الرقابي (Super Admin Activity Logs)" },
      { name: "Super Admin - Grades", description: "الإدارة العامة: إدارة الصفوف الدراسية والأسعار (Super Admin Grades & Pricing)" },
      { name: "Super Admin - Groups", description: "الإدارة العامة: إدارة المجموعات والمواعيد والقاعات (Super Admin Groups & Rooms)" },
      { name: "Super Admin - Students", description: "الإدارة العامة: إدارة الطلاب وملفاتهم الأكاديمية (Super Admin Students)" },
      { name: "Super Admin - Bulk Upload", description: "الإدارة العامة: الرفع الجماعي للطلاب والنتائج (Super Admin Bulk Upload)" },
      { name: "Super Admin - Attendance", description: "الإدارة العامة: إدارة ومراقبة الحضور والجلسات (Super Admin Attendance)" },
      { name: "Super Admin - Paper Exams", description: "الإدارة العامة: الامتحانات الورقية (Super Admin Paper Exams)" },
      { name: "Super Admin - Exam Results", description: "الإدارة العامة: نتائج الامتحانات الورقية (Super Admin Exam Results)" },
      { name: "Super Admin - Online Exams", description: "الإدارة العامة: الامتحانات الإلكترونية وإدارتها (Super Admin Online Exams)" },
      { name: "Super Admin - Questions", description: "الإدارة العامة: بنك الأسئلة للامتحانات الإلكترونية (Super Admin Question Bank)" },
      { name: "Super Admin - Options", description: "الإدارة العامة: خيارات أسئلة الامتحانات (Super Admin Question Options)" },
      { name: "Super Admin - Student Exams", description: "الإدارة العامة: سجل محاولات الامتحانات الإلكترونية (Super Admin Student Exams)" },
      { name: "Super Admin - Student Answers", description: "الإدارة العامة: إجابات الطلاب وتصحيح المقالي (Super Admin Student Answers)" },
      { name: "Super Admin - Assignments", description: "الإدارة العامة: إدارة الواجبات المدرسية (Super Admin Assignments)" },
      { name: "Super Admin - Assignment Submissions", description: "الإدارة العامة: تسليمات وتصحيح الواجبات (Super Admin Assignment Submissions)" },
      { name: "Super Admin - Videos", description: "الإدارة العامة: إدارة مكتبة الفيديوهات التعليمية (Super Admin Videos)" },
      { name: "Super Admin - Playlists", description: "الإدارة العامة: إدارة قوائم التشغيل التعليمية (Super Admin Playlists)" },
      { name: "Super Admin - Playlist Videos", description: "الإدارة العامة: ترتيب وتعيين فيديوهات القوائم (Super Admin Playlist Videos)" },
      { name: "Super Admin - Payments", description: "الإدارة العامة: إدارة المدفوعات والتقارير المالية (Super Admin Payments & Finance)" },
      { name: "Super Admin - Subscriptions", description: "الإدارة العامة: الاشتراكات الشهرية وحالات السداد (Super Admin Subscriptions)" },
      { name: "Super Admin - WhatsApp", description: "الإدارة العامة: إدارة نظام الواتساب والقوالب والإرسال (Super Admin WhatsApp System)" },
      { name: "Super Admin - Download & Preview", description: "الإدارة العامة: معاينة وتنزيل الملفات والمرفقات (Super Admin File Downloads)" },
    ],
    components: {
      securitySchemes: {
        ApiAuth: {
          type: "http",
          scheme: "basic",
          description: "مصادقة التطبيق الأساسية عبر اسم المستخدم وكلمة مرور الـ API (Basic Auth: API_USERNAME, API_PASSWORD)",
        },
        ClientToken: {
          type: "apiKey",
          in: "header",
          name: "x-client-key",
          description: "توكن العميل المشفر JWT يتم إرساله في هيدر x-client-key (يتم الحصول عليه بعد تسجيل الدخول)",
        },
        SuperAdminKey: {
          type: "apiKey",
          in: "header",
          name: "x-super-admin-key",
          description: "مفتاح التوثيق الخاص بالمدير العام Super Admin بصيغة Basic Base64 في هيدر x-super-admin-key",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "auth.docs.js"),
    path.join(__dirname, "student.docs.js"),
    path.join(__dirname, "parent.docs.js"),
    path.join(__dirname, "assistant.docs.js"),
    path.join(__dirname, "teacher.docs.js"),
    path.join(__dirname, "super-admin.docs.js"),
    path.join(__dirname, "generated-routes.docs.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const allowedOperations = new Set(
  routeCatalog.map(({ method, path: routePath }) => `${method} ${routePath}`),
);

for (const [routePath, pathItem] of Object.entries(swaggerSpec.paths || {})) {
  for (const method of Object.keys(pathItem)) {
    if (["parameters", "summary", "description"].includes(method)) continue;
    if (!allowedOperations.has(`${method.toUpperCase()} ${routePath}`)) {
      delete pathItem[method];
    }
  }
  if (!Object.keys(pathItem).some((key) =>
    !["parameters", "summary", "description"].includes(key),
  )) {
    delete swaggerSpec.paths[routePath];
  }
}

module.exports = swaggerSpec;
