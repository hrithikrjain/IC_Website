import {
  BriefcaseBusiness,
  Download,
  FileQuestion,
  LayoutDashboard,
  LogOut,
  Save,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import { api } from "../../lib/api";

const tabs = [
  { id: "applications", label: "Applications", icon: Download },
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "team", label: "Team", icon: Users },
  { id: "faqs", label: "FAQs", icon: FileQuestion },
  { id: "content", label: "Site Content", icon: LayoutDashboard },
];

const emptyJob = {
  job_code: "",
  title: "",
  company: "Intellectual Capital Pvt. Ltd.",
  location: "",
  employment_type: "Full-time",
  salary_range: "",
  short_description: "",
  description: "",
  responsibilities: "",
  requirements: "",
  tags: "",
  industry: "",
  featured: false,
  is_active: true,
};

const emptyTeam = { name: "", role: "", bio: "", email: "", linkedin_url: "", image_url: "", display_order: 0 };
const emptyFaq = { question: "", answer: "", category: "", display_order: 0 };
const emptyContent = { key: "", value: "", content_type: "text" };
const applicationStatuses = ["applied", "screening", "interview", "offered", "rejected", "hired"];

function splitLines(value) {
  return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function joinLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function inputClass() {
  return "w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-300";
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function normalizeContentEntries(content) {
  if (Array.isArray(content)) {
    return content.map((item) => ({ key: item.key, value: item.value, content_type: item.content_type || "text" }));
  }

  return Object.entries(content || {}).map(([key, value]) => ({ key, value, content_type: "text" }));
}

function AdminDashboardPage({ initialTab = "applications" }) {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const { refreshAll } = useAppData();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [jobs, setJobs] = useState([]);
  const [team, setTeam] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contentEntries, setContentEntries] = useState([]);
  const [applicationsSearch, setApplicationsSearch] = useState("");
  const [status, setStatus] = useState("");
  const [jobForm, setJobForm] = useState(emptyJob);
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [contentForm, setContentForm] = useState(emptyContent);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const visibleContentEntries = useMemo(
    () => contentEntries.filter((entry) => Boolean(String(entry.key ?? "").trim()) && entry.value !== undefined && entry.value !== null),
    [contentEntries],
  );

  const contentMap = useMemo(() => Object.fromEntries(visibleContentEntries.map((entry) => [entry.key, entry.value])), [visibleContentEntries]);

  const applicationFilterOptions = useMemo(() => {
    const options = new Map(jobs.map((job) => [String(job.id), { id: String(job.id), label: job.job_code ? `${job.job_code} - ${job.title}` : job.title }]));
    applications.forEach((application) => {
      if (application?.job_id && application?.job_title && !options.has(String(application.job_id))) {
        options.set(String(application.job_id), {
          id: String(application.job_id),
          label: application.job_code ? `${application.job_code} - ${application.job_title}` : application.job_title,
        });
      }
    });
    return Array.from(options.values());
  }, [applications, jobs]);

  const filteredApplications = useMemo(() => {
    const needle = applicationsSearch.trim().toLowerCase();
    if (!needle) return applications;
    return applications.filter((application) => {
      const label = application.job_code ? `${application.job_code} - ${application.job_title}` : application.job_title || "";
      return label.toLowerCase().includes(needle);
    });
  }, [applications, applicationsSearch]);

  useEffect(() => {
    setActiveTab(initialTab);
    setEditingId(null);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === "content" && visibleContentEntries.length > 0 && !editingId) {
      setEditingId(visibleContentEntries[0].key);
      setContentForm(visibleContentEntries[0]);
    }
  }, [activeTab, editingId, visibleContentEntries]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobList, teamList, faqList, content, applicationList] = await Promise.all([
          api.listJobs(),
          api.listTeamMembers(),
          api.listFaqs(),
          api.getSiteContent(),
          api.listApplications(),
        ]);
        setJobs(jobList);
        setTeam(teamList);
        setFaqs(faqList);
        setApplications(applicationList);
        setContentEntries(normalizeContentEntries(content));
      } finally {
        setLoading(false);
      }
    };
    loadData().catch(() => setLoading(false));
  }, []);

  const resetEditor = () => {
    setEditingId(null);
    setJobForm(emptyJob);
    setTeamForm(emptyTeam);
    setFaqForm(emptyFaq);
    setContentForm(visibleContentEntries[0] ?? emptyContent);
  };

  const saveJob = async (event) => {
    event.preventDefault();
    const payload = {
      ...jobForm,
      job_code: jobForm.job_code.trim().toUpperCase(),
      responsibilities: splitLines(jobForm.responsibilities),
      requirements: splitLines(jobForm.requirements),
      tags: splitLines(jobForm.tags),
    };
    if (editingId) {
      const updatedJob = await api.updateJob(editingId, payload);
      setJobs((current) => current.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setStatus("Job updated.");
    } else {
      const createdJob = await api.createJob(payload);
      setJobs((current) => [createdJob, ...current]);
      setStatus("Job created.");
    }
    resetEditor();
    await refreshAll();
  };

  const saveTeam = async (event) => {
    event.preventDefault();
    if (editingId) {
      const updatedMember = await api.updateTeamMember(editingId, teamForm);
      setTeam((current) => current.map((member) => (member.id === updatedMember.id ? updatedMember : member)));
      setStatus("Team member updated.");
    } else {
      const createdMember = await api.createTeamMember(teamForm);
      setTeam((current) => [...current, createdMember]);
      setStatus("Team member created.");
    }
    resetEditor();
    await refreshAll();
  };

  const saveFaq = async (event) => {
    event.preventDefault();
    if (editingId) {
      const updatedFaq = await api.updateFaq(editingId, faqForm);
      setFaqs((current) => current.map((faq) => (faq.id === updatedFaq.id ? updatedFaq : faq)));
      setStatus("FAQ updated.");
    } else {
      const createdFaq = await api.createFaq(faqForm);
      setFaqs((current) => [...current, createdFaq]);
      setStatus("FAQ created.");
    }
    resetEditor();
    await refreshAll();
  };

  const saveContent = async (event) => {
    event.preventDefault();
    if (!contentForm.key) return;
    const updatedEntry = await api.upsertSiteContent(contentForm);
    setContentEntries((current) => current.map((entry) => (entry.key === updatedEntry.key ? updatedEntry : entry)));
    setEditingId(updatedEntry.key);
    setContentForm(updatedEntry);
    setStatus("Site content saved.");
    await refreshAll();
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    const updatedApplication = await api.updateApplication(applicationId, { status: newStatus });
    setApplications((current) => current.map((application) => (application.id === updatedApplication.id ? updatedApplication : application)));
    setStatus("Application status updated.");
  };

  const startJobEdit = (job) => {
    setActiveTab("jobs");
    setEditingId(job.id);
    setJobForm({
      ...job,
      job_code: job.job_code || "",
      responsibilities: joinLines(job.responsibilities),
      requirements: joinLines(job.requirements),
      tags: joinLines(job.tags),
    });
  };

  const startTeamEdit = (member) => {
    setActiveTab("team");
    setEditingId(member.id);
    setTeamForm(member);
  };

  const startFaqEdit = (faq) => {
    setActiveTab("faqs");
    setEditingId(faq.id);
    setFaqForm(faq);
  };

  const startContentEdit = (entry) => {
    setActiveTab("content");
    setEditingId(entry.key);
    setContentForm(entry);
  };

  const deleteItem = async (type, id) => {
    if (type === "job") {
      await api.deleteJob(id);
      setJobs((current) => current.filter((job) => job.id !== id));
      setStatus("Job removed.");
      await refreshAll();
    }
    if (type === "team") {
      await api.deleteTeamMember(id);
      setTeam((current) => current.filter((member) => member.id !== id));
      setStatus("Team member removed.");
      await refreshAll();
    }
    if (type === "faq") {
      await api.deleteFaq(id);
      setFaqs((current) => current.filter((faq) => faq.id !== id));
      setStatus("FAQ removed.");
      await refreshAll();
    }
    if (editingId === id) resetEditor();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <button type="button" onClick={() => navigate("/")} className="mb-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/15">{"\u2190 Back to Home"}</button>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[32px] p-6 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Admin</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Content dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Signed in as {admin?.email}</p>
          <div className="mt-8 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setStatus(""); setEditingId(null); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-950 text-white" : "bg-white/70 text-slate-700 hover:bg-white"}`}><Icon className="h-4 w-4" />{tab.label}</button>;
            })}
          </div>
          <button type="button" onClick={() => { logout(); navigate("/"); }} className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-600"><LogOut className="h-4 w-4" />Logout</button>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel rounded-[32px] p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="rounded-[24px] bg-white/80 p-5"><p className="text-sm text-slate-500">Applications</p><p className="mt-2 text-3xl font-semibold text-slate-950">{applications.length}</p></div>
              <div className="rounded-[24px] bg-white/80 p-5"><p className="text-sm text-slate-500">Jobs</p><p className="mt-2 text-3xl font-semibold text-slate-950">{jobs.length}</p></div>
              <div className="rounded-[24px] bg-white/80 p-5"><p className="text-sm text-slate-500">Team</p><p className="mt-2 text-3xl font-semibold text-slate-950">{team.length}</p></div>
              <div className="rounded-[24px] bg-white/80 p-5"><p className="text-sm text-slate-500">FAQs</p><p className="mt-2 text-3xl font-semibold text-slate-950">{faqs.length}</p></div>
              <div className="rounded-[24px] bg-white/80 p-5"><p className="text-sm text-slate-500">Hero title</p><p className="mt-2 text-sm font-medium text-slate-950">{contentMap.hero_title || "Not set"}</p></div>
            </div>
          </div>

          {status && <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{status}</div>}

          {loading ? (
            <div className="glass-panel rounded-[32px] p-10 text-center shadow-card">Loading dashboard...</div>
          ) : (
            <>
              {activeTab === "applications" && (
                <div className="glass-panel rounded-[32px] p-6 shadow-card">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Applications</h2>
                      <p className="mt-1 text-sm text-slate-500">Track incoming candidates and move them through the funnel.</p>
                    </div>
                    <div className="w-full sm:w-80">
                      <input list="application-job-options" value={applicationsSearch} onChange={(event) => setApplicationsSearch(event.target.value)} placeholder="Search by job code or title" className={inputClass()} />
                      <datalist id="application-job-options">
                        {applicationFilterOptions.map((job) => <option key={job.id} value={job.label} />)}
                      </datalist>
                    </div>
                  </div>
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-slate-500">
                        <tr>
                          <th className="pb-3 pr-4 font-medium">Name</th>
                          <th className="pb-3 pr-4 font-medium">Email</th>
                          <th className="pb-3 pr-4 font-medium">Phone</th>
                          <th className="pb-3 pr-4 font-medium">Job title</th>
                          <th className="pb-3 pr-4 font-medium">Resume</th>
                          <th className="pb-3 pr-4 font-medium">Status</th>
                          <th className="pb-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((application) => (
                          <tr key={application.id} className="border-t border-white/60 text-slate-700">
                            <td className="py-4 pr-4 font-medium text-slate-950">{application.first_name} {application.last_name}</td>
                            <td className="py-4 pr-4">{application.email}</td>
                            <td className="py-4 pr-4">{application.phone}</td>
                            <td className="py-4 pr-4">{application.job_code ? `${application.job_code} - ${application.job_title}` : application.job_title}</td>
                            <td className="py-4 pr-4"><a href={application.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600"><Download className="h-4 w-4" />Download</a></td>
                            <td className="py-4 pr-4"><select value={application.status} onChange={(event) => updateApplicationStatus(application.id, event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-brand-300">{applicationStatuses.map((statusOption) => <option key={statusOption} value={statusOption}>{statusOption}</option>)}</select></td>
                            <td className="py-4">{formatDate(application.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredApplications.length === 0 && <div className="rounded-[24px] bg-white/80 p-8 text-center text-sm text-slate-500">No applications yet for the current search.</div>}
                  </div>
                </div>
              )}

              {activeTab === "jobs" && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="glass-panel rounded-[32px] p-6 shadow-card">
                    <h2 className="text-xl font-semibold text-slate-950">Manage jobs</h2>
                    <div className="mt-5 space-y-4">
                      {jobs.length === 0 ? <div className="rounded-[24px] bg-white/80 p-5 text-sm text-slate-500">No jobs available</div> : jobs.map((job) => (
                        <div key={job.id} className="rounded-[24px] bg-white/80 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{job.job_code || "No code"}</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{job.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{job.location} | {job.salary_range} | {job.employment_type}</p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => startJobEdit(job)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Edit</button>
                              <button type="button" onClick={() => deleteItem("job", job.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={saveJob} className="glass-panel rounded-[32px] p-6 shadow-glow space-y-4">
                    <h2 className="text-xl font-semibold text-slate-950">{editingId && activeTab === "jobs" ? "Edit job" : "Create job"}</h2>
                    <Field label="Job Code"><input className={inputClass()} value={jobForm.job_code} onChange={(e) => setJobForm((c) => ({ ...c, job_code: e.target.value.toUpperCase() }))} /></Field>
                    <Field label="Title"><input className={inputClass()} value={jobForm.title} onChange={(e) => setJobForm((c) => ({ ...c, title: e.target.value }))} /></Field>
                    <Field label="Company"><input className={inputClass()} value={jobForm.company} onChange={(e) => setJobForm((c) => ({ ...c, company: e.target.value }))} /></Field>
                    <Field label="Location"><input className={inputClass()} value={jobForm.location} onChange={(e) => setJobForm((c) => ({ ...c, location: e.target.value }))} /></Field>
                    <Field label="Employment type"><input className={inputClass()} value={jobForm.employment_type} onChange={(e) => setJobForm((c) => ({ ...c, employment_type: e.target.value }))} /></Field>
                    <Field label="Salary range"><input className={inputClass()} value={jobForm.salary_range} onChange={(e) => setJobForm((c) => ({ ...c, salary_range: e.target.value }))} /></Field>
                    <Field label="Industry"><input className={inputClass()} value={jobForm.industry} onChange={(e) => setJobForm((c) => ({ ...c, industry: e.target.value }))} /></Field>
                    <Field label="Short description"><textarea rows="3" className={inputClass()} value={jobForm.short_description} onChange={(e) => setJobForm((c) => ({ ...c, short_description: e.target.value }))} /></Field>
                    <Field label="Description"><textarea rows="4" className={inputClass()} value={jobForm.description} onChange={(e) => setJobForm((c) => ({ ...c, description: e.target.value }))} /></Field>
                    <Field label="Responsibilities (comma or new line separated)"><textarea rows="4" className={inputClass()} value={jobForm.responsibilities} onChange={(e) => setJobForm((c) => ({ ...c, responsibilities: e.target.value }))} /></Field>
                    <Field label="Requirements (comma or new line separated)"><textarea rows="4" className={inputClass()} value={jobForm.requirements} onChange={(e) => setJobForm((c) => ({ ...c, requirements: e.target.value }))} /></Field>
                    <Field label="Tags (comma or new line separated)"><textarea rows="3" className={inputClass()} value={jobForm.tags} onChange={(e) => setJobForm((c) => ({ ...c, tags: e.target.value }))} /></Field>
                    <div className="flex gap-4 text-sm text-slate-700"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={jobForm.featured} onChange={(e) => setJobForm((c) => ({ ...c, featured: e.target.checked }))} /> Featured</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={jobForm.is_active} onChange={(e) => setJobForm((c) => ({ ...c, is_active: e.target.checked }))} /> Active</label></div>
                    <div className="flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save</button><button type="button" onClick={resetEditor} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Reset</button></div>
                  </form>
                </div>
              )}

              {activeTab === "team" && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="glass-panel rounded-[32px] p-6 shadow-card">
                    <h2 className="text-xl font-semibold text-slate-950">Manage team</h2>
                    <div className="mt-5 space-y-4">
                      {team.length === 0 ? <div className="rounded-[24px] bg-white/80 p-5 text-sm text-slate-500">No team members available</div> : team.map((member) => (
                        <div key={member.id} className="rounded-[24px] bg-white/80 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100">{member.image_url ? <img src={member.image_url} alt={member.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm font-semibold text-brand-600">{member.name.charAt(0)}</div>}</div>
                              <div><p className="text-lg font-semibold text-slate-950">{member.name}</p><p className="mt-1 text-sm text-slate-500">{member.role}</p></div>
                            </div>
                            <div className="flex gap-2"><button type="button" onClick={() => startTeamEdit(member)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Edit</button><button type="button" onClick={() => deleteItem("team", member.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Delete</button></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={saveTeam} className="glass-panel rounded-[32px] p-6 shadow-glow space-y-4">
                    <h2 className="text-xl font-semibold text-slate-950">{editingId && activeTab === "team" ? "Edit team member" : "Create team member"}</h2>
                    <Field label="Name"><input className={inputClass()} value={teamForm.name} onChange={(e) => setTeamForm((c) => ({ ...c, name: e.target.value }))} /></Field>
                    <Field label="Role"><input className={inputClass()} value={teamForm.role} onChange={(e) => setTeamForm((c) => ({ ...c, role: e.target.value }))} /></Field>
                    <Field label="Bio"><textarea rows="5" className={inputClass()} value={teamForm.bio} onChange={(e) => setTeamForm((c) => ({ ...c, bio: e.target.value }))} /></Field>
                    <Field label="Email"><input className={inputClass()} value={teamForm.email} onChange={(e) => setTeamForm((c) => ({ ...c, email: e.target.value }))} /></Field>
                    <Field label="LinkedIn URL"><input className={inputClass()} value={teamForm.linkedin_url} onChange={(e) => setTeamForm((c) => ({ ...c, linkedin_url: e.target.value }))} /></Field>
                    <Field label="Image URL"><input className={inputClass()} value={teamForm.image_url} onChange={(e) => setTeamForm((c) => ({ ...c, image_url: e.target.value }))} /></Field>
                    <Field label="Display order"><input type="number" className={inputClass()} value={teamForm.display_order} onChange={(e) => setTeamForm((c) => ({ ...c, display_order: Number(e.target.value) }))} /></Field>
                    <div className="flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save</button><button type="button" onClick={resetEditor} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Reset</button></div>
                  </form>
                </div>
              )}

              {activeTab === "faqs" && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="glass-panel rounded-[32px] p-6 shadow-card">
                    <h2 className="text-xl font-semibold text-slate-950">Manage FAQs</h2>
                    <div className="mt-5 space-y-4">
                      {faqs.length === 0 ? <div className="rounded-[24px] bg-white/80 p-5 text-sm text-slate-500">No FAQs available</div> : faqs.map((faq) => (
                        <div key={faq.id} className="rounded-[24px] bg-white/80 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="max-w-xl"><p className="text-lg font-semibold text-slate-950">{faq.question}</p><p className="mt-2 text-sm text-slate-600">{faq.answer}</p></div>
                            <div className="flex gap-2"><button type="button" onClick={() => startFaqEdit(faq)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Edit</button><button type="button" onClick={() => deleteItem("faq", faq.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Delete</button></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={saveFaq} className="glass-panel rounded-[32px] p-6 shadow-glow space-y-4">
                    <h2 className="text-xl font-semibold text-slate-950">{editingId && activeTab === "faqs" ? "Edit FAQ" : "Create FAQ"}</h2>
                    <Field label="Question"><input className={inputClass()} value={faqForm.question} onChange={(e) => setFaqForm((c) => ({ ...c, question: e.target.value }))} /></Field>
                    <Field label="Answer"><textarea rows="6" className={inputClass()} value={faqForm.answer} onChange={(e) => setFaqForm((c) => ({ ...c, answer: e.target.value }))} /></Field>
                    <Field label="Category"><input className={inputClass()} value={faqForm.category} onChange={(e) => setFaqForm((c) => ({ ...c, category: e.target.value }))} /></Field>
                    <Field label="Display order"><input type="number" className={inputClass()} value={faqForm.display_order} onChange={(e) => setFaqForm((c) => ({ ...c, display_order: Number(e.target.value) }))} /></Field>
                    <div className="flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save</button><button type="button" onClick={resetEditor} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Reset</button></div>
                  </form>
                </div>
              )}

              {activeTab === "content" && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="glass-panel rounded-[32px] p-6 shadow-card">
                    <h2 className="text-xl font-semibold text-slate-950">Manage site content</h2>
                    <div className="mt-5 space-y-4">
                      {visibleContentEntries.length === 0 ? <div className="rounded-[24px] bg-white/80 p-5 text-sm text-slate-500">No editable content available</div> : visibleContentEntries.map((entry) => (
                        <div key={entry.key} className="rounded-[24px] bg-white/80 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">{entry.key}</p><p className="mt-2 text-sm text-slate-600">{entry.value}</p></div>
                            <div className="flex gap-2"><button type="button" onClick={() => startContentEdit(entry)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Edit</button></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={saveContent} className="glass-panel rounded-[32px] p-6 shadow-glow space-y-4">
                    <h2 className="text-xl font-semibold text-slate-950">Edit content</h2>
                    <Field label="Key"><input className={inputClass()} value={contentForm.key} readOnly /></Field>
                    <Field label="Value"><textarea rows={contentForm.key.startsWith("about_") ? 16 : 6} className={inputClass()} value={contentForm.value} onChange={(e) => setContentForm((c) => ({ ...c, value: e.target.value }))} /></Field>
                    <div className="flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save</button></div>
                  </form>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
