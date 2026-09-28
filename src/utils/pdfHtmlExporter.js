const { formatEgyptTime } = require("./timezone");

/**
 * Base HTML document wrapper with Cairo font, RTL direction, and print styles
 */
function wrapHtmlReport({ title, subtitle, badges = [], statsCards = [], tableHeaders = [], tableRows = [], excelUrl = null }) {
  const generatedAt = formatEgyptTime(new Date(), "YYYY-MM-DD HH:mm:ss");

  const badgesHtml = badges
    .filter(b => b && b.value)
    .map(b => `<span class="badge"><strong>${b.label}:</strong> ${b.value}</span>`)
    .join("");

  const statsCardsHtml = statsCards.length > 0 ? `
    <div class="stats-grid">
      ${statsCards.map(s => `
        <div class="stat-card ${s.color || ''}">
          <div class="stat-label">${s.label}</div>
          <div class="stat-value">${s.value}</div>
          ${s.hint ? `<div class="stat-hint">${s.hint}</div>` : ''}
        </div>
      `).join("")}
    </div>
  ` : "";

  const tableHeadersHtml = tableHeaders
    .map(h => `<th style="${h.align ? `text-align: ${h.align};` : ''}">${h.label}</th>`)
    .join("");

  const tableRowsHtml = tableRows.length > 0 ? tableRows.map((row, idx) => `
    <tr>
      ${row.map((cell, cIdx) => {
        const align = tableHeaders[cIdx]?.align || 'right';
        return `<td style="text-align: ${align};">${cell !== null && cell !== undefined ? cell : '-'}</td>`;
      }).join("")}
    </tr>
  `).join("") : `<tr><td colspan="${tableHeaders.length}" class="no-data">لا توجد بيانات متطابقة</td></tr>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | منصة بوشطة التعليمية</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1e3a8a;
      --primary-dark: #172554;
      --accent: #0284c7;
      --success: #16a34a;
      --danger: #dc2626;
      --warning: #d97706;
      --bg: #f8fafc;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 24px;
    }

    .report-container {
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    /* Action bar on top for browser view */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px dashed var(--border);
    }

    .action-title {
      font-size: 14px;
      color: var(--text-muted);
    }

    .btn-group {
      display: flex;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background-color: var(--primary);
      color: #ffffff;
    }

    .btn-primary:hover {
      background-color: var(--primary-dark);
    }

    .btn-excel {
      background-color: #107c41;
      color: #ffffff;
    }

    .btn-excel:hover {
      background-color: #0b582e;
    }

    /* Platform Header */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 16px;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
    }

    .brand-sub {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .doc-meta {
      text-align: left;
      font-size: 13px;
      color: var(--text-muted);
    }

    .doc-title-block {
      margin-bottom: 20px;
    }

    .doc-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
    }

    .doc-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Badges */
    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #f1f5f9;
      color: var(--text);
      border-radius: 6px;
      font-size: 13px;
      border: 1px solid #e2e8f0;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px 18px;
      text-align: center;
    }

    .stat-card.success { border-right: 4px solid var(--success); }
    .stat-card.danger { border-right: 4px solid var(--danger); }
    .stat-card.primary { border-right: 4px solid var(--accent); }

    .stat-label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
      margin-top: 4px;
    }

    .stat-hint {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }

    thead th {
      background-color: #f1f5f9;
      color: var(--primary-dark);
      font-weight: 700;
      padding: 12px 10px;
      border-bottom: 2px solid #cbd5e1;
      border-top: 1px solid #cbd5e1;
    }

    tbody td {
      padding: 10px;
      border-bottom: 1px solid var(--border);
      color: var(--text);
    }

    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    tbody tr:hover {
      background-color: #f1f5f9;
    }

    .no-data {
      text-align: center;
      padding: 30px;
      color: var(--text-muted);
      font-size: 15px;
    }

    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-paid, .status-passed {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-unpaid, .status-failed {
      background-color: #fee2e2;
      color: #991b1b;
    }

    /* Footer */
    .report-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Print styles */
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }

      .report-container {
        border: none;
        padding: 0;
        box-shadow: none;
      }

      .no-print {
        display: none !important;
      }

      thead th {
        background-color: #f1f5f9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      tbody tr:nth-child(even) {
        background-color: #f8fafc !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .status-badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      @page {
        margin: 12mm 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Action Bar (Hidden on print) -->
    <div class="action-bar no-print">
      <div class="action-title">
        عرض الطباعة والحفظ كـ PDF (اضغط طباعة لاختيار حفظ بتنسيق PDF)
      </div>
      <div class="btn-group">
        <button class="btn btn-primary" onclick="window.print()">
          🖨️ طباعة / حفظ كـ PDF
        </button>
        ${excelUrl ? `
          <a class="btn btn-excel" href="${excelUrl}" target="_blank">
            📊 تصدير Excel
          </a>
        ` : ''}
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div>
        <div class="brand-title">منصة بوشطة التعليمية</div>
        <div class="brand-sub">نظام الإدارة الأكاديمية والامتحانات والمتابعة</div>
      </div>
      <div class="doc-meta">
        <div>تاريخ الاستخراج: <strong>${generatedAt}</strong></div>
        <div>التوقيت: <strong>توقيت مصر الرسمي (Cairo)</strong></div>
      </div>
    </div>

    <!-- Document Info -->
    <div class="doc-title-block">
      <h1 class="doc-title">${title}</h1>
      ${subtitle ? `<p class="doc-subtitle">${subtitle}</p>` : ''}
    </div>

    ${badgesHtml ? `<div class="badges-row">${badgesHtml}</div>` : ''}

    ${statsCardsHtml}

    <!-- Table -->
    <table>
      <thead>
        <tr>${tableHeadersHtml}</tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
      </tbody>
    </table>

    <!-- Footer -->
    <div class="report-footer">
      <div>تم إصدار هذا الكشف آلياً من منصة بوشطة التعليمية</div>
      <div>صفحة 1 من 1</div>
    </div>
  </div>

  <script>
    // Auto-trigger print if requested via query parameter
    if (new URLSearchParams(window.location.search).get('print') === 'true') {
      window.onload = () => setTimeout(() => window.print(), 500);
    }
  </script>
</body>
</html>`;
}

