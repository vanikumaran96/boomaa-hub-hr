import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown, Wallet } from "lucide-react";
import { sampleEmployees, generateAttendance, BRANCHES } from "@/data/sampleData";
import type { PayrollSummary } from "@/types/hr";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const Payroll = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth()));
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const month = parseInt(selectedMonth);
  const year = currentDate.getFullYear();

  const payrollData: PayrollSummary[] = useMemo(() => {
    return sampleEmployees
      .filter((emp) => branchFilter === "all" || emp.branch === branchFilter)
      .map((emp) => {
        const attendance = generateAttendance(emp.id, year, month);
        const counts = { P: 0, L: 0, WO: 0, NA: 0, A: 0 };
        attendance.forEach((r) => counts[r.status]++);
        const totalDays = attendance.length;
        const paidLeaves = Math.min(counts.L, 1);
        const unpaidLeaves = Math.max(counts.L - 1, 0);
        const payableDays = counts.P + counts.WO + counts.NA + paidLeaves;
        const dailyRate = emp.salary / totalDays;
        const netPayable = Math.round(dailyRate * payableDays);

        return {
          employeeId: emp.id,
          employeeName: emp.name,
          branch: emp.branch,
          month,
          year,
          totalDays,
          presentDays: counts.P,
          leaveDays: counts.L,
          absentDays: counts.A,
          weeklyOffs: counts.WO,
          naDays: counts.NA,
          payableDays,
          grossSalary: emp.salary,
          netPayable,
        };
      });
  }, [month, year, branchFilter]);

  const generatePayslip = (record: PayrollSummary) => {
    const doc = new jsPDF();
    const emp = sampleEmployees.find((e) => e.id === record.employeeId)!;

    doc.setFontSize(18);
    doc.setTextColor(30, 64, 120);
    doc.text("Boomaa Consultants", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("HR Management Information System", 105, 27, { align: "center" });
    doc.setDrawColor(30, 64, 120);
    doc.line(20, 32, 190, 32);

    doc.setFontSize(13);
    doc.setTextColor(30, 64, 120);
    doc.text(`Payslip — ${MONTHS[record.month]} ${record.year}`, 105, 42, { align: "center" });

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Details"]],
      body: [
        ["Employee ID", emp.id],
        ["Name", emp.name],
        ["Designation", emp.designation],
        ["Branch", emp.branch],
        ["Bank", `${emp.bankName} (${emp.accountNumber})`],
        ["PAN", emp.pan],
        ["UAN", emp.uan],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 64, 120] },
      styles: { fontSize: 9 },
    });

    const firstTableEnd = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: firstTableEnd,
      head: [["Attendance Summary", "Days"]],
      body: [
        ["Total Days", String(record.totalDays)],
        ["Present", String(record.presentDays)],
        ["Leave", String(record.leaveDays)],
        ["Absent", String(record.absentDays)],
        ["Weekly Off", String(record.weeklyOffs)],
        ["N/A", String(record.naDays)],
        ["Total Payable Days", String(record.payableDays)],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 64, 120] },
      styles: { fontSize: 9 },
    });

    const secondTableEnd = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: secondTableEnd,
      head: [["Earnings", "Amount (₹)"]],
      body: [
        ["Gross Salary", `₹${record.grossSalary.toLocaleString()}`],
        ["Net Payable", `₹${record.netPayable.toLocaleString()}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 64, 120] },
      styles: { fontSize: 9 },
      foot: [["Net Pay", `₹${record.netPayable.toLocaleString()}`]],
      footStyles: { fillColor: [240, 245, 255], textColor: [30, 64, 120], fontStyle: "bold" },
    });

    doc.save(`Payslip_${emp.id}_${MONTHS[record.month]}_${record.year}.pdf`);
  };

  const totalPayable = payrollData.reduce((sum, r) => sum + r.netPayable, 0);

  return (
    <AppLayout title="Payroll">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All Branches" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Payable</p>
                <p className="text-lg font-bold text-foreground">₹{totalPayable.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Payroll Summary — {MONTHS[month]} {year}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Leave</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">WO</TableHead>
                    <TableHead className="text-center">Payable Days</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead className="text-right">Payslip</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((record) => (
                    <TableRow key={record.employeeId}>
                      <TableCell className="font-mono text-xs">{record.employeeId}</TableCell>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell className="text-muted-foreground">{record.branch}</TableCell>
                      <TableCell className="text-center">{record.presentDays}</TableCell>
                      <TableCell className="text-center">{record.leaveDays}</TableCell>
                      <TableCell className="text-center">{record.absentDays}</TableCell>
                      <TableCell className="text-center">{record.weeklyOffs}</TableCell>
                      <TableCell className="text-center font-semibold">{record.payableDays}</TableCell>
                      <TableCell className="text-right font-semibold">₹{record.netPayable.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => generatePayslip(record)}>
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Payroll;
