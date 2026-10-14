
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyApplications,
  getMyApplicationDetails,
  withdrawMyApplication,
} from "@/lib/student-profile-api";

type Application = {
  application_id: string;
  drive_id: string;
  student_id: string;
  resume_id: string | null;
  application_status: string | null;
  applied_at: string | null;
  company_name: string | null;
  role_title: string | null;
  drive_title: string | null;
};

type Filters = {
  status: string;
  company: string;
  role: string;
};

const terminalStatuses = ["WITHDRAWN", "REJECTED", "SELECTED"];

const statusStyles: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-300 ring-blue-400/20",
  ELIGIBILITY_VERIFIED: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20",
  SHORTLISTED: "bg-purple-500/10 text-purple-300 ring-purple-400/20",
  ASSESSMENT: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  TECHNICAL_INTERVIEW: "bg-indigo-500/10 text-indigo-300 ring-indigo-400/20",
  HR_INTERVIEW: "bg-orange-500/10 text-orange-300 ring-orange-400/20",
  SELECTED: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  REJECTED: "bg-red-500/10 text-red-300 ring-red-400/20",
  WITHDRAWN: "bg-slate-700/60 text-slate-300 ring-slate-600",
};

function formatStatus(status: string | null) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string | null) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleString();
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [filters, setFilters] = useState<Filters>({
    status: "",
    company: "",
    role: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    status: "",
    company: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const loadApplications = useCallback(async (activeFilters: Filters) => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const data = await getMyApplications({
        status: activeFilters.status || undefined,
        company: activeFilters.company.trim() || undefined,
        role: activeFilters.role.trim() || undefined,
      });

      if (!Array.isArray(data)) {
        throw new Error(
          "The server returned an unexpected applications response."
        );
      }

      setApplications(data as Application[]);
    } catch (err) {
      setApplications([]);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications(appliedFilters);
  }, [appliedFilters, loadApplications]);

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters({ ...filters });
    setDetailsId(null);
    setDetails(null);
  }

  function clearFilters() {
    const emptyFilters = { status: "", company: "", role: "" };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setDetailsId(null);
    setDetails(null);
  }

  async function toggleDetails(applicationId: string) {
    if (detailsId === applicationId) {
      setDetailsId(null);
      setDetails(null);
      setDetailsError("");
      return;
    }

    setDetailsId(applicationId);
    setDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const result = await getMyApplicationDetails(applicationId);

      if (result && typeof result === "object" && !Array.isArray(result)) {
        setDetails(result as Record<string, unknown>);
      } else {
        setDetailsError("Application details could not be displayed.");
      }
    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "Failed to load application details."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleWithdraw(application: Application) {
    const confirmed = window.confirm(
      `Are you sure you want to withdraw your application to ${
        application.company_name || "this company"
      } for ${application.role_title || "this role"}?`
    );

    if (!confirmed) return;

    setWithdrawingId(application.application_id);
    setError("");
    setNotice("");

    try {
      await withdrawMyApplication(application.application_id);

      setNotice("Your application has been withdrawn successfully.");
      setDetailsId(null);
      setDetails(null);

      await loadApplications(appliedFilters);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to withdraw the application."
      );
    } finally {
      setWithdrawingId(null);
    }
  }

  const appliedCount = applications.filter(
    (app) => app.application_status === "APPLIED"
  ).length;

  const shortlistedCount = applications.filter(
    (app) => app.application_status === "SHORTLISTED"
  ).length;

  const selectedCount = applications.filter(
    (app) => app.application_status === "SELECTED"
  ).length;

  const withdrawnCount = applications.filter(
    (app) => app.application_status === "WITHDRAWN"
  ).length;

  const hasFilters = Boolean(
    filters.status || filters.company.trim() || filters.role.trim()
  );

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
              Placement portal
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              My Applications
            </h1>

            <p className="mt-2 text-slate-400">
              Track your applications and manage your placement journey.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadApplications(appliedFilters)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-500/50 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true">↻</span>
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <section
          aria-label="Application summary"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            {
              label: "Applications shown",
              value: applications.length,
              symbol: "▤",
              color: "bg-violet-500/10 text-violet-300",
            },
            {
              label: "Applied",
              value: appliedCount,
              symbol: "◷",
              color: "bg-blue-500/10 text-blue-300",
            },
            {
              label: "Shortlisted",
              value: shortlistedCount,
              symbol: "✦",
              color: "bg-purple-500/10 text-purple-300",
            },
            {
              label: "Selected",
              value: selectedCount,
              symbol: "✓",
              color: "bg-emerald-500/10 text-emerald-300",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-400">
                  {item.label}
                </p>

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${item.color}`}
                >
                  {item.symbol}
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              Filter applications
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Find applications by status, company, or job role.
            </p>
          </div>

          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Application status
                </label>

                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(event) =>
                    setFilters({ ...filters, status: event.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">All statuses</option>
                  <option value="APPLIED">Applied</option>
                  <option value="ELIGIBILITY_VERIFIED">
                    Eligibility Verified
                  </option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="TECHNICAL_INTERVIEW">
                    Technical Interview
                  </option>
                  <option value="HR_INTERVIEW">HR Interview</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="company-filter"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Company
                </label>

                <input
                  id="company-filter"
                  type="text"
                  placeholder="Search company..."
                  value={filters.company}
                  onChange={(event) =>
                    setFilters({ ...filters, company: event.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="role-filter"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Job role
                </label>

                <input
                  id="role-filter"
                  type="text"
                  placeholder="Search job role..."
                  value={filters.role}
                  onChange={(event) =>
                    setFilters({ ...filters, role: event.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:opacity-50"
              >
                Apply filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                disabled={loading && !hasFilters}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
              >
                Clear filters
              </button>
            </div>
          </form>
        </section>

        {/* Feedback messages */}
        {notice && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-emerald-800 bg-emerald-950/50 p-4 text-sm text-emerald-300"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300"
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1">{error}</p>

            <button
              type="button"
              onClick={() => void loadApplications(appliedFilters)}
              className="mt-3 font-semibold underline underline-offset-2 hover:text-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Application list heading */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">
              Your applications
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {loading
                ? "Loading applications..."
                : `${applications.length} application${
                    applications.length === 1 ? "" : "s"
                  } found`}
            </p>
          </div>

          {withdrawnCount > 0 && (
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-300">
              {withdrawnCount} withdrawn
            </span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="mt-5 space-y-4" aria-label="Loading applications">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="h-5 w-1/3 rounded bg-slate-700" />
                <div className="mt-4 h-4 w-1/4 rounded bg-slate-800" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && applications.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-300">
              ▤
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">
              {hasFilters ? "No matching applications" : "No applications yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {hasFilters
                ? "Try different filters or clear them to see all your applications."
                : "Your placement applications will appear here after you apply for a placement drive."}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Application cards */}
        {!loading && !error && applications.length > 0 && (
          <div className="mt-5 space-y-5">
            {applications.map((application) => {
              const status = application.application_status ?? "";
              const isTerminal = terminalStatuses.includes(status);
              const isWithdrawing =
                withdrawingId === application.application_id;
              const isExpanded = detailsId === application.application_id;

              return (
                <article
                  key={application.application_id}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 transition hover:border-slate-700 hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400">
                          {application.drive_title || "Placement drive"}
                        </p>

                        <h3 className="mt-2 break-words text-xl font-bold text-white">
                          {application.company_name ||
                            "Company details unavailable"}
                        </h3>

                        <p className="mt-1 text-base font-medium text-slate-300">
                          {application.role_title ||
                            "Role details unavailable"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[status] ??
                          "bg-slate-800 text-slate-300 ring-slate-700"
                        }`}
                      >
                        {formatStatus(status || null)}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Applied on
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {formatDate(application.applied_at)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Application ID
                        </p>
                        <p className="mt-1 break-all text-sm text-slate-400">
                          {application.application_id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-5">
                      <button
                        type="button"
                        onClick={() =>
                          void toggleDetails(application.application_id)
                        }
                        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-500/50 hover:bg-slate-700"
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </button>

                      {!isTerminal && (
                        <button
                          type="button"
                          disabled={isWithdrawing}
                          onClick={() => void handleWithdraw(application)}
                          className="rounded-xl border border-red-900/80 bg-red-950/20 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isWithdrawing
                            ? "Withdrawing..."
                            : "Withdraw application"}
                        </button>
                      )}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/60 p-4 sm:p-5">
                        <h4 className="font-semibold text-white">
                          Application details
                        </h4>

                        {detailsLoading && (
                          <p className="mt-3 text-sm text-slate-400">
                            Loading details...
                          </p>
                        )}

                        {detailsError && (
                          <p role="alert" className="mt-3 text-sm text-red-300">
                            {detailsError}
                          </p>
                        )}

                      {details && !detailsLoading && (
                        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Company
                            </dt>
                            <dd className="mt-1 text-sm text-slate-200">
                              {String(details.company_name ?? "Not available")}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Job role
                            </dt>
                            <dd className="mt-1 text-sm text-slate-200">
                              {String(details.role_title ?? "Not available")}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Placement drive
                            </dt>
                            <dd className="mt-1 text-sm text-slate-200">
                              {String(details.drive_title ?? "Not available")}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Application status
                            </dt>
                            <dd className="mt-1 text-sm text-slate-200">
                              {formatStatus(
                                typeof details.application_status === "string"
                                  ? details.application_status
                                  : null
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Applied on
                            </dt>
                            <dd className="mt-1 text-sm text-slate-200">
                              {formatDate(
                                typeof details.applied_at === "string"
                                  ? details.applied_at
                                  : null
                              )}
                            </dd>
                          </div>
                        </dl>
                      )}

                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          Application statuses are provided by the placement system.
        </p>
      </div>
    </main>
  );
}
