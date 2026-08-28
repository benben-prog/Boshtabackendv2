const { query } = require("../../config/database");
const groupQueries = require("./groups.queries");

// Create a new group
const createGroup = async (groupData) => {
  const { name, grade_id, days, start_time, end_time, room } = groupData;
  const result = await query(groupQueries.createGroup, [
    name,
    grade_id,
    days,
    start_time,
    end_time,
    room,
  ]);
  return result.rows[0];
};

// Get all groups
const getAllGroups = async () => {
  const result = await query(groupQueries.getAllGroups);
  return result.rows;
};

// Get a single group by ID
const getGroupById = async (groupId) => {
  const result = await query(groupQueries.getGroupById, [groupId]);
  return result.rows[0];
};

// Find group by name within a specific grade
const findGroupByName = async (name, grade_id) => {
  const result = await query(groupQueries.findGroupByName, [name, grade_id]);
  return result.rows[0];
};

// Get all groups in a specific grade
const getGroupsByGradeId = async (gradeId) => {
  const result = await query(groupQueries.getGroupsByGradeId, [gradeId]);
  return result.rows;
};

// Update a group
const updateGroup = async (id, groupData) => {
  const { name, days, start_time, end_time, room } = groupData;
  const result = await query(groupQueries.updateGroup, [
    name,
    days,
    start_time,
    end_time,
    room,
    id,
  ]);
  return result.rows[0];
};

// Soft delete a group
const softDeleteGroup = async (id) => {
  const result = await query(groupQueries.softDeleteGroup, [id]);
  return result.rows[0];
};

// Hard delete a group
const hardDeleteGroup = async (id) => {
  const result = await query(groupQueries.hardDeleteGroup, [id]);
  return result.rows[0];
};

// Get statistics for a single group
const getGroupStats = async (groupId) => {
  const result = await query(groupQueries.getGroupStats, [groupId]);
  return result.rows[0];
};

// Get statistics for all groups
const getAllGroupsStats = async () => {
  const result = await query(groupQueries.getAllGroupsStats);
  return result.rows;
};

// Get all groups with students count
const getGroupsWithStudentsCount = async () => {
  const result = await query(groupQueries.getGroupsWithStudentsCount);
  return result.rows;
};

// Get all groups with grade name
const getGroupsWithGradeName = async () => {
  const result = await query(groupQueries.getGroupsWithGradeName);
  return result.rows;
};

// Get group full stats
const getGroupFullStats = async (groupId) => {
  const stats = await query(groupQueries.getGroupFullStats, [groupId]);
  const students = await query(groupQueries.getGroupStudentsList, [groupId]);
  
  return {
    ...stats.rows[0],
    students_list: students.rows,
  };
};


module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  findGroupByName,
  getGroupsByGradeId,
  updateGroup,
  softDeleteGroup,
  hardDeleteGroup,
  getGroupStats,
  getAllGroupsStats,
  getGroupsWithStudentsCount,
  getGroupsWithGradeName,
  getGroupFullStats,
};
