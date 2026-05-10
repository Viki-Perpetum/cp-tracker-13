import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock, Search, Eye, Building2, FileCheck, Banknote } from "lucide-react";

const CPS = [
  { id: "CP-01", name: "Foundations – Block A", contractor: "Democo NV", value: "€2.4M", drawdown: "2024-07-15", milestone: "Concrete pour complete", milestoneStatus: "done", belfiusCondition: "Insurance certificate", belfiusStatus: "missing", deliverable: "As-built survey", deliverableStatus: "at-risk", pm: "Lena Maes", notes: "Survey firm delayed by 2 weeks. Escalated to Democo on 12 Jun." },
  { id: "CP-02", name: "Steel Frame – Block B", contractor: "Victor Construct", value: "€5.1M", drawdown: "2024-08-01", milestone: "Frame erection 80%", milestoneStatus: "at-risk", belfiusCondition: "Bank approval letter", belfiusStatus: "done", deliverable: "Progress photos + QA log", deliverableStatus: "done", pm: "Yannick De Wolf", notes: "Steel delivery delayed 10 days from Liège depot." },
  { id: "CP-03", name: "MEP Rough-in – Block A", contractor: "TechnoFlow BVBA", value: "€1.8M", drawdown: "2024-08-20", milestone: "1st fix complete", milestoneStatus: "on-track", belfiusCondition: "Contractor solvency cert", belfiusStatus: "at-risk", deliverable: "Inspection sign-off", deliverableStatus: "on-track", pm: "Lena Maes", notes: "Solvency cert requested 3 weeks ago, no response." },
  { id: "CP-04", name: "Facade Cladding – Block C", contractor: "Arcadia Facades", value: "€3.3M", drawdown: "2024-09-10", milestone: "Sample panel approved", milestoneStatus: "done", belfiusCondition: "Planning permit confirmation", belfiusStatus: "done", deliverable: "Material delivery note", deliverableStatus: "done", pm: "Tom Verbeke", notes: "All green. Ready for drawdown." },
  { id: "CP-05", name: "Groundworks – Block D", contractor: "Terra Sol NV", value: "€0.9M", drawdown: "2024-09-30", milestone: "Drainage network laid", milestoneStatus: "at-risk", belfiusCondition: "Soil report validation", belfiusStatus: "missing", deliverable: "CCTV pipe inspection", deliverableStatus: "missing", pm: "Tom Verbeke", notes: "Soil report revision pending geotechnical lab. Critical path item." },
  { id: "CP-06", name: "Roofing – Block B", contractor: "TopDak BV", value: "€1.2M", drawdown: "2024-10-05", milestone: "Waterproof membrane down", milestoneStatus: "on-track", belfiusCondition: "Warranty letter", belfiusStatus: "on-track", deliverable: "Thermographic report", deliverableStatus: "on-track", pm: "Yannick De Wolf", notes: "On schedule. Thermal survey booked for 5 Sep." }
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  done: { label: "Done", color: "bg-emerald-500/15 text-emerald-600 border-emerald-300", icon: <CheckCircle2 className="w-3 h-3" /> },
  "on-track": { label: "On Track", color: "bg-blue-500/15 text-blue-600 border-blue-300", icon: <Clock className="w-3 h-3" /> },
  "at-risk": { label: "At Risk", color: "bg-amber-500/15 text-amber-600 border-amber-300", icon: <AlertTriangle className="w-3 h-3" /> },
  missing: { label: "Missing", color: "bg-destructive/15 text-destructive border-destructive/30", icon: <AlertTriangle className="w-3 h-3" /> }
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["on-track"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.color}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function overallRisk(cp: typeof CPS[0]) {
  const statuses = [cp.milestoneStatus, cp.belfiusStatus, cp.deliverableStatus];
  if (statuses.includes("missing")) return "missing";
  if (statuses.includes("at-risk")) return "at-risk";
  if (statuses.every(s => s === "done")) return "done";
  return "on-track";
}

export default function CpTracker() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<typeof CPS[0] | null>(null);

  const filtered = CPS.filter(cp => {
    const q = search.toLowerCase();
    const matchSearch = cp.name.toLowerCase().includes(q) || cp.contractor.toLowerCase().includes(q) || cp.id.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (tab === "blocked") return ["missing", "at-risk"].includes(overallRisk(cp));
    if (tab === "ready") return overallRisk(cp) === "done";
    return true;
  });

  const blocked = CPS.filter(c => ["missing", "at-risk"].includes(overallRisk(c))).length;
  const ready = CPS.filter(c => overallRisk(c) === "done").length;
  const totalValue = "€14.7M";
  const nextDrawdown = "15 Jul 2024";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Construction Package Tracker</h1>
        <p className="text-muted-foreground mt-1">Unified view of CP milestones, Belfius conditions, and contractor deliverables across all active packages.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Building2 className="w-4 h-4" />Total Packages</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{CPS.length}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />Blocked / At Risk</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-amber-500">{blocked}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Banknote className="w-4 h-4" />Portfolio Value</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{totalValue}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2"><FileCheck className="w-4 h-4 text-emerald-500" />Next Drawdown</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{nextDrawdown}</p><p className="text-xs text-muted-foreground">CP-01 · {ready} pkg ready</p></CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search CP, contractor…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="blocked">Blocked</TabsTrigger>
                <TabsTrigger value="ready">Ready</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-2.5 text-muted-foreground font-medium">CP</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium">Contractor</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium">Drawdown</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium">Milestone</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium">Belfius Cond.</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium">Deliverable</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-medium">Overall</th>
                  <th className="px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cp => (
                  <tr key={cp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-foreground">{cp.id}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">{cp.name}</p>
                    </td>
                    <td className="px-3 py-3 text-foreground">{cp.contractor}</td>
                    <td className="px-3 py-3 text-foreground whitespace-nowrap">{cp.drawdown}</td>
                    <td className="px-3 py-3"><StatusBadge status={cp.milestoneStatus} /></td>
                    <td className="px-3 py-3"><StatusBadge status={cp.belfiusStatus} /></td>
                    <td className="px-3 py-3"><StatusBadge status={cp.deliverableStatus} /></td>
                    <td className="px-3 py-3"><StatusBadge status={overallRisk(cp)} /></td>
                    <td className="px-3 py-3">
                      <Button size="sm" variant="ghost" onClick={() => setSelected(cp)}><Eye className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No packages match your filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{selected.id} — {selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-muted-foreground">Contractor</p><p className="font-medium text-foreground">{selected.contractor}</p></div>
                  <div><p className="text-muted-foreground">Value</p><p className="font-medium text-foreground">{selected.value}</p></div>
                  <div><p className="text-muted-foreground">Drawdown Date</p><p className="font-medium text-foreground">{selected.drawdown}</p></div>
                  <div><p className="text-muted-foreground">Project Manager</p><p className="font-medium text-foreground">{selected.pm}</p></div>
                </div>
                <div className="border border-border rounded-lg divide-y divide-border">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div><p className="font-medium text-foreground">Milestone</p><p className="text-xs text-muted-foreground">{selected.milestone}</p></div>
                    <StatusBadge status={selected.milestoneStatus} />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div><p className="font-medium text-foreground">Belfius Condition</p><p className="text-xs text-muted-foreground">{selected.belfiusCondition}</p></div>
                    <StatusBadge status={selected.belfiusStatus} />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div><p className="font-medium text-foreground">Deliverable</p><p className="text-xs text-muted-foreground">{selected.deliverable}</p></div>
                    <StatusBadge status={selected.deliverableStatus} />
                  </div>
                </div>
                <div className="bg-muted/40 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Notes</p>
                  <p className="text-foreground">{selected.notes}</p>
                </div>
                <div className="flex justify-end"><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
