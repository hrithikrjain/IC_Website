from models import Admin, FAQ, Job, SiteContent, TeamMember, db


PLACEHOLDER_TEAM_IMAGES = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
]

DEFAULT_SITE_CONTENT = {
    "placements_count": "500+",
    "clients_count": "120+",
    "experience_years": "10+",
    "hero_heading": "We build high-performing teams",
    "hero_subtext": "Connecting talent with opportunity",
    "hero_badge": "Modern hiring experiences for ambitious teams",
    "hero_title": "We build high-performing teams",
    "hero_subtitle": "Connecting talent with opportunity",
    "hero_panel_badge": "Premium Search Partner",
    "hero_panel_title": "Human-first hiring systems with a luxury digital experience.",
    "stat_offer_acceptance": "94%",
    "stat_offer_acceptance_label": "Offer acceptance",
    "stat_shortlist_cycle": "12d",
    "stat_shortlist_cycle_label": "Average shortlist cycle",
    "stat_verticals_served": "40+",
    "stat_verticals_served_label": "Industry verticals served",
    "placements_count_label": "Placements done",
    "featured_jobs_title": "Featured opportunities",
    "featured_jobs_subtitle": "Curated roles with premium teams, thoughtful compensation, and room to grow.",
    "browse_industry_title": "Browse by industry",
    "browse_industry_subtitle": "From digital-first startups to leadership hiring for established enterprises, we build talent strategies that feel tailored instead of transactional.",
    "industry_card_1_title": "Technology",
    "industry_card_1_body": "Specialist hiring support across software, product, data, cloud, and platform teams.",
    "industry_card_2_title": "HR Consulting",
    "industry_card_2_body": "Search partnerships for recruitment operations, talent advisory, and people strategy roles.",
    "industry_card_3_title": "Client Services",
    "industry_card_3_body": "High-touch hiring for customer success, account management, and relationship-led delivery teams.",
    "hire_talent_title": "Hire Talent",
    "hire_talent_body": "Bring us your hiring goals and we will design a cleaner, faster, more premium recruitment engine around them.",
    "upload_resume_title": "Upload Resume",
    "upload_resume_body": "Share your profile once and our consultants can align you with high-quality opportunities that match your trajectory.",
    "contact_email": "hello@intellectualcapital.in",
    "contact_phone": "+91 98765 43210",
    "contact_locations": "Mumbai, Bengaluru, Gurugram",
    "jobs_page_title": "Find your next role with clarity.",
    "jobs_page_subtitle": "Explore premium openings across consulting, technology, research, and client success.",
    "team_intro": "Meet the consultants, operators, and hiring specialists behind our premium search experience.",
    "faq_intro": "Answers to the questions candidates and employers ask most often.",
    "team_contact_title": "Team + Contact",
    "team_contact_heading": "Meet the people behind the shortlist.",
    "team_contact_body": "Connect with the people shaping every shortlist, stakeholder update, and candidate experience.",
    "team_advisory_badge": "Our advisory team",
    "faq_badge": "FAQ",
    "faq_title": "Answers with less friction.",
    "employer_title": "Better hires, delivered with precision.",
    "employer_body": "Tell us where your hiring momentum is stuck. We will design a premium recruitment experience that improves speed, clarity, and candidate quality.",
    "employer_benefits_badge": "What you get",
    "employer_benefit_1": "Dedicated consultants for critical and growth hiring mandates.",
    "employer_benefit_2": "Market mapping, employer storytelling, and shortlist strategy.",
    "employer_benefit_3": "White-glove candidate communication and conversion support.",
    "about_story": """Organizations today recognize that the right human capital strategy is a true competitive advantage. At Intellectual Capital Pvt. Ltd., helping businesses unlock this advantage is at the core of everything we do.\n\nFounded in 2002, Intellectual Capital began as a small team of passionate professionals with a handful of clients. Over the years, we have grown into a 50+ member team, delivering recruitment and HR consulting solutions to 200+ clients across India, and successfully closing 2000+ positions across industries.\n\nFrom startups and domestic firms to large multinational corporations, we have consistently delivered high-quality talent solutions tailored to business needs.""",
    "about_growth_stats": """20+ years of industry presence\n2000+ successful placements\n200+ clients served across sectors\n50+ professionals with diverse expertise\nStrong network across BFSI, Real Estate, Wastewater Management & Technical domains\n\nWe have built a reputation as a trusted partner, admired for our execution speed, domain expertise, and ability to consistently outperform expectations.""",
    "about_services": """Talent Acquisition & Executive Search\nRecruitment for BFSI, Real Estate & Technical Industries\nLeadership & Mid-level Hiring\nTalent Mapping & Market Intelligence\nHR Consulting & Workforce Strategy\nCustomized Hiring Solutions\nCandidate Screening & Assessment\nEnd-to-End Recruitment Lifecycle Management\n\nOur strength lies in:\nDeep industry mapping\nStrong professional network\nDomain expertise\nFast turnaround time\n\nWe do not just fill positions - we build long-term talent strategies that help organizations attract, motivate, and retain the best people at optimal cost.""",
    "about_vision": """We believe that our potential, combined with perseverance, will make us the most preferred HR solutions partner.\n\nWe are proud to be:\nTrusted by clients\nRespected by competitors\nValued by our employees""",
    "footer_body": "Premium recruitment and HR consulting for companies that want sharper hiring systems, stronger talent pipelines, and a more elevated employer brand.",
}

