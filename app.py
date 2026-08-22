import os

from dotenv import load_dotenv
from flask import Flask, render_template
from flask_cors import CORS
from flask_login import LoginManager

from models.database import db
from models import User, Chat, MedicalReport, SymptomCheck

from routes.chat import chat_bp
from routes.auth import auth_bp
from routes.symptoms import symptom_bp
from routes.reports import report_bp
from routes.dashboard import dashboard_bp
from routes.profile import profile_bp


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# CREATE FLASK APPLICATION
# ============================================================

app = Flask(__name__)


# ============================================================
# SECRET KEY
# ============================================================

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY not found. Add SECRET_KEY to your .env file."
    )

app.config["SECRET_KEY"] = SECRET_KEY


# ============================================================
# SESSION / AUTHENTICATION COOKIE CONFIGURATION
# ============================================================

# Your production React frontend and Flask backend
# are hosted on different Render domains.
#
# Therefore the authentication cookie must support
# cross-site HTTPS requests.

app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_HTTPONLY"] = True

app.config["REMEMBER_COOKIE_SAMESITE"] = "None"
app.config["REMEMBER_COOKIE_SECURE"] = True
app.config["REMEMBER_COOKIE_HTTPONLY"] = True


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

DATABASE_DIR = os.path.join(
    BASE_DIR,
    "database"
)

os.makedirs(
    DATABASE_DIR,
    exist_ok=True
)

DATABASE_PATH = os.path.join(
    DATABASE_DIR,
    "medical.db"
)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///" + DATABASE_PATH
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# ============================================================
# CORS CONFIGURATION
# ============================================================

CORS(
    app,
    supports_credentials=True,
    resources={
        r"/api/*": {
            "origins": [
                # Local React development
                "http://localhost:5173",
                "http://localhost:5174",

                # Production React frontend
                "https://mediai-1-1f65.onrender.com"
            ]
        }
    }
)


# ============================================================
# INITIALIZE DATABASE
# ============================================================

db.init_app(app)


# ============================================================
# FLASK LOGIN
# ============================================================

login_manager = LoginManager()

login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):

    try:

        return db.session.get(
            User,
            int(user_id)
        )

    except (TypeError, ValueError):

        return None


# ============================================================
# REGISTER API ROUTES
# ============================================================

app.register_blueprint(auth_bp)

app.register_blueprint(chat_bp)

app.register_blueprint(symptom_bp)

app.register_blueprint(report_bp)

app.register_blueprint(dashboard_bp)

app.register_blueprint(profile_bp)


# ============================================================
# TEMPORARY OLD FLASK HOME PAGE
# ============================================================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

with app.app_context():

    db.create_all()


# ============================================================
# RUN FLASK
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )