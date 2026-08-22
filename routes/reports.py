import os
import uuid

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename

from models.database import db
from models import MedicalReport
from services.gemini_service import get_gemini_response


report_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/api/reports"
)


# ============================================================
# CONFIGURATION
# ============================================================

ALLOWED_EXTENSIONS = {
    "pdf"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


BASE_DIR = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "uploads",
    "reports"
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# HELPER
# ============================================================

def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# ============================================================
# UPLOAD MEDICAL REPORT
# ============================================================

@report_bp.route(
    "/upload",
    methods=["POST"]
)
@login_required
def upload_report():

    try:

        # ----------------------------------------------------
        # Check file
        # ----------------------------------------------------

        if "file" not in request.files:

            return jsonify({
                "success": False,
                "message": "Please select a medical report."
            }), 400


        file = request.files["file"]


        if not file or not file.filename:

            return jsonify({
                "success": False,
                "message": "Please select a medical report."
            }), 400


        # ----------------------------------------------------
        # Check extension
        # ----------------------------------------------------

        if not allowed_file(file.filename):

            return jsonify({
                "success": False,
                "message": "Only PDF files are currently supported."
            }), 400


        # ----------------------------------------------------
        # Check size
        # ----------------------------------------------------

        file.seek(0, os.SEEK_END)

        file_size = file.tell()

        file.seek(0)


        if file_size > MAX_FILE_SIZE:

            return jsonify({
                "success": False,
                "message": "File size must be less than 10 MB."
            }), 400


        # ----------------------------------------------------
        # Secure filename
        # ----------------------------------------------------

        original_filename = secure_filename(
            file.filename
        )

        extension = original_filename.rsplit(
            ".",
            1
        )[1].lower()


        unique_filename = (
            f"{uuid.uuid4().hex}.{extension}"
        )


        file_path = os.path.join(
            UPLOAD_DIR,
            unique_filename
        )


        # ----------------------------------------------------
        # Save file
        # ----------------------------------------------------

        file.save(
            file_path
        )


        # ----------------------------------------------------
        # Extract PDF text
        # ----------------------------------------------------

        from pypdf import PdfReader

        reader = PdfReader(
            file_path
        )

        extracted_pages = []


        for page in reader.pages:

            text = page.extract_text()

            if text:

                extracted_pages.append(
                    text
                )


        extracted_text = "\n\n".join(
            extracted_pages
        ).strip()


        # ----------------------------------------------------
        # Check extracted text
        # ----------------------------------------------------

        if not extracted_text:

            try:

                os.remove(
                    file_path
                )

            except OSError:
                pass


            return jsonify({
                "success": False,
                "message": (
                    "Could not extract readable text "
                    "from this PDF. Scanned PDFs will "
                    "be supported in the next step."
                )
            }), 400


        # ----------------------------------------------------
        # Limit text sent to AI
        # ----------------------------------------------------

        MAX_TEXT_LENGTH = 30000

        report_text = extracted_text[
            :MAX_TEXT_LENGTH
        ]


        # ----------------------------------------------------
        # Gemini prompt
        # ----------------------------------------------------

        prompt = f"""
You are a medical information assistant.

Analyze the following medical report and explain it
in simple, easy-to-understand language.

Do NOT diagnose the patient.

Do NOT invent information.

Do NOT claim that you personally examined the patient.

Only discuss information that is present in the report.

Medical Report:

{report_text}


Provide the analysis using these sections:

Report Summary:
Briefly explain what the report is about.

Important Findings:
Explain the important findings or measurements
mentioned in the report.

What These Results May Mean:
Explain the findings in simple language without
making a diagnosis.

Things to Discuss With a Doctor:
Mention reasonable questions or topics the patient
may want to discuss with a qualified healthcare
professional.

Warning Signs:
If the report contains findings that could potentially
require urgent medical attention, clearly mention that
the patient should seek appropriate medical care.

Medical Disclaimer:
Explain that this is general information and not
a medical diagnosis.

Important:
- Do not invent test results.
- Do not change numerical values.
- Do not prescribe medication.
- Do not claim certainty.
- Preserve important medical terminology while
  explaining it simply.
"""


        # ----------------------------------------------------
        # Gemini analysis
        # ----------------------------------------------------

        analysis = get_gemini_response(
            prompt
        )


        # ----------------------------------------------------
        # Save database record
        # ----------------------------------------------------

        report = MedicalReport(

            user_id=current_user.id,

            file_name=original_filename,

            file_type="pdf",

            extracted_text=extracted_text,

            analysis=analysis

        )


        db.session.add(
            report
        )

        db.session.commit()


        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "message": (
                "Medical report analyzed successfully."
            ),

            "report": {

                "id": report.id,

                "filename": original_filename,

                "file_type": "pdf",

                "analysis": analysis,

                "created_at": (
                    report.created_at.isoformat()
                    if report.created_at
                    else None
                )

            }

        }), 200


    except Exception as e:

        db.session.rollback()

        print(
            "Medical Report Error:",
            e
        )


        return jsonify({

            "success": False,

            "message": (
                "Unable to analyze the medical report."
            )

        }), 500

    # ============================================================
# GET MEDICAL REPORT HISTORY
# ============================================================

@report_bp.route("/history", methods=["GET"])
@login_required
def report_history():

    try:

        reports = (
            MedicalReport.query
            .filter_by(user_id=current_user.id)
            .order_by(MedicalReport.id.desc())
            .all()
        )

        history = []

        for report in reports:

            history.append({
                "id": report.id,
                "filename": report.file_name,
                "file_type": report.file_type,
                "analysis": report.analysis,
                "created_at": (
                    report.created_at.isoformat()
                    if report.created_at
                    else None
                )
            })

        return jsonify({
            "success": True,
            "history": history
        }), 200

    except Exception as e:

        print(
            "Report History Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to load report history."
        }), 500


# ============================================================
# DELETE MEDICAL REPORT
# ============================================================

@report_bp.route(
    "/history/<int:report_id>",
    methods=["DELETE"]
)
@login_required
def delete_report(report_id):

    try:

        report = MedicalReport.query.filter_by(
            id=report_id,
            user_id=current_user.id
        ).first()

        if not report:

            return jsonify({
                "success": False,
                "message": "Medical report not found."
            }), 404


        db.session.delete(report)

        db.session.commit()


        return jsonify({
            "success": True,
            "message": "Medical report deleted successfully."
        }), 200


    except Exception as e:

        db.session.rollback()

        print(
            "Delete Report Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to delete medical report."
        }), 500