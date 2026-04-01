import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "Employers", to: "/employers" },
  { label: "Team + Contact", to: "/team-contact" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/65 backdrop-blur-2xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo className="h-11 w-11" />
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-brand-600">
              Intellectual Capital
            </p>
            <p className="text-xs text-slate-500">Premium Recruitment Advisory</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
          <Link
            to="/employers"
            className="ml-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-500"
          >
            Hire Talent
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 shadow-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/60 bg-white/90 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden"
          >
            <div className="section-shell flex flex-col gap-2 px-0">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700"
              >
                Admin
              </Link>
              <Link
                to="/employers"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white"
              >
                Hire Talent
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
