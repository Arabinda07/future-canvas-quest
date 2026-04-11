import type { EntryPath } from "@/domain/types";

export function resolveEntryPath(counselorCode: string): EntryPath {
  return counselorCode.trim() ? "school-issued" : "self-serve";
}
