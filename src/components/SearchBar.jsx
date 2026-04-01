import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({
  className = "",
  compact = false,
  initialKeywords = "",
  initialLocation = ""
}) {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState(initialKeywords);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setKeywords(initialKeywords);
  }, [initialKeywords]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const query = new URLSearchParams();
    if (keywords) query.set("keyword", keywords);
    if (location) query.set("location", location);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className={`glass-panel flex flex-col gap-3 rounded-[28px] p-3 shadow-glow sm:flex-row sm:items-center ${className}`}
    >
      <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-slate-600 ring-1 ring-slate-200/70 transition focus-within:ring-brand-300">
        <Search className="h-5 w-5 text-brand-500" />
        <input
          type="text"
          value={keywords}
          onChange={(event) => setKeywords(event.target.value)}
          placeholder="Job title, skills, or company"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-slate-600 ring-1 ring-slate-200/70 transition focus-within:ring-brand-300">
        <MapPin className="h-5 w-5 text-brand-500" />
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City or remote preference"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      <button
        type="submit"
        className={`rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-brand-500 ${
          compact ? "sm:px-5" : "sm:px-7"
        }`}
      >
        Search Jobs
      </button>
    </motion.form>
  );
}

export default SearchBar;

