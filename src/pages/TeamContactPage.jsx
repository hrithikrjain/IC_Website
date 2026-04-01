import { Mail, MapPin, Phone } from "lucide-react";
import TeamCard from "../components/TeamCard";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";

function TeamContactPage() {
  const { siteContent, teamMembers } = useAppData();

  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel rounded-[32px] p-8 shadow-card sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            {contentValue(siteContent, "team_contact_title")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {contentValue(siteContent, "team_contact_heading")}
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-600">
            {contentValue(siteContent, "team_contact_body")}
          </p>
          <div className="mt-8 space-y-4 text-sm text-slate-600">
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

        <div className="glass-panel rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-8 text-white shadow-glow sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-200">{contentValue(siteContent, "team_advisory_badge")}</p>
          <p className="mt-6 text-lg leading-8 text-orange-50/90">
            {contentValue(siteContent, "team_intro")}
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export default TeamContactPage;
