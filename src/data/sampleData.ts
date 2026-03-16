import { type Employee, type AttendanceRecord, type Candidate } from "@/types/hr";

export const BRANCHES = ["Chennai", "Hyderabad", "Bangalore", "Mumbai", "Pune", "NCR"] as const;

export const ATTENDANCE_CODES = {
  P: { label: "Present", color: "bg-success text-success-foreground" },
  L: { label: "Leave", color: "bg-warning text-warning-foreground" },
  WO: { label: "Weekly Off", color: "bg-muted text-muted-foreground" },
  NA: { label: "Not Applicable", color: "bg-secondary text-secondary-foreground" },
  A: { label: "Absent", color: "bg-destructive text-destructive-foreground" },
} as const;

export const sampleEmployees: Employee[] = [
  { id: "EMP001", name: "Rajesh Kumar", email: "rajesh@boomaa.com", phone: "9876543210", designation: "HR Executive", department: "Human Resources", branch: "Chennai", joiningDate: "2023-01-15", salary: 35000, bankName: "HDFC Bank", accountNumber: "1234567890123", ifsc: "HDFC0001234", pan: "ABCPK1234A", uan: "100123456789" },
  { id: "EMP002", name: "Priya Sharma", email: "priya@boomaa.com", phone: "9876543211", designation: "Recruiter", department: "Recruitment", branch: "Hyderabad", joiningDate: "2023-03-20", salary: 30000, bankName: "ICICI Bank", accountNumber: "9876543210987", ifsc: "ICIC0005678", pan: "DEFPS5678B", uan: "100234567890" },
  { id: "EMP003", name: "Amit Patel", email: "amit@boomaa.com", phone: "9876543212", designation: "Branch Manager", department: "Operations", branch: "Bangalore", joiningDate: "2022-06-10", salary: 55000, bankName: "SBI", accountNumber: "5678901234567", ifsc: "SBIN0009012", pan: "GHIAP9012C", uan: "100345678901" },
  { id: "EMP004", name: "Sneha Reddy", email: "sneha@boomaa.com", phone: "9876543213", designation: "Payroll Analyst", department: "Finance", branch: "Mumbai", joiningDate: "2023-07-01", salary: 40000, bankName: "Axis Bank", accountNumber: "3456789012345", ifsc: "UTIB0003456", pan: "JKLSR3456D", uan: "100456789012" },
  { id: "EMP005", name: "Vikram Singh", email: "vikram@boomaa.com", phone: "9876543214", designation: "Senior Recruiter", department: "Recruitment", branch: "Pune", joiningDate: "2022-11-15", salary: 45000, bankName: "Kotak Bank", accountNumber: "7890123456789", ifsc: "KKBK0007890", pan: "MNOVS7890E", uan: "100567890123" },
  { id: "EMP006", name: "Anita Desai", email: "anita@boomaa.com", phone: "9876543215", designation: "HR Manager", department: "Human Resources", branch: "NCR", joiningDate: "2021-09-01", salary: 60000, bankName: "Punjab National Bank", accountNumber: "2345678901234", ifsc: "PUNB0002345", pan: "PQRAD2345F", uan: "100678901234" },
  { id: "EMP007", name: "Karthik Nair", email: "karthik@boomaa.com", phone: "9876543216", designation: "IT Support", department: "IT", branch: "Chennai", joiningDate: "2023-05-10", salary: 32000, bankName: "Federal Bank", accountNumber: "6789012345678", ifsc: "FDRL0006789", pan: "STUKN6789G", uan: "100789012345" },
  { id: "EMP008", name: "Meera Joshi", email: "meera@boomaa.com", phone: "9876543217", designation: "Compliance Officer", department: "Legal", branch: "Mumbai", joiningDate: "2022-02-14", salary: 50000, bankName: "Bank of Baroda", accountNumber: "8901234567890", ifsc: "BARB0008901", pan: "VWXMJ8901H", uan: "100890123456" },
];

export function generateAttendance(employeeId: string, year: number, month: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const codes: AttendanceRecord["status"][] = ["P", "L", "WO", "NA", "A"];

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
  { id: "CAN001", name: "Rahul Mehta", email: "rahul.m@email.com", phone: "9001234567", position: "Software Developer", client: "TCS", stage: "sourced", appliedDate: "2024-03-01", notes: "5 years exp in Java" },
  { id: "CAN002", name: "Divya Krishnan", email: "divya.k@email.com", phone: "9001234568", position: "HR Executive", client: "Infosys", stage: "interview", appliedDate: "2024-02-20", notes: "Good communication skills" },
  { id: "CAN003", name: "Arjun Nair", email: "arjun.n@email.com", phone: "9001234569", position: "Data Analyst", client: "Wipro", stage: "placed", appliedDate: "2024-01-15", notes: "Python, SQL expert" },
  { id: "CAN004", name: "Shalini Gupta", email: "shalini.g@email.com", phone: "9001234570", position: "Project Manager", client: "HCL", stage: "sourced", appliedDate: "2024-03-05", notes: "PMP certified" },
  { id: "CAN005", name: "Manoj Verma", email: "manoj.v@email.com", phone: "9001234571", position: "UI/UX Designer", client: "Accenture", stage: "interview", appliedDate: "2024-02-28", notes: "Strong portfolio" },
  { id: "CAN006", name: "Pooja Rao", email: "pooja.r@email.com", phone: "9001234572", position: "DevOps Engineer", client: "Cognizant", stage: "sourced", appliedDate: "2024-03-08", notes: "AWS certified" },
  { id: "CAN007", name: "Suresh Iyer", email: "suresh.i@email.com", phone: "9001234573", position: "Business Analyst", client: "Deloitte", stage: "placed", appliedDate: "2024-01-25", notes: "6 years BA experience" },
  { id: "CAN008", name: "Kavitha Raman", email: "kavitha.r@email.com", phone: "9001234574", position: "QA Engineer", client: "Tech Mahindra", stage: "interview", appliedDate: "2024-03-02", notes: "Selenium, JIRA expertise" },
];
