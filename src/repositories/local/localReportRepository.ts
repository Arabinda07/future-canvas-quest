import type {
  AptitudeTableRow,
  CareerClusterRecommendation,
  CounsellingFlagDetail,
  CounsellingSection,
  DominantPersonalityTrait,
  InterestInsight,
  PersonalityInsight,
  Report,
  ReportSnapshot,
  StreamRecommendationDetail,
} from "@/domain/types";
import type { ReportRepository } from "@/repositories/contracts";
import { getBrowserStorage, isRecord, readJsonStorage, writeJsonStorage } from "@/lib/storage";

const STORAGE_KEY = "fcq.reports";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isDimensionScore(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.label === "string" &&
    typeof value.raw === "number" &&
    typeof value.maxRaw === "number" &&
    typeof value.scaled === "number"
  );
}

function isStreamScore(value: unknown) {
  return isRecord(value) && typeof value.code === "string" && typeof value.label === "string" && typeof value.score === "number";
}

function isDominantPersonalityTrait(value: unknown): value is DominantPersonalityTrait {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.label === "string" &&
    typeof value.score === "number" &&
    (value.direction === "High" || value.direction === "Low") &&
    typeof value.distanceFromMidpoint === "number"
  );
}

function isReportSnapshot(value: unknown): value is ReportSnapshot {
  if (!isRecord(value) || !isDimensionScore(value.topAptitude) || !Array.isArray(value.topInterests) || !isDominantPersonalityTrait(value.dominantPersonalityTrait) || !isRecord(value.topRecommendedStream) || !isStreamScore(value.topRecommendedStream)) {
    return false;
  }

  const topRecommendedStream = value.topRecommendedStream as Record<string, unknown>;

  return (
    value.topInterests.every(isDimensionScore) &&
    (topRecommendedStream.confidence === "High" ||
      topRecommendedStream.confidence === "Moderate" ||
      topRecommendedStream.confidence === "Low") &&
    Array.isArray(value.atAGlance) &&
    value.atAGlance.length === 4 &&
    value.atAGlance.every((entry) => typeof entry === "string")
  );
}

function isAptitudeTableRow(value: unknown): value is AptitudeTableRow {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.label === "string" &&
    typeof value.score === "number" &&
    (value.level === "Emerging" || value.level === "Developing" || value.level === "Strong") &&
    typeof value.cbseSubjectInterpretation === "string"
  );
}

function isInterestInsight(value: unknown): value is InterestInsight {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.label === "string" &&
    typeof value.score === "number" &&
    typeof value.definition === "string" &&
    Array.isArray(value.practicalActivities) &&
    value.practicalActivities.every((entry) => typeof entry === "string")
  );
}

function isPersonalityInsight(value: unknown): value is PersonalityInsight {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.label === "string" &&
    typeof value.score === "number" &&
    (value.level === "Low" || value.level === "Balanced" || value.level === "High") &&
    typeof value.balancedImplication === "string"
  );
}

function isStreamRecommendationDetail(value: unknown): value is StreamRecommendationDetail {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.label === "string" &&
    typeof value.score === "number" &&
    (value.fitLabel === "Best Fit" || value.fitLabel === "Explore Next" || value.fitLabel === "Keep as Backup") &&
    typeof value.rationale === "string"
  );
}

function isCareerClusterRecommendation(value: unknown): value is CareerClusterRecommendation {
  return (
    isRecord(value) &&
    typeof value.title === "string" &&
    typeof value.reason === "string" &&
    typeof value.isLessConventional === "boolean"
  );
}

function isCounsellingFlagDetail(value: unknown): value is CounsellingFlagDetail {
  return (
    isRecord(value) &&
    typeof value.flag === "string" &&
    typeof value.score === "number" &&
    typeof value.empatheticFraming === "string" &&
    typeof value.supportiveNextStep === "string"
  );
}

function isCounsellingSection(value: unknown): value is CounsellingSection {
  return (
    isRecord(value) &&
    typeof value.summary === "string" &&
    Array.isArray(value.flags) &&
    value.flags.every(isCounsellingFlagDetail)
  );
}

function isReport(value: unknown): value is Report {
  if (!isRecord(value)) return false;
  if (
    typeof value.id !== "string" ||
    typeof value.sessionId !== "string" ||
    typeof value.studentId !== "string" ||
    typeof value.generatedAt !== "string" ||
    typeof value.disclaimer !== "string" ||
    !isRecord(value.cover) ||
    !isReportSnapshot(value.snapshot) ||
    !isRecord(value.scoring) ||
    !Array.isArray(value.aptitudeTable) ||
    !Array.isArray(value.interestInsights) ||
    !Array.isArray(value.bigFive) ||
    !Array.isArray(value.streamTable) ||
    !Array.isArray(value.whyBestFit) ||
    !Array.isArray(value.quickActions) ||
    !Array.isArray(value.careerClusters) ||
    !isCounsellingSection(value.counselling)
  ) {
    return false;
  }

  const cover = value.cover as Record<string, unknown>;
  const scoring = value.scoring as Record<string, unknown>;

  return (
    typeof cover.title === "string" &&
    typeof cover.subtitle === "string" &&
    typeof cover.studentName === "string" &&
    typeof cover.rollNo === "string" &&
    typeof cover.class === "string" &&
    typeof cover.section === "string" &&
    typeof cover.school === "string" &&
    typeof cover.date === "string" &&
    isRecord(scoring.aptitude) &&
    isRecord(scoring.interests) &&
    isRecord(scoring.personality) &&
    isRecord(scoring.streams) &&
    Array.isArray(scoring.rankedStreams) &&
    scoring.rankedStreams.every(isStreamScore) &&
    isStreamScore(scoring.topStream) &&
    (scoring.confidence === "High" || scoring.confidence === "Moderate" || scoring.confidence === "Low") &&
    Array.isArray(scoring.flags) &&
    scoring.flags.every(
      (flag: unknown) =>
        flag === "HIGH_NEUROTICISM" || flag === "LOW_CONSCIENTIOUSNESS",
    ) &&
    isDominantPersonalityTrait(scoring.dominantPersonalityTrait) &&
    value.aptitudeTable.every(isAptitudeTableRow) &&
    value.interestInsights.every(isInterestInsight) &&
    value.bigFive.every(isPersonalityInsight) &&
    value.streamTable.every(isStreamRecommendationDetail) &&
    value.whyBestFit.every((sentence) => typeof sentence === "string") &&
    value.quickActions.every((action) => typeof action === "string") &&
    value.careerClusters.every(isCareerClusterRecommendation)
  );
}

function isReportRecord(value: unknown): value is Record<string, Report> {
  return isRecord(value) && Object.entries(value).every(([id, report]) => isReport(report) && report.id === id);
}

export function createLocalReportRepository(storage = getBrowserStorage()): ReportRepository {
  const loadReports = () => readJsonStorage<Record<string, Report>>(storage, STORAGE_KEY, {}, isReportRecord);
  const persistReports = (reports: Record<string, Report>) => writeJsonStorage(storage, STORAGE_KEY, reports);

  return {
    listReports: () => Object.values(loadReports()),
    getReport: (id) => loadReports()[id] ?? null,
    saveReport: (report) => {
      const reports = loadReports();
      reports[report.id] = report;
      persistReports(reports);
      return report;
    },
  };
}
