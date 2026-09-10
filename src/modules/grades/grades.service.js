const { query } = require("../../config/database");
const gradeQueries = require("./grades.queries");

// ============================================
// CREATE
// ============================================

const createGrade = async (gradeData) => {
  const { name, monthly_price } = gradeData;

  const result = await query(gradeQueries.createGrade, [name, monthly_price]);

  return result.rows[0];
};

// ============================================
// GETTERS
// ============================================

const getAllGrades = async (search = "") => {
  const result = await query(gradeQueries.getAllGrades, [search]);
  return result.rows;
};

const getGradeById = async (id) => {
  const result = await query(gradeQueries.getGradeById, [id]);
  return result.rows[0];
};

const findGradeByName = async (name) => {
  const result = await query(gradeQueries.findGradeByName, [name]);
  return result.rows[0];
};

const getGradesWithGroupsCount = async () => {
  const result = await query(gradeQueries.getGradesWithGroupsCount);
  return result.rows;
};

const getGradesWithStudentsCount = async () => {
  const result = await query(gradeQueries.getGradesWithStudentsCount);
  return result.rows;
};

// ============================================
// GET GRADE DETAILS (FULL - OPTIMIZED)
// ============================================

const getGradeDetails = async (gradeId) => {
  // Run all queries in parallel
  const [basicStatsResult, groupsResult] = await Promise.all([
    query(gradeQueries.getGradeBasicStats, [gradeId]),
    query(gradeQueries.getGroupsByGradeIdWithCount, [gradeId]),
  ]);

  const basic = basicStatsResult.rows[0];

  if (!basic) {
    return null;
  }

  return {
    grade: {
      id: basic.id,
      name: basic.name,
      monthly_price: basic.monthly_price,
      created_at: basic.created_at,
      updated_at: basic.updated_at,
    },
    stats: {
      total_students: parseInt(basic.total_students || 0),
      active_students: parseInt(basic.active_students || 0),
      deleted_students: parseInt(basic.deleted_students || 0),
      total_groups: parseInt(basic.total_groups || 0),
    },
    groups: groupsResult.rows,
  };
};

// ============================================
// UPDATE
// ============================================

const updateGrade = async (id, gradeData) => {
  const { name, monthly_price } = gradeData;

  const result = await query(gradeQueries.updateGrade, [
    name ?? null,
    monthly_price ?? null,
    id,
  ]);

  return result.rows[0];
};

// ============================================
// DELETE
// ============================================

const softDeleteGrade = async (id) => {
  const result = await query(gradeQueries.softDeleteGrade, [id]);
  return result.rows[0];
};

const hardDeleteGrade = async (id) => {
  const result = await query(gradeQueries.hardDeleteGrade, [id]);
  return result.rows[0];
};

// ============================================
// STATISTICS
// ============================================

const getGradeStats = async (id) => {
  const result = await query(gradeQueries.getGradeStats, [id]);
  return result.rows[0];
};

const getAllGradesStats = async () => {
  const result = await query(gradeQueries.getAllGradesStats);
  return result.rows;
};

module.exports = {
  createGrade,
  getAllGrades,
  getGradeById,
  findGradeByName,
  getGradeDetails,
  updateGrade,
  softDeleteGrade,
  hardDeleteGrade,
  getGradeStats,
  getAllGradesStats,
  getGradesWithGroupsCount,
  getGradesWithStudentsCount,
};
