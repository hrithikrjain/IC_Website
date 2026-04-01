import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";
import BrandLogo from "./BrandLogo";

function Footer() {
  const { siteContent } = useAppData();

  return (
    <footer
      id="contact"
      className="mt-24 border-t border-white/60 bg-white/70 py-10 backdrop-blur-xl"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Intellectual Capital Pvt. Ltd.
            </p>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            {contentValue(siteContent, "footer_body")}
          </p>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-950">Explore</p>
          <Link className="block transition hover:text-brand-600" to="/jobs">
            Jobs <ArrowUpRight className="ml-1 inline h-4 w-4" />
          </Link>
          <Link className="block transition hover:text-brand-600" to="/team-contact">
            Team + Contact <ArrowUpRight className="ml-1 inline h-4 w-4" />
          </Link>
          <Link className="block transition hover:text-brand-600" to="/faq">
            FAQ <ArrowUpRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-950">Contact</p>
          <p>
            <Mail className="mr-2 inline h-4 w-4 text-brand-500" />
            {contentValue(siteContent, "contact_email")}
          </p>
          <p>
            <Phone className="mr-2 inline h-4 w-4 text-brand-500" />
            {contentValue(siteContent, "contact_phone")}
          </p>
          <p>
            <MapPin className="mr-2 inline h-4 w-4 text-brand-500" />
            {contentValue(siteContent, "contact_locations")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
