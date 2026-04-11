import { createLocalAssessmentRepository } from "@/repositories/local/localAssessmentRepository";
import { createLocalCampaignRepository } from "@/repositories/local/localCampaignRepository";
import { createLocalReportRepository } from "@/repositories/local/localReportRepository";

export type {
  AssessmentRepository,
  CampaignRepository,
  ReportRepository,
} from "@/repositories/contracts";
export { createLocalAssessmentRepository } from "@/repositories/local/localAssessmentRepository";
export { createLocalCampaignRepository } from "@/repositories/local/localCampaignRepository";
export { createLocalReportRepository } from "@/repositories/local/localReportRepository";

export const repositories = {
  assessment: createLocalAssessmentRepository(),
  campaign: createLocalCampaignRepository(),
  report: createLocalReportRepository(),
};
