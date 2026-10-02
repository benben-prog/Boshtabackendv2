const { query } = require("../../config/database");

const COMPUTED_STATUS_SQL = `
  CASE 
    WHEN ls.status = 'cancelled' THEN 'cancelled'
    WHEN ls.status = 'ended' THEN 'ended'
    WHEN NOW() >= ls.start_time AND NOW() <= ls.end_time THEN 'live'
    WHEN NOW() > ls.end_time THEN 'ended'
    ELSE ls.status
  END
`;

const liveSessionsQueries = {
  // Insert new live session
  insertLiveSession: async ({
    title,
    description,
    start_time,
    end_time,
    duration_minutes,
    meet_link,
    google_event_id,
    target_type,
    grade_id,
    group_id,
    student_id,
    material_file_path,
    material_name,
    created_by,
  }) => {
    const result = await query(
      `
      INSERT INTO live_sessions (
        title, description, start_time, end_time, duration_minutes,
        meet_link, google_event_id, target_type, grade_id, group_id, student_id,
        material_file_path, material_name, created_by, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'scheduled', NOW(), NOW())
      RETURNING *
    `,
      [
        title,
        description || null,
        start_time,
        end_time,
        duration_minutes,
        meet_link,
        google_event_id || null,
        target_type,
        grade_id || null,
        group_id || null,
        student_id || null,
        material_file_path || null,
        material_name || null,
        created_by || null,
      ],
    );
    return result.rows[0];
  },

  // Get live session by ID
  getLiveSessionById: async (id) => {
    const result = await query(
      `
      SELECT 
        ls.id,
        ls.title,
        ls.description,
        ls.start_time,
        ls.end_time,
        ls.duration_minutes,
        ls.meet_link,
        ls.google_event_id,
        ls.target_type,
        ls.grade_id,
        ls.group_id,
        ls.student_id,
        ls.material_file_path,
        ls.material_name,
        ls.recording_url,
        ${COMPUTED_STATUS_SQL} AS status,
        ls.created_by,
        ls.created_at,
        ls.updated_at,
        g.name AS grade_name,
        grp.name AS group_name,
        s.full_name AS student_name,
        s.barcode AS student_barcode,
        s.phone AS student_phone,
        u.full_name AS creator_name
      FROM live_sessions ls
      LEFT JOIN grades g ON g.id = ls.grade_id
      LEFT JOIN groups grp ON grp.id = ls.group_id
      LEFT JOIN students s ON s.id = ls.student_id
      LEFT JOIN users u ON u.id = ls.created_by
      WHERE ls.id = $1 AND ls.deleted = 0
    `,
      [id],
    );
    return result.rows[0] || null;
  },

  // Get live sessions list with filters
  getLiveSessions: async ({
    grade_id,
    group_id,
    target_type,
    status,
    search,
    limit = 20,
    offset = 0,
  }) => {
    const conditions = ["ls.deleted = 0"];
    const values = [];
    let paramIndex = 1;

    if (grade_id) {
      conditions.push(`ls.grade_id = $${paramIndex++}`);
      values.push(grade_id);
    }

    if (group_id) {
      conditions.push(`ls.group_id = $${paramIndex++}`);
      values.push(group_id);
    }

    if (target_type) {
      conditions.push(`ls.target_type = $${paramIndex++}`);
      values.push(target_type);
    }

    if (status) {
      conditions.push(`(${COMPUTED_STATUS_SQL}) = $${paramIndex++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(
        `(ls.title ILIKE $${paramIndex} OR ls.description ILIKE $${paramIndex} OR s.full_name ILIKE $${paramIndex} OR s.barcode ILIKE $${paramIndex})`,
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const dataQuery = `
      SELECT 
        ls.id,
        ls.title,
        ls.description,
        ls.start_time,
        ls.end_time,
        ls.duration_minutes,
        ls.meet_link,
        ls.google_event_id,
        ls.target_type,
        ls.grade_id,
        ls.group_id,
        ls.student_id,
        ls.material_file_path,
        ls.material_name,
        ls.recording_url,
        ${COMPUTED_STATUS_SQL} AS status,
        ls.created_by,
        ls.created_at,
        ls.updated_at,
        g.name AS grade_name,
        grp.name AS group_name,
        s.full_name AS student_name,
        s.barcode AS student_barcode,
        u.full_name AS creator_name
      FROM live_sessions ls
      LEFT JOIN grades g ON g.id = ls.grade_id
      LEFT JOIN groups grp ON grp.id = ls.group_id
      LEFT JOIN students s ON s.id = ls.student_id
      LEFT JOIN users u ON u.id = ls.created_by
      ${whereClause}
      ORDER BY ls.start_time DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limit, offset);

    const result = await query(dataQuery, values);
    return result.rows;
  },

  // Count live sessions matching filters
  countLiveSessions: async ({ grade_id, group_id, target_type, status, search }) => {
    const conditions = ["ls.deleted = 0"];
    const values = [];
    let paramIndex = 1;

    if (grade_id) {
      conditions.push(`ls.grade_id = $${paramIndex++}`);
      values.push(grade_id);
    }

    if (group_id) {
      conditions.push(`ls.group_id = $${paramIndex++}`);
      values.push(group_id);
    }

    if (target_type) {
      conditions.push(`ls.target_type = $${paramIndex++}`);
      values.push(target_type);
    }

    if (status) {
      conditions.push(`(${COMPUTED_STATUS_SQL}) = $${paramIndex++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(
        `(ls.title ILIKE $${paramIndex} OR ls.description ILIKE $${paramIndex} OR s.full_name ILIKE $${paramIndex} OR s.barcode ILIKE $${paramIndex})`,
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*)::INTEGER AS total
      FROM live_sessions ls
      LEFT JOIN students s ON s.id = ls.student_id
      ${whereClause}
    `;

    const result = await query(countQuery, values);
    return result.rows[0]?.total || 0;
  },

  // Update live session fields dynamically
  updateLiveSession: async (id, fields) => {
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(fields)) {
      setClauses.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const updateQuery = `
      UPDATE live_sessions
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex} AND deleted = 0
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    return result.rows[0] || null;
  },

  // Soft delete live session
  deleteLiveSession: async (id) => {
    const result = await query(
      `
      UPDATE live_sessions
      SET deleted = 1, updated_at = NOW()
      WHERE id = $1 AND deleted = 0
      RETURNING id, google_event_id, created_by
    `,
      [id],
    );
    return result.rows[0] || null;
  },

  // Get live sessions for a student based on grade, group, or direct assignment
  getLiveSessionsForStudent: async ({
    grade_id,
    group_id,
    student_id,
    status,
    limit = 20,
    offset = 0,
  }) => {
    const conditions = [
      "ls.deleted = 0",
      `(
        (ls.target_type = 'grade' AND ls.grade_id = $1)
        OR (ls.target_type = 'group' AND ls.group_id = $2)
        OR (ls.target_type = 'student' AND ls.student_id = $3)
      )`,
    ];
    const values = [grade_id, group_id, student_id];
    let paramIndex = 4;

    if (status) {
      conditions.push(`(${COMPUTED_STATUS_SQL}) = $${paramIndex++}`);
      values.push(status);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const dataQuery = `
      SELECT 
        ls.id,
        ls.title,
        ls.description,
        ls.start_time,
        ls.end_time,
        ls.duration_minutes,
        ls.meet_link,
        ls.material_file_path,
        ls.material_name,
        ls.recording_url,
        ${COMPUTED_STATUS_SQL} AS status,
        ls.target_type,
        g.name AS grade_name,
        grp.name AS group_name
      FROM live_sessions ls
      LEFT JOIN grades g ON g.id = ls.grade_id
      LEFT JOIN groups grp ON grp.id = ls.group_id
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN (NOW() >= ls.start_time AND NOW() <= ls.end_time AND ls.status NOT IN ('cancelled', 'ended')) OR ls.status = 'live' THEN 1
          WHEN ls.status = 'scheduled' AND NOW() < ls.start_time THEN 2
          ELSE 3
        END,
        ls.start_time DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limit, offset);

    const result = await query(dataQuery, values);
    return result.rows;
  },

  // Count live sessions for a student
  countLiveSessionsForStudent: async ({ grade_id, group_id, student_id, status }) => {
    const conditions = [
      "ls.deleted = 0",
      `(
        (ls.target_type = 'grade' AND ls.grade_id = $1)
        OR (ls.target_type = 'group' AND ls.group_id = $2)
        OR (ls.target_type = 'student' AND ls.student_id = $3)
      )`,
    ];
    const values = [grade_id, group_id, student_id];
    let paramIndex = 4;

    if (status) {
      conditions.push(`(${COMPUTED_STATUS_SQL}) = $${paramIndex++}`);
      values.push(status);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const countQuery = `
      SELECT COUNT(*)::INTEGER AS total
      FROM live_sessions ls
      ${whereClause}
    `;

    const result = await query(countQuery, values);
    return result.rows[0]?.total || 0;
  },

  // Find student by barcode
  findStudentByBarcode: async (barcode) => {
    const result = await query(
      "SELECT id, full_name, barcode AS student_barcode, grade_id, group_id FROM students WHERE barcode = $1 AND deleted = 0 LIMIT 1",
      [barcode],
    );
    return result.rows[0] || null;
  },

  // Check grade exists
  checkGradeExists: async (gradeId) => {
    const result = await query(
      "SELECT id, name AS grade_name FROM grades WHERE id = $1 AND deleted = 0 LIMIT 1",
      [gradeId],
    );
    return result.rows[0] || null;
  },

  // Check group exists
  checkGroupExists: async (groupId) => {
    const result = await query(
      "SELECT id, name AS group_name, grade_id FROM groups WHERE id = $1 AND deleted = 0 LIMIT 1",
      [groupId],
    );
    return result.rows[0] || null;
  },

  // Check student exists
  checkStudentExists: async (studentId) => {
    const result = await query(
      "SELECT id, full_name, barcode AS student_barcode, grade_id, group_id FROM students WHERE id = $1 AND deleted = 0 LIMIT 1",
      [studentId],
    );
    return result.rows[0] || null;
  },
};

module.exports = liveSessionsQueries;
