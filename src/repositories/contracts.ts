import type {
  AssessmentSession,
  Campaign,
  CreateAssessmentSessionInput,
  Report,
} from "@/domain/types";

export interface CampaignRepository {
  listCampaigns(): Campaign[];
  getCampaign(id: string): Campaign | null;
  saveCampaign(campaign: Campaign): Campaign;
}

export interface AssessmentRepository {
  createSession(input: CreateAssessmentSessionInput): AssessmentSession;
  getSession(id: string): AssessmentSession | null;
  saveSession(session: AssessmentSession): AssessmentSession;
  listSessions(): AssessmentSession[];
}

export interface ReportRepository {
  listReports(): Report[];
  getReport(id: string): Report | null;
  saveReport(report: Report): Report;
}
