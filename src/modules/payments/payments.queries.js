/* ============================================
   PAYMENTS QUERIES
   ============================================ */

// Get subscription required amount
const getSubscriptionAmount = `
SELECT required_amount, status
FROM subscriptions
WHERE id = $1 AND deleted = 0
`;

// Create a new payment - amount comes from subscription
const createPayment = `
INSERT INTO payments (subscription_id, student_id, amount, payment_date, notes)
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`;

// Auto update subscription status to paid
const markSubscriptionAsPaid = `
UPDATE subscriptions
SET status = 'paid'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Get all payments with filters - 20 per page
const getAllPayments = `
SELECT 
  p.id,
  p.subscription_id,
  p.student_id,
  s.full_name AS student_name,
  s.barcode,
  g.name AS grade_name,
  gr.name AS group_name,
  p.amount,
  p.payment_date,
  p.notes,
  sub.month AS subscription_month,
  sub.required_amount
FROM payments p
JOIN students s ON p.student_id = s.id AND s.deleted = 0
LEFT JOIN grades g ON s.grade_id = g.id
LEFT JOIN groups gr ON s.group_id = gr.id
LEFT JOIN subscriptions sub ON p.subscription_id = sub.id
WHERE ($1 = '' OR s.full_name ILIKE $1 OR s.barcode ILIKE $1)
  AND ($2::int IS NULL OR s.grade_id = $2::int)
  AND ($3::int IS NULL OR s.group_id = $3::int)
ORDER BY p.payment_date DESC
LIMIT 20 OFFSET (($4::int - 1) * 20)
`;

// Get payment by ID
const getPaymentById = `
SELECT 
  p.id,
  p.subscription_id,
  p.student_id,
  s.full_name AS student_name,
  s.barcode,
  g.name AS grade_name,
  gr.name AS group_name,
  p.amount,
  p.payment_date,
  p.notes,
  sub.month AS subscription_month,
  sub.required_amount
FROM payments p
JOIN students s ON p.student_id = s.id
LEFT JOIN grades g ON s.grade_id = g.id
LEFT JOIN groups gr ON s.group_id = gr.id
LEFT JOIN subscriptions sub ON p.subscription_id = sub.id
WHERE p.id = $1
`;

// Update payment
const updatePayment = `
UPDATE payments
SET 
  amount = $1,
  payment_date = $2,
  notes = $3
WHERE id = $4
RETURNING *
`;

// Delete payment - and revert subscription status to unpaid
const deletePayment = `
DELETE FROM payments
WHERE id = $1
RETURNING *
`;

// Get subscription ID from payment before delete
const getPaymentSubscriptionId = `
SELECT subscription_id
FROM payments
WHERE id = $1
`;

// Check if subscription has other payments
const checkOtherPayments = `
SELECT COUNT(*) AS count
FROM payments
WHERE subscription_id = $1 AND id != $2
`;

// Revert subscription to unpaid
const revertSubscriptionToUnpaid = `
UPDATE subscriptions
SET status = 'unpaid'
WHERE id = $1 AND deleted = 0
RETURNING *
`;

// Get payments by grade and month
const getPaymentsByGradeAndMonth = `
SELECT 
  p.id,
  p.student_id,
  s.full_name,
  s.barcode,
  g.name AS grade_name,
  gr.name AS group_name,
  p.amount,
  p.payment_date,
  p.notes
FROM payments p
JOIN students s ON p.student_id = s.id AND s.deleted = 0
JOIN grades g ON s.grade_id = g.id
JOIN groups gr ON s.group_id = gr.id
WHERE s.grade_id = $1 
  AND TO_CHAR(p.payment_date, 'YYYY-MM') = $2
ORDER BY p.payment_date DESC
`;

// Get payments by group and month
const getPaymentsByGroupAndMonth = `
SELECT 
  p.id,
  p.student_id,
  s.full_name,
  s.barcode,
  g.name AS grade_name,
  gr.name AS group_name,
  p.amount,
  p.payment_date,
  p.notes
FROM payments p
JOIN students s ON p.student_id = s.id AND s.deleted = 0
JOIN grades g ON s.grade_id = g.id
JOIN groups gr ON s.group_id = gr.id
WHERE s.group_id = $1 
  AND TO_CHAR(p.payment_date, 'YYYY-MM') = $2
ORDER BY p.payment_date DESC
`;

// Get monthly collections
const getMonthlyCollections = `
SELECT 
  TO_CHAR(p.payment_date, 'YYYY-MM') AS month,
  COUNT(p.id) AS total_payments,
  COALESCE(SUM(p.amount), 0) AS total_collected,
  COUNT(DISTINCT p.student_id) AS students_paid
