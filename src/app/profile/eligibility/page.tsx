
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { ApiError, apiClient } from "@/lib/api/client";

interface PlacementDrive {
  drive_id: string;
  drive_title: string | null;
  job_description: string | null;
  employment_type: string | null;
  work_mode: string | null;
  location: string | null;
  minimum_package_lpa: number | string | null;
  maximum_package_lpa: number | string | null;
  registration_deadline: string | null;
  drive_date: string | null;
  status: string | null;
}

interface PlacementDriveListResponse {
  total: number;
  page: number;
  page_size: number;
  drives: PlacementDrive[];
}

interface EligibilityCriterionResult {
  criterion: string;
  passed: boolean;
  message: string;
}

interface EligibilityEvaluationResponse {
  drive_id: string;
  is_eligible: boolean;
  results: EligibilityCriterionResult[];
}

function displayDate(value: string | null): string {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function displayPackage(
  minimum: number | string | null,
  maximum: number | string | null
): string {
  if (minimum == null && maximum == null) return "Not specified";

  const format = (value: number | string) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
      ? numericValue.toString()
      : String(value);
  };

  if (minimum != null && maximum != null) {
    return `${format(minimum)}–${format(maximum)} LPA`;
  }

  if (minimum != null) return `From ${format(minimum)} LPA`;
  return `Up to ${format(maximum!)} LPA`;
}

