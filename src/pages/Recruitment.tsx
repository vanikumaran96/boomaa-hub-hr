import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, GripVertical, Mail, Briefcase, Building2, User } from "lucide-react";
import { sampleCandidates, sampleClients, sampleEmployees, samplePlacements } from "@/data/sampleData";
import type { Candidate, PlacementRecord } from "@/types/hr";
import { useToast } from "@/hooks/use-toast";

const STAGES = [
  { key: "sourced" as const, label: "Sourced", color: "bg-info/15 text-info border-info/20" },
  { key: "interview" as const, label: "Interview", color: "bg-warning/15 text-warning border-warning/20" },
  { key: "placed" as const, label: "Placed", color: "bg-success/15 text-success border-success/20" },
];

const recruiters = sampleEmployees.filter(e => e.department === "Recruitment");

const Recruitment = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(sampleCandidates);
  const [placements, setPlacements] = useState<PlacementRecord[]>(samplePlacements);
  const [draggedCandidate, setDraggedCandidate] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const [newCandidate, setNewCandidate] = useState({
    name: "", email: "", phone: "", position: "", clientId: "", assignedRecruiterId: "", notes: "",
  });

  const getClientName = (clientId: string) => sampleClients.find(c => c.id === clientId)?.name ?? "N/A";
  const getRecruiterName = (recruiterId: string) => sampleEmployees.find(e => e.id === recruiterId)?.name ?? "N/A";

  const calculateFee = (clientId: string) => {
    const client = sampleClients.find(c => c.id === clientId);
    if (!client) return 0;
    // For percentage, assume a base annual salary of 600000 (₹50k/month)
    return client.feeType === "percentage" ? Math.round((client.feeValue / 100) * 600000) : client.feeValue;
  };

  const getBillingStatus = (clientId: string) => sampleClients.find(c => c.id === clientId)?.invoiceStatus ?? "pending";

  const handleDragStart = (candidateId: string) => setDraggedCandidate(candidateId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (stage: Candidate["stage"]) => {
    if (!draggedCandidate) return;
    const candidate = candidates.find(c => c.id === draggedCandidate);
    if (!candidate) return;

    const previousStage = candidate.stage;
    setCandidates(prev => prev.map(c => c.id === draggedCandidate ? { ...c, stage } : c));

    // Auto-create placement record when moved to "placed"
    if (stage === "placed" && previousStage !== "placed") {
      const newPlacement: PlacementRecord = {
        id: `PLC${String(placements.length + 1).padStart(3, "0")}`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        clientId: candidate.clientId,
        clientName: getClientName(candidate.clientId),
        recruiterId: candidate.assignedRecruiterId,
        recruiterName: getRecruiterName(candidate.assignedRecruiterId),
        placementDate: new Date().toISOString().split("T")[0],
        expectedFee: calculateFee(candidate.clientId),
        billingStatus: getBillingStatus(candidate.clientId),
      };
      setPlacements(prev => [...prev, newPlacement]);
      toast({ title: "Placement recorded!", description: `${candidate.name} placed at ${newPlacement.clientName}. Expected fee: ₹${newPlacement.expectedFee.toLocaleString("en-IN")}` });
    } else {
      toast({ title: "Candidate moved", description: `Moved to ${stage} stage` });
    }

    setDraggedCandidate(null);
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.position || !newCandidate.clientId) return;
    const candidate: Candidate = {
      id: `CAN${String(candidates.length + 1).padStart(3, "0")}`,
      ...newCandidate,
      stage: "sourced",
      appliedDate: new Date().toISOString().split("T")[0],
    };
    setCandidates(prev => [...prev, candidate]);
    setNewCandidate({ name: "", email: "", phone: "", position: "", clientId: "", assignedRecruiterId: "", notes: "" });
    setIsAddOpen(false);
    toast({ title: "Candidate added", description: `${candidate.name} added to Sourced` });
  };

  // Recruiter performance stats
  const recruiterStats = recruiters.map(r => {
    const recruiterPlacements = placements.filter(p => p.recruiterId === r.id);
    return {
      ...r,
      placements: recruiterPlacements.length,
      totalRevenue: recruiterPlacements.reduce((sum, p) => sum + p.expectedFee, 0),
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);

  return (
    <AppLayout title="Recruitment Pipeline">
      <div className="space-y-4">
        {/* Recruiter Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recruiterStats.map(r => (
            <Card key={r.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{r.placements} placements • ₹{r.totalRevenue.toLocaleString("en-IN")} revenue</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Candidate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Name *</Label><Input value={newCandidate.name} onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })} /></div>
                  <div><Label>Email</Label><Input type="email" value={newCandidate.email} onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={newCandidate.phone} onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })} /></div>
                  <div><Label>Position *</Label><Input value={newCandidate.position} onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })} /></div>
                </div>
                <div>
                  <Label>Hiring Client *</Label>
                  <Select value={newCandidate.clientId} onValueChange={(v) => setNewCandidate({ ...newCandidate, clientId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      {sampleClients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assigned Recruiter</Label>
                  <Select value={newCandidate.assignedRecruiterId} onValueChange={(v) => setNewCandidate({ ...newCandidate, assignedRecruiterId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select recruiter" /></SelectTrigger>
                    <SelectContent>
                      {recruiters.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Notes</Label><Textarea value={newCandidate.notes} onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })} /></div>
                <Button onClick={handleAddCandidate} className="w-full" disabled={!newCandidate.name || !newCandidate.position || !newCandidate.clientId}>Add Candidate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage.key);
            return (
              <div key={stage.key} onDragOver={handleDragOver} onDrop={() => handleDrop(stage.key)} className="min-h-[400px]">
                <Card className="shadow-card h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{stage.label}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{stageCandidates.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageCandidates.map((candidate) => {
                      const placement = placements.find(p => p.candidateId === candidate.id);
                      return (
                        <div
                          key={candidate.id}
                          draggable
                          onDragStart={() => handleDragStart(candidate.id)}
                          className="p-3 rounded-lg border bg-card hover:shadow-card-hover transition-shadow cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" />{candidate.position}</div>
                            <div className="flex items-center gap-1.5"><Building2 className="h-3 w-3" />{getClientName(candidate.clientId)}</div>
                            <div className="flex items-center gap-1.5"><User className="h-3 w-3" />{getRecruiterName(candidate.assignedRecruiterId)}</div>
                            {candidate.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{candidate.email}</div>}
                          </div>
                          {/* Billing status for placed candidates */}
                          {candidate.stage === "placed" && placement && (
                            <div className="mt-2 pt-2 border-t flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">₹{placement.expectedFee.toLocaleString("en-IN")}</span>
                              <Badge variant={placement.billingStatus === "paid" ? "default" : placement.billingStatus === "overdue" ? "destructive" : "secondary"} className="text-[10px]">
                                {placement.billingStatus.charAt(0).toUpperCase() + placement.billingStatus.slice(1)}
                              </Badge>
                            </div>
                          )}
                          {candidate.notes && (
                            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">{candidate.notes}</p>
                          )}
                        </div>
                      );
                    })}
                    {stageCandidates.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">Drag candidates here</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Placement Ledger */}
        {placements.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Placement Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Candidate</th>
                      <th className="pb-2 pr-4 font-medium">Client</th>
                      <th className="pb-2 pr-4 font-medium">Recruiter</th>
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="pb-2 pr-4 font-medium text-right">Expected Fee</th>
                      <th className="pb-2 font-medium">Billing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placements.map(p => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 text-foreground">{p.candidateName}</td>
                        <td className="py-2 pr-4">{p.clientName}</td>
                        <td className="py-2 pr-4">{p.recruiterName}</td>
                        <td className="py-2 pr-4">{p.placementDate}</td>
                        <td className="py-2 pr-4 text-right">₹{p.expectedFee.toLocaleString("en-IN")}</td>
                        <td className="py-2">
                          <Badge variant={p.billingStatus === "paid" ? "default" : p.billingStatus === "overdue" ? "destructive" : "secondary"} className="text-[10px]">
                            {p.billingStatus.charAt(0).toUpperCase() + p.billingStatus.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Recruitment;
