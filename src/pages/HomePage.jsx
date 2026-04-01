import { motion } from "framer-motion";
import { ArrowRight, Building2, FileUp, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";

function HomePage() {
  const { siteContent, jobs } = useAppData();

  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 4);
  const industryCards = [
    {
      title: contentValue(siteContent, "industry_card_1_title"),
      body: contentValue(siteContent, "industry_card_1_body"),
    },
    {
      title: contentValue(siteContent, "industry_card_2_title"),
      body: contentValue(siteContent, "industry_card_2_body"),
    },
    {
      title: contentValue(siteContent, "industry_card_3_title"),
      body: contentValue(siteContent, "industry_card_3_body"),
    },
  ];

  return (
    <div>
      <section className="section-shell relative pt-14 sm:pt-20">
        <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-80 max-w-4xl rounded-full bg-gradient-to-r from-brand-200/50 via-orange-100/60 to-amber-100/50 blur-3xl" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm text-brand-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {contentValue(siteContent, "hero_badge")}
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              {contentValue(siteContent, "hero_title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {contentValue(siteContent, "hero_subtitle")}
            </p>

            <SearchBar className="mt-8" />

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Trusted by fast-growth teams
              </span>
              <span>Executive search</span>
              <span>Tech hiring</span>
              <span>Leadership mandates</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-[32px] p-6 shadow-glow"
          >
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-orange-200">
                {contentValue(siteContent, "hero_panel_badge")}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                {contentValue(siteContent, "hero_panel_title")}
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  [contentValue(siteContent, "stat_offer_acceptance"), contentValue(siteContent, "stat_offer_acceptance_label")],
                  [contentValue(siteContent, "stat_shortlist_cycle"), contentValue(siteContent, "stat_shortlist_cycle_label")],
                  [contentValue(siteContent, "stat_verticals_served"), contentValue(siteContent, "stat_verticals_served_label")],
                  [contentValue(siteContent, "placements_count"), contentValue(siteContent, "placements_count_label")],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-orange-100">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">{contentValue(siteContent, "featured_jobs_title")}</h2>
            <p className="section-copy">
              {contentValue(siteContent, "featured_jobs_subtitle")}
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-brand-600"
          >
            Explore all jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="section-shell mt-24">
        <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="section-title">{contentValue(siteContent, "browse_industry_title")}</h2>
              <p className="section-copy mt-4">
                {contentValue(siteContent, "browse_industry_subtitle")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {industryCards.map((industry, index) => (
                <motion.div
                  key={industry.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
                >
                  <p className="text-base font-semibold text-slate-900">{industry.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{industry.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-[32px] p-8 shadow-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
              {contentValue(siteContent, "hire_talent_title")}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {contentValue(siteContent, "hire_talent_body")}
            </p>
            <Link
              to="/employers"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500"
            >
              Talk to our team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="glass-panel rounded-[32px] p-8 shadow-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <FileUp className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
              {contentValue(siteContent, "upload_resume_title")}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {contentValue(siteContent, "upload_resume_body")}
            </p>
            <Link
              to="/apply/future"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 ring-1 ring-slate-200 transition hover:ring-brand-200"
            >
              Submit your CV <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
