import { type Employee, type AttendanceRecord, type Candidate, type Client, type PlacementRecord } from "@/types/hr";

export const BRANCHES = ["Chennai", "Hyderabad", "Bangalore", "Mumbai", "Pune", "NCR"] as const;

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
