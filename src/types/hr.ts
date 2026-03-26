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
  dob?: string;
  bloodGroup?: string;
  status?: "Working" | "Left";
  workMode?: "On Site" | "WFH";
  ctc?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: "P" | "L" | "WO" | "NA" | "A";
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  feeType: "percentage" | "flat";
  feeValue: number;
  invoiceStatus: "paid" | "pending" | "overdue";
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  clientId: string;
  assignedRecruiterId: string;
  stage: "sourced" | "interview" | "placed";
  appliedDate: string;
  notes: string;
}

export interface PlacementRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  clientId: string;
  clientName: string;
  recruiterId: string;
  recruiterName: string;
  placementDate: string;
  expectedFee: number;
  billingStatus: "paid" | "pending" | "overdue";
}

export interface Invoice {
  id: string;
  candidateName: string;
  joiningDate: string;
  designation: string;
  packageAmount: number;
  invoiceAmount: number;
  client: string;
  status: "active" | "left";
  month: string;
  year: number;
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
  paidLeaves: number;
  unpaidLeaves: number;
  absentDays: number;
  weeklyOffs: number;
  naDays: number;
  payableDays: number;
  grossSalary: number;
  netPayable: number;
}
