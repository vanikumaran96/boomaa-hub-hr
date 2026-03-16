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
import { Plus, GripVertical, User, Mail, Phone, Briefcase, Building2 } from "lucide-react";
import { sampleCandidates } from "@/data/sampleData";
import type { Candidate } from "@/types/hr";
import { useToast } from "@/hooks/use-toast";

const STAGES = [
  { key: "sourced" as const, label: "Sourced", color: "bg-info/15 text-info border-info/20" },
  { key: "interview" as const, label: "Interview", color: "bg-warning/15 text-warning border-warning/20" },
  { key: "placed" as const, label: "Placed", color: "bg-success/15 text-success border-success/20" },
];

const Recruitment = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(sampleCandidates);
  const [draggedCandidate, setDraggedCandidate] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const [newCandidate, setNewCandidate] = useState({
    name: "", email: "", phone: "", position: "", client: "", notes: "",
  });

  const handleDragStart = (candidateId: string) => {
    setDraggedCandidate(candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: Candidate["stage"]) => {
    if (!draggedCandidate) return;
    setCandidates((prev) =>
      prev.map((c) => (c.id === draggedCandidate ? { ...c, stage } : c))
    );
    setDraggedCandidate(null);
    toast({ title: "Candidate moved", description: `Moved to ${stage} stage` });
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.position) return;
    const candidate: Candidate = {
      id: `CAN${String(candidates.length + 1).padStart(3, "0")}`,
      ...newCandidate,
      stage: "sourced",
      appliedDate: new Date().toISOString().split("T")[0],
    };
    setCandidates((prev) => [...prev, candidate]);
    setNewCandidate({ name: "", email: "", phone: "", position: "", client: "", notes: "" });
    setIsAddOpen(false);
    toast({ title: "Candidate added", description: `${candidate.name} added to Sourced` });
  };

  return (
    <AppLayout title="Recruitment Pipeline">
      <div className="space-y-4">
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
                <div><Label>Client</Label><Input value={newCandidate.client} onChange={(e) => setNewCandidate({ ...newCandidate, client: e.target.value })} /></div>
                <div><Label>Notes</Label><Textarea value={newCandidate.notes} onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })} /></div>
                <Button onClick={handleAddCandidate} className="w-full" disabled={!newCandidate.name || !newCandidate.position}>Add Candidate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage.key);
            return (
              <div
                key={stage.key}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.key)}
                className="min-h-[400px]"
              >
                <Card className="shadow-card h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{stage.label}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{stageCandidates.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageCandidates.map((candidate) => (
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
                          <div className="flex items-center gap-1.5"><Building2 className="h-3 w-3" />{candidate.client}</div>
                          {candidate.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{candidate.email}</div>}
                        </div>
                        {candidate.notes && (
                          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">{candidate.notes}</p>
                        )}
                      </div>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Drag candidates here
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Recruitment;
