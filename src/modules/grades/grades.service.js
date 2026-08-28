const { query } = require("../../config/database");
const gradeQueries = require("./grades.queries");

const createGrade = async (name, monthlyPrice) => {
  const result = await query(gradeQueries.createGrade, [name, monthlyPrice]);

  return result.rows[0];
};

const getAllGrades = async () => {
  const result = await query(gradeQueries.getAllGrades);
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

const updateGrade = async (id, name, monthlyPrice) => {
  const result = await query(gradeQueries.updateGrade, [
    name,
    monthlyPrice,
    id,
  ]);

  return result.rows[0];
};

const softDeleteGrade = async (id) => {
  const result = await query(gradeQueries.softDeleteGrade, [id]);

  return result.rows[0];
};

const hardDeleteGrade = async (id) => {
  const result = await query(gradeQueries.hardDeleteGrade, [id]);

  return result.rows[0];
};

const getGradeStats = async (id) => {
  const result = await query(gradeQueries.getGradeStats, [id]);

  return result.rows[0];
};

const getAllGradesStats = async () => {
  const result = await query(gradeQueries.getAllGradesStats);

  return result.rows;
};

const getGradesWithGroupsCount = async () => {
  const result = await query(gradeQueries.getGradesWithGroupsCount);

  return result.rows;
};

const getGradesWithStudentsCount = async () => {
  const result = await query(gradeQueries.getGradesWithStudentsCount);

  return result.rows;
};

module.exports = {
  createGrade,
  getAllGrades,
  getGradeById,
  findGradeByName,
  updateGrade,
  softDeleteGrade,
  hardDeleteGrade,
  getGradeStats,
  getAllGradesStats,
  getGradesWithGroupsCount,
  getGradesWithStudentsCount,
};
