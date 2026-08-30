import {apiFetch} from "./api";
import type {
  PlacementOfficerAnalytics,
} from "@/types/analytics";

export async function getPlacementOfficerAnalytics() {
  return apiFetch<PlacementOfficerAnalytics>(
    "/api/v1/analytics/placement-officer"
  );
}