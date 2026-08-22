from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from models.database import db
from models import SymptomCheck
from services.gemini_service import get_gemini_response


symptom_bp = Blueprint(
    "symptoms",
    __name__,
    url_prefix="/api/symptoms"
)


@symptom_bp.route("/analyze", methods=["POST"])
@login_required
def analyze_symptoms():

    try:

        data = request.get_json() or {}

        symptoms = data.get("symptoms", "").strip()
        age = data.get("age")
        gender = data.get("gender", "").strip()
        duration = data.get("duration", "").strip()
        severity = data.get("severity", "").strip()


        # --------------------------------------------------
        # Validate symptoms
        # --------------------------------------------------

        if not symptoms:

            return jsonify({
                "success": False,
                "message": "Please enter your symptoms."
            }), 400


        # --------------------------------------------------
        # Convert age
        # --------------------------------------------------

        if age:

            try:
                age = int(age)

            except ValueError:

                return jsonify({
                    "success": False,
                    "message": "Age must be a valid number."
                }), 400

        else:

            age = None


        # --------------------------------------------------
        # Gemini prompt
        # --------------------------------------------------

        prompt = f"""
You are a medical information and symptom-triage assistant.

Analyze the symptoms provided by the user and give
general medical information.

Do NOT diagnose the patient.

Do NOT claim certainty.

Clearly explain that possible causes are only possibilities
and that a qualified healthcare professional should make
a diagnosis.

Patient information:

Age:
{age if age else "Not provided"}

Gender:
{gender if gender else "Not provided"}

Duration:
{duration if duration else "Not provided"}

Severity:
{severity if severity else "Not provided"}

Symptoms:
{symptoms}


Provide the response using these sections:

Possible Causes:
Explain the common possible causes that could be associated
with these symptoms.

Urgency Level:
Classify the situation as one of:
- Emergency
- Urgent
- Routine
- Self-care

Explain why you selected the urgency level.

Warning Signs:
Explain symptoms or changes that should require urgent
or emergency medical attention.

Recommended Next Steps:
Give practical and safe next steps.

Medical Disclaimer:
Clearly state that this is general medical information
and not a medical diagnosis.


Important rules:

- Never claim to diagnose the patient.
- Do not invent test results.
- Do not claim that medication was prescribed.
- Do not recommend prescription medication.
- Do not give dangerous treatment instructions.
- If symptoms could indicate a medical emergency, clearly
  recommend seeking urgent medical care.
- Use simple language.
- Be concise but useful.
"""


        # --------------------------------------------------
        # Generate Gemini response
        # --------------------------------------------------

        analysis = get_gemini_response(
            prompt
        )


        # --------------------------------------------------
        # Save symptom check
        # --------------------------------------------------

        symptom_check = SymptomCheck(

            user_id=current_user.id,

            symptoms=symptoms,

            age=age,

            gender=gender,

            duration=duration,

            severity=severity,

            analysis=analysis

        )


        db.session.add(
            symptom_check
        )

        db.session.commit()


        # --------------------------------------------------
        # Return response
        # --------------------------------------------------

        return jsonify({

            "success": True,

            "message": "Symptoms analyzed successfully.",

            "result": {

                "id": symptom_check.id,

                "symptoms": symptoms,

                "age": age,

                "gender": gender,

                "duration": duration,

                "severity": severity,

                "analysis": analysis

            }

        }), 200


    except Exception as e:

        db.session.rollback()

        print(
            "Symptom Analysis Error:",
            e
        )


        return jsonify({

            "success": False,

            "message": (
                "Unable to analyze symptoms right now. "
                "Please try again."
            )

        }), 500

    # ============================================================
# GET SYMPTOM CHECK HISTORY
# ============================================================

@symptom_bp.route("/history", methods=["GET"])
@login_required
def symptom_history():

    try:

        checks = (
            SymptomCheck.query
            .filter_by(user_id=current_user.id)
            .order_by(SymptomCheck.id.desc())
            .all()
        )

        history = []

        for check in checks:

            history.append({
                "id": check.id,
                "symptoms": check.symptoms,
                "age": check.age,
                "gender": check.gender,
                "duration": check.duration,
                "severity": check.severity,
                "analysis": check.analysis,
                "created_at": (
                    check.created_at.isoformat()
                    if check.created_at
                    else None
                )
            })

        return jsonify({
            "success": True,
            "history": history
        }), 200


    except Exception as e:

        print(
            "Symptom History Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to load symptom history."
        }), 500


# ============================================================
# DELETE SYMPTOM CHECK
# ============================================================

@symptom_bp.route(
    "/history/<int:check_id>",
    methods=["DELETE"]
)
@login_required
def delete_symptom_check(check_id):

    try:

        check = SymptomCheck.query.filter_by(
            id=check_id,
            user_id=current_user.id
        ).first()

        if not check:

            return jsonify({
                "success": False,
                "message": "Symptom check not found."
            }), 404


        db.session.delete(check)

        db.session.commit()


        return jsonify({
            "success": True,
            "message": "Symptom check deleted successfully."
        }), 200


    except Exception as e:

        db.session.rollback()

        print(
            "Delete Symptom Check Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to delete symptom check."
        }), 500