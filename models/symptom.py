from datetime import datetime

from models.database import db


class SymptomCheck(db.Model):

    __tablename__ = "symptom_checks"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    symptoms = db.Column(
        db.Text,
        nullable=False
    )

    age = db.Column(
        db.Integer,
        nullable=True
    )

    gender = db.Column(
        db.String(30),
        nullable=True
    )

    duration = db.Column(
        db.String(100),
        nullable=True
    )

    severity = db.Column(
        db.String(30),
        nullable=True
    )

    analysis = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )