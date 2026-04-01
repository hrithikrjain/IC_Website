import os
from datetime import timedelta
from uuid import uuid4

from flask import Flask, jsonify, request, send_from_directory, url_for
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from sqlalchemy import inspect, text
from werkzeug.utils import secure_filename

from models import Admin, Application, FAQ, Job, SiteContent, TeamMember, db
from seed import seed_data

ALLOWED_RESUME_EXTENSIONS = {"pdf", "doc", "docx"}
APPLICATION_STATUSES = {"applied", "screening", "interview", "offered", "rejected", "hired"}


def create_app():
    app = Flask(__name__)

    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/intellectual_capital",
    )
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    upload_folder = os.path.join(app.root_path, os.getenv("UPLOAD_FOLDER", "uploads"))
    os.makedirs(upload_folder, exist_ok=True)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
    app.config["UPLOAD_FOLDER"] = upload_folder
    app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_UPLOAD_MB", "10")) * 1024 * 1024

    db.init_app(app)
    JWTManager(app)
    allowed_origins = [
        "http://localhost",
        "http://localhost:80",
        "http://localhost:5173",
        "http://127.0.0.1",
        "http://127.0.0.1:80",
        "http://127.0.0.1:5173",
    ]
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

    def ensure_job_code_support():
        inspector = inspect(db.engine)
        columns = {column["name"] for column in inspector.get_columns("jobs")}
        with db.engine.begin() as connection:
            if "job_code" not in columns:
                connection.execute(text("ALTER TABLE jobs ADD COLUMN job_code VARCHAR(50)"))

    with app.app_context():
        db.create_all()
        ensure_job_code_support()

    seed_data(
        app,
        admin_email=os.getenv("ADMIN_EMAIL", "admin@intellectualcapital.in"),
        admin_password=os.getenv("ADMIN_PASSWORD", "Admin@12345"),
    )

    with app.app_context():
        next_index = 1
        changed = False
        for job in Job.query.order_by(Job.id.asc()).all():
            if job.title == "Future Job":
                if not job.job_code:
                    job.job_code = "FUTURE"
                    changed = True
                continue

            if job.job_code:
                continue

            job.job_code = f"JB{next_index:02d}"
            next_index += 1
            changed = True

        if changed:
            db.session.commit()

    def json_list_field(value):
        if isinstance(value, list):
            return value
        if value in (None, ""):
            return []
        return [value]

    def allowed_resume(filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_RESUME_EXTENSIONS

    def application_to_public_resume_url(filename):
        return url_for("uploaded_file", filename=filename, _external=False)

    def get_or_create_future_job():
        future_job = Job.query.filter_by(title="Future Job").first()
        if future_job is None:
            future_job = Job(
                job_code="FUTURE",
                title="Future Job",
                company="Intellectual Capital Pvt. Ltd.",
                location="Future Opportunity",
                employment_type="Open Application",
                salary_range="To be discussed",
                short_description="General resume submissions for future openings.",
                description="Candidates can share their resume to be considered for future roles that match their background.",
                responsibilities=[],
                requirements=[],
                tags=["Future Job"],
                industry="Talent Network",
                featured=False,
                is_active=False,
            )
            db.session.add(future_job)
            db.session.commit()
        elif not future_job.job_code:
            future_job.job_code = "FUTURE"
            db.session.commit()
        return future_job

    def job_from_payload(job, payload):
        job.job_code = payload["job_code"].strip().upper()
        job.title = payload["title"]
        job.company = payload["company"]
        job.location = payload["location"]
        job.employment_type = payload["employment_type"]
        job.salary_range = payload["salary_range"]
        job.short_description = payload["short_description"]
        job.description = payload["description"]
        job.responsibilities = json_list_field(payload.get("responsibilities"))
        job.requirements = json_list_field(payload.get("requirements"))
        job.tags = json_list_field(payload.get("tags"))
        job.industry = payload["industry"]
        job.featured = bool(payload.get("featured", False))
        job.is_active = bool(payload.get("is_active", True))
        return job

    def team_member_from_payload(member, payload):
        member.name = payload["name"]
        member.role = payload["role"]
        member.bio = payload["bio"]
        member.email = payload.get("email")
        member.linkedin_url = payload.get("linkedin_url")
        member.image_url = payload.get("image_url")
        member.display_order = int(payload.get("display_order", 0))
        return member

    def faq_from_payload(faq, payload):
        faq.question = payload["question"]
        faq.answer = payload["answer"]
        faq.category = payload.get("category")
        faq.display_order = int(payload.get("display_order", 0))
        return faq

    def require_fields(payload, fields):
        missing = [field for field in fields if payload.get(field) in (None, "")]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
        return None

    def validate_job_code(payload, current_job_id=None):
        job_code = payload.get("job_code", "").strip().upper()
        if not job_code:
            return jsonify({"error": "Missing required field: job_code"}), 400

        existing_job = Job.query.filter(db.func.lower(Job.job_code) == job_code.lower()).first()
        if existing_job and existing_job.id != current_job_id:
            return jsonify({"error": "Job code already exists."}), 400
        return None

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/uploads/<path:filename>")
    @jwt_required(optional=True)
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=True)

    @app.post("/api/admin/login")
    @app.post("/api/auth/login")
    def admin_login():
        payload = request.get_json(silent=True) or {}
        email = payload.get("email", "").strip().lower()
        password = payload.get("password", "")

        admin = Admin.query.filter_by(email=email).first()
        if admin is None or not admin.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token(identity=str(admin.id), additional_claims={"email": admin.email})
        return jsonify({"token": token})

    @app.get("/api/auth/me")
    @jwt_required()
    def auth_me():
        identity = get_jwt_identity()

        if isinstance(identity, dict):
            admin_id = identity.get("id")
        else:
            admin_id = identity

        admin = Admin.query.get(int(admin_id))
        if admin is None:
            return jsonify({"error": "Admin not found"}), 404
        return jsonify(admin.to_dict())

    @app.get("/api/jobs")
    def list_jobs():
        include_inactive = request.args.get("include_inactive") == "true"
        query = Job.query.order_by(Job.featured.desc(), Job.created_at.desc())
        if not include_inactive:
            query = query.filter_by(is_active=True)
        keyword = request.args.get("keyword")
        location = request.args.get("location")
        if keyword:
            like = f"%{keyword}%"
            query = query.filter(
                db.or_(
                    Job.title.ilike(like),
                    Job.short_description.ilike(like),
                    Job.industry.ilike(like),
                )
            )
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))
        return jsonify([job.to_dict() for job in query.all()])

    @app.post("/api/jobs")
    @jwt_required()
    def create_job():
        payload = request.get_json(silent=True) or {}
        error = require_fields(
            payload,
            [
                "job_code",
                "title",
                "company",
                "location",
                "employment_type",
                "salary_range",
                "short_description",
                "description",
                "industry",
            ],
        )
        if error:
            return error
        job_code_error = validate_job_code(payload)
        if job_code_error:
            return job_code_error
        job = job_from_payload(Job(), payload)
        db.session.add(job)
        db.session.commit()
        return jsonify(job.to_dict()), 201

    @app.get("/api/jobs/<int:job_id>")
    def get_job(job_id):
        job = Job.query.get_or_404(job_id)
        return jsonify(job.to_dict())

    @app.put("/api/jobs/<int:job_id>")
    @jwt_required()
    def update_job(job_id):
        job = Job.query.get_or_404(job_id)
        payload = request.get_json(silent=True) or {}
        error = require_fields(
            payload,
            [
                "job_code",
                "title",
                "company",
                "location",
                "employment_type",
                "salary_range",
                "short_description",
                "description",
                "industry",
            ],
        )
        if error:
            return error
        job_code_error = validate_job_code(payload, current_job_id=job.id)
        if job_code_error:
            return job_code_error
        job_from_payload(job, payload)
        db.session.commit()
        return jsonify(job.to_dict())

    @app.delete("/api/jobs/<int:job_id>")
    @jwt_required()
    def delete_job(job_id):
        job = Job.query.get_or_404(job_id)
        db.session.delete(job)
        db.session.commit()
        return jsonify({"success": True})

    @app.post("/api/applications")
    def create_application():
        job_id = request.form.get("job_id")
        first_name = request.form.get("first_name", "").strip()
        last_name = request.form.get("last_name", "").strip()
        email = request.form.get("email", "").strip().lower()
        phone = request.form.get("phone", "").strip()
        resume = request.files.get("resume")

        if not all([first_name, last_name, email, phone]):
            return jsonify({"error": "All application fields are required."}), 400
        if resume is None or resume.filename == "":
            return jsonify({"error": "Resume file is required."}), 400
        if not allowed_resume(resume.filename):
            return jsonify({"error": "Resume must be a PDF, DOC, or DOCX file."}), 400

        job = Job.query.get_or_404(int(job_id)) if job_id else get_or_create_future_job()

        extension = resume.filename.rsplit(".", 1)[1].lower()
        stored_filename = secure_filename(f"{uuid4().hex}.{extension}")
        resume_path = os.path.join(app.config["UPLOAD_FOLDER"], stored_filename)
        resume.save(resume_path)

        application = Application(
            job_id=job.id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            resume_url=application_to_public_resume_url(stored_filename),
            status="applied",
        )
        db.session.add(application)
        db.session.commit()
        return jsonify(application.to_dict()), 201

    @app.get("/api/applications")
    @jwt_required()
    def list_applications():
        job_id = request.args.get("job_id")
        query = Application.query.join(Job).order_by(Application.created_at.desc())
        if job_id:
            query = query.filter(Application.job_id == int(job_id))
        return jsonify([application.to_dict() for application in query.all()])

    @app.put("/api/applications/<int:application_id>")
    @jwt_required()
    def update_application(application_id):
        application = Application.query.get_or_404(application_id)
        payload = request.get_json(silent=True) or {}
        status = payload.get("status", "").strip().lower()
        if status not in APPLICATION_STATUSES:
            return jsonify({"error": "Invalid application status."}), 400
        application.status = status
        db.session.commit()
        return jsonify(application.to_dict())

    @app.route("/api/team", methods=["GET", "OPTIONS"])
    def get_team():
        team = TeamMember.query.all()
        return jsonify([member.to_dict() for member in team])

    @app.get("/api/team-members")
    def list_team_members():
        members = TeamMember.query.order_by(TeamMember.display_order.asc(), TeamMember.created_at.asc()).all()
        return jsonify([member.to_dict() for member in members])

    @app.get("/api/team-members/<int:member_id>")
    def get_team_member(member_id):
        member = TeamMember.query.get_or_404(member_id)
        return jsonify(member.to_dict())

    @app.post("/api/team-members")
    @jwt_required()
    def create_team_member():
        payload = request.get_json(silent=True) or {}
        error = require_fields(payload, ["name", "role", "bio"])
        if error:
            return error
        member = team_member_from_payload(TeamMember(), payload)
        db.session.add(member)
        db.session.commit()
        return jsonify(member.to_dict()), 201

    @app.put("/api/team-members/<int:member_id>")
    @jwt_required()
    def update_team_member(member_id):
        payload = request.get_json(silent=True) or {}
        error = require_fields(payload, ["name", "role", "bio"])
        if error:
            return error
        member = TeamMember.query.get_or_404(member_id)
        team_member_from_payload(member, payload)
        db.session.commit()
        return jsonify(member.to_dict())

    @app.delete("/api/team-members/<int:member_id>")
    @jwt_required()
    def delete_team_member(member_id):
        member = TeamMember.query.get_or_404(member_id)
        db.session.delete(member)
        db.session.commit()
        return jsonify({"success": True})

    @app.route("/api/faqs", methods=["GET", "OPTIONS"])
    def list_faqs():
        faqs = FAQ.query.order_by(FAQ.display_order.asc(), FAQ.created_at.asc()).all()
        return jsonify([faq.to_dict() for faq in faqs])

    @app.get("/api/faqs/<int:faq_id>")
    def get_faq(faq_id):
        faq = FAQ.query.get_or_404(faq_id)
        return jsonify(faq.to_dict())

    @app.post("/api/faqs")
    @jwt_required()
    def create_faq():
        payload = request.get_json(silent=True) or {}
        error = require_fields(payload, ["question", "answer"])
        if error:
            return error
        faq = faq_from_payload(FAQ(), payload)
        db.session.add(faq)
        db.session.commit()
        return jsonify(faq.to_dict()), 201

    @app.put("/api/faqs/<int:faq_id>")
    @jwt_required()
    def update_faq(faq_id):
        payload = request.get_json(silent=True) or {}
        error = require_fields(payload, ["question", "answer"])
        if error:
            return error
        faq = FAQ.query.get_or_404(faq_id)
        faq_from_payload(faq, payload)
        db.session.commit()
        return jsonify(faq.to_dict())

    @app.delete("/api/faqs/<int:faq_id>")
    @jwt_required()
    def delete_faq(faq_id):
        faq = FAQ.query.get_or_404(faq_id)
        db.session.delete(faq)
        db.session.commit()
        return jsonify({"success": True})

    @app.route("/api/content", methods=["GET", "OPTIONS"])
    def get_content():
        content = SiteContent.query.all()
        return jsonify([item.to_dict() for item in content])

    @app.get("/api/site-content")
    def list_site_content():
        items = SiteContent.query.order_by(SiteContent.key.asc()).all()
        return jsonify({item.key: item.value for item in items})

    @app.post("/api/site-content")
    @jwt_required()
    def upsert_site_content():
        payload = request.get_json(silent=True) or {}
        key = payload.get("key")
        value = payload.get("value", "")
        content_type = payload.get("content_type", "text")
        if not key:
            return jsonify({"error": "Missing required field: key"}), 400

        item = SiteContent.query.get(key)
        if item is None:
            item = SiteContent(key=key, value=value, content_type=content_type)
            db.session.add(item)
        else:
            item.value = value
            item.content_type = content_type
        db.session.commit()
        return jsonify(item.to_dict())

    @app.get("/api/site-content/<string:key>")
    def get_site_content_item(key):
        item = SiteContent.query.get_or_404(key)
        return jsonify(item.to_dict())

    @app.delete("/api/site-content/<string:key>")
    @jwt_required()
    def delete_site_content_item(key):
        item = SiteContent.query.get_or_404(key)
        db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True})

    return app


app = create_app()
