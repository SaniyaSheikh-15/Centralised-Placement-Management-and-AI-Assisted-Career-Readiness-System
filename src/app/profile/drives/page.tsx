
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { ApiError, apiClient } from "@/lib/api/client";
import { applyForPlacementDrive } from "@/lib/student-profile-api";

type PlacementDrive = {
  drive_id: string;
  company_id: string;
  recruiter_id: string;
  job_role_id: string;
  drive_title: string | null;
  job_description: string | null;
  employment_type: string | null;
  work_mode: string | null;
  location: string | null;
  minimum_package_lpa: number | string | null;
  maximum_package_lpa: number | string | null;
  vacancies: number | null;
  registration_deadline: string | null;
  drive_date: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

type PlacementDriveListResponse = {
  total: number;
  page: number;
  page_size: number;
  drives: PlacementDrive[];
};

type ApplicationRecord = {
  drive_id?: string;
  application_id?: string;
  status?: string;
};

type ApplicationListResponse =
  | ApplicationRecord[]
  | { applications?: ApplicationRecord[] };

const PAGE_SIZE = 100;

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not announced";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPackage(
  minimum: number | string | null,
  maximum: number | string | null,
) {
  const min = minimum === null ? null : Number(minimum);
  const max = maximum === null ? null : Number(maximum);

  if (min === null && max === null) return "Not disclosed";
  if (min !== null && max !== null) {
    return min === max ? `${min} LPA` : `${min}–${max} LPA`;
  }
  if (min !== null) return `${min} LPA onwards`;
  return `Up to ${max} LPA`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Your session may have expired. Please sign in again.";
    }
    if (error.status === 403) {
      return "You do not have permission to view these placement drives.";
    }
    return error.message || "Unable to complete the request.";
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function getStatusColor(status: string | null | undefined) {
  switch (status?.toLowerCase()) {
    case "active":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "closed":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";
    default:
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }
}

