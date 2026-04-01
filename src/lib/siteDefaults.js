export const siteDefaults = {
  placements_count: "500+",
  clients_count: "120+",
  experience_years: "10+",
  hero_badge: "Modern hiring experiences for ambitious teams",
  hero_title: "Recruitment, reimagined for talent and employers.",
  hero_subtitle:
    "Intellectual Capital Pvt. Ltd. helps companies hire with precision and helps candidates discover roles that feel like a genuine step up.",
  hero_panel_badge: "Premium Search Partner",
  hero_panel_title: "Human-first hiring systems with a luxury digital experience.",
  stat_offer_acceptance: "94%",
  stat_offer_acceptance_label: "Offer acceptance",
  stat_shortlist_cycle: "12d",
  stat_shortlist_cycle_label: "Average shortlist cycle",
  stat_verticals_served: "40+",
  stat_verticals_served_label: "Industry verticals served",
  placements_count_label: "Placements done",
  featured_jobs_title: "Featured opportunities",
  featured_jobs_subtitle: "Curated roles with premium teams, thoughtful compensation, and room to grow.",
  browse_industry_title: "Browse by industry",
  browse_industry_subtitle:
    "From digital-first startups to leadership hiring for established enterprises, we build talent strategies that feel tailored instead of transactional.",
  industry_card_1_title: "Technology",
  industry_card_1_body: "Specialist hiring support across software, product, data, cloud, and platform teams.",
  industry_card_2_title: "HR Consulting",
  industry_card_2_body: "Search partnerships for recruitment operations, talent advisory, and people strategy roles.",
  industry_card_3_title: "Client Services",
  industry_card_3_body: "High-touch hiring for customer success, account management, and relationship-led delivery teams.",
  hire_talent_title: "Hire Talent",
  hire_talent_body:
    "Bring us your hiring goals and we will design a cleaner, faster, more premium recruitment engine around them.",
  upload_resume_title: "Upload Resume",
  upload_resume_body:
    "Share your profile once and our consultants can align you with high-quality opportunities that match your trajectory.",
  contact_email: "hello@intellectualcapital.in",
  contact_phone: "+91 98765 43210",
  contact_locations: "Mumbai, Bengaluru, Gurugram",
  jobs_page_title: "Find your next role with clarity.",
  jobs_page_subtitle:
    "Explore premium openings across consulting, technology, research, and client success.",
  team_intro: "Meet the consultants, operators, and hiring specialists behind our premium search experience.",
  team_contact_title: "Team + Contact",
  team_contact_heading: "Meet the people behind the shortlist.",
  team_contact_body:
    "Connect with the people shaping every shortlist, stakeholder update, and candidate experience.",
  team_advisory_badge: "Our advisory team",
  faq_badge: "FAQ",
  faq_title: "Answers with less friction.",
  faq_intro: "Answers to the questions candidates and employers ask most often.",
  employer_title: "Better hires, delivered with precision.",
  employer_body:
    "Tell us where your hiring momentum is stuck. We will design a premium recruitment experience that improves speed, clarity, and candidate quality.",
  employer_benefits_badge: "What you get",
  employer_benefit_1: "Dedicated consultants for critical and growth hiring mandates.",
  employer_benefit_2: "Market mapping, employer storytelling, and shortlist strategy.",
  employer_benefit_3: "White-glove candidate communication and conversion support.",
  about_story: `Organizations today recognize that the right human capital strategy is a true competitive advantage. At Intellectual Capital Pvt. Ltd., helping businesses unlock this advantage is at the core of everything we do.

Founded in 2002, Intellectual Capital began as a small team of passionate professionals with a handful of clients. Over the years, we have grown into a 50+ member team, delivering recruitment and HR consulting solutions to 200+ clients across India, and successfully closing 2000+ positions across industries.

From startups and domestic firms to large multinational corporations, we have consistently delivered high-quality talent solutions tailored to business needs.`,
  about_growth_stats: `20+ years of industry presence
2000+ successful placements
200+ clients served across sectors
50+ professionals with diverse expertise
Strong network across BFSI, Real Estate, Wastewater Management & Technical domains

We have built a reputation as a trusted partner, admired for our execution speed, domain expertise, and ability to consistently outperform expectations.`,
  about_services: `Talent Acquisition & Executive Search
Recruitment for BFSI, Real Estate & Technical Industries
Leadership & Mid-level Hiring
Talent Mapping & Market Intelligence
HR Consulting & Workforce Strategy
Customized Hiring Solutions
Candidate Screening & Assessment
End-to-End Recruitment Lifecycle Management

Our strength lies in:
Deep industry mapping
Strong professional network
Domain expertise
Fast turnaround time

We don’t just fill positions — we build long-term talent strategies that help organizations attract, motivate, and retain the best people at optimal cost.`,
  about_vision: `We believe that our potential, combined with perseverance, will make us the most preferred HR solutions partner.

We are proud to be:
Trusted by clients
Respected by competitors
Valued by our employees`,
  footer_body:
    "Premium recruitment and HR consulting for companies that want sharper hiring systems, stronger talent pipelines, and a more elevated employer brand.",
};

export function contentValue(siteContent, key) {
  return siteContent[key] || siteDefaults[key] || "";
}