FROM payments p
GROUP BY TO_CHAR(p.payment_date, 'YYYY-MM')
ORDER BY month DESC
`;

// Get unpaid students current month
const getUnpaidStudentsCurrentMonth = `
SELECT 
  s.id,
  s.full_name,
  s.barcode,
  s.parent_phone,
  g.name AS grade_name,
  g.monthly_price AS required_amount,
  gr.name AS group_name,
  sub.id AS subscription_id,
  sub.status
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
WHERE s.deleted = 0
  AND (sub.id IS NULL OR sub.status = 'unpaid')
ORDER BY s.full_name ASC
`;

// Get grade payment stats
const getGradePaymentStats = `
SELECT 
  g.id,
  g.name,
  g.monthly_price AS required_amount,
  COUNT(DISTINCT s.id) AS total_students,
  COALESCE(SUM(g.monthly_price), 0) AS total_required,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  COALESCE(SUM(g.monthly_price), 0) - COALESCE(SUM(p.amount), 0) AS total_remaining,
  COUNT(DISTINCT CASE WHEN sub.status = 'paid' THEN s.id END) AS fully_paid,
  COUNT(DISTINCT CASE WHEN sub.id IS NULL OR sub.status = 'unpaid' THEN s.id END) AS not_paid
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id AND s.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
LEFT JOIN payments p ON p.subscription_id = sub.id
WHERE g.id = $1 AND g.deleted = 0
GROUP BY g.id, g.name, g.monthly_price
`;

// Get group payment stats
const getGroupPaymentStats = `
SELECT 
  gr.id,
  gr.name,
  g.name AS grade_name,
  g.monthly_price AS required_amount,
  COUNT(DISTINCT s.id) AS total_students,
  COALESCE(SUM(g.monthly_price), 0) AS total_required,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  COALESCE(SUM(g.monthly_price), 0) - COALESCE(SUM(p.amount), 0) AS total_remaining,
  COUNT(DISTINCT CASE WHEN sub.status = 'paid' THEN s.id END) AS fully_paid,
  COUNT(DISTINCT CASE WHEN sub.id IS NULL OR sub.status = 'unpaid' THEN s.id END) AS not_paid
FROM groups gr
JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
LEFT JOIN payments p ON p.subscription_id = sub.id
WHERE gr.id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, g.name, g.monthly_price
`;

// Get overall payment stats
const getOverallPaymentStats = `
SELECT 
  COUNT(DISTINCT s.id) AS total_students,
  COALESCE(SUM(g.monthly_price), 0) AS total_required,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  COALESCE(SUM(g.monthly_price), 0) - COALESCE(SUM(p.amount), 0) AS total_remaining,
  COUNT(DISTINCT CASE WHEN sub.status = 'paid' THEN s.id END) AS fully_paid,
  COUNT(DISTINCT CASE WHEN sub.id IS NULL OR sub.status = 'unpaid' THEN s.id END) AS not_paid
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
LEFT JOIN payments p ON p.subscription_id = sub.id
WHERE s.deleted = 0
`;

// Get all students payment status
const getAllStudentsPaymentStatus = `
SELECT 
  s.id,
  s.barcode,
  s.full_name,
  s.grade_id,
  g.name AS grade_name,
  g.monthly_price AS required_amount,
  s.group_id,
  gr.name AS group_name,
  sub.id AS subscription_id,
  sub.month AS subscription_month,
  sub.status AS subscription_status,
  CASE 
    WHEN sub.status = 'paid' THEN 'paid'
    WHEN sub.id IS NULL THEN 'no_subscription'
    ELSE 'unpaid'
  END AS payment_status,
  COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.subscription_id = sub.id), 0) AS paid_amount
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
WHERE s.deleted = 0
ORDER BY s.full_name ASC
`;

// Get payments count with filters
const getPaymentsCount = `
SELECT COUNT(*) AS count
FROM payments p
JOIN students s ON p.student_id = s.id AND s.deleted = 0
WHERE ($1 = '' OR s.full_name ILIKE $1 OR s.barcode ILIKE $1)
  AND ($2::int IS NULL OR s.grade_id = $2::int)
  AND ($3::int IS NULL OR s.group_id = $3::int)
`;

module.exports = {
  getSubscriptionAmount,
  createPayment,
  markSubscriptionAsPaid,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentSubscriptionId,
  checkOtherPayments,
  revertSubscriptionToUnpaid,
  getPaymentsByGradeAndMonth,
  getPaymentsByGroupAndMonth,
  getMonthlyCollections,
  getUnpaidStudentsCurrentMonth,
  getGradePaymentStats,
  getGroupPaymentStats,
  getOverallPaymentStats,
  getAllStudentsPaymentStatus,
  getPaymentsCount,
};
