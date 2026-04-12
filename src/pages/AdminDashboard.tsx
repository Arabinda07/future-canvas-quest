import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, RefreshCcw, ShieldCheck, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  approveCounselorRegistration,
  listCounselorRegistrationRequests,
  rejectCounselorRegistration,
  listCounselorBatches,
  retireCounselorBatch,
  type CounselorApprovalResult,
  type CounselorRegistrationRequest,
  type CounselorBatchRow,
} from "@/lib/backend/counselorGateway";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [approvalToken, setApprovalToken] = useState("");
  const [requests, setRequests] = useState<CounselorRegistrationRequest[]>([]);
  const [batches, setBatches] = useState<CounselorBatchRow[]>([]);
  
  const [approvalResult, setApprovalResult] = useState<CounselorApprovalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [retiringBatchCode, setRetiringBatchCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  const loadAll = async () => {
    const token = approvalToken.trim();
    if (!token) {
      setError("Enter the admin approval token first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [reqs, bts] = await Promise.all([
        listCounselorRegistrationRequests(token, statusFilter),
        listCounselorBatches(token)
      ]);
      setRequests(reqs.requests);
      setBatches(bts.batches);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "We could not load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setActiveRequestId(requestId);
    setError(null);
    try {
      const result = await approveCounselorRegistration({ requestId, approvalToken: approvalToken.trim() });
      setApprovalResult(result);
      setRequests((current) => current.map((request) => (request.id === requestId ? { ...request, status: "approved", batchCode: result.batchCode } : request)));
      loadAll();
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : "We could not approve this counselor request.");
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActiveRequestId(requestId);
    setError(null);
    try {
      await rejectCounselorRegistration({ requestId, approvalToken: approvalToken.trim() });
      setRequests((current) => current.map((request) => (request.id === requestId ? { ...request, status: "rejected" } : request)));
    } catch (rejectionError) {
      setError(rejectionError instanceof Error ? rejectionError.message : "We could not reject this counselor request.");
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleRetireBatch = async (batchCode: string) => {
    setRetiringBatchCode(batchCode);
    setError(null);
    try {
      await retireCounselorBatch(batchCode, approvalToken.trim());
      toast({
        title: "Batch Retired",
        description: `School batch ${batchCode} has been explicitly retired.`,
      });
      loadAll();
    } catch (retireError) {
      setError(retireError instanceof Error ? retireError.message : "We could not retire this batch.");
    } finally {
      setRetiringBatchCode(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--lavender-glow)/0.12)] -top-28 -left-24" />
        <div className="glow-blob w-[24rem] h-[24rem] bg-[hsl(var(--mint-glow)/0.08)] bottom-0 -right-20" style={{ animationDuration: "15s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65">
            <ShieldCheck size={14} />
            Internal admin dashboard
          </div>
          <div>
            <h1 className="text-[clamp(2rem,5vw,4rem)] leading-[0.98]">Command Center</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-white/55">
              Review requests, coordinate school batches, and securely manage access tokens from one unified interface.
            </p>
          </div>
        </div>

        <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
          <CardHeader>
            <CardTitle>Admin authorization</CardTitle>
            <CardDescription className="text-white/55">This dashboard is protected by the `FCQ_ADMIN_APPROVAL_TOKEN` Edge Function secret.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="admin-approval-token" className="text-white/70">Admin approval token</Label>
              <Input
                id="admin-approval-token"
                type="password"
                value={approvalToken}
                onChange={(event) => setApprovalToken(event.target.value)}
                className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white"
              />
            </div>
            <Button className="self-end min-h-[48px] rounded-full gradient-accent text-primary-foreground border-0" onClick={() => void loadAll()} disabled={isLoading}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
              Load Dashboard Data
            </Button>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 text-sm text-white/80">
            {error}
          </div>
        ) : null}

        {approvalResult ? (
          <Card className="border-[hsl(var(--mint)/0.25)] bg-[hsl(var(--mint)/0.08)] shadow-card backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 size={20} />
                Invite created
              </CardTitle>
              <CardDescription className="text-white/65">Copy these details and share them with the counselor manually.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/75">
              <p>Batch code: <span className="font-mono text-white">{approvalResult.batchCode}</span></p>
              <p>Access token: <span className="font-mono text-white">{approvalResult.adminToken}</span></p>
              <p className="break-all">Invite URL: <span className="font-mono text-white">{approvalResult.inviteUrl}</span></p>
            </CardContent>
          </Card>
        ) : null}

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/[0.03] border border-white/5 mb-6 p-1">
            <TabsTrigger value="requests" className="rounded-xl data-[state=active]:bg-white/[0.08] data-[state=active]:text-white transition-all text-white/60">
              Registration Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="batches" className="rounded-xl data-[state=active]:bg-white/[0.08] data-[state=active]:text-white transition-all text-white/60">
              School Batches ({batches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-end mb-4">
              <div className="w-[180px]">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); if(approvalToken) void loadAll(); }}>
                  <SelectTrigger className="bg-white/[0.03] border-white/10 text-white rounded-xl">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white rounded-xl">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {requests.length === 0 ? (
              <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
                <CardContent className="px-4 py-8 text-center text-sm text-white/45">
                  No counselor registration requests found for this status.
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle>{request.schoolName}</CardTitle>
                      <Badge className="bg-white/[0.08] text-white/70">{request.status}</Badge>
                    </div>
                    <CardDescription className="text-white/55">
                      {request.counselorName} · {request.email} · {request.phone} · {request.schoolCity}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-white/55">
                      Expected students: {request.expectedStudentCount}. {request.message || "No additional message provided."}
                    </p>
                    {request.batchCode ? <p className="text-sm text-white/60">Batch code {request.batchCode}</p> : null}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        className="rounded-full gradient-accent text-primary-foreground border-0"
                        disabled={request.status !== "pending" || activeRequestId === request.id}
                        onClick={() => void handleApprove(request.id)}
                      >
                        {activeRequestId === request.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Approve request
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        disabled={request.status !== "pending" || activeRequestId === request.id}
                        onClick={() => void handleReject(request.id)}
                      >
                        <XCircle size={16} />
                        Reject request
                      </Button>
                      {request.status === "approved" && request.batchCode ? (
                        <span className="inline-flex items-center gap-2 text-sm text-white/55">
                          Approved <ArrowRight size={14} />
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            {batches.length === 0 ? (
              <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
                <CardContent className="px-4 py-8 text-center text-sm text-white/45">
                  No active school batches found.
                </CardContent>
              </Card>
            ) : (
              batches.map((batch) => {
                const isRetired = batch.valid_until && new Date(batch.valid_until).getTime() <= Date.now();
                return (
                  <Card key={batch.code} className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
                    <CardHeader className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="font-mono text-xl">{batch.code}</CardTitle>
                        <Badge className={isRetired ? "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]" : "bg-[hsl(var(--mint)/0.15)] text-[hsl(var(--mint))]"} >
                          {isRetired ? "Retired" : "Active"}
                        </Badge>
                      </div>
                      <CardDescription className="text-white/60 text-base">{batch.school_name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-white/55">
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Created At</span>
                          <span>{new Date(batch.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Seats Purchased</span>
                          <span>{batch.seats_purchased}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Seats Used</span>
                          <span>{batch.seats_used}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Status</span>
                          <span className={isRetired ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--mint))]"}>{isRetired ? "Retired" : "Valid"}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
                        <Button
                          variant="destructive"
                          className="rounded-full bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.2)] border-0"
                          disabled={isRetired || retiringBatchCode === batch.code}
                          onClick={() => void handleRetireBatch(batch.code)}
                        >
                          {retiringBatchCode === batch.code ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          Retire Batch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
