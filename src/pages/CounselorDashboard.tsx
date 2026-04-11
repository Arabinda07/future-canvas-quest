import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, ExternalLink, LayoutDashboard, LogOut, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clearCounselorAccessSession, loadCounselorAccessSession } from "@/features/counselor/accessSession";
import { fetchCounselorDashboardData } from "@/lib/backend/counselorGateway";

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const accessSession = loadCounselorAccessSession();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["counselor-dashboard", accessSession?.batchCode],
    queryFn: () => {
      if (!accessSession) {
        throw new Error("Counselor access is missing.");
      }

      return fetchCounselorDashboardData(accessSession);
    },
  });

  const handleLogout = () => {
    clearCounselorAccessSession();
    navigate("/counselor/login", { replace: true });
  };

  const metricCards = [
    { label: "Invited", value: data?.metrics.invited ?? 0 },
    { label: "Started", value: data?.metrics.started ?? 0 },
    { label: "Completed", value: data?.metrics.completed ?? 0 },
    { label: "Report ready", value: data?.metrics.reportReady ?? 0 },
  ];

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
                Counselor dashboard
              </div>
              <div>
                <h1 className="text-[clamp(2rem,5vw,4rem)] leading-[0.98]">Counselor dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-white/55">
                  Batch-scoped access for school-issued sessions, validated by the invite token before the dashboard loads.
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
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Log out
              </Button>
            </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <Card key={metric.label} className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/50">{metric.label}</CardDescription>
                <CardTitle className="text-4xl">{metric.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle>Batch access</CardTitle>
              <CardDescription className="text-white/55">
                The dashboard is locked to the batch validated by the invite link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/45">
                  Loading batch-scoped counselor data...
                </div>
              ) : isError || !data ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/45">
                  We couldn't load the counselor dashboard for this batch. Reopen the invite link or refresh to try again.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-medium text-white/90">{data.schoolName}</h2>
                        <Badge className="bg-[hsl(var(--mint)/0.16)] text-[hsl(var(--mint-glow))] hover:bg-[hsl(var(--mint)/0.16)]">Validated</Badge>
                      </div>
                      <p className="mt-1 text-sm text-white/50">Batch code {data.batchCode}</p>
                    </div>
                    <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--mint))]" />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-6 text-white/50">
                    {data.validUntil
                      ? `Access valid until ${new Date(data.validUntil).toLocaleDateString("en-IN")}.`
                      : "This invite link does not currently expose an expiry date."}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
              <CardHeader>
                <CardTitle>Batch controls</CardTitle>
                <CardDescription className="text-white/55">
                  Use the validated invite token to refresh batch metrics and linked report visibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-6 text-white/50">
                  School-issued submissions for the validated batch appear below. Self-serve submissions stay outside this dashboard.
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
                  onClick={() => void refetch()}
                >
                  <RefreshCcw size={16} />
                  Refresh batch data
                </Button>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
              <CardHeader className="space-y-2">
                <CardTitle>Linked report views</CardTitle>
                <CardDescription className="text-white/55">
                  Only saved reports owned by the validated batch are shown here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.reports && data.reports.length > 0 ? (
                  data.reports.map((report) => (
                    <div key={report.reportId} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate font-medium text-white/90">{report.studentName}</h2>
                            <Badge className="bg-[hsl(var(--mint)/0.16)] text-[hsl(var(--mint-glow))] hover:bg-[hsl(var(--mint)/0.16)]">
                              School-issued
                            </Badge>
                          </div>
                          <p className="text-sm text-white/55">
                            Class {report.className} · {report.section} · {report.schoolName}
                          </p>
                          <p className="text-xs uppercase tracking-[0.16em] text-white/35">Session {report.sessionId}</p>
                        </div>
                        <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--mint))]" />
                      </div>

                      <Link
                        to={`/counselor/reports/${report.reportId}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        Open report
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/45">
                    No validated batch reports are available yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;
