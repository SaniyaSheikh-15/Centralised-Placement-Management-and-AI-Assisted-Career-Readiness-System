import { DriveFilters } from "@/lib/placement-queries";

interface DriveFiltersProps {
  value: DriveFilters;
}

export function DriveFiltersForm({ value }: DriveFiltersProps) {
  return (
    <form className="panel grid gap-4 p-5 lg:grid-cols-4" method="get">
      <label className="lg:col-span-2">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Search</span>
        <input
          name="search"
          defaultValue={value.search}
          placeholder="Search companies, roles or skills..."
          className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400"
        />
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Job Type</span>
        <select name="jobType" defaultValue={value.jobType ?? "all"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="all">All</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FULL_TIME_WITH_INTERNSHIP">Internship + Full Time</option>
        </select>
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Location</span>
        <select name="location" defaultValue={value.location ?? "all"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="all">All</option>
          <option value="ON_SITE">On-site</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="city:bengaluru">Bengaluru</option>
          <option value="city:chennai">Chennai</option>
          <option value="city:hyderabad">Hyderabad</option>
          <option value="city:remote">Remote City</option>
        </select>
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Salary</span>
        <select name="salary" defaultValue={value.salary ?? "all"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="all">All</option>
          <option value="under-5">Under ₹5 LPA</option>
          <option value="5-10">₹5-10 LPA</option>
          <option value="10-15">₹10-15 LPA</option>
          <option value="15-plus">₹15 LPA+</option>
        </select>
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Eligibility</span>
        <select name="eligibility" defaultValue={value.eligibility ?? "all"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="all">All</option>
          <option value="eligible">Eligible</option>
          <option value="not-eligible">Not Eligible</option>
          <option value="applied">Applied</option>
        </select>
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Deadline</span>
        <select name="deadline" defaultValue={value.deadline ?? "all"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="all">All</option>
          <option value="closing-today">Closing Today</option>
          <option value="closing-soon">Closing Soon</option>
          <option value="this-week">This Week</option>
        </select>
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Role</span>
        <select name="role" defaultValue={value.role ?? "all"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="all">All</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="ML Engineer">ML Engineer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
        </select>
      </label>

      <label>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Sort</span>
        <select name="sort" defaultValue={value.sort ?? "deadline"} className="w-full rounded-[18px] border border-slate-800/60 bg-slate-950 px-4 py-3 text-[13px] text-white outline-none focus:border-sky-400">
          <option value="deadline">Soonest Deadline</option>
          <option value="salary">Highest Salary</option>
        </select>
      </label>

      <div className="lg:col-span-4 flex flex-wrap gap-3">
        <button type="submit" className="rounded-[18px] bg-sky-500 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-sky-400">
          Apply Filters
        </button>
        <a href="/student/placement-drives" className="rounded-[18px] border border-slate-800/60 px-5 py-3 text-[13px] font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
          Clear Filters
        </a>
      </div>
    </form>
  );
}