/**
 * 1. Render Students Printable HTML Report
 */
function renderStudentsReportHtml({ students, meta = {}, excelUrl = null }) {
  const tableHeaders = [
    { label: "م", align: "center" },
    { label: "الباركود", align: "center" },
    { label: "اسم الطالب", align: "right" },
    { label: "رقم الهاتف", align: "center" },
    { label: "رقم ولي الأمر", align: "center" },
    { label: "المرحلة الدراسية", align: "right" },
    { label: "المجموعة", align: "right" },
    { label: "المبلغ الشهري", align: "center" },
    { label: "حالة التفعيل", align: "center" },
    { label: "حالة الاشتراك", align: "center" },
  ];

  const tableRows = students.map((s, idx) => {
    const isPaid = s.payment_status === "paid";
    const isInactive = s.is_active === false;
    const activationBadge = isInactive
      ? `<span class="status-badge" style="background-color: #fee2e2; color: #991b1b; font-weight: bold;">غير مفعل (${s.deactivation_reason || "غياب متكرر"})</span>`
      : `<span class="status-badge" style="background-color: #dcfce7; color: #166534; font-weight: bold;">مفعل</span>`;

    return [
      idx + 1,
      s.barcode || "-",
      `<strong>${s.full_name || "-"}</strong>`,
      s.phone || "-",
      s.parent_phone || "-",
      s.grade_name || "-",
      s.group_name || "-",
      s.required_amount ? `${s.required_amount} ج.م` : "-",
      activationBadge,
      `<span class="status-badge ${isPaid ? 'status-paid' : 'status-unpaid'}">${isPaid ? 'مدفوع' : 'غير مدفوع'}</span>`,
    ];
  });

  const activeCount = students.filter(s => s.is_active !== false).length;
  const inactiveCount = students.length - activeCount;
  const paidCount = students.filter(s => s.payment_status === "paid").length;
  const unpaidCount = students.length - paidCount;

  return wrapHtmlReport({
    title: "كشف بيانات الطلاب",
    subtitle: `إجمالي الطلاب المسجلين: ${students.length}`,
    badges: [
      { label: "المرحلة الدراسية", value: meta.gradeName || "الكل" },
      { label: "المجموعة", value: meta.groupName || "الكل" },
      { label: "بحث", value: meta.search || null },
    ],
    statsCards: [
      { label: "إجمالي الطلاب", value: students.length, color: "primary" },
      { label: "مفعلين", value: activeCount, color: "success" },
      { label: "غير مفعلين", value: inactiveCount, color: "danger" },
      { label: "مسددي اشتراك الشهر", value: paidCount, color: "success" },
      { label: "غير المسددين", value: unpaidCount, color: "warning" },
    ],
    tableHeaders,
    tableRows,
    excelUrl,
  });
}

