import { type Employee, type AttendanceRecord, type Candidate, type Client, type PlacementRecord } from "@/types/hr";

export const BRANCHES = ["Chennai", "Hyderabad", "Bangalore", "Noida", "Gurgaon", "Mumbai", "Pune", "NCR"] as const;

export const ATTENDANCE_CODES = {
  P: { label: "Present", color: "bg-success text-success-foreground" },
  L: { label: "Leave", color: "bg-warning text-warning-foreground" },
  WO: { label: "Weekly Off", color: "bg-muted text-muted-foreground" },
  NA: { label: "Not Applicable", color: "bg-secondary text-secondary-foreground" },
  A: { label: "Absent", color: "bg-destructive text-destructive-foreground" },
} as const;

export const sampleClients: Client[] = [
  { id: "CLI001", name: "TCS", contactPerson: "Ramesh Nair", email: "ramesh@tcs.com", phone: "9112345001", feeType: "percentage", feeValue: 8.33, invoiceStatus: "paid" },
  { id: "CLI002", name: "Infosys", contactPerson: "Lakshmi Rao", email: "lakshmi@infosys.com", phone: "9112345002", feeType: "percentage", feeValue: 10, invoiceStatus: "pending" },
  { id: "CLI003", name: "Wipro", contactPerson: "Sunil Das", email: "sunil@wipro.com", phone: "9112345003", feeType: "flat", feeValue: 50000, invoiceStatus: "paid" },
  { id: "CLI004", name: "HCL", contactPerson: "Neeta Sharma", email: "neeta@hcl.com", phone: "9112345004", feeType: "percentage", feeValue: 12, invoiceStatus: "overdue" },
  { id: "CLI005", name: "Accenture", contactPerson: "Vikash Mehta", email: "vikash@accenture.com", phone: "9112345005", feeType: "flat", feeValue: 75000, invoiceStatus: "pending" },
  { id: "CLI006", name: "Cognizant", contactPerson: "Anjali Pillai", email: "anjali@cognizant.com", phone: "9112345006", feeType: "percentage", feeValue: 9, invoiceStatus: "paid" },
  { id: "CLI007", name: "Deloitte", contactPerson: "Karan Singh", email: "karan@deloitte.com", phone: "9112345007", feeType: "flat", feeValue: 100000, invoiceStatus: "paid" },
  { id: "CLI008", name: "Tech Mahindra", contactPerson: "Priti Jain", email: "priti@techmahindra.com", phone: "9112345008", feeType: "percentage", feeValue: 8, invoiceStatus: "pending" },
];

