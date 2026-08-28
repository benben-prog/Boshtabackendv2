const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

// ============================================
// CONFIGURATION
// ============================================

const BASE_URL = "http://localhost:3000/api";
const API_KEY =
  "Basic QWJkZWxyaG1hbl9FbHNoYWVyQGp1cGl0ZXJMZWFybi5jb206RWxzaGFlckBqdXBpdGVyTGVhcm4yMDI2";
const SUPER_ADMIN_KEY = "Basic RWxzaGFlcl9BZG1pbjpFbHNoYWVyQEFkbWluMjAyNg==";

// التوكنز
const superAdminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVyX2FkbWluIiwicGVybWlzc2lvbnMiOiJjZW50ZXJfbWFuYWdlbWVudCIsImlhdCI6MTc4Nzg1MTM0NywiZXhwIjoxNzg4NDU2MTQ3fQ.ZA8Qn_KF_uBLKwVBPRw_Gr0YksWEtAqzjrWXewjc29g";
const assistantToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6ImFzc2lzdGFudCIsInBlcm1pc3Npb25zIjoiY2VudGVyX21hbmFnZW1lbnQiLCJpYXQiOjE3ODc4NTE0MzMsImV4cCI6MTc4ODQ1NjIzM30.2BagtCwDz9IovvhlvS6anSnazRMEDDOIl8LFwboRUY0";

// متغيرات هتتعبا أثناء التشغيل
let testGradeName = "";
let testGroupName = "";
let testExamId = null;
let testStudentBarcode = "";

// عدادات النتائج
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// ============================================
// HELPERS
// ============================================

const ensureTempDir = () => {
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};

const createExcelFile = (data, fileName) => {
  ensureTempDir();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const filePath = path.join(process.cwd(), "temp", fileName);
  XLSX.writeFile(workbook, filePath);
  return filePath;
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.log("⚠️ فشل حذف الملف:", filePath);
  }
};

const printResult = (testName, success, data) => {
  totalTests++;
  if (success) {
    passedTests++;
  } else {
    failedTests++;
  }

  console.log("\n" + "=".repeat(70));
  console.log(`${success ? "✅" : "❌"} ${testName}`);
  console.log("=".repeat(70));
  if (success) {
    console.log("📊 النتيجة:");
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log("❌ الخطأ:", data);
  }
  console.log("=".repeat(70) + "\n");
};

const testDownloadTemplate = async (
  token,
  templateType,
  userType = "super-admin",
) => {
  const headers = {
    Authorization: API_KEY,
    "x-client-key": token,
  };

  if (userType === "super-admin") {
    headers["x-super-admin-key"] = SUPER_ADMIN_KEY;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/${userType}/${templateType}/template`,
      {
        headers,
        responseType: "arraybuffer",
      },
    );

    ensureTempDir();
    const fileName = `downloaded_${templateType}_template.xlsx`;
    const filePath = path.join(process.cwd(), "temp", fileName);
    fs.writeFileSync(filePath, response.data);

    printResult(`تحميل Template ${templateType} (${userType})`, true, {
      fileName,
      fileSize: response.data.length,
    });

    deleteFile(filePath);
    return true;
  } catch (error) {
    printResult(
      `تحميل Template ${templateType} (${userType})`,
      false,
      error.response?.data || error.message,
    );
    return false;
  }
};

const testBulkUpload = async (
  token,
  endpoint,
  filePath,
  userType = "super-admin",
) => {
  const headers = {
    Authorization: API_KEY,
    "x-client-key": token,
  };

  if (userType === "super-admin") {
    headers["x-super-admin-key"] = SUPER_ADMIN_KEY;
  }

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      `${BASE_URL}/${userType}/${endpoint}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          ...headers,
        },
      },
    );

    return response.data;
  } catch (error) {
    return error.response?.data || null;
  }
};

// ============================================
// MAIN TEST FUNCTION
// ============================================

