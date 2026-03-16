import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { sampleEmployees, generateAttendance, ATTENDANCE_CODES } from "@/data/sampleData";
import type { AttendanceRecord } from "@/types/hr";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const Attendance = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth()));
  const [selectedYear] = useState(currentDate.getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState(sampleEmployees[0].id);

  const month = parseInt(selectedMonth);
  const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const attendanceData = useMemo(
    () => generateAttendance(selectedEmployee, selectedYear, month),
    [selectedEmployee, selectedYear, month]
  );

  const summary = useMemo(() => {
    const counts = { P: 0, L: 0, WO: 0, NA: 0, A: 0 };
    attendanceData.forEach((r) => counts[r.status]++);
    return counts;
  }, [attendanceData]);

  const employee = sampleEmployees.find((e) => e.id === selectedEmployee);

  return (
    <AppLayout title="Attendance Tracker">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sampleEmployees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.keys(ATTENDANCE_CODES) as Array<keyof typeof ATTENDANCE_CODES>).map((code) => (
            <Card key={code} className="shadow-card">
              <CardContent className="p-4 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${ATTENDANCE_CODES[code].color}`}>
                  {code}
                </span>
                <p className="text-2xl font-bold text-foreground mt-2">{summary[code]}</p>
                <p className="text-xs text-muted-foreground">{ATTENDANCE_CODES[code].label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance Grid */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {employee?.name} — {MONTHS[month]} {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {days.map((day) => {
                    const dateStr = `${selectedYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const record = attendanceData.find((r) => r.date === dateStr);
                    const dayName = new Date(selectedYear, month, day).toLocaleDateString("en-US", { weekday: "short" });
                    const status = record?.status || "NA";

                    return (
                      <TableRow key={day} className={dayName === "Sun" ? "bg-muted/30" : ""}>
                        <TableCell className="font-mono text-sm">{String(day).padStart(2, "0")}</TableCell>
                        <TableCell className="text-muted-foreground">{dayName}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-semibold ${ATTENDANCE_CODES[status].color}`}>
                            {status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Attendance;
