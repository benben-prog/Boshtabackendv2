const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

/**
 * إنشاء Template للطلاب
 */
const createStudentsTemplate = () => {
  const data = [
    {
      barcode: "1001",
      full_name: "أحمد محمد",
      phone: "01012345678",
      parent_phone: "01098765432",
      grade_name: "الصف الأول",
      group_name: "مجموعة أ",
      notes: "مثال",
    },
    {
      barcode: "1002",
      full_name: "سارة علي",
      phone: "01112345678",
      parent_phone: "01198765432",
      grade_name: "الصف الأول",
      group_name: "مجموعة أ",
      notes: "",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  return workbook;
};

/**
 * إنشاء Template للدرجات
 */
const createExamResultsTemplate = () => {
  const data = [
    {
      barcode: "1001",
      degree: 85,
      notes: "ممتاز",
    },
    {
      barcode: "1002",
      degree: 90,
      notes: "",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Results");

  return workbook;
};

/**
 * إنشاء Template للصفوف
 */
const createGradesTemplate = () => {
  const data = [
    {
      name: "الصف الأول",
      monthly_price: 500,
    },
    {
      name: "الصف الثاني",
      monthly_price: 600,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

  return workbook;
};

/**
 * إنشاء Template للمجموعات
 */
const createGroupsTemplate = () => {
  const data = [
    {
      name: "مجموعة أ",
      grade_name: "الصف الأول",
      days: "سبت-اثنين-اربعاء",
      start_time: "10:00",
      end_time: "12:00",
      room: "قاعة 1",
    },
    {
      name: "مجموعة ب",
      grade_name: "الصف الأول",
      days: "احد-ثلاثاء-خميس",
      start_time: "12:00",
      end_time: "14:00",
      room: "قاعة 2",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Groups");

  return workbook;
};

/**
 * إرسال الـ Template كملف Excel
 * @param {object} res - Response object
 * @param {string} type - نوع الـ template
 */
const downloadTemplate = (res, type) => {
  let workbook;
  let fileName;

  switch (type) {
    case "students":
      workbook = createStudentsTemplate();
      fileName = "students_template.xlsx";
      break;
    case "exam-results":
      workbook = createExamResultsTemplate();
      fileName = "exam_results_template.xlsx";
      break;
    case "grades":
      workbook = createGradesTemplate();
      fileName = "grades_template.xlsx";
      break;
    case "groups":
      workbook = createGroupsTemplate();
      fileName = "groups_template.xlsx";
      break;
    default:
      throw new Error("نوع template غير صحيح!");
  }

  // كتابة الملف
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  // إرسال الملف
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  return res.send(buffer);
};

module.exports = {
  downloadTemplate,
};
