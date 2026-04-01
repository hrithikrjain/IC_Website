import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Building2, Compass, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";

function splitParagraphs(value) {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value) {
  return value
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractStatCards(value) {
  const lines = splitLines(value);
  return lines.filter((line) => /\d|BFSI|Real Estate|Wastewater|Technical/i.test(line));
}

function extractGrowthClosing(value) {
  return splitParagraphs(value).slice(1);
}

function extractServiceItems(value) {
  const lines = splitLines(value);
  const pivotIndex = lines.findIndex((line) => line === "Our strength lies in:");
  return pivotIndex === -1 ? lines : lines.slice(0, pivotIndex);
}

function extractApproachItems(value) {
  const lines = splitLines(value);
  const pivotIndex = lines.findIndex((line) => line === "Our strength lies in:");
  if (pivotIndex === -1) {
    return [];
  }

  const tail = lines.slice(pivotIndex + 1);
  return tail.filter((line) => !line.startsWith("We don’t just fill positions"));
}

function extractServicesClosing(value) {
  const lines = splitLines(value);
  return lines.find((line) => line.startsWith("We don’t just fill positions")) || "";
}

function AboutPage() {
  const { siteContent } = useAppData();

  const storyParagraphs = splitParagraphs(contentValue(siteContent, "about_story"));
  const growthStats = extractStatCards(contentValue(siteContent, "about_growth_stats"));
  const growthClosing = extractGrowthClosing(contentValue(siteContent, "about_growth_stats"));
  const services = extractServiceItems(contentValue(siteContent, "about_services"));
  const approachItems = extractApproachItems(contentValue(siteContent, "about_services"));
  const servicesClosing = extractServicesClosing(contentValue(siteContent, "about_services"));
  const visionParagraphs = splitParagraphs(contentValue(siteContent, "about_vision"));
  const visionList = splitLines(visionParagraphs[1] || "").filter((line) => line !== "We are proud to be:");

  return (
    <div className="space-y-24">
      <section className="section-shell relative pt-14 sm:pt-20">
        <div className="absolute inset-x-0 top-8 -z-10 mx-auto h-72 max-w-4xl rounded-full bg-gradient-to-r from-brand-200/50 via-orange-100/60 to-amber-100/50 blur-3xl" />
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm text-brand-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              About Intellectual Capital
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Human capital strategy, built as a competitive advantage.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {storyParagraphs[0]}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="glass-panel rounded-[32px] p-6 shadow-glow"
          >
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-orange-200">Our Growth & Strength</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {growthStats.slice(0, 4).map((stat) => (
                  <div key={stat} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm leading-7 text-orange-50">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="section-title mt-6">Our Story</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              {storyParagraphs.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <h2 className="section-title mt-6">Growth Stats</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {growthStats.map((item) => (
                <div key={item} className="rounded-[24px] border border-white/60 bg-white/75 p-5 shadow-sm">
                  <p className="text-sm font-medium leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              {growthClosing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">What We Do</h2>
              <p className="section-copy mt-4">
                We specialize in connecting organizations with top-tier talent across technical and business domains.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div key={service} className="rounded-[24px] border border-white/60 bg-white/75 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
                <p className="text-sm font-medium leading-7 text-slate-700">{service}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-200">Our Approach</p>
              <div className="mt-6 space-y-3">
                {approachItems.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-orange-50 backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-sm">
              <p className="text-base leading-8 text-slate-600">{servicesClosing}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-4">
        <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="section-title mt-6">Our Vision</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                {visionParagraphs.slice(0, 1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-brand-50 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">We are proud to be</p>
              <div className="mt-5 space-y-3">
                {visionList.map((item) => (
                  <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
              <Link
                to="/employers"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500"
              >
                Partner with us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
