const XLSX = require("xlsx");

// Create students template
const createStudentsTemplate = () => {
  const data = [
    {
      "الاسم الكامل": "أحمد محمد",
      الباركود: "1001",
      "المرحلة الدراسية": "الصف الأول",
      المجموعة: "مجموعة أ",
      "رقم الجوال": "01012345678",
      "رقم ولي الامر": "01098765432",
      ملاحظات: "مثال",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  return workbook;
};

// Create exam results template
const createExamResultsTemplate = () => {
  const data = [
    {
      barcode: "1001",
      degree: 85,
      notes: "ممتاز",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Results");

  return workbook;
};

// Create grades template
const createGradesTemplate = () => {
  const data = [
    {
      name: "الصف الأول",
      monthly_price: 500,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

  return workbook;
};

// Create groups template
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
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Groups");

  return workbook;
};

// Download template as Excel file
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
      throw new Error("نوع template غير صحيح");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

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
