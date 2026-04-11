export type StudentClass = "IX" | "X" | "XI" | "XII";

export type EntryPath = "self-serve" | "school-issued";

export interface Student {
  id: string;
  name: string;
  class: StudentClass;
  email?: string;
  counselorId?: string;
  entryPath?: EntryPath;
  consent?: boolean;
}

export interface Counselor {
  id: string;
  name: string;
  code: string;
  email?: string;
  schoolId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  entryPath: EntryPath;
  active: boolean;
  counselorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  sessionId: string;
  studentId: string;
  answers: Record<string, string>;
  submittedAt: string;
}

export type AssessmentAnswers = Record<string, string>;

export type AptitudeCode = "N" | "L" | "V";

export type InterestCode = "R" | "I" | "A" | "S" | "E" | "C";

export type PersonalityCode = "O" | "Co" | "Ex" | "Ag" | "Ne";

export type StreamCode = "Science" | "Commerce" | "Humanities";

export type RecommendationConfidence = "High" | "Moderate" | "Low";

export type RecommendationFlag = "HIGH_NEUROTICISM" | "LOW_CONSCIENTIOUSNESS";

export type PersonalityLevel = "Low" | "Balanced" | "High";

export interface DimensionScore<Code extends string> {
  code: Code;
  label: string;
  raw: number;
  maxRaw: number;
  scaled: number;
}

export interface StreamScore {
  code: StreamCode;
  label: string;
  score: number;
}

export interface DominantPersonalityTrait {
  code: PersonalityCode;
  label: string;
  score: number;
  direction: "High" | "Low";
  distanceFromMidpoint: number;
}

export interface AssessmentScoringResult {
  aptitude: Record<AptitudeCode, DimensionScore<AptitudeCode>>;
  interests: Record<InterestCode, DimensionScore<InterestCode>>;
  personality: Record<PersonalityCode, DimensionScore<PersonalityCode>>;
  streams: Record<StreamCode, StreamScore>;
  rankedStreams: StreamScore[];
  topStream: StreamScore;
  confidence: RecommendationConfidence;
  flags: RecommendationFlag[];
  dominantPersonalityTrait: DominantPersonalityTrait;
}

export interface ReportStudentProfile {
  name: string;
  rollNo: string;
  class: StudentClass;
  section: string;
  school: string;
}

export interface ReportCover {
  title: string;
  subtitle: string;
  studentName: string;
  rollNo: string;
  class: StudentClass;
  section: string;
  school: string;
  date: string;
}

export interface ReportSnapshot {
  topAptitude: DimensionScore<AptitudeCode>;
  topInterests: DimensionScore<InterestCode>[];
  dominantPersonalityTrait: DominantPersonalityTrait;
  topRecommendedStream: StreamScore & { confidence: RecommendationConfidence };
  atAGlance: [string, string, string, string];
}

export interface InterestInsight {
  code: InterestCode;
  label: string;
  score: number;
  definition: string;
  practicalActivities: string[];
}

export interface PersonalityInsight {
  code: PersonalityCode;
  label: string;
  score: number;
  level: PersonalityLevel;
  balancedImplication: string;
}

export interface AptitudeTableRow {
  code: AptitudeCode;
  label: string;
  score: number;
  level: "Emerging" | "Developing" | "Strong";
  cbseSubjectInterpretation: string;
}

export interface StreamRecommendationDetail {
  code: StreamCode;
  label: string;
  score: number;
  fitLabel: "Best Fit" | "Explore Next" | "Keep as Backup";
  rationale: string;
}

export interface CareerClusterRecommendation {
  title: string;
  reason: string;
  isLessConventional: boolean;
}

export interface CounsellingFlagDetail {
  flag: RecommendationFlag;
  score: number;
  empatheticFraming: string;
  supportiveNextStep: string;
}

export interface CounsellingSection {
  summary: string;
  flags: CounsellingFlagDetail[];
}

export interface Report {
  id: string;
  sessionId: string;
  studentId: string;
  generatedAt: string;
  cover: ReportCover;
  snapshot: ReportSnapshot;
  scoring: AssessmentScoringResult;
  aptitudeTable: AptitudeTableRow[];
  interestInsights: InterestInsight[];
  bigFive: PersonalityInsight[];
  streamTable: StreamRecommendationDetail[];
  whyBestFit: string[];
  quickActions: string[];
  careerClusters: CareerClusterRecommendation[];
  counselling: CounsellingSection;
  disclaimer: string;
}

export interface AssessmentSession {
  id: string;
  studentId: string;
  counselorId?: string;
  studentClass: StudentClass;
  entryPath: EntryPath;
  answers: AssessmentAnswers;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentSessionInput {
  studentId: string;
  studentClass: StudentClass;
  entryPath: EntryPath;
  counselorId?: string;
}
