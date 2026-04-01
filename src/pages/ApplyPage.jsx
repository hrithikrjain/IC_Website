import { motion } from "framer-motion";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import FormInput from "../components/FormInput";
import { api } from "../lib/api";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

function ApplyPage() {
  const { jobId } = useParams();
  const isFutureApplication = jobId === "future";
  const [job, setJob] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isFutureApplication) {
      setJob(null);
      return;
    }

    api.getJob(jobId).then(setJob).catch(() => setJob(null));
  }, [isFutureApplication, jobId]);

  const intro = useMemo(() => {
    if (isFutureApplication) {
      return {
        eyebrow: "Talent network",
        title: "Join us for future opportunities",
        body:
          "Share your resume with us and we will keep your profile in view for upcoming roles that match your background, goals, and strengths.",
        steps: [
          "1. Upload your latest resume in PDF or Word format.",
          "2. Our team reviews your profile and maps it to future openings.",
          "3. If a strong-fit role opens up, we will reach out directly.",
        ],
      };
    }

    return {
      eyebrow: "Apply for",
      title: job?.title || "Current Opportunity",
      body:
        "Share your details and resume. We have designed this flow to feel simple, transparent, and respectful of your time.",
      steps: [
        "1. Upload your latest resume in PDF or Word format.",
        "2. Our recruiters review every application with a human lens.",
        "3. Shortlisted candidates hear from us with clear next steps.",
      ],
    };
  }, [isFutureApplication, job?.title]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!resume) {
      setError("Please upload your resume before submitting.");
      return;
    }

    const formData = new FormData();
    if (!isFutureApplication) {
      formData.append("job_id", jobId);
    }
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("resume", resume);

    setLoading(true);
    setError("");

    try {
      await api.createApplication(formData);
      setSubmitted(true);
      setForm(initialForm);
      setResume(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <p className="text-sm font-medium text-brand-600">{intro.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {intro.title}
          </h1>
          <p className="mt-6 text-sm leading-8 text-slate-600">{intro.body}</p>

          <div className="mt-8 rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-orange-200">Application flow</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-orange-50/90">
              {intro.steps.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-[32px] p-8 shadow-glow sm:p-10"
        >
          {submitted ? (
            <div className="rounded-[28px] bg-brand-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-brand-600" />
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">Application submitted</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Your resume has been received successfully. Our team will review it and reach out if there is a strong match.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  label="First name"
                  type="text"
                  placeholder="Aarav"
                  value={form.first_name}
                  onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))}
                  required
                />
                <FormInput
                  label="Last name"
                  type="text"
                  placeholder="Sharma"
                  value={form.last_name}
                  onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="aarav@example.com"
                  className="sm:col-span-2"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
                <FormInput
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="sm:col-span-2"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  required
                />
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Resume upload</span>
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/75 p-5">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <UploadCloud className="h-5 w-5 text-brand-500" />
                      PDF, DOC, or DOCX up to 10 MB
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(event) => setResume(event.target.files?.[0] || null)}
                      className="mt-4 w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700"
                    />
                    {resume && (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                        <FileText className="h-4 w-4 text-brand-500" />
                        {resume.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>

              {error && <p className="mt-5 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </>
          )}
        </motion.form>
      </div>
    </div>
  );
}

export default ApplyPage;