export const sampleEmployees: Employee[] = [
  { id: "BC01", name: "Durga Devi", email: "durgaramalingam02@gmail.com", phone: "9962220349", designation: "Senior HR Recruiter", department: "Recruitment", branch: "Chennai", joiningDate: "2023-08-28", salary: 16000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2000-01-02", bloodGroup: "O+ve", status: "Working", workMode: "On Site", ctc: "1.92 LPA" },
  { id: "BC13", name: "Uma Devi", email: "Umasudeesh@gmail.com", phone: "8668076633", designation: "Key Account Manager", department: "Operations", branch: "Chennai", joiningDate: "2025-03-03", salary: 35000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1986-12-23", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "4.2 LPA" },
  { id: "BC19", name: "Swetha M", email: "shwetha18112002@gmail.com", phone: "9884244443", designation: "HR Recruiter", department: "Recruitment", branch: "Chennai", joiningDate: "2025-05-12", salary: 15000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2002-11-18", bloodGroup: "O-ve", status: "Working", workMode: "On Site", ctc: "1.8 LPA" },
  { id: "BC20", name: "Vani K", email: "vanikumaran96@gmail.com", phone: "7200446356", designation: "Senior HR Recruiter", department: "Recruitment", branch: "Chennai", joiningDate: "2025-06-16", salary: 20000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1996-10-29", bloodGroup: "A1+ve", status: "Working", workMode: "On Site", ctc: "2.4 LPA" },
  { id: "BC24", name: "Sona S", email: "ssona258201@gmail.com", phone: "9361091917", designation: "HR Recruiter", department: "Recruitment", branch: "Chennai", joiningDate: "2025-06-30", salary: 15000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2001-08-25", bloodGroup: "A1+ve", status: "Working", workMode: "On Site", ctc: "1.8 LPA" },
  { id: "BC26", name: "Roshini V", email: "roshinipandiyan00@gmail.com", phone: "7603879813", designation: "HR Recruiter", department: "Recruitment", branch: "Chennai", joiningDate: "2025-07-17", salary: 15000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2004-06-28", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "1.8 LPA" },
  { id: "BC45", name: "Linda Tracey Issac", email: "lindanow02@gmail.com", phone: "9597303957", designation: "HR Recruiter", department: "Recruitment", branch: "Chennai", joiningDate: "2026-03-02", salary: 20000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2001-11-02", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "2.4 LPA" },
  { id: "BC28", name: "Ajithaa", email: "ajithaaaji05@gmail.com", phone: "9489249188", designation: "HR Executive/Trainer", department: "Human Resources", branch: "Chennai", joiningDate: "2025-09-04", salary: 20000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2004-05-19", bloodGroup: "O+ve", status: "Working", workMode: "On Site", ctc: "2.4 LPA" },
  { id: "BC46", name: "Shaik Farhana Azeemudeen", email: "farathameem14@gmail.com", phone: "6369035263", designation: "Senior HR Associate", department: "Recruitment", branch: "Chennai", joiningDate: "2026-03-02", salary: 23000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1993-02-14", bloodGroup: "O+ve", status: "Working", workMode: "On Site", ctc: "2.76 LPA" },
  { id: "BC42", name: "Kavitha G", email: "kavithagopi178913@gmail.com", phone: "8122178913", designation: "HR Recruiter/ CRM Coordinator", department: "Recruitment", branch: "Chennai", joiningDate: "2026-03-02", salary: 25000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2002-07-09", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "3 LPA" },
  { id: "BC47", name: "Nirosha M", email: "niroshamuth@gmail.com", phone: "", designation: "Team Lead", department: "Recruitment", branch: "Chennai", joiningDate: "2026-03-16", salary: 32000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "3.84 LPA" },
  { id: "BC03", name: "Rajyalakshmi L", email: "rajyalaksmilalam652@gmail.com", phone: "7382102307", designation: "Talent Acquisition Manager", department: "Recruitment", branch: "Hyderabad", joiningDate: "2024-10-18", salary: 40000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1995-08-03", bloodGroup: "O+ve", status: "Working", workMode: "WFH", ctc: "4.8 LPA" },
  { id: "BC16", name: "Kavya Ganapathy", email: "kavyanetha97@gmail.com", phone: "9032332185", designation: "Team Leader", department: "Recruitment", branch: "Hyderabad", joiningDate: "2025-04-01", salary: 23000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2000-06-08", bloodGroup: "A1+ve", status: "Working", workMode: "WFH", ctc: "2.76 LPA" },
  { id: "BC17", name: "Neha Chikka", email: "nehanetha0809@gmail.com", phone: "8639199374", designation: "Senior HR Recruiter", department: "Recruitment", branch: "Hyderabad", joiningDate: "2025-06-02", salary: 23000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1998-08-09", bloodGroup: "A+ve", status: "Working", workMode: "WFH", ctc: "2.76 LPA" },
  { id: "BC35", name: "Srigiri Swapna", email: "swapna.ramu23@gmail.com", phone: "8639124828", designation: "Talent Acquisition Specialist", department: "Recruitment", branch: "Hyderabad", joiningDate: "2026-02-23", salary: 28000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1987-02-24", bloodGroup: "B+ve", status: "Working", workMode: "WFH", ctc: "3.36 LPA" },
  { id: "BC46B", name: "Jagriti Tripathi", email: "jagritiboomaa07@gmail.com", phone: "7015636457", designation: "Senior HR Associate", department: "Recruitment", branch: "Hyderabad", joiningDate: "2026-03-09", salary: 35000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1990-03-07", bloodGroup: "O+ve", status: "Working", workMode: "WFH", ctc: "4.2 LPA" },
  { id: "BC27", name: "Chepuri Jyothi", email: "chepurijyothi14@gmail.com", phone: "9515321896", designation: "Senior HR Recruiter", department: "Recruitment", branch: "Hyderabad", joiningDate: "2025-03-08", salary: 21000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2000-03-14", bloodGroup: "O+ve", status: "Working", workMode: "WFH", ctc: "2.52 LPA" },
  { id: "BC06", name: "Archana Beura", email: "archanabeaura132@gmail.com", phone: "8143702773", designation: "HR Recruiter", department: "Recruitment", branch: "Hyderabad", joiningDate: "2025-12-11", salary: 16000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2002-11-15", bloodGroup: "A1+ve", status: "Working", workMode: "WFH", ctc: "1.92 LPA" },
  { id: "BC28B", name: "Sanjana Singh", email: "sanjanasinghh696@gmail.com", phone: "9182201969", designation: "HR Recruiter", department: "Recruitment", branch: "Hyderabad", joiningDate: "2025-10-06", salary: 15000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1998-06-23", bloodGroup: "B+ve", status: "Working", workMode: "WFH", ctc: "1.8 LPA" },
  { id: "BC29", name: "Gauri Raghav", email: "gauriraghav779@gmail.com", phone: "7505771535", designation: "Talent Acquisition Manager", department: "Recruitment", branch: "Noida", joiningDate: "2025-12-01", salary: 38000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1996-02-27", bloodGroup: "O+ve", status: "Working", workMode: "WFH", ctc: "4.56 LPA" },
  { id: "BC23", name: "Saanchi Harapanahalli", email: "hsaanchi@gmail.com", phone: "8169220789", designation: "HR Recruiter", department: "Recruitment", branch: "Bangalore", joiningDate: "2025-06-30", salary: 23000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1994-10-22", bloodGroup: "B+ve", status: "Working", workMode: "WFH", ctc: "2.76 LPA" },
  { id: "BC22", name: "Nivedha D", email: "nivilogi@gmail.com", phone: "6383165073", designation: "Senior HR Recruiter", department: "Recruitment", branch: "Bangalore", joiningDate: "2025-06-30", salary: 25000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2001-06-05", bloodGroup: "A+ve", status: "Working", workMode: "On Site", ctc: "3 LPA" },
  { id: "BC33", name: "Pooja R Akkatangerhal", email: "arpooja2000@gmail.com", phone: "9353345813", designation: "HR Trainee", department: "Recruitment", branch: "Bangalore", joiningDate: "2026-02-16", salary: 16000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2000-08-01", bloodGroup: "A+ve", status: "Working", workMode: "On Site", ctc: "1.92 LPA" },
  { id: "BC25", name: "Shwetha Kattimani", email: "shwetakattimani4@gmail.com", phone: "8867692040", designation: "HR Recruiter", department: "Recruitment", branch: "Bangalore", joiningDate: "2025-03-03", salary: 16667, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2000-01-14", bloodGroup: "A1+ve", status: "Working", workMode: "On Site", ctc: "2 LPA" },
  { id: "BC24B", name: "Anitha P", email: "ponnapallianitha79936@gmail.com", phone: "7993685762", designation: "HR Recruiter", department: "Recruitment", branch: "Bangalore", joiningDate: "2025-07-07", salary: 16667, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2002-02-20", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "2 LPA" },
  { id: "BC21", name: "Anjali aka Anitha S", email: "adhya.srinivas@gmail.com", phone: "7026750546", designation: "CRM/HR", department: "Human Resources", branch: "Bangalore", joiningDate: "2025-06-16", salary: 30000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1994-08-04", bloodGroup: "A+ve", status: "Working", workMode: "On Site", ctc: "4.2 LPA" },
  { id: "BC38", name: "Seelam Manasa", email: "", phone: "", designation: "Senior HR Recruiter", department: "Recruitment", branch: "Bangalore", joiningDate: "2025-02-25", salary: 20000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "", bloodGroup: "", status: "Working", workMode: "On Site", ctc: "2.4 LPA" },
  { id: "BC32", name: "Kamsu Bhawana", email: "bhawana1124@gmail.com", phone: "", designation: "Recruitment Manager", department: "Recruitment", branch: "Bangalore", joiningDate: "2026-02-05", salary: 52000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "1987-11-24", bloodGroup: "B+ve", status: "Working", workMode: "On Site", ctc: "6.24 LPA" },
  { id: "BC41", name: "Harshitha K N", email: "harshithak860@gmail.com", phone: "8310013436", designation: "HR Recruiter", department: "Recruitment", branch: "Bangalore", joiningDate: "2026-03-02", salary: 20000, bankName: "", accountNumber: "", ifsc: "", pan: "", uan: "", dob: "2004-03-30", bloodGroup: "O+ve", status: "Working", workMode: "On Site", ctc: "2.4 LPA" },
];

export function generateAttendance(employeeId: string, year: number, month: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    let status: AttendanceRecord["status"];

    if (dayOfWeek === 0) {
      status = "WO";
    } else {
      const rand = Math.random();
      if (rand < 0.75) status = "P";
      else if (rand < 0.85) status = "L";
      else if (rand < 0.92) status = "A";
      else status = "NA";
    }

    records.push({
      id: `${employeeId}-${year}-${month}-${day}`,
      employeeId,
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      status,
    });
  }
  return records;
}

export const sampleCandidates: Candidate[] = [
  { id: "CAN001", name: "Rahul Mehta", email: "rahul.m@email.com", phone: "9001234567", position: "Software Developer", clientId: "CLI001", assignedRecruiterId: "EMP002", stage: "sourced", appliedDate: "2024-03-01", notes: "5 years exp in Java" },
  { id: "CAN002", name: "Divya Krishnan", email: "divya.k@email.com", phone: "9001234568", position: "HR Executive", clientId: "CLI002", assignedRecruiterId: "EMP005", stage: "interview", appliedDate: "2024-02-20", notes: "Good communication skills" },
  { id: "CAN003", name: "Arjun Nair", email: "arjun.n@email.com", phone: "9001234569", position: "Data Analyst", clientId: "CLI003", assignedRecruiterId: "EMP002", stage: "placed", appliedDate: "2024-01-15", notes: "Python, SQL expert" },
  { id: "CAN004", name: "Shalini Gupta", email: "shalini.g@email.com", phone: "9001234570", position: "Project Manager", clientId: "CLI004", assignedRecruiterId: "EMP005", stage: "sourced", appliedDate: "2024-03-05", notes: "PMP certified" },
  { id: "CAN005", name: "Manoj Verma", email: "manoj.v@email.com", phone: "9001234571", position: "UI/UX Designer", clientId: "CLI005", assignedRecruiterId: "EMP002", stage: "interview", appliedDate: "2024-02-28", notes: "Strong portfolio" },
  { id: "CAN006", name: "Pooja Rao", email: "pooja.r@email.com", phone: "9001234572", position: "DevOps Engineer", clientId: "CLI006", assignedRecruiterId: "EMP005", stage: "sourced", appliedDate: "2024-03-08", notes: "AWS certified" },
  { id: "CAN007", name: "Suresh Iyer", email: "suresh.i@email.com", phone: "9001234573", position: "Business Analyst", clientId: "CLI007", assignedRecruiterId: "EMP002", stage: "placed", appliedDate: "2024-01-25", notes: "6 years BA experience" },
  { id: "CAN008", name: "Kavitha Raman", email: "kavitha.r@email.com", phone: "9001234574", position: "QA Engineer", clientId: "CLI008", assignedRecruiterId: "EMP005", stage: "interview", appliedDate: "2024-03-02", notes: "Selenium, JIRA expertise" },
];

export const samplePlacements: PlacementRecord[] = [
  { id: "PLC001", candidateId: "CAN003", candidateName: "Arjun Nair", clientId: "CLI003", clientName: "Wipro", recruiterId: "EMP002", recruiterName: "Priya Sharma", placementDate: "2024-02-10", expectedFee: 50000, billingStatus: "paid" },
  { id: "PLC002", candidateId: "CAN007", candidateName: "Suresh Iyer", clientId: "CLI007", clientName: "Deloitte", recruiterId: "EMP002", recruiterName: "Priya Sharma", placementDate: "2024-02-20", expectedFee: 100000, billingStatus: "paid" },
];
