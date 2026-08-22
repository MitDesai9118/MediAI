from flask import Blueprint, request, jsonify
from flask_login import (
    login_user,
    logout_user,
    login_required,
    current_user
)

from models.database import db
from models import User


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# ============================================================
# REGISTER
# ============================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")


    if not name or not email or not password:

        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400


    if len(password) < 6:

        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters."
        }), 400


    existing_user = User.query.filter_by(
        email=email
    ).first()


    if existing_user:

        return jsonify({
            "success": False,
            "message": "Email already registered."
        }), 400


    user = User(
        name=name,
        email=email
    )

    user.set_password(password)


    db.session.add(user)
    db.session.commit()


    return jsonify({
        "success": True,
        "message": "Account created successfully."
    }), 201


# ============================================================
# LOGIN
# ============================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get(
        "email",
        ""
    ).strip().lower()

    password = data.get(
        "password",
        ""
    )


    user = User.query.filter_by(
        email=email
    ).first()


    if not user or not user.check_password(password):

        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401


    # Create Flask-Login session
    login_user(
        user,
        remember=True
    )


    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200


# ============================================================
# LOGOUT
# ============================================================

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():

    logout_user()


    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    }), 200


# ============================================================
# CURRENT USER
# ============================================================

@auth_bp.route("/me", methods=["GET"])
def me():

    if not current_user.is_authenticated:

        return jsonify({
            "authenticated": False,
            "user": None
        }), 200


    return jsonify({
        "authenticated": True,
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }), 200