function readableStatus(status: string | null): string {
  if (!status) return "Status unavailable";

  return status
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function EligibilityPage() {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [evaluatingDriveId, setEvaluatingDriveId] = useState<string | null>(
    null
  );
  const [evaluations, setEvaluations] = useState<
    Record<string, EligibilityEvaluationResponse>
  >({});
  const [evaluationErrors, setEvaluationErrors] = useState<
    Record<string, string>
  >({});

  const loadDrives = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response =
        await apiClient.get<PlacementDriveListResponse>(
          "placement-drives?page=1&page_size=100"
        );

      setDrives(response.drives ?? []);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setPageError(
          "Your session may have expired. Please sign in again and retry."
        );
      } else {
        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load placement drives. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDrives();
  }, [loadDrives]);

  async function checkEligibility(driveId: string) {
    setEvaluatingDriveId(driveId);
    setEvaluationErrors((previous) => {
      const next = { ...previous };
      delete next[driveId];
      return next;
    });

    try {
      const result =
        await apiClient.post<EligibilityEvaluationResponse>(
          `placement-drives/${driveId}/eligibility/evaluate`
        );

      setEvaluations((previous) => ({
        ...previous,
        [driveId]: result,
      }));
    } catch (error) {
      let message =
        error instanceof Error
          ? error.message
          : "Unable to evaluate eligibility. Please retry.";

      if (error instanceof ApiError && error.status === 401) {
        message = "Your session may have expired. Please sign in again.";
      } else if (error instanceof ApiError && error.status === 404) {
        message =
          "A student profile or placement drive could not be found. Please check your profile and try again.";
      }

      setEvaluationErrors((previous) => ({
        ...previous,
        [driveId]: message,
      }));
    } finally {
      setEvaluatingDriveId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-in space-y-6">
      <section className="rounded-2xl border border-[#1A2B42] bg-gradient-to-br from-[#0E1B2E] to-[#09111E] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1683FF]/15">
            <ShieldCheck className="h-6 w-6 text-[#1683FF]" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-[#F1F5F9]">
              Placement Eligibility
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
              Explore placement drives and check your eligibility against
              their configured criteria using your student profile.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#1A2B42] bg-[#09111E] px-3 py-1.5 text-sm text-[#CBD5E1]">
            {drives.length} drive{drives.length === 1 ? "" : "s"} loaded
          </span>

          <button
            type="button"
            onClick={() => void loadDrives()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#263A54] px-3 py-2 text-sm font-medium text-[#CBD5E1] transition hover:border-[#1683FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh drives
          </button>
        </div>
      </section>

      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">{pageError}</div>
          <button
            type="button"
            onClick={() => void loadDrives()}
            className="font-semibold underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center gap-3 text-[#94A3B8]">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#1683FF]" />
          Loading placement drives...
        </div>
      ) : !pageError && drives.length === 0 ? (
        <div className="rounded-2xl border border-[#1A2B42] bg-[#09111E] px-6 py-14 text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-[#64748B]" />
          <h3 className="mt-4 text-lg font-semibold text-[#F1F5F9]">
            No placement drives found
          </h3>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Placement drives will appear here when they are available from
            the backend.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {drives.map((drive) => {
            const result = evaluations[drive.drive_id];
            const isEvaluating =
              evaluatingDriveId === drive.drive_id;
            const evaluationError =
              evaluationErrors[drive.drive_id];

            return (
              <article
                key={drive.drive_id}
                className="overflow-hidden rounded-2xl border border-[#1A2B42] bg-[#09111E]"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#263A54] bg-[#0E1B2E] px-2.5 py-1 text-xs font-medium text-[#CBD5E1]">
                          {readableStatus(drive.status)}
                        </span>
                        {drive.employment_type && (
                          <span className="text-xs text-[#64748B]">
                            {drive.employment_type.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-[#F1F5F9]">
                        {drive.drive_title || "Untitled placement drive"}
                      </h3>

                      {drive.job_description && (
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#94A3B8]">
                          {drive.job_description}
                        </p>
                      )}

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs text-[#64748B]">Location</p>
                          <p className="mt-1 text-[#CBD5E1]">
                            {drive.location || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">Package</p>
                          <p className="mt-1 text-[#CBD5E1]">
                            {displayPackage(
                              drive.minimum_package_lpa,
                              drive.maximum_package_lpa
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">
                            Registration deadline
                          </p>
                          <p className="mt-1 text-[#CBD5E1]">
                            {displayDate(drive.registration_deadline)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void checkEligibility(drive.drive_id)
                      }
                      disabled={isEvaluating}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0872E8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isEvaluating ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <ClipboardCheck className="h-4 w-4" />
                      )}
                      {isEvaluating
                        ? "Checking..."
                        : result
                          ? "Check again"
                          : "Check eligibility"}
                    </button>
                  </div>

                  {evaluationError && (
                    <div
                      role="alert"
                      className="mt-5 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {evaluationError}
                    </div>
                  )}

                  {result && (
                    <section
                      aria-live="polite"
                      className="mt-6 border-t border-[#1A2B42] pt-5"
                    >
                      <div
                        className={`flex items-center gap-3 rounded-xl border p-4 ${
                          result.is_eligible
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-red-500/30 bg-red-500/10"
                        }`}
                      >
                        {result.is_eligible ? (
                          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                        ) : (
                          <XCircle className="h-6 w-6 shrink-0 text-red-400" />
                        )}

                        <div>
                          <h4
                            className={`font-bold ${
                              result.is_eligible
                                ? "text-emerald-300"
                                : "text-red-300"
                            }`}
                          >
                            {result.is_eligible
                              ? "You are eligible"
                              : "You are not currently eligible"}
                          </h4>
                          <p className="mt-1 text-sm text-[#CBD5E1]">
                            {result.results.length} criterion
                            {result.results.length === 1 ? "" : "a"}{" "}
                            evaluated by the backend.
                          </p>
                        </div>
                      </div>

                      <h5 className="mt-5 font-semibold text-[#F1F5F9]">
                        Eligibility breakdown
                      </h5>

                      {result.results.length === 0 ? (
                        <p className="mt-3 text-sm text-[#94A3B8]">
                          The backend returned no individual criteria.
                        </p>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {result.results.map((criterion, index) => (
                            <div
                              key={`${criterion.criterion}-${index}`}
                              className="flex items-start gap-3 rounded-xl border border-[#1A2B42] bg-[#0E1B2E]/60 p-4"
                            >
                              {criterion.passed ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                              ) : (
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                              )}

                              <div className="min-w-0">
                                <p className="font-medium text-[#F1F5F9]">
                                  {criterion.criterion}
                                </p>
                                <p className="mt-1 text-sm leading-5 text-[#94A3B8]">
                                  {criterion.message}
                                </p>
                              </div>

                              <span
                                className={`ml-auto shrink-0 text-xs font-semibold ${
                                  criterion.passed
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                {criterion.passed ? "Passed" : "Failed"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