/**
 * 2. Render Paper Exam Results Printable HTML Report
 */
function renderExamResultsReportHtml({ exam, results, stats = {}, excelUrl = null }) {
  const tableHeaders = [
    { label: "م", align: "center" },
    { label: "الباركود", align: "center" },
    { label: "اسم الطالب", align: "right" },
    { label: "الدرجة", align: "center" },
    { label: "الدرجة الكلية", align: "center" },
    { label: "النسبة المئوية", align: "center" },
    { label: "الحالة", align: "center" },
    { label: "ملاحظات", align: "right" },
  ];

  const tableRows = results.map((r, idx) => {
    const isAbsent = r.is_absent === true || r.is_absent === "true" || r.is_absent === 1;
    const isPassed = !isAbsent && Number(r.percentage) >= 50;
    const degreeDisplay = isAbsent 
      ? `<span style="color: var(--danger); font-weight: 700;">غياب</span>`
      : `<span style="font-weight: 700;">${r.degree}</span>`;
    const statusDisplay = isAbsent
      ? `<span class="status-badge" style="background-color: #fee2e2; color: #991b1b; font-weight: bold;">غياب</span>`
      : `<span class="status-badge ${isPassed ? 'status-passed' : 'status-failed'}">${isPassed ? 'ناجح' : 'راسب'}</span>`;
    return [
      idx + 1,
      r.barcode || "-",
      `<strong>${r.full_name || "-"}</strong>`,
      degreeDisplay,
      r.total_degree || exam?.total_degree || "-",
      isAbsent ? "0%" : `${r.percentage}%`,
      statusDisplay,
      r.notes || "-",
    ];
  });

  return wrapHtmlReport({
    title: `كشف نتائج: ${exam?.title || "الامتحان الورقي"}`,
    subtitle: `تاريخ الامتحان: ${exam?.exam_date ? formatEgyptTime(exam.exam_date, "YYYY-MM-DD") : "-"} | الدرجة الكلية: ${exam?.total_degree || "-"}`,
    badges: [
      { label: "المرحلة الدراسية", value: exam?.grade_name || null },
      { label: "المجموعة", value: exam?.group_name || null },
    ],
    statsCards: [
      { label: "عدد الطلاب", value: stats.students_count || results.length, color: "primary" },
      { label: "متوسط الدرجات", value: stats.average_degree || "-", hint: "من " + (exam?.total_degree || 0) },
      { label: "أعلى درجة", value: stats.highest_degree || "-", color: "success" },
      { label: "أقل درجة", value: stats.lowest_degree || "-", color: "danger" },
      { label: "نسبة النجاح", value: stats.students_count ? `${Math.round(((stats.passed_count || 0) / stats.students_count) * 100)}%` : "-", color: "success" },
    ],
    tableHeaders,
    tableRows,
    excelUrl,
  });
}

/**
 * 3. Render Payments Printable HTML Report
 */
