import { motion } from "framer-motion";
import { Bookmark, BriefcaseBusiness, MapPin, Share2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.getJob(jobId).then(setJob).catch(() => setJob(null));
  }, [jobId]);

  if (!job) {
    return (
      <div className="section-shell py-14">
        <div className="glass-panel rounded-[32px] p-10 text-center shadow-card">
          <h1 className="text-2xl font-semibold text-slate-950">Loading role details...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <p className="text-sm font-medium text-brand-600">{job.company}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {job.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
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

          <div className="mt-10 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Role overview</h2>
              <p className="mt-4 text-sm leading-8 text-slate-600">{job.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Responsibilities</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {(job.responsibilities || []).map((item) => (
                  <li key={item} className="rounded-2xl bg-white/70 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Requirements</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {(job.requirements || []).map((item) => (
                  <li key={item} className="rounded-2xl bg-white/70 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="glass-panel rounded-[32px] p-6 shadow-glow">
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white">
              <p className="text-sm text-orange-200">Move fast on this opportunity</p>
              <h2 className="mt-3 text-2xl font-semibold">Apply with confidence</h2>
              <p className="mt-3 text-sm leading-7 text-orange-50/90">
                Our team reviews every application with a human lens and maintains clear, timely communication.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                to={`/apply/${job.id}`}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                Apply now
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
              >
                <Bookmark className="h-4 w-4" />
                Save job
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

export default JobDetailPage;