const runAllTests = async () => {
  console.log("\n🚀 بدء اختبارات Bulk Upload الشاملة\n");
  console.log("📅 الوقت:", new Date().toLocaleString("ar-EG"));
  console.log("\n");

  const timestamp = Date.now();

  // ============================================
  // 1. اختبار تحميل Templates
  // ============================================

  console.log("\n📁 [1] اختبار تحميل Templates\n");

  await testDownloadTemplate(superAdminToken, "students", "super-admin");
  await testDownloadTemplate(superAdminToken, "grades", "super-admin");
  await testDownloadTemplate(superAdminToken, "groups", "super-admin");
  await testDownloadTemplate(superAdminToken, "exam-results", "super-admin");

  await testDownloadTemplate(assistantToken, "students", "assistant");
  await testDownloadTemplate(assistantToken, "grades", "assistant");
  await testDownloadTemplate(assistantToken, "groups", "assistant");
  await testDownloadTemplate(assistantToken, "exam-results", "assistant");

  // ============================================
  // 2. إنشاء صف اختبار
  // ============================================

  console.log("\n📊 [2] إنشاء صف اختبار\n");

  const newGradeData = [{ name: `صف أساسي ${timestamp}`, monthly_price: 500 }];
  const newGradePath = createExcelFile(newGradeData, "test_new_grade.xlsx");
  const newGradeResult = await testBulkUpload(
    superAdminToken,
    "grades/bulk-upload",
    newGradePath,
    "super-admin",
  );

  if (
    newGradeResult &&
    newGradeResult.success &&
    newGradeResult.data.success_count > 0
  ) {
    testGradeName = `صف أساسي ${timestamp}`;
    printResult("إنشاء صف اختبار", true, newGradeResult.data);
  } else {
    printResult("إنشاء صف اختبار", false, newGradeResult);
  }
  deleteFile(newGradePath);

  // ============================================
  // 3. إنشاء مجموعة اختبار
  // ============================================

  console.log("\n📊 [3] إنشاء مجموعة اختبار\n");

  if (testGradeName) {
    const newGroupData = [
      {
        name: `مجموعة أساسية ${timestamp}`,
        grade_name: testGradeName,
        days: "سبت-اثنين",
        start_time: "10:00",
        end_time: "12:00",
        room: "قاعة 1",
      },
    ];
    const newGroupPath = createExcelFile(newGroupData, "test_new_group.xlsx");
    const newGroupResult = await testBulkUpload(
      superAdminToken,
      "groups/bulk-upload",
      newGroupPath,
      "super-admin",
    );

    if (
      newGroupResult &&
      newGroupResult.success &&
      newGroupResult.data.success_count > 0
    ) {
      testGroupName = `مجموعة أساسية ${timestamp}`;
      printResult("إنشاء مجموعة اختبار", true, newGroupResult.data);
    } else {
      printResult("إنشاء مجموعة اختبار", false, newGroupResult);
    }
    deleteFile(newGroupPath);
  }

  // ============================================
  // 4. اختبار رفع الصفوف
  // ============================================

  console.log("\n📊 [4] اختبار رفع الصفوف\n");

  // صفوف صحيحة
  const validGradesData = [
    { name: `صف صحيح ${timestamp}`, monthly_price: 600 },
  ];
  const validGradesPath = createExcelFile(
    validGradesData,
    "test_valid_grades.xlsx",
  );
  const validGradesResult = await testBulkUpload(
    superAdminToken,
    "grades/bulk-upload",
    validGradesPath,
    "super-admin",
  );
  printResult(
    "رفع صف صحيح (Super Admin)",
    validGradesResult &&
      validGradesResult.success &&
      validGradesResult.data.success_count === 1,
    validGradesResult?.data,
  );
  deleteFile(validGradesPath);

  // صفوف خاطئة
  const invalidGradesData = [
    { name: `صف مكرر ${timestamp}`, monthly_price: 700 },
    { name: `صف مكرر ${timestamp}`, monthly_price: 800 },
    { name: "", monthly_price: 500 },
  ];
  const invalidGradesPath = createExcelFile(
    invalidGradesData,
    "test_invalid_grades.xlsx",
  );
  const invalidGradesResult = await testBulkUpload(
    assistantToken,
    "grades/bulk-upload",
    invalidGradesPath,
    "assistant",
  );
  printResult(
    "رفع صفوف خاطئة (Assistant)",
    invalidGradesResult &&
      invalidGradesResult.success &&
      invalidGradesResult.data.error_count === 3,
    invalidGradesResult?.data,
  );
  deleteFile(invalidGradesPath);

  // ============================================
  // 5. اختبار رفع المجموعات
  // ============================================

  console.log("\n📊 [5] اختبار رفع المجموعات\n");

  if (testGradeName) {
    const validGroupsData = [
      {
        name: `مجموعة صحيحة ${timestamp}`,
        grade_name: testGradeName,
        days: "احد-ثلاثاء",
        start_time: "12:00",
        end_time: "14:00",
        room: "قاعة 2",
      },
    ];
    const validGroupsPath = createExcelFile(
      validGroupsData,
      "test_valid_groups.xlsx",
    );
    const validGroupsResult = await testBulkUpload(
      assistantToken,
      "groups/bulk-upload",
      validGroupsPath,
      "assistant",
    );
    printResult(
      "رفع مجموعة صحيحة (Assistant)",
      validGroupsResult &&
        validGroupsResult.success &&
        validGroupsResult.data.success_count === 1,
      validGroupsResult?.data,
    );
    deleteFile(validGroupsPath);
  }

  // ============================================
  // 6. اختبار رفع الطلاب
  // ============================================

  console.log("\n📊 [6] اختبار رفع الطلاب\n");

  if (testGradeName && testGroupName) {
    testStudentBarcode = `9${String(timestamp).slice(-9)}`;

    const validStudentsData = [
      {
        barcode: testStudentBarcode,
        full_name: `طالب صحيح ${timestamp}`,
        phone: "01012345671",
        parent_phone: "01098765431",
        grade_name: testGradeName,
        group_name: testGroupName,
        notes: "اختبار",
      },
    ];
    const validStudentsPath = createExcelFile(
      validStudentsData,
      "test_valid_students.xlsx",
    );
    const validStudentsResult = await testBulkUpload(
      superAdminToken,
      "students/bulk-upload",
      validStudentsPath,
      "super-admin",
    );
    printResult(
      "رفع طالب صحيح (Super Admin)",
      validStudentsResult &&
        validStudentsResult.success &&
        validStudentsResult.data.success_count === 1,
      validStudentsResult?.data,
    );
    deleteFile(validStudentsPath);
  } else {
    printResult("رفع طالب صحيح (Super Admin)", false, "لا يوجد صف أو مجموعة");
  }

  // ============================================
  // 7. اختبار رفع الطلاب الخاطئين
  // ============================================

  console.log("\n📊 [7] اختبار رفع الطلاب الخاطئين\n");

  if (testGradeName && testGroupName) {
    const invalidStudentsData = [
      {
        barcode: "12345", // باركود قصير
        full_name: `طالب غلط ${timestamp}`,
        phone: "12345", // رقم غلط
        parent_phone: "01098765432",
        grade_name: testGradeName,
        group_name: testGroupName,
      },
    ];
    const invalidStudentsPath = createExcelFile(
      invalidStudentsData,
      "test_invalid_students.xlsx",
    );
    const invalidStudentsResult = await testBulkUpload(
      assistantToken,
      "students/bulk-upload",
      invalidStudentsPath,
      "assistant",
    );
    printResult(
      "رفع طالب خاطئ (Assistant)",
      invalidStudentsResult &&
        invalidStudentsResult.success &&
        invalidStudentsResult.data.error_count === 1,
      invalidStudentsResult?.data,
    );
    deleteFile(invalidStudentsPath);
  }

  // ============================================
  // 8. اختبار الملف الفاضي والأعمدة الغلط
  // ============================================

  console.log("\n📊 [8] اختبار حالات خاصة\n");

  const emptyPath = createExcelFile([], "test_empty.xlsx");
  const emptyResult = await testBulkUpload(
    superAdminToken,
    "students/bulk-upload",
    emptyPath,
    "super-admin",
  );
  printResult(
    "رفع ملف فاضي",
    emptyResult && emptyResult.success === false,
    emptyResult,
  );
  deleteFile(emptyPath);

  const wrongColumnsPath = createExcelFile(
    [{ wrong: "test" }],
    "test_wrong.xlsx",
  );
  const wrongColumnsResult = await testBulkUpload(
    superAdminToken,
    "students/bulk-upload",
    wrongColumnsPath,
    "super-admin",
  );
  printResult(
    "رفع ملف بأعمدة غلط",
    wrongColumnsResult && wrongColumnsResult.success === false,
    wrongColumnsResult,
  );
  deleteFile(wrongColumnsPath);

  // ============================================
  // الملخص النهائي
  // ============================================

  console.log("\n" + "=".repeat(70));
  console.log("📊 الملخص النهائي");
  console.log("=".repeat(70));
  console.log(`✅ الاختبارات الناجحة: ${passedTests}/${totalTests}`);
  console.log(`❌ الاختبارات الفاشلة: ${failedTests}/${totalTests}`);
  console.log(
    `📈 نسبة النجاح: ${((passedTests / totalTests) * 100).toFixed(2)}%`,
  );
  console.log("=".repeat(70) + "\n");
};

// تشغيل الاختبارات
runAllTests().catch((error) => {
  console.error("❌ خطأ غير متوقع:", error);
});
