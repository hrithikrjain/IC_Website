import { motion } from "framer-motion";
import { Bookmark, BriefcaseBusiness, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="glass-panel rounded-[28px] p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-600">{job.company}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            <Link to={`/jobs/${job.id}`} className="transition hover:text-brand-600">
              {job.title}
            </Link>
          </h3>
        </div>
        <button
          type="button"
          className="rounded-2xl border border-white/70 bg-white/80 p-3 text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
          aria-label={`Save ${job.title}`}
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-500" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-500" />
          {job.salary_range}
        </span>
        <span className="inline-flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-brand-500" />
          {job.employment_type}
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">{job.short_description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(job.tags || []).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-semibold text-slate-950 transition hover:text-brand-600"
        >
          View details
        </Link>
        <Link
          to={`/apply/${job.id}`}
          className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-500"
        >
          Apply now
        </Link>
      </div>
    </motion.article>
  );
}

export default JobCard;