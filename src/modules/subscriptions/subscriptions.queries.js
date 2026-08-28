/* ============================================
   SUBSCRIPTIONS QUERIES
   ============================================ */

// Get student's grade monthly price
const getStudentGradePrice = `
SELECT g.monthly_price
FROM students s
JOIN grades g ON s.grade_id = g.id
WHERE s.id = $1 AND s.deleted = 0 AND g.deleted = 0
`;

// Create subscription - auto fetch required_amount from grade
const createSubscription = `
INSERT INTO subscriptions (student_id, month, required_amount)
SELECT $1, $2, g.monthly_price
FROM students s
JOIN grades g ON s.grade_id = g.id
WHERE s.id = $1 AND s.deleted = 0 AND g.deleted = 0
RETURNING *
`;

// Get student subscriptions
const getStudentSubscriptions = `
SELECT 
  sub.id,
  sub.month,
  sub.required_amount,
  sub.status,
  sub.created_at,
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.subscription_id = sub.id), 0
  ) AS paid_amount,
  sub.required_amount - COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.subscription_id = sub.id), 0
  ) AS remaining_amount
FROM subscriptions sub
WHERE sub.student_id = $1 AND sub.deleted = 0
ORDER BY sub.month DESC
`;

// Get subscriptions by month
const getSubscriptionsByMonth = `
SELECT 
  sub.id,
  sub.student_id,
  s.full_name,
  s.barcode,
  g.name AS grade_name,
  gr.name AS group_name,
  sub.required_amount,
  sub.status,
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.subscription_id = sub.id), 0
  ) AS paid_amount,
  sub.required_amount - COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.subscription_id = sub.id), 0
  ) AS remaining_amount
FROM subscriptions sub
JOIN students s ON sub.student_id = s.id AND s.deleted = 0
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE sub.month = $1 AND sub.deleted = 0
ORDER BY s.full_name ASC
`;

// Get students without subscription current month
const getStudentsWithoutSubscriptionCurrentMonth = `
SELECT 
  s.id,
  s.full_name,
  s.barcode,
  s.parent_phone,
  g.name AS grade_name,
  g.monthly_price AS required_amount,
  gr.name AS group_name
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN groups gr ON s.group_id = gr.id AND gr.deleted = 0
WHERE s.deleted = 0
  AND s.id NOT IN (
    SELECT sub.student_id
    FROM subscriptions sub
    WHERE sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
      AND sub.deleted = 0
  )
ORDER BY s.full_name ASC
`;

// Get grade subscription stats
const getGradeSubscriptionStats = `
SELECT 
  g.id,
  g.name,
  g.monthly_price AS required_amount,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT sub.id) AS total_subscriptions,
  COALESCE(SUM(g.monthly_price), 0) AS total_required,
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p 
     JOIN subscriptions sub2 ON p.subscription_id = sub2.id
     WHERE sub2.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
       AND sub2.student_id IN (SELECT id FROM students WHERE grade_id = g.id AND deleted = 0)
    ), 0
  ) AS total_paid
FROM grades g
LEFT JOIN students s ON g.id = s.grade_id AND s.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
WHERE g.id = $1 AND g.deleted = 0
GROUP BY g.id, g.name, g.monthly_price
`;

// Get group subscription stats
const getGroupSubscriptionStats = `
SELECT 
  gr.id,
  gr.name,
  g.name AS grade_name,
  g.monthly_price AS required_amount,
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT sub.id) AS total_subscriptions,
  COALESCE(SUM(g.monthly_price), 0) AS total_required,
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p 
     JOIN subscriptions sub2 ON p.subscription_id = sub2.id
     WHERE sub2.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
       AND sub2.student_id IN (SELECT id FROM students WHERE group_id = gr.id AND deleted = 0)
    ), 0
  ) AS total_paid
FROM groups gr
JOIN grades g ON gr.grade_id = g.id AND g.deleted = 0
LEFT JOIN students s ON gr.id = s.group_id AND s.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
WHERE gr.id = $1 AND gr.deleted = 0
GROUP BY gr.id, gr.name, g.name, g.monthly_price
`;

// Get overall subscription stats
const getOverallSubscriptionStats = `
SELECT 
  COUNT(DISTINCT s.id) AS total_students,
  COUNT(DISTINCT sub.id) AS total_subscriptions,
  COALESCE(SUM(g.monthly_price), 0) AS total_required,
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p 
     JOIN subscriptions sub2 ON p.subscription_id = sub2.id
     WHERE sub2.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    ), 0
  ) AS total_paid
FROM students s
LEFT JOIN grades g ON s.grade_id = g.id AND g.deleted = 0
LEFT JOIN subscriptions sub ON s.id = sub.student_id 
  AND sub.month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND sub.deleted = 0
WHERE s.deleted = 0
`;

// Update subscription status
const updateSubscriptionStatus = `
UPDATE subscriptions
SET status = $1
WHERE id = $2 AND deleted = 0
RETURNING *
`;

// Delete subscription
const deleteSubscription = `
DELETE FROM subscriptions
WHERE id = $1
RETURNING *
`;

// Get subscription by ID with student info
const getSubscriptionById = `
SELECT 
  sub.*,
  s.full_name AS student_name,
  s.barcode,
  g.name AS grade_name,
  gr.name AS group_name
FROM subscriptions sub
JOIN students s ON sub.student_id = s.id
JOIN grades g ON s.grade_id = g.id
JOIN groups gr ON s.group_id = gr.id
WHERE sub.id = $1 AND sub.deleted = 0
`;

module.exports = {
  getStudentGradePrice,
  createSubscription,
  getStudentSubscriptions,
  getSubscriptionsByMonth,
  getStudentsWithoutSubscriptionCurrentMonth,
  getGradeSubscriptionStats,
  getGroupSubscriptionStats,
  getOverallSubscriptionStats,
  updateSubscriptionStatus,
  deleteSubscription,
  getSubscriptionById,
};
