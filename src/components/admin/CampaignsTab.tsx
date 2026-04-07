import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Copy, Check, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  school_name: string;
  class: string;
  section: string | null;
  campaign_code: string;
  status: string;
  created_at: string;
}

interface CampaignStats {
  campaign_id: string;
  total: number;
  completed: number;
  paid: number;
}

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const CampaignsTab = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Record<string, CampaignStats>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [classVal, setClassVal] = useState("");
  const [section, setSection] = useState("");
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    const campaignList = (data || []) as Campaign[];
    setCampaigns(campaignList);

    // Fetch stats for each campaign
    if (campaignList.length > 0) {
      const ids = campaignList.map((c) => c.id);
      const { data: assessments } = await supabase
        .from("assessments")
        .select("campaign_id, payment_status, scores")
        .in("campaign_id", ids);

      const statsMap: Record<string, CampaignStats> = {};
      for (const c of campaignList) {
        const related = (assessments || []).filter((a: any) => a.campaign_id === c.id);
        statsMap[c.id] = {
          campaign_id: c.id,
          total: related.length,
          completed: related.filter((a: any) => a.scores).length,
          paid: related.filter((a: any) => a.payment_status === "paid").length,
        };
      }
      setStats(statsMap);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async () => {
    if (!schoolName.trim() || !classVal) return;
    setCreating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "Not authenticated", variant: "destructive" });
      setCreating(false);
      return;
    }

    const code = generateCode();
    const { error } = await supabase.from("campaigns").insert({
      counselor_id: user.id,
      school_name: schoolName.trim(),
      class: classVal,
      section: section.trim() || null,
      campaign_code: code,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Campaign created", description: `Code: ${code}` });
      setSchoolName("");
      setClassVal("");
      setSection("");
      await fetchCampaigns();
    }
    setCreating(false);
  };

  const copyLink = (code: string, id: string) => {
    const url = `${window.location.origin}/register?campaign=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Create Campaign */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Campaign
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">School Name *</Label>
              <Input
                placeholder="e.g. Delhi Public School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Class *</Label>
              <Select value={classVal} onValueChange={setClassVal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {["IX", "X", "XI", "XII"].map((c) => (
                    <SelectItem key={c} value={c}>Class {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Section</Label>
              <Input
                placeholder="e.g. A"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
            <Button onClick={handleCreate} disabled={creating || !schoolName.trim() || !classVal}>
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading…</p>
      ) : campaigns.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No campaigns yet. Create one above.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => {
                const s = stats[c.id] || { total: 0, completed: 0, paid: 0 };
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.school_name}</TableCell>
                    <TableCell>{c.class}</TableCell>
                    <TableCell>{c.section || "—"}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{c.campaign_code}</code>
                    </TableCell>
                    <TableCell>{s.total}</TableCell>
                    <TableCell>{s.completed}</TableCell>
                    <TableCell>{s.paid}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "active" ? "default" : "secondary"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyLink(c.campaign_code, c.id)}
                        className="gap-1"
                      >
                        {copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === c.id ? "Copied" : "Copy"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CampaignsTab;
