import type { ModelConsumable } from "@/types";

type Relation = Pick<ModelConsumable, "modelId" | "verificationStatus" | "evidenceScope">;
type Part = { compatibilities?: Relation[] };

export function isOfficialCompatibility(relation: Relation | undefined): boolean {
  return relation?.verificationStatus === "official" && relation.evidenceScope === "scoped";
}

export function hasOfficialCompatibility(part: Part, modelId: string): boolean {
  return (
    part.compatibilities?.some((r) => r.modelId === modelId && isOfficialCompatibility(r)) ?? false
  );
}

export function summarizeCompatibility(parts: Part[], modelId: string) {
  const confirmed = parts.filter((part) => hasOfficialCompatibility(part, modelId)).length;
  return { registered: parts.length, confirmed, needsReview: parts.length - confirmed };
}