export default function PlacementDrivesPage() {
  const router = useRouter();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [total, setTotal] = useState(0);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const loadDrives = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await apiClient.get<PlacementDriveListResponse>(
          `placement-drives?page=1&page_size=${PAGE_SIZE}`,
        );

      setDrives(response.drives ?? []);
      setTotal(response.total ?? response.drives?.length ?? 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    try {
      const response = await apiClient.get<
        ApplicationListResponse | null
      >("applications/me");

      const records = Array.isArray(response)
        ? response
        : response?.applications ?? [];

      setApplications(records);
    } catch {
      // Drive browsing should still work if application history cannot load.
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    void loadDrives();
    void loadApplications();
  }, [loadDrives, loadApplications]);

  const appliedDriveIds = useMemo(
    () =>
      new Set(
        applications
          .filter(
            (application) =>
              application.status?.toUpperCase() !== "WITHDRAWN",
          )
          .map((application) => application.drive_id)
          .filter((id): id is string => Boolean(id)),
      ),
    [applications],
  );

  const filteredDrives = useMemo(() => {
    const term = search.trim().toLowerCase();

    return drives.filter((drive) => {
      const matchesSearch =
        !term ||
        [
          drive.drive_title,
          drive.job_description,
          drive.location,
          drive.employment_type,
          drive.work_mode,
        ].some((value) => value?.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "all" ||
        drive.status?.toLowerCase() === statusFilter;

      const matchesEmployment =
        employmentFilter === "all" ||
        drive.employment_type === employmentFilter;

      return matchesSearch && matchesStatus && matchesEmployment;
    });
  }, [drives, search, statusFilter, employmentFilter]);

  async function handleApply(drive: PlacementDrive) {
    setApplyingTo(drive.drive_id);
    setNotice("");
    setActionError("");

    try {
      await applyForPlacementDrive(drive.drive_id);
      setNotice(`Application submitted for "${drive.drive_title ?? "this drive"}".`);
      await loadApplications();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setApplyingTo(null);
    }
  }

  function isDeadlinePassed(deadline: string | null) {
    if (!deadline) return false;
    const date = new Date(deadline);
    return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
  }

  return (
    <main className="min-h-screen bg-[#09111E] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#102440] via-[#102039] to-[#11182B] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
                Career opportunities
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Placement Drives
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Explore placement opportunities, review the requirements, and
                apply for drives that match your career goals.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-5 py-4">
              <div className="rounded-xl bg-blue-500/15 p-3 text-blue-300">
                <BriefcaseBusiness size={23} />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-slate-400">Total listed drives</p>
              </div>
            </div>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200"
          >
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span>{notice}</span>
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <span>{actionError}</span>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-[#0E1B2E] p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_190px_220px_auto]">
            <label className="relative block">
              <span className="sr-only">Search placement drives</span>
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, location or description"
                className="w-full rounded-xl border border-white/10 bg-[#091525] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-blue-400/60"
              />
            </label>

            <label>
              <span className="sr-only">Filter by drive status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#091525] px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/60"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label>
              <span className="sr-only">Filter by employment type</span>
              <select
                value={employmentFilter}
                onChange={(event) => setEmploymentFilter(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#091525] px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/60"
              >
                <option value="all">All employment types</option>
                <option value="FULL_TIME">Full time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME_WITH_INTERNSHIP">
                  Full time + internship
                </option>
                <option value="CONTRACT">Contract</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setEmploymentFilter("all");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
            >
              <Filter size={16} />
              Reset
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw size={26} className="animate-spin text-blue-400" />
            <p className="text-sm">Loading placement drives...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-7 text-center">
            <AlertCircle className="mx-auto mb-3 text-rose-300" size={30} />
            <h2 className="font-semibold text-white">
              Could not load placement drives
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadDrives()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : filteredDrives.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0E1B2E] px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <BriefcaseBusiness size={26} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {drives.length === 0
                ? "No placement drives available"
                : "No matching drives found"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {drives.length === 0
                ? "Placement drives will appear here when they are published."
                : "Try changing your search or filters to see more opportunities."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">
                Available opportunities
              </h2>
              <p className="text-sm text-slate-400">
                {filteredDrives.length} shown
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {filteredDrives.map((drive) => {
                const deadlinePassed = isDeadlinePassed(
                  drive.registration_deadline,
                );
                const applied = appliedDriveIds.has(drive.drive_id);
                const closed =
                  drive.status?.toLowerCase() === "closed" || deadlinePassed;
                const busy = applyingTo === drive.drive_id;

                return (
                  <article
                    key={drive.drive_id}
                    className="flex flex-col rounded-2xl border border-white/10 bg-[#0E1B2E] p-5 transition hover:border-blue-400/30 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                          <BriefcaseBusiness size={22} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-semibold text-white">
                            {drive.drive_title || "Untitled placement drive"}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Job role ID: {drive.job_role_id}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(drive.status)}`}
                      >
                        {formatLabel(drive.status)}
                      </span>
                    </div>

                    <p className="mt-5 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-400">
                      {drive.job_description ||
                        "No job description has been provided for this drive."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/5 bg-[#091525] p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Wallet size={15} />
                          Package
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-200">
                          {formatPackage(
                            drive.minimum_package_lpa,
                            drive.maximum_package_lpa,
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-[#091525] p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin size={15} />
                          Location
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-200">
                          {drive.location || formatLabel(drive.work_mode)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-[#091525] p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <BriefcaseBusiness size={15} />
                          Employment
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-200">
                          {formatLabel(drive.employment_type)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-[#091525] p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users size={15} />
                          Vacancies
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-200">
                          {drive.vacancies ?? "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        Deadline: {formatDate(drive.registration_deadline)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} />
                        Drive date: {formatDate(drive.drive_date)}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => router.push("/profile/eligibility")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20"
                      >
                        Check eligibility
                        <ExternalLink size={15} />
                      </button>

                      <button
                        type="button"
                        disabled={closed || applied || busy}
                        onClick={() => void handleApply(drive)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                      >
                        {busy ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Applying...
                          </>
                        ) : applied ? (
                          <>
                            <CheckCircle2 size={16} />
                            Already applied
                          </>
                        ) : closed ? (
                          "Applications closed"
                        ) : (
                          "Apply now"
                        )}
                      </button>
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-500">
                      Company ID: {drive.company_id}
                    </p>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