SAMPLE_JOBS = [
    {
        "title": "Senior Talent Partner",
        "company": "Intellectual Capital Pvt. Ltd.",
        "location": "Bengaluru, India",
        "employment_type": "Full-time",
        "salary_range": "18L - 24L",
        "short_description": "Lead strategic recruitment programs for high-growth clients across technology and consulting.",
        "description": "Drive end-to-end hiring for priority mandates, shape candidate experiences, and partner with clients on search strategy.",
        "responsibilities": [
            "Own senior hiring mandates from intake to offer closure.",
            "Build targeted pipelines through research, referrals, and outbound sourcing.",
            "Share market insights and hiring recommendations with clients.",
        ],
        "requirements": [
            "6+ years of agency or consulting recruitment experience.",
            "Strong stakeholder management and offer negotiation skills.",
            "Comfort working with hiring metrics and ATS workflows.",
        ],
        "tags": ["Urgent", "Leadership", "Hybrid"],
        "industry": "HR Consulting",
        "featured": True,
        "is_active": True,
    },
    {
        "title": "Technology Recruiter",
        "company": "Intellectual Capital Pvt. Ltd.",
        "location": "Pune, India",
        "employment_type": "Full-time",
        "salary_range": "10L - 14L",
        "short_description": "Manage full-cycle hiring for engineering, data, and product teams.",
        "description": "Partner with hiring managers to convert technical requirements into sharp sourcing strategies and strong candidate pipelines.",
        "responsibilities": [
            "Source and screen talent across software, data, and cloud roles.",
            "Coordinate interviews and maintain candidate communication.",
            "Track conversion metrics and optimize funnel efficiency.",
        ],
        "requirements": [
            "3+ years in technology recruitment.",
            "Excellent sourcing across LinkedIn, referrals, and niche communities.",
            "Ability to assess role fit with hiring teams.",
        ],
        "tags": ["Remote", "Full-time", "Fast Hiring"],
        "industry": "Technology",
        "featured": True,
        "is_active": True,
    },
    {
        "title": "Client Success Manager",
        "company": "Intellectual Capital Pvt. Ltd.",
        "location": "Mumbai, India",
        "employment_type": "Full-time",
        "salary_range": "12L - 18L",
        "short_description": "Own hiring program communication and strengthen client relationships across active mandates.",
        "description": "Act as the operating bridge between employer partners and the delivery team to keep every mandate moving with clarity and speed.",
        "responsibilities": [
            "Lead client updates, reporting, and hiring progress reviews.",
            "Translate business needs into executable recruitment plans.",
            "Identify partnership growth opportunities.",
        ],
        "requirements": [
            "4+ years in account management or recruitment operations.",
            "Excellent written communication and stakeholder handling.",
            "Strong commercial awareness and follow-through.",
        ],
        "tags": ["On-site", "Client Success", "Priority"],
        "industry": "Client Services",
        "featured": False,
        "is_active": True,
    },
]

