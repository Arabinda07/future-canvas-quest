import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeInfo, FileWarning } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadCounselorAccessSession } from "@/features/counselor/accessSession";
import { fetchCounselorReport } from "@/lib/backend/counselorGateway";

const CounselorStudentReport = () => {
  const { reportId = "" } = useParams();
  const normalizedReportId = reportId.trim();
  const accessSession = loadCounselorAccessSession();
  const { data: report } = useQuery({
    queryKey: ["counselor-student-report", normalizedReportId],
    queryFn: () => {
      if (!accessSession) {
        throw new Error("Counselor access is missing.");
      }

      return fetchCounselorReport(normalizedReportId, accessSession);
    },
    enabled: normalizedReportId.length > 0 && Boolean(accessSession),
  });

  if (!report) {
    
    return (
      <div className="min-h-screen bg-background relative overflow-x-clip px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong rounded-[28px] border border-white/10 p-8 sm:p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] border border-white/10">
              <FileWarning size={28} className="text-white/70" />
            </div>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)] leading-[0.96]">Report not available</h1>
            <p className="mt-4 text-white/55 leading-7">
              Only school-issued student reports can be opened from the counselor view. This saved report is not linked to the validated school batch, or the link is incomplete.
            </p>
            <Link
              to="/counselor/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/75 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip px-4 py-5 sm:px-6 sm:py-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--lavender-glow)/0.12)] -top-24 -left-20" />
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.08)] bottom-0 -right-12" style={{ animationDuration: "15s" }} />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-[28px] border border-white/10 p-6 sm:p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/65">
            <BadgeInfo size={14} />
            Counselor report view
          </div>
          <h1 className="mt-5 text-[clamp(2rem,6vw,4rem)] leading-[0.96]">{report.cover.title}</h1>
          <p className="mt-3 max-w-3xl text-white/55 leading-7">
            Linked saved report for {report.cover.studentName} from session {report.sessionId}.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/65">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{report.cover.studentName}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Class {report.cover.class}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{report.cover.school}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Validated batch report</span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle>Snapshot at a glance</CardTitle>
              <CardDescription className="text-white/55">
                These values come straight from the saved report that the counselor dashboard links to.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-white/65">
                {report.snapshot.atAGlance.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle>Linked session</CardTitle>
              <CardDescription className="text-white/55">
                This report is loaded from the saved session/report pair, not from a fabricated summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/65">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-white/45">Session ID</p>
                <p className="mt-1 font-medium text-white/90">{report.sessionId}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-white/45">Student / class</p>
                <p className="mt-1 font-medium text-white/90">
                  {report.cover.studentName} · Class {report.cover.class} {report.cover.section}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-white/45">Generated on</p>
                <p className="mt-1 font-medium text-white/90">{report.cover.date}</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription className="text-white/55">Counselor-friendly next steps from the saved report.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-white/65">
                {report.quickActions.map((action) => (
                  <li key={action} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    {action}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle>Counselor note</CardTitle>
              <CardDescription className="text-white/55">A direct excerpt from the saved report body.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/65">
              <p className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">{report.counselling.summary}</p>
              {report.counselling.flags.length > 0 ? (
                report.counselling.flags.map((flag) => (
                  <div key={flag.flag} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/35">{flag.flag}</p>
                    <p className="mt-2 text-white/85">{flag.empatheticFraming}</p>
                    <p className="mt-2 text-white/55">{flag.supportiveNextStep}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-white/55">
                  No counseling flags were raised in this report.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        <Link
          to="/counselor/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default CounselorStudentReport;
