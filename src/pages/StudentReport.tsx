import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Compass, FileWarning } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { repositories } from "@/repositories";
import { fetchStudentReportFromBackend } from "@/lib/backend/assessmentGateway";

const StudentReport = () => {
  const { reportId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const normalizedReportId = reportId.trim();
  const reportAccessToken = searchParams.get("token")?.trim() ?? "";
  const { data: report } = useQuery({
    queryKey: ["student-report", normalizedReportId, reportAccessToken],
    queryFn: async () => {
      const localReport = repositories.report.getReport(normalizedReportId);
      if (localReport) {
        return localReport;
      }

      if (!reportAccessToken) {
        return null;
      }

      return fetchStudentReportFromBackend(normalizedReportId, reportAccessToken);
    },
    enabled: normalizedReportId.length > 0,
  });

  if (!report) {
    return (
      <div className="min-h-screen bg-background relative overflow-x-clip px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong rounded-[28px] border border-white/10 p-8 sm:p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] border border-white/10">
              <FileWarning size={28} className="text-white/70" />
            </div>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)] leading-[0.96]">Report not found</h1>
            <p className="mt-4 text-white/55 leading-7">
              We couldn&apos;t load this report. It may have been removed, or the link may be incomplete.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/75 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to registration
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              >
                Return home
              </Link>
            </div>
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
            <Compass size={14} />
            Saved report
          </div>
          <h1 className="mt-5 text-[clamp(2rem,6vw,4rem)] leading-[0.96]">{report.cover.title}</h1>
          <p className="mt-3 max-w-3xl text-white/55 leading-7">{report.cover.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/65">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{report.cover.studentName}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Class {report.cover.class}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{report.snapshot.topRecommendedStream.label}</span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="glass rounded-[24px] border border-white/10 p-6">
            <h2 className="text-xl text-white/90">Snapshot at a glance</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
              {report.snapshot.atAGlance.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-[24px] border border-white/10 p-6">
            <h2 className="text-xl text-white/90">Quick actions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
              {report.quickActions.map((action) => (
                <li key={action} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default StudentReport;