SAMPLE_TEAM_MEMBERS = [
    {
        "name": "Aanya Rao",
        "role": "Managing Director",
        "bio": "Leads strategic hiring partnerships and executive search mandates across growth-stage and enterprise clients.",
        "email": "aanya@intellectualcapital.in",
        "linkedin_url": "https://www.linkedin.com",
        "image_url": PLACEHOLDER_TEAM_IMAGES[0],
        "display_order": 1,
    },
    {
        "name": "Rohan Malhotra",
        "role": "Head of Technology Hiring",
        "bio": "Builds high-signal technology pipelines with a focus on conversion quality and candidate experience.",
        "email": "rohan@intellectualcapital.in",
        "linkedin_url": "https://www.linkedin.com",
        "image_url": PLACEHOLDER_TEAM_IMAGES[1],
        "display_order": 2,
    },
    {
        "name": "Meera Nair",
        "role": "Client Success Lead",
        "bio": "Keeps mandates aligned, communication crisp, and hiring programs moving with speed and confidence.",
        "email": "meera@intellectualcapital.in",
        "linkedin_url": "https://www.linkedin.com",
        "image_url": PLACEHOLDER_TEAM_IMAGES[2],
        "display_order": 3,
    },
]

SAMPLE_FAQS = [
    {
        "question": "How quickly do you share shortlisted candidates?",
        "answer": "For most mandates, we begin sharing calibrated profiles within 7 to 12 business days after intake and alignment.",
        "category": "Employers",
        "display_order": 1,
    },
    {
        "question": "Do you work on confidential leadership searches?",
        "answer": "Yes. We regularly run discreet senior and leadership mandates with tightly managed outreach and stakeholder visibility.",
        "category": "Employers",
        "display_order": 2,
    },
    {
        "question": "Can candidates submit a resume without applying to a listed role?",
        "answer": "Absolutely. Our consultants review proactive profiles and map them to current and upcoming opportunities where there is strong fit.",
        "category": "Candidates",
        "display_order": 3,
    },
]


def seed_jobs_if_empty():
    if Job.query.count() > 0:
        return

    db.session.add_all([Job(**job_data) for job_data in SAMPLE_JOBS])


def seed_team_if_empty():
    if TeamMember.query.count() > 0:
        return

    db.session.add_all([TeamMember(**member_data) for member_data in SAMPLE_TEAM_MEMBERS])


def seed_faqs_if_empty():
    if FAQ.query.count() > 0:
        return

    db.session.add_all([FAQ(**faq_data) for faq_data in SAMPLE_FAQS])


def seed_site_content_defaults():
    for key, value in DEFAULT_SITE_CONTENT.items():
        if SiteContent.query.get(key) is None:
            db.session.add(SiteContent(key=key, value=value, content_type="text"))


def seed_admin_if_missing(admin_email, admin_password):
    if Admin.query.filter_by(email=admin_email).first() is not None:
        return

    admin = Admin(email=admin_email, name="Platform Admin")
    admin.set_password(admin_password)
    db.session.add(admin)


def seed_data(app, admin_email, admin_password):
    with app.app_context():
        seed_jobs_if_empty()
        seed_team_if_empty()
        seed_faqs_if_empty()
        seed_site_content_defaults()
        seed_admin_if_missing(admin_email, admin_password)
        db.session.commit()



