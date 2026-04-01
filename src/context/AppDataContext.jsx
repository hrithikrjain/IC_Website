import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AppDataContext = createContext(null);

function normalizeSiteContent(content) {
  if (Array.isArray(content)) {
    return content.reduce((accumulator, item) => {
      if (item?.key) {
        accumulator[item.key] = item.value;
      }
      return accumulator;
    }, {});
  }

  return content || {};
}

export function AppDataProvider({ children }) {
  const [siteContent, setSiteContent] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = async () => {
    setLoading(true);
    try {
      const [content, team, faqList, jobList] = await Promise.all([
        api.getSiteContent(),
        api.listTeamMembers(),
        api.listFaqs(),
        api.listJobs(),
      ]);
      setSiteContent(normalizeSiteContent(content));
      setTeamMembers(team);
      setFaqs(faqList);
      setJobs(jobList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll().catch(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      siteContent,
      teamMembers,
      faqs,
      jobs,
      loading,
      refreshAll,
      refreshSiteContent: async () => {
        const content = await api.getSiteContent();
        const normalizedContent = normalizeSiteContent(content);
        setSiteContent(normalizedContent);
        return normalizedContent;
      },
      refreshTeamMembers: async () => {
        const team = await api.listTeamMembers();
        setTeamMembers(team);
        return team;
      },
      refreshFaqs: async () => {
        const faqList = await api.listFaqs();
        setFaqs(faqList);
        return faqList;
      },
      refreshJobs: async () => {
        const jobList = await api.listJobs();
        setJobs(jobList);
        return jobList;
      },
    }),
    [faqs, jobs, loading, siteContent, teamMembers],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
}
