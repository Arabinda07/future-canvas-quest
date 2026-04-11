import type { AssessmentSession, Campaign, Report } from "@/domain/types";

export interface CounselorDashboardMetrics {
  invited: number;
  started: number;
  completed: number;
  reportReady: number;
}

function isDefinedString(value: string | undefined): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function calculateCounselorDashboardMetrics({
  campaigns,
  sessions,
  reports,
}: {
  campaigns: Campaign[];
  sessions: AssessmentSession[];
  reports: Report[];
}): CounselorDashboardMetrics {
  const schoolIssuedCampaigns = campaigns.filter((campaign) => campaign.entryPath === "school-issued");
  const counselorIds = new Set(schoolIssuedCampaigns.map((campaign) => campaign.counselorId).filter(isDefinedString));
  const filterByCounselor = counselorIds.size > 0;

  const relevantSessions = sessions.filter((session) => {
    if (session.entryPath !== "school-issued") {
      return false;
    }

    if (!filterByCounselor) {
      return true;
    }

    return isDefinedString(session.counselorId) && counselorIds.has(session.counselorId);
  });

  const relevantSessionIds = new Set(relevantSessions.map((session) => session.id));

  return {
    invited: schoolIssuedCampaigns.length,
    started: relevantSessions.length,
    completed: relevantSessions.filter((session) => session.completed).length,
    reportReady: reports.filter((report) => relevantSessionIds.has(report.sessionId)).length,
  };
}
