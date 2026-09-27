const XLSX = require("xlsx");
const { formatEgyptTime } = require("./timezone");

/**
 * Encode string filename safely for Content-Disposition header
 */
function getEncodedFilename(fileName) {
  return encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, "%2A");
}

/**
 * Helper to send an Excel workbook buffer as a downloadable response
 */
function sendExcelResponse(res, buffer, fileName) {
  const encodedName = getEncodedFilename(fileName);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
  );
  res.setHeader("Cache-Control", "no-cache");
  return res.send(buffer);
}

/**
 * 1. Export Students to Excel
 */
function exportStudentsToExcel(students, meta = {}) {
  const data = students.map((s, index) => ({
    "م": index + 1,
    "كود الطالب (الباركود)": s.barcode || "-",
    "اسم الطالب": s.full_name || "-",
    "رقم الهاتف": s.phone || "-",
    "رقم ولي الأمر": s.parent_phone || "-",
    "المرحلة الدراسية": s.grade_name || "-",
    "المجموعة": s.group_name || "-",
    "المبلغ الشهري": s.required_amount !== undefined && s.required_amount !== null ? `${s.required_amount} ج.م` : "-",
    "حالة اشتراك الشهر": s.payment_status === "paid" ? "مدفوع" : "غير مدفوع",
    "ملاحظات": s.notes || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!views"] = [{ RTL: true }];

  // Column widths
  worksheet["!cols"] = [
    { wch: 6 },  // م
    { wch: 20 }, // الباركود
    { wch: 28 }, // اسم الطالب
    { wch: 16 }, // رقم الهاتف
    { wch: 16 }, // رقم ولي الأمر
    { wch: 20 }, // المرحلة
    { wch: 18 }, // المجموعة
    { wch: 15 }, // المبلغ
    { wch: 16 }, // حالة الاشتراك
    { wch: 25 }, // ملاحظات
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const dateStr = formatEgyptTime(new Date(), "YYYY-MM-DD");
  const fileName = `كشف_الطلاب_${meta.gradeName || "عام"}_${dateStr}.xlsx`;

  return { buffer, fileName };
}

/**
 * 2. Export Paper Exam Results to Excel
 */
function exportExamResultsToExcel(exam, results, stats = {}) {
  const data = results.map((r, index) => {
    const isPassed = Number(r.percentage) >= 50;
    return {
      "م": index + 1,
      "كود الطالب (الباركود)": r.barcode || "-",
      "اسم الطالب": r.full_name || "-",
      "الدرجة": Number(r.degree),
      "الدرجة الكلية": Number(r.total_degree || exam?.total_degree || 0),
      "النسبة المئوية": `${r.percentage}%`,
      "التقدير / الحالة": isPassed ? "ناجح" : "راسب",
      "ملاحظات": r.notes || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!views"] = [{ RTL: true }];

  worksheet["!cols"] = [
    { wch: 6 },  // م
    { wch: 20 }, // الباركود
    { wch: 28 }, // اسم الطالب
    { wch: 12 }, // الدرجة
    { wch: 14 }, // الدرجة الكلية
    { wch: 15 }, // النسبة
    { wch: 16 }, // الحالة
    { wch: 25 }, // ملاحظات
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "نتائج الامتحان");

  // Optional: Summary sheet
  if (stats && stats.students_count) {
    const summaryData = [
      { "البيان": "عنوان الامتحان", "القيمة": exam?.title || "-" },
      { "البيان": "تاريخ الامتحان", "القيمة": exam?.exam_date ? formatEgyptTime(exam.exam_date, "YYYY-MM-DD") : "-" },
      { "البيان": "الدرجة الكلية", "القيمة": exam?.total_degree || 0 },
      { "البيان": "إجمالي الطلاب الممتحنين", "القيمة": stats.students_count || 0 },
      { "البيان": "متوسط الدرجات", "القيمة": stats.average_degree || 0 },
      { "البيان": "أعلى درجة", "القيمة": stats.highest_degree || 0 },
      { "البيان": "أقل درجة", "القيمة": stats.lowest_degree || 0 },
      { "البيان": "عدد الناجحين", "القيمة": stats.passed_count || 0 },
      { "البيان": "عدد الراسبين", "القيمة": stats.failed_count || 0 },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!views"] = [{ RTL: true }];
    summarySheet["!cols"] = [{ wch: 25 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "إحصائيات الامتحان");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const examTitleClean = (exam?.title || "امتحان").replace(/[\/\\?%*:|"<>]/g, "-");
  const fileName = `نتائج_${examTitleClean}.xlsx`;

  return { buffer, fileName };
}

/**
 * 3. Export Payments to Excel
 */
function exportPaymentsToExcel(payments, meta = {}) {
  const data = payments.map((p, index) => ({
    "م": index + 1,
    "رقم الدفعة": p.id,
    "كود الطالب (الباركود)": p.barcode || "-",
    "اسم الطالب": p.student_name || p.full_name || "-",
    "المرحلة الدراسية": p.grade_name || "-",
    "المجموعة": p.group_name || "-",
    "المبلغ المدفوع": `${p.amount} ج.م`,
    "طريقة الدفع": p.payment_mode === "custom" ? "مخصص" : "عادي",
    "شهر الاشتراك": p.subscription_month || "-",
    "تاريخ الدفع": p.payment_date ? formatEgyptTime(p.payment_date, "YYYY-MM-DD HH:mm") : "-",
    "ملاحظات": p.notes || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!views"] = [{ RTL: true }];

  worksheet["!cols"] = [
    { wch: 6 },  // م
    { wch: 12 }, // رقم الدفعة
    { wch: 20 }, // الباركود
    { wch: 28 }, // اسم الطالب
    { wch: 20 }, // المرحلة
    { wch: 18 }, // المجموعة
    { wch: 16 }, // المبلغ
    { wch: 14 }, // طريقة الدفع
    { wch: 14 }, // شهر الاشتراك
    { wch: 20 }, // تاريخ الدفع
    { wch: 25 }, // ملاحظات
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "المدفوعات");

  // Summary sheet if totals exist
  if (meta.totalAmount !== undefined || meta.totalCount !== undefined) {
    const totalCollected = meta.totalAmount || payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const summaryData = [
      { "البيان": "إجمالي عدد الدفعات", "القيمة": payments.length },
      { "البيان": "إجمالي المبالغ المحصلة", "القيمة": `${totalCollected} ج.م` },
      { "البيان": "تاريخ استخراج التقرير", "القيمة": formatEgyptTime(new Date(), "YYYY-MM-DD HH:mm:ss") },
      { "البيان": "الفلتر المطبق (المرحلة)", "القيمة": meta.gradeName || "الكل" },
      { "البيان": "الفلتر المطبق (المجموعة)", "القيمة": meta.groupName || "الكل" },
      { "البيان": "الشهر", "القيمة": meta.month || "الكل" },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!views"] = [{ RTL: true }];
    summarySheet["!cols"] = [{ wch: 25 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "ملخص التحصيل");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const dateStr = formatEgyptTime(new Date(), "YYYY-MM-DD");
  const fileName = `تقرير_المدفوعات_${meta.month || dateStr}.xlsx`;

  return { buffer, fileName };
}

module.exports = {
  sendExcelResponse,
  exportStudentsToExcel,
  exportExamResultsToExcel,
  exportPaymentsToExcel,
};
