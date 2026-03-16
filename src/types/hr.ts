export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  branch: string;
  joiningDate: string;
  salary: number;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  pan: string;
  uan: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: "P" | "L" | "WO" | "NA" | "A";
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  client: string;
  stage: "sourced" | "interview" | "placed";
  appliedDate: string;
  notes: string;
}

export interface PayrollSummary {
  employeeId: string;
  employeeName: string;
  branch: string;
  month: number;
  year: number;
  totalDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  weeklyOffs: number;
  naDays: number;
  payableDays: number;
  grossSalary: number;
  netPayable: number;
}
