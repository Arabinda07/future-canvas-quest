import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, RefreshCcw, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  approveCounselorRegistration,
  listCounselorRegistrationRequests,
  rejectCounselorRegistration,
  type CounselorApprovalResult,
  type CounselorRegistrationRequest,
} from "@/lib/backend/counselorGateway";

const AdminCounselorRequests = () => {
  const [approvalToken, setApprovalToken] = useState("");
  const [requests, setRequests] = useState<CounselorRegistrationRequest[]>([]);
  const [approvalResult, setApprovalResult] = useState<CounselorApprovalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    const token = approvalToken.trim();
    if (!token) {
      setError("Enter the admin approval token first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await listCounselorRegistrationRequests(token);
      setRequests(result.requests);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "We could not load counselor requests.");
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
            Internal admin
          </div>
          <div>
            <h1 className="text-[clamp(2rem,5vw,4rem)] leading-[0.98]">Counselor requests</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-white/55">
              Review pending school requests, approve them into school batches, and copy the generated invite URL.
            </p>
          </div>
        </div>

        <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
          <CardHeader>
            <CardTitle>Admin approval token</CardTitle>
            <CardDescription className="text-white/55">This page calls a Supabase Edge Function protected by the `FCQ_ADMIN_APPROVAL_TOKEN` secret.</CardDescription>
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
            <Button className="self-end min-h-[48px] rounded-full gradient-accent text-primary-foreground border-0" onClick={() => void loadRequests()} disabled={isLoading}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
              Load pending requests
            </Button>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 text-sm text-white/80">
            {error}
          </div>
        ) : null}

        {approvalResult ? (
          <Card className="border-[hsl(var(--mint)/0.25)] bg-[hsl(var(--mint)/0.08)] shadow-card backdrop-blur">
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

        <div className="grid gap-4">
          {requests.length === 0 ? (
            <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
              <CardContent className="px-4 py-8 text-center text-sm text-white/45">
                No counselor registration requests loaded yet.
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle>{request.schoolName}</CardTitle>
                    <Badge className="bg-white/[0.08] text-white/70 hover:bg-white/[0.08]">{request.status}</Badge>
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
                      className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
                      disabled={request.status !== "pending" || activeRequestId === request.id}
                      onClick={() => void handleReject(request.id)}
                    >
                      <XCircle size={16} />
                      Reject request
                    </Button>
                    {request.status === "approved" && request.batchCode ? (
                      <span className="inline-flex items-center gap-2 text-sm text-white/55">
                        Approved
                        <ArrowRight size={14} />
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCounselorRequests;
