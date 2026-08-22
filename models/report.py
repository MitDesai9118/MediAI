from datetime import datetime

from models.database import db


class MedicalReport(db.Model):

    __tablename__ = "medical_reports"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Keep the existing database column name: filename
    file_name = db.Column(
        "filename",
        db.String(255),
        nullable=False
    )

    file_type = db.Column(
        db.String(50),
        nullable=True
    )

    extracted_text = db.Column(
        db.Text,
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

    