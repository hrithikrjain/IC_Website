import { motion } from "framer-motion";
import { ArrowRight, Building2, PhoneCall } from "lucide-react";
import FormInput from "../components/FormInput";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";

function EmployerPage() {
  const { siteContent } = useAppData();

  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">
            {contentValue(siteContent, "employer_title")}
          </h1>
          <p className="mt-6 text-sm leading-8 text-slate-600">
            {contentValue(siteContent, "employer_body")}
          </p>

          <div className="mt-8 rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-200">{contentValue(siteContent, "employer_benefits_badge")}</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-orange-50/95">
              <p>{contentValue(siteContent, "employer_benefit_1")}</p>
              <p>{contentValue(siteContent, "employer_benefit_2")}</p>
              <p>{contentValue(siteContent, "employer_benefit_3")}</p>
            </div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[32px] p-8 shadow-glow sm:p-10"
        >
          <div className="grid gap-5">
            <FormInput label="Company name" type="text" placeholder="Acme Technologies" required />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Hiring needs</span>
              <textarea
                rows="5"
                placeholder="Describe your open roles, hiring timelines, locations, and seniority mix."
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-300"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput label="Contact name" type="text" placeholder="Priya Mehta" required />
              <FormInput label="Work email" type="email" placeholder="priya@acme.com" required />
            </div>
            <FormInput label="Phone" type="tel" placeholder="+91 98765 43210" required />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              Request consultation <ArrowRight className="h-4 w-4" />
            </button>

            <p className="inline-flex items-center gap-2 text-sm text-slate-500">
              <PhoneCall className="h-4 w-4 text-brand-500" />
              Prefer to talk now? Call our advisory team directly.
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default EmployerPage;
