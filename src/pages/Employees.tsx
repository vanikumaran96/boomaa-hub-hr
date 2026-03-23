import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Eye, Users } from "lucide-react";
import { sampleEmployees, BRANCHES } from "@/data/sampleData";
import type { Employee } from "@/types/hr";

const Employees = () => {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filtered = sampleEmployees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchBranch = branchFilter === "all" || emp.branch === branchFilter;
    const matchStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchSearch && matchBranch && matchStatus;
  });

  return (
    <AppLayout title="Employee Directory">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID, or designation..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Working">Working</SelectItem>
              <SelectItem value="Left">Left</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Employees ({filtered.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Work Mode</TableHead>
                    <TableHead>CTC</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-mono text-xs">{emp.id}</TableCell>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.designation}</TableCell>
                      <TableCell><Badge variant="secondary">{emp.branch}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{emp.workMode || "—"}</TableCell>
                      <TableCell className="font-medium">{emp.ctc || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={emp.status === "Working" ? "default" : "destructive"}>
                          {emp.status || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(emp)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{emp.name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><p className="text-muted-foreground">Employee ID</p><p className="font-medium">{emp.id}</p></div>
                              <div><p className="text-muted-foreground">Designation</p><p className="font-medium">{emp.designation}</p></div>
                              <div><p className="text-muted-foreground">Department</p><p className="font-medium">{emp.department}</p></div>
                              <div><p className="text-muted-foreground">Branch</p><p className="font-medium">{emp.branch}</p></div>
                              <div><p className="text-muted-foreground">Email</p><p className="font-medium break-all">{emp.email || "—"}</p></div>
                              <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{emp.phone || "—"}</p></div>
                              <div><p className="text-muted-foreground">Joining Date</p><p className="font-medium">{emp.joiningDate}</p></div>
                              <div><p className="text-muted-foreground">CTC</p><p className="font-medium">{emp.ctc || "—"}</p></div>
                              <div><p className="text-muted-foreground">Monthly Salary</p><p className="font-medium">₹{emp.salary.toLocaleString()}</p></div>
                              <div><p className="text-muted-foreground">Work Mode</p><p className="font-medium">{emp.workMode || "—"}</p></div>
                              <div><p className="text-muted-foreground">DOB</p><p className="font-medium">{emp.dob || "—"}</p></div>
                              <div><p className="text-muted-foreground">Blood Group</p><p className="font-medium">{emp.bloodGroup || "—"}</p></div>
                              <div><p className="text-muted-foreground">Status</p>
                                <Badge variant={emp.status === "Working" ? "default" : "destructive"}>
                                  {emp.status || "—"}
                                </Badge>
                              </div>
                              <div className="col-span-2 border-t pt-3 mt-2">
                                <p className="font-semibold text-foreground mb-2">Bank & Statutory Details</p>
                              </div>
                              <div><p className="text-muted-foreground">Bank</p><p className="font-medium">{emp.bankName || "—"}</p></div>
                              <div><p className="text-muted-foreground">Account No.</p><p className="font-medium font-mono">{emp.accountNumber || "—"}</p></div>
                              <div><p className="text-muted-foreground">IFSC</p><p className="font-medium font-mono">{emp.ifsc || "—"}</p></div>
                              <div><p className="text-muted-foreground">PAN</p><p className="font-medium font-mono">{emp.pan || "—"}</p></div>
                              <div className="col-span-2"><p className="text-muted-foreground">UAN</p><p className="font-medium font-mono">{emp.uan || "—"}</p></div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No employees found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Employees;
