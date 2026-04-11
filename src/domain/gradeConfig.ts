import type { StudentClass } from "@/domain/types";

export interface ClassBandConfig {
  className: StudentClass;
  band: "middle" | "secondary" | "senior";
  label: string;
  gradeLevel: number;
}

const CLASS_BAND_CONFIG: Record<StudentClass, ClassBandConfig> = {
  IX: { className: "IX", band: "secondary", label: "Class IX", gradeLevel: 9 },
  X: { className: "X", band: "secondary", label: "Class X", gradeLevel: 10 },
  XI: { className: "XI", band: "senior", label: "Class XI", gradeLevel: 11 },
  XII: { className: "XII", band: "senior", label: "Class XII", gradeLevel: 12 },
};

export function getClassBandConfig(className: StudentClass): ClassBandConfig {
  return CLASS_BAND_CONFIG[className];
}

export function getClassBandLabel(className: StudentClass): string {
  return getClassBandConfig(className).label;
}

export function getClassBandGradeLevel(className: StudentClass): number {
  return getClassBandConfig(className).gradeLevel;
}

export const classBandConfig = CLASS_BAND_CONFIG;
