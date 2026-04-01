import { SlidersHorizontal } from "lucide-react";

const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
const salaryRanges = ["0 - 6L", "6L - 12L", "12L - 18L", "18L+"];

function FilterSidebar({ filters, onChange }) {
  return (
    <aside className="glass-panel rounded-[28px] p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Refine Search</h2>
          <p className="text-sm text-slate-500">Sharper filters, faster matches.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Keyword</span>
          <input
            type="text"
            value={filters.keyword}
            onChange={(event) => onChange("keyword", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-300"
            placeholder="Recruiter, analyst, sourcing..."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
          <input
            type="text"
            value={filters.location}
            onChange={(event) => onChange("location", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-300"
            placeholder="Mumbai, remote..."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Job Type</span>
          <select
            value={filters.jobType}
            onChange={(event) => onChange("jobType", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-300"
          >
            <option value="">All job types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Salary Range</span>
          <select
            value={filters.salaryRange}
            onChange={(event) => onChange("salaryRange", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-300"
          >
            <option value="">Any range</option>
            {salaryRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </label>
      </div>
    </aside>
  );
}

export default FilterSidebar;
