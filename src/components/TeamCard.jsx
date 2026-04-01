import { Linkedin, Mail } from "lucide-react";

function TeamCard({ member }) {
  return (
    <article className="glass-panel rounded-[28px] p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="h-64 overflow-hidden rounded-[24px] bg-gradient-to-br from-orange-100 to-white">
        {member.image_url ? (
          <img
            src={member.image_url}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-semibold text-brand-500">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-brand-600">{member.role}</p>
        <p className="mt-4 text-sm leading-7 text-slate-600">{member.bio}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
        {member.email && (
          <a className="inline-flex items-center gap-2 transition hover:text-brand-600" href={`mailto:${member.email}`}>
            <Mail className="h-4 w-4" />
            Email
          </a>
        )}
        {member.linkedin_url && (
          <a
            className="inline-flex items-center gap-2 transition hover:text-brand-600"
            href={member.linkedin_url}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );
}

export default TeamCard;