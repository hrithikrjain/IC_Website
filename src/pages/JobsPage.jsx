import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";

function JobsPage() {
  const [params] = useSearchParams();
  const { jobs, siteContent } = useAppData();
  const [filters, setFilters] = useState({
    keyword: params.get("keyword") ?? "",
    location: params.get("location") ?? "",
    jobType: "",
    salaryRange: "",
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      keyword: params.get("keyword") ?? "",
      location: params.get("location") ?? "",
    }));
  }, [params]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keywordMatch =
        !filters.keyword ||
        `${job.title} ${job.short_description} ${job.industry}`
          .toLowerCase()
          .includes(filters.keyword.toLowerCase());
      const locationMatch =
        !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      const typeMatch = !filters.jobType || job.employment_type === filters.jobType;
      const salaryMatch =
        !filters.salaryRange || job.salary_range.includes(filters.salaryRange.split(" ")[0]);
      return keywordMatch && locationMatch && typeMatch && salaryMatch;
    });
  }, [filters, jobs]);

  const handleChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="section-shell py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {contentValue(siteContent, "jobs_page_title")}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          {contentValue(siteContent, "jobs_page_subtitle")}
        </p>
      </div>

      <SearchBar
        className="mx-auto mt-8 max-w-5xl"
        compact
        initialKeywords={filters.keyword}
        initialLocation={filters.location}
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-28 xl:self-start">
          <FilterSidebar filters={filters} onChange={handleChange} />
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-950">{filteredJobs.length}</span> roles found
            </p>
            <p className="text-sm text-slate-500">Updated dynamically from the hiring database</p>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="glass-panel rounded-[28px] p-10 text-center shadow-card">
              <h2 className="text-xl font-semibold text-slate-950">No matches yet</h2>
              <p className="mt-3 text-sm text-slate-500">
                Adjust your filters and we will surface a sharper set of opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
