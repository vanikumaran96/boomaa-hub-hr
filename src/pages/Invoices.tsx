import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { sampleInvoices } from "@/data/sampleData";
import { Search, IndianRupee, FileText, Users, AlertCircle } from "lucide-react";

const Invoices = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = sampleInvoices.filter((inv) => {
    const matchesSearch =
      inv.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.designation.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiceAmount = sampleInvoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0);
  const activeCount = sampleInvoices.filter((inv) => inv.status === "active").length;
  const leftCount = sampleInvoices.filter((inv) => inv.status === "left").length;

  return (
    <AppLayout title="Invoices">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-3xl font-bold text-foreground mt-1">{sampleInvoices.length}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-1">₹{totalInvoiceAmount.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-success/10">
                <IndianRupee className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-foreground mt-1">{activeCount}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Left</p>
                <p className="text-3xl font-bold text-foreground mt-1">{leftCount}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, client, designation..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="left">Left</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Package</TableHead>
                  <TableHead className="text-right">Invoice Amount</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv, idx) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{inv.candidateName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(inv.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>{inv.designation}</TableCell>
                    <TableCell className="text-right">
                      {inv.packageAmount > 0 ? `₹${inv.packageAmount.toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{inv.invoiceAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        inv.status === "active"
                          ? "bg-success/15 text-success"
                          : "bg-destructive/15 text-destructive"
                      }`}>
                        {inv.status === "active" ? "Active" : "Left"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No invoices found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Month label */}
        <p className="text-xs text-muted-foreground text-center">February 2026 Invoice List</p>
      </div>
    </AppLayout>
  );
};

export default Invoices;
