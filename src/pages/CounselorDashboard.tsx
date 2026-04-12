import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, ExternalLink, LayoutDashboard, LogOut, RefreshCcw, PlusCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseClient } from "@/lib/backend/supabase";
import { fetchCounselorDashboardData, claimCounselorBatch } from "@/lib/backend/counselorGateway";
import { clearCounselorAccessSession } from "@/features/counselor/accessSession";
import { toast } from "@/hooks/use-toast";

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  
  const [claimBatchCode, setClaimBatchCode] = useState("");
  const [claimAdminToken, setClaimAdminToken] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["counselor-dashboard"],
    queryFn: fetchCounselorDashboardData,
  });

  useEffect(() => {
    // Check if there is a pending claim from navigating to login with an invite link
    const pendingClaimStr = window.localStorage.getItem("pending_batch_claim");
    if (pendingClaimStr) {
      try {
        const parsed = JSON.parse(pendingClaimStr);
        if (parsed.batchCode && parsed.adminToken) {
          void handleClaimBatch(parsed.batchCode, parsed.adminToken);
        }
        window.localStorage.removeItem("pending_batch_claim");
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      if (supabase) await supabase.auth.signOut();
    } finally {
      clearCounselorAccessSession();
      navigate("/counselor/login", { replace: true });
    }
  };

  const handleClaimBatch = async (batchCodeOverride?: string, tokenOverride?: string) => {
    const bCode = (batchCodeOverride || claimBatchCode).trim();
    const aToken = (tokenOverride || claimAdminToken).trim();
    
    if (!bCode || !aToken) {
      setClaimError("Batch code and admin token are required.");
      return;
    }

    setIsClaiming(true);
    setClaimError(null);
    try {
      await claimCounselorBatch(bCode, aToken);
      toast({
        title: "Batch Claimed Successfully!",
        description: `School batch ${bCode} has been linked to your account.`,
      });
      setClaimBatchCode("");
      setClaimAdminToken("");
      void refetch();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "We could not claim this batch.");
      if (batchCodeOverride) {
        toast({
          variant: "destructive",
          title: "Failed to claim pending batch",
          description: err instanceof Error ? err.message : "Error claiming batch.",
        });
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--lavender-glow)/0.12)] -top-28 -left-24" />
        <div className="glow-blob w-[24rem] h-[24rem] bg-[hsl(var(--mint-glow)/0.08)] bottom-0 -right-20" style={{ animationDuration: "15s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65">
                <LayoutDashboard size={14} />
                Counselor workspace
              </div>
              <div>
                <h1 className="text-[clamp(2rem,5vw,4rem)] leading-[0.98]">Counselor dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-white/55">
                  Welcome back, {user?.email}. Review your connected school batches, monitor student analytics, and access assessment reports.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                className="rounded-full text-white/60 hover:text-white hover:bg-white/[0.05] self-start"
                onClick={() => navigate("/")}
              >
                Back to site
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
                onClick={() => void handleLogout()}
              >
                <LogOut size={16} />
                Log out
              </Button>
            </div>
        </div>

        {/* Claim Batch Widget */}
        <Card className="border-[hsl(var(--mint)/0.25)] bg-[hsl(var(--mint)/0.04)] shadow-card backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PlusCircle size={20} />
              Link an approved school batch
            </CardTitle>
            <CardDescription className="text-white/60">
              When an admin approves your registration, they will provide a Batch Code and Access Token. Claim it here to permanently bind it to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Input
                placeholder="Batch code (e.g. KVXYZ2025)"
                value={claimBatchCode}
                onChange={(e) => setClaimBatchCode(e.target.value.toUpperCase())}
                className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Private access token"
                type="password"
                value={claimAdminToken}
                onChange={(e) => setClaimAdminToken(e.target.value)}
                className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white"
              />
            </div>
            <Button
              className="self-end min-h-[48px] rounded-full gradient-accent text-primary-foreground border-0 hover:opacity-95"
              onClick={() => void handleClaimBatch()}
              disabled={isClaiming}
            >
              Claim Batch
            </Button>
          </CardContent>
          {claimError ? (
            <CardFooter>
              <div className="w-full rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 text-sm text-white/80 flex items-center gap-3">
                <AlertTriangle size={16} className="text-[hsl(var(--destructive))]" />
                {claimError}
              </div>
            </CardFooter>
          ) : null}
        </Card>

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-16 text-center text-white/45">
            Loading your linked batches...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.05)] px-4 py-16 text-center text-white/60">
            We couldn't load your dashboard. Try refreshing the page.
          </div>
        ) : data?.batches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-20 text-center text-white/45 shadow-sm">
            <h3 className="text-lg font-medium text-white/80 mb-2">No batches linked</h3>
            <p className="max-w-md mx-auto">Use the widget above to link your first school batch utilizing the credentials provided by the admin.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
                onClick={() => void refetch()}
              >
                <RefreshCcw size={16} />
                Refresh Latest Data
              </Button>
            </div>
            
            {data?.batches.map((batch) => (
              <div key={batch.batchCode} className="space-y-6 pb-12 border-b border-white/5 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-white/95">{batch.schoolName}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <p className="text-sm text-white/50 font-mono">CODE: {batch.batchCode}</p>
                       <Badge className="bg-[hsl(var(--mint)/0.16)] text-[hsl(var(--mint-glow))] hover:bg-[hsl(var(--mint)/0.16)] font-normal text-xs">Active Batch</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Invited", value: batch.metrics.invited },
                    { label: "Started", value: batch.metrics.started },
                    { label: "Completed", value: batch.metrics.completed },
                    { label: "Report ready", value: batch.metrics.reportReady },
                  ].map((metric) => (
                    <Card key={metric.label} className="border-white/10 bg-white/[0.03] shadow-none backdrop-blur">
                      <CardHeader className="pb-3">
                        <CardDescription className="text-white/50">{metric.label}</CardDescription>
                        <CardTitle className="text-3xl">{metric.value}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <Card className="border-white/10 bg-white/[0.02] shadow-none backdrop-blur">
                  <CardHeader className="space-y-2 pb-0">
                    <CardTitle className="text-lg">Generated Student Reports</CardTitle>
                    <CardDescription className="text-white/55">
                      School-issued submissions natively linked to this batch.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {batch.reports && batch.reports.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {batch.reports.map((report) => (
                          <div key={report.reportId} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:bg-white/[0.06]">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 space-y-1">
                                <h3 className="truncate font-medium text-white/90">{report.studentName}</h3>
                                <p className="text-sm text-white/55">Class {report.className} · {report.section}</p>
                              </div>
                              <CheckCircle2 size={16} className="shrink-0 text-[hsl(var(--mint))]" />
                            </div>

                            <Link
                              to={`/counselor/reports/${report.reportId}`}
                              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 text-sm text-white/80 transition hover:bg-black/60 hover:text-white"
                            >
                              Open Full Report
                              <ExternalLink size={16} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/5 bg-transparent px-4 py-8 text-center text-sm text-white/30">
                        No validated reports are available yet for this batch.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorDashboard;
