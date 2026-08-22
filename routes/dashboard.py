from flask import Blueprint, jsonify
from flask_login import login_required, current_user

from models import Chat, SymptomCheck, MedicalReport


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


# ============================================================
# DASHBOARD
# ============================================================

@dashboard_bp.route("", methods=["GET"])
@login_required
def dashboard():

    try:

        # ----------------------------------------------------
        # COUNT USER DATA
        # ----------------------------------------------------

        chat_count = (
            Chat.query
            .filter_by(user_id=current_user.id)
            .count()
        )

        symptom_count = (
            SymptomCheck.query
            .filter_by(user_id=current_user.id)
            .count()
        )

        report_count = (
            MedicalReport.query
            .filter_by(user_id=current_user.id)
            .count()
        )


        # ----------------------------------------------------
        # RECENT CHATS
        # ----------------------------------------------------

        recent_chats = (
            Chat.query
            .filter_by(user_id=current_user.id)
            .order_by(Chat.id.desc())
            .limit(5)
            .all()
        )


        # ----------------------------------------------------
        # RECENT SYMPTOMS
        # ----------------------------------------------------

        recent_symptoms = (
            SymptomCheck.query
            .filter_by(user_id=current_user.id)
            .order_by(SymptomCheck.id.desc())
            .limit(5)
            .all()
        )


        # ----------------------------------------------------
        # RECENT REPORTS
        # ----------------------------------------------------

        recent_reports = (
            MedicalReport.query
            .filter_by(user_id=current_user.id)
            .order_by(MedicalReport.id.desc())
            .limit(5)
            .all()
        )


        # ----------------------------------------------------
        # RECENT ACTIVITY
        # ----------------------------------------------------

        recent_activity = []


        # ----------------------------------------------------
        # CHAT ACTIVITY
        # ----------------------------------------------------

        for chat in recent_chats:

            recent_activity.append({

                "type": "chat",

                "title": (
                    chat.question
                    if getattr(chat, "question", None)
                    else "AI Medical Consultation"
                ),

                "description": "AI Medical Chat",

                "id": chat.id,

                "created_at": (
                    chat.created_at.isoformat()
                    if chat.created_at
                    else None
                )

            })


        # ----------------------------------------------------
        # SYMPTOM ACTIVITY
        # ----------------------------------------------------

        for symptom in recent_symptoms:

            recent_activity.append({

                "type": "symptom",

                "title": (
                    symptom.symptoms
                    if getattr(symptom, "symptoms", None)
                    else "Symptom Check"
                ),

                "description": "Symptom Check",

                "id": symptom.id,

                "created_at": (
                    symptom.created_at.isoformat()
                    if symptom.created_at
                    else None
                )

            })


        # ----------------------------------------------------
        # REPORT ACTIVITY
        # ----------------------------------------------------

        for report in recent_reports:

            # Your MedicalReport model uses file_name

            report_name = getattr(
                report,
                "file_name",
                None
            )

            if not report_name:

                report_name = "Medical Report"


            recent_activity.append({

                "type": "report",

                "title": report_name,

                "description": "Medical Report",

                "id": report.id,

                "created_at": (
                    report.created_at.isoformat()
                    if report.created_at
                    else None
                )

            })


        # ----------------------------------------------------
        # SORT RECENT ACTIVITY
        # ----------------------------------------------------

        recent_activity.sort(
            key=lambda item: item["created_at"] or "",
            reverse=True
        )


        # Keep latest 8

        recent_activity = recent_activity[:8]


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "user": {

                "id": current_user.id,

                "name": getattr(
                    current_user,
                    "name",
                    None
                ),

                "email": getattr(
                    current_user,
                    "email",
                    None
                )

            },

            "stats": {

                "chats": chat_count,

                "symptom_checks": symptom_count,

                "reports": report_count

            },

            "recent_activity": recent_activity

        }), 200


    except Exception as e:

        print(
            "Dashboard Error:",
            e
        )

        return jsonify({

            "success": False,

            "message": "Unable to load dashboard."

        }), 500