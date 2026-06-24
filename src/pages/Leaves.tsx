import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { CalendarDays, CheckCircle2, XCircle, Clock, Plus } from "lucide-react";

type LeaveType = "Casual Leave" | "Sick Leave" | "Earned Leave" | "Maternity/Paternity Leave";
type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

interface LeaveRow {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: LeaveStatus;
  admin_remarks: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const LEAVE_BALANCES = {
  "Casual Leave": 12,
  "Sick Leave": 10,
  "Earned Leave": 15,
};

const statusBadge = (status: LeaveStatus) => {
  const map: Record<LeaveStatus, string> = {
    Pending: "bg-amber-100 text-amber-800 border-amber-300",
    Approved: "bg-green-100 text-green-800 border-green-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
    Cancelled: "bg-gray-100 text-gray-700 border-gray-300",
  };
  return <Badge variant="outline" className={map[status]}>{status}</Badge>;
};

const daysBetween = (s: string, e: string) => {
  if (!s || !e) return 0;
  const a = new Date(s).getTime();
  const b = new Date(e).getTime();
  if (b < a) return 0;
  return Math.floor((b - a) / 86400000) + 1;
};

const Leaves = () => {
  const { userId, email, isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType>("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Review modal
  const [reviewRow, setReviewRow] = useState<LeaveRow | null>(null);
  const [remarks, setRemarks] = useState("");
  const [reviewing, setReviewing] = useState(false);

  // Admin filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterEmployee, setFilterEmployee] = useState<string>("");

  const totalDays = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as LeaveRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!roleLoading) load();
  }, [roleLoading]);

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (totalDays <= 0) {
      toast({ title: "Invalid dates", description: "End date must be on/after start date.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leave_requests").insert({
      employee_id: userId,
      employee_name: email ?? "Employee",
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      reason,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Submit failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Leave requested", description: "Your request was submitted for approval." });
      setStartDate(""); setEndDate(""); setReason(""); setLeaveType("Casual Leave");
      load();
    }
  };

  const cancelRequest = async (id: string) => {
    const { error } = await supabase
      .from("leave_requests")
      .update({ status: "Cancelled" })
      .eq("id", id);
    if (error) toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Request cancelled" }); load(); }
  };

  const decide = async (status: "Approved" | "Rejected") => {
    if (!reviewRow || !userId) return;
    setReviewing(true);
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status,
        admin_remarks: remarks || null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reviewRow.id);
    setReviewing(false);
    if (error) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Request ${status.toLowerCase()}` });
      setReviewRow(null); setRemarks("");
      load();
    }
  };

  // Derived data for employee view
  const myRows = rows.filter((r) => r.employee_id === userId);
  const usedByType = (t: LeaveType) =>
    myRows.filter((r) => r.leave_type === t && r.status === "Approved").reduce((s, r) => s + r.total_days, 0);

  // Admin data
  const pending = rows.filter((r) => r.status === "Pending");
  const history = rows.filter((r) => r.status !== "Pending").filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterEmployee && !r.employee_name.toLowerCase().includes(filterEmployee.toLowerCase())) return false;
    return true;
  });

  if (roleLoading) {
    return <AppLayout title="Leaves"><div className="p-6 text-muted-foreground">Loading…</div></AppLayout>;
  }

  return (
    <AppLayout title={isAdmin ? "Leave Approvals" : "Attendance & Leaves"}>
      <Tabs defaultValue={isAdmin ? "pending" : "request"} className="space-y-4">
        <TabsList>
          {isAdmin ? (
            <>
              <TabsTrigger value="pending">Pending Queue ({pending.length})</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="request">Apply Leave</TabsTrigger>
              <TabsTrigger value="mine">My Requests</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="request">Apply Leave</TabsTrigger>
              <TabsTrigger value="mine">My Requests</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Apply Leave + Balances */}
        <TabsContent value="request" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(LEAVE_BALANCES) as Array<keyof typeof LEAVE_BALANCES>).map((t) => {
              const used = usedByType(t as LeaveType);
              const total = LEAVE_BALANCES[t];
              return (
                <Card key={t}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />{t}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.max(0, total - used)}<span className="text-sm font-normal text-muted-foreground"> / {total} days</span></div>
                    <p className="text-xs text-muted-foreground mt-1">{used} used this year</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> New Leave Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                      <SelectItem value="Maternity/Paternity Leave">Maternity/Paternity Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Days</Label>
                  <Input value={totalDays || ""} readOnly placeholder="Auto-calculated" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Reason</Label>
                  <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required placeholder="Provide a brief reason for your leave" />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit Request"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Requests */}
        <TabsContent value="mine">
          <Card>
            <CardHeader><CardTitle className="text-base">My Requests</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admin Remarks</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRows.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">No leave requests yet.</TableCell></TableRow>
                  )}
                  {myRows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.leave_type}</TableCell>
                      <TableCell>{r.start_date}</TableCell>
                      <TableCell>{r.end_date}</TableCell>
                      <TableCell>{r.total_days}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.admin_remarks || "—"}</TableCell>
                      <TableCell>
                        {r.status === "Pending" && (
                          <Button size="sm" variant="ghost" onClick={() => cancelRequest(r.id)}>Cancel</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin: Pending Queue */}
        {isAdmin && (
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StatCard icon={<Clock className="h-4 w-4 text-amber-600" />} label="Pending" value={pending.length} />
              <StatCard icon={<CheckCircle2 className="h-4 w-4 text-green-600" />} label="Approved" value={rows.filter(r => r.status === "Approved").length} />
              <StatCard icon={<XCircle className="h-4 w-4 text-red-600" />} label="Rejected" value={rows.filter(r => r.status === "Rejected").length} />
            </div>
            <Card>
              <CardHeader><CardTitle className="text-base">Pending Queue</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">No pending requests.</TableCell></TableRow>
                    )}
                    {pending.map((r) => (
                      <TableRow key={r.id} className="cursor-pointer" onClick={() => { setReviewRow(r); setRemarks(""); }}>
                        <TableCell className="font-medium">{r.employee_name}</TableCell>
                        <TableCell>{r.leave_type}</TableCell>
                        <TableCell>{r.start_date}</TableCell>
                        <TableCell>{r.end_date}</TableCell>
                        <TableCell>{r.total_days}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">{r.reason}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); setReviewRow(r); setRemarks(""); }}>Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Admin: History */}
        {isAdmin && (
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">History Logs</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Input placeholder="Filter by employee…" value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} className="sm:max-w-xs" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Reviewed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-6">No historical records.</TableCell></TableRow>
                    )}
                    {history.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.employee_name}</TableCell>
                        <TableCell>{r.leave_type}</TableCell>
                        <TableCell>{r.start_date}</TableCell>
                        <TableCell>{r.end_date}</TableCell>
                        <TableCell>{r.total_days}</TableCell>
                        <TableCell>{statusBadge(r.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{r.admin_remarks || "—"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Review Modal */}
      <Dialog open={!!reviewRow} onOpenChange={(o) => { if (!o) setReviewRow(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review Leave Request</DialogTitle></DialogHeader>
          {reviewRow && (
            <div className="space-y-3 text-sm">
              <Detail label="Employee" value={reviewRow.employee_name} />
              <Detail label="Type" value={reviewRow.leave_type} />
              <Detail label="Period" value={`${reviewRow.start_date} → ${reviewRow.end_date} (${reviewRow.total_days} day${reviewRow.total_days > 1 ? "s" : ""})`} />
              <Detail label="Submitted" value={new Date(reviewRow.created_at).toLocaleString()} />
              <div>
                <div className="text-muted-foreground text-xs mb-1">Reason</div>
                <div className="rounded border bg-muted/30 p-2">{reviewRow.reason}</div>
              </div>
              <div className="space-y-2">
                <Label>Admin Remarks</Label>
                <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Add a note for the employee (optional)" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => decide("Rejected")} disabled={reviewing} className="border-red-300 text-red-700 hover:bg-red-50">
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button onClick={() => decide("Approved")} disabled={reviewing} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <Card>
    <CardContent className="pt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </CardContent>
  </Card>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

export default Leaves;
