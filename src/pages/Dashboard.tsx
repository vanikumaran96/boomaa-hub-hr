import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, Wallet, UserSearch, TrendingUp, Building2 } from "lucide-react";
import { sampleEmployees, sampleCandidates, BRANCHES } from "@/data/sampleData";

const Dashboard = () => {
  const totalEmployees = sampleEmployees.length;
  const totalCandidates = sampleCandidates.length;
  const placed = sampleCandidates.filter((c) => c.stage === "placed").length;
  const inInterview = sampleCandidates.filter((c) => c.stage === "interview").length;

  const stats = [
    { title: "Total Employees", value: totalEmployees, icon: Users, change: "+2 this month" },
    { title: "Active Branches", value: BRANCHES.length, icon: Building2, change: "All operational" },
    { title: "Open Positions", value: totalCandidates - placed, icon: UserSearch, change: `${inInterview} in interview` },
    { title: "Placements", value: placed, icon: TrendingUp, change: "This quarter" },
  ];

  const branchData = BRANCHES.map((branch) => ({
    name: branch,
    count: sampleEmployees.filter((e) => e.branch === branch).length,
  }));

  const recentCandidates = [...sampleCandidates]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branch Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Branch Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {branchData.map((branch) => (
                  <div key={branch.name} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-28">{branch.name}</span>
                    <div className="flex-1 h-7 bg-secondary rounded-md overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-md flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${Math.max((branch.count / totalEmployees) * 100, 15)}%` }}
                      >
                        <span className="text-xs font-medium text-primary-foreground">{branch.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Candidates */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Recent Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.position} • {sampleClients.find(c => c.id === candidate.clientId)?.name ?? "N/A"}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      candidate.stage === "placed"
                        ? "bg-success/15 text-success"
                        : candidate.stage === "interview"
                        ? "bg-warning/15 text-warning"
                        : "bg-info/15 text-info"
                    }`}>
                      {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
