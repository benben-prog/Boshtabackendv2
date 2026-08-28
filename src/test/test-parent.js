// src/test/test-parent.js

const credential = "Abdelrhman_Elshaer@jupiterLearn.com:Elshaer@jupiterLearn2026";
const API_TOKEN = btoa(credential);
const BASE_URL = "http://localhost:3000";
const API_AUTH = `Basic ${API_TOKEN}`;
const PARENT_TOKEN = "96773a9a09bd1f330b24c0a1fb0f57cd";

const headers = {
  "Authorization": API_AUTH,
  "Content-Type": "application/json"
};

async function testAllEndpoints() {
  console.log("Testing PARENT endpoint...\n");
  
  try {
    const response = await fetch(`${BASE_URL}/api/parent/${PARENT_TOKEN}`, {
      method: "GET",
      headers
    });
    
    const status = response.status;
    const data = await response.json().catch(() => null);
    
    if (status === 200 && data.success) {
      console.log(`[PASS] Parent Dashboard (${status})`);
      console.log("\n==========================================");
      console.log("PARENT DASHBOARD");
      console.log("==========================================");
      console.log(`Student: ${data.data.student.full_name}`);
      console.log(`Grade: ${data.data.student.grade_name}`);
      console.log(`Group: ${data.data.groupInfo.group_name}`);
      console.log(`Room: ${data.data.groupInfo.room}`);
      console.log(`Schedule: ${data.data.groupInfo.days} (${data.data.groupInfo.start_time} - ${data.data.groupInfo.end_time})`);
      console.log(`Students in group: ${data.data.groupInfo.students_count}`);
      
      console.log("\n--- Attendance ---");
      console.log(`Attendance: ${data.data.attendance.attendance_percentage}%`);
      console.log(`Present: ${data.data.attendance.present_days} | Absent: ${data.data.attendance.absent_days} | Late: ${data.data.attendance.late_days}`);
      console.log(`Last Absences: ${data.data.lastAbsences.length}`);
      
      console.log("\n--- Payments ---");
      console.log(`Required: ${data.data.payments.total_required}`);
      console.log(`Paid: ${data.data.payments.total_paid}`);
      console.log(`Remaining: ${data.data.payments.remaining}`);
      console.log(`Last Payment: ${data.data.lastPayment ? data.data.lastPayment.amount + ' on ' + data.data.lastPayment.payment_date : 'N/A'}`);
      
      console.log("\n--- Paper Exams ---");
      console.log(`Exams: ${data.data.paperExams.length}`);
      if (data.data.paperExams.length > 0) {
        console.log(`Latest: ${data.data.paperExams[0].title} - ${data.data.paperExams[0].student_degree}/${data.data.paperExams[0].total_degree} (${data.data.paperExams[0].percentage}%)`);
      }
      
      console.log("\n--- Online Exams ---");
      console.log(`Exams: ${data.data.onlineExams.length}`);
      if (data.data.onlineExams.length > 0) {
        console.log(`Latest: ${data.data.onlineExams[0].title} - ${data.data.onlineExams[0].score}/${data.data.onlineExams[0].full_mark} (${data.data.onlineExams[0].percentage}%)`);
      }
      
      console.log("\n--- Assignments ---");
      console.log(`Assignments: ${data.data.assignments.length}`);
      data.data.assignments.forEach(a => {
        console.log(`  ${a.title} - ${a.status}${a.score ? ' (' + a.score + '/' + a.full_mark + ')' : ''}`);
      });
      
      console.log("\n==========================================");
      console.log("PARENT TEST: PASS");
      console.log("==========================================");
    } else {
      console.log(`[FAIL] Parent Dashboard (${status}) - ${data?.message || "Unknown error"}`);
    }
  } catch (error) {
    console.log(`[ERROR] Parent Dashboard - ${error.message}`);
  }
}

testAllEndpoints();