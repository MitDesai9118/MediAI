from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

from models.database import db


profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api/profile"
)


# ============================================================
# GET PROFILE
# ============================================================

@profile_bp.route("", methods=["GET"])
@login_required
def get_profile():

    try:

        return jsonify({
            "success": True,
            "user": {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email
            }
        }), 200

    except Exception as e:

        print("Profile Error:", e)

        return jsonify({
            "success": False,
            "message": "Unable to load profile."
        }), 500


# ============================================================
# UPDATE PROFILE
# ============================================================

@profile_bp.route("", methods=["PUT"])
@login_required
def update_profile():

    try:

        data = request.get_json() or {}

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()


        if not name:

            return jsonify({
                "success": False,
                "message": "Name is required."
            }), 400


        if not email:

            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400


        # Check whether another user already uses email

        from models import User

        existing_user = (
            User.query
            .filter(
                User.email == email,
                User.id != current_user.id
            )
            .first()
        )


        if existing_user:

            return jsonify({
                "success": False,
                "message": "This email is already registered."
            }), 409


        current_user.name = name
        current_user.email = email

        db.session.commit()


        return jsonify({
            "success": True,
            "message": "Profile updated successfully.",
            "user": {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email
            }
        }), 200


    except Exception as e:

        db.session.rollback()

        print(
            "Update Profile Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to update profile."
        }), 500


# ============================================================
# CHANGE PASSWORD
# ============================================================

# ============================================================
# CHANGE PASSWORD
# ============================================================

@profile_bp.route(
    "/password",
    methods=["PUT"]
)
@login_required
def change_password():

    try:

        data = request.get_json() or {}

        current_password = data.get(
            "current_password",
            ""
        ).strip()

        new_password = data.get(
            "new_password",
            ""
        ).strip()


        # ----------------------------------------------------
        # Validation
        # ----------------------------------------------------

        if not current_password:

            return jsonify({
                "success": False,
                "message": "Current password is required."
            }), 400


        if not new_password:

            return jsonify({
                "success": False,
                "message": "New password is required."
            }), 400


        if len(new_password) < 8:

            return jsonify({
                "success": False,
                "message": (
                    "New password must contain "
                    "at least 8 characters."
                )
            }), 400


        # ----------------------------------------------------
        # Verify current password
        # ----------------------------------------------------

        if not current_user.check_password(
            current_password
        ):

            return jsonify({
                "success": False,
                "message": "Current password is incorrect."
            }), 401


        # ----------------------------------------------------
        # Check same password
        # ----------------------------------------------------

        if current_user.check_password(
            new_password
        ):

            return jsonify({
                "success": False,
                "message": (
                    "New password must be different "
                    "from your current password."
                )
            }), 400


        # ----------------------------------------------------
        # Set new password
        # ----------------------------------------------------

        current_user.set_password(
            new_password
        )


        db.session.commit()


        return jsonify({
            "success": True,
            "message": "Password changed successfully."
        }), 200


    except Exception as e:

        db.session.rollback()

        print(
            "Change Password Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to change password."
        }), 500