function renderPaymentsReportHtml({ payments, meta = {}, stats = {}, excelUrl = null }) {
  const tableHeaders = [
    { label: "م", align: "center" },
    { label: "رقم الدفعة", align: "center" },
    { label: "الباركود", align: "center" },
    { label: "اسم الطالب", align: "right" },
    { label: "حالة الطالب", align: "center" },
    { label: "المرحلة", align: "right" },
    { label: "المجموعة", align: "right" },
    { label: "المبلغ المدفوع", align: "center" },
    { label: "نوع الدفع", align: "center" },
    { label: "شهر الاشتراك", align: "center" },
    { label: "تاريخ الدفع", align: "center" },
  ];

  const totalAmount = meta.totalAmount !== undefined 
    ? meta.totalAmount 
    : payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const tableRows = payments.map((p, idx) => {
    const isInactive = p.student_is_active === false || p.student_status === "غير مفعل";
    const statusBadge = isInactive
      ? `<span class="status-badge" style="background-color: #fee2e2; color: #991b1b; font-weight: bold;">غير مفعل</span>`
      : `<span class="status-badge" style="background-color: #dcfce7; color: #166534; font-weight: bold;">مفعل</span>`;

    return [
      idx + 1,
      p.id,
      p.barcode || "-",
      `<strong>${p.student_name || p.full_name || "-"}</strong>`,
      statusBadge,
      p.grade_name || "-",
      p.group_name || "-",
      `<strong>${p.amount} ج.م</strong>`,
      p.payment_mode === "custom" ? "مخصص" : "عادي",
      p.subscription_month || "-",
      p.payment_date ? formatEgyptTime(p.payment_date, "YYYY-MM-DD HH:mm") : "-",
    ];
  });

  return wrapHtmlReport({
    title: "تقرير سجل المدفوعات والتحصيل",
    subtitle: `إجمالي عدد الدفعات: ${payments.length} عملية سداد`,
    badges: [
      { label: "المرحلة الدراسية", value: meta.gradeName || "الكل" },
      { label: "المجموعة", value: meta.groupName || "الكل" },
      { label: "الشهر", value: meta.month || "الكل" },
    ],
    statsCards: [
      { label: "إجمالي المحصل", value: `${totalAmount.toLocaleString()} ج.م`, color: "success" },
      { label: "عدد الدفعات", value: payments.length, color: "primary" },
    ],
    tableHeaders,
    tableRows,
    excelUrl,
  });
}

/**
 * 4. Render Passwords Printable HTML Report
 */
function renderPasswordsReportHtml({ passwords = [], meta = {}, excelUrl = null }) {
  const tableHeaders = [
    { label: "م", align: "center" },
    { label: "اسم الطالب", align: "right" },
    { label: "كود الطالب (الباركود)", align: "center" },
    { label: "رقم الموبايل", align: "center" },
    { label: "المرحلة الدراسية", align: "right" },
    { label: "المجموعة", align: "right" },
    { label: "كلمة المرور المؤقتة", align: "center" },
  ];

  const tableRows = passwords.map((p, idx) => [
    idx + 1,
    `<strong>${p.full_name || "-"}</strong>`,
    `<span style="font-family: monospace; font-size: 14px; font-weight: bold; color: var(--primary);">${p.barcode || "-"}</span>`,
    p.phone ? `<span dir="ltr" style="font-family: monospace; font-size: 13px;">${p.phone}</span>` : "-",
    p.grade_name || meta.gradeName || "-",
    p.group_name || meta.groupName || "-",
    `<span style="font-family: monospace; font-size: 14px; font-weight: 700; background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 4px; border: 1px solid #fcd34d; letter-spacing: 0.5px;">${p.password || "-"}</span>`,
  ]);

  return wrapHtmlReport({
    title: meta.title || "كشف بيانات دخول وكلمات مرور الطلاب",
    subtitle: `إجمالي عدد الحسابات: ${passwords.length}`,
    badges: [
      { label: "المرحلة الدراسية", value: meta.gradeName || null },
      { label: "المجموعة", value: meta.groupName || null },
      { label: "عدد الطلاب", value: passwords.length.toString() },
    ],
    statsCards: [
      { label: "إجمالي الحسابات", value: passwords.length, color: "primary" },
      { label: "تم توليد وتعيين الباسورد", value: passwords.length, color: "success" },
    ],
    tableHeaders,
    tableRows,
    excelUrl,
  });
}

function sendReportHtml(res, html) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(html);
}

module.exports = {
  renderStudentsReportHtml,
  renderExamResultsReportHtml,
  renderPaymentsReportHtml,
  renderPasswordsReportHtml,
  sendReportHtml,
};
