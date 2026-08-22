# MediAI 🩺

MediAI is a full-stack AI-powered healthcare assistant that helps users manage their health information, understand symptoms, analyze medical reports, organize medicines and prescriptions, and interact with an AI medical assistant.

The application combines a modern React frontend with a Flask backend and Google's Gemini AI to provide an interactive and user-friendly healthcare experience.

> ⚠️ **Medical Disclaimer:** MediAI provides AI-generated information for educational and informational purposes only. It is not a replacement for professional medical diagnosis, treatment, or medical advice. Always consult a qualified healthcare professional for medical concerns.

---

## ✨ Features

### 🤖 AI Medical Chat

- Ask general medical and health-related questions.
- Get AI-generated explanations using Google Gemini.
- Clean conversational chat interface.
- Markdown-formatted AI responses.
- Chat history is stored for authenticated users.

### 🩺 Symptom Checker

- Enter symptoms and receive AI-generated information.
- Understand possible causes and general health information.
- Results are saved to the user's health history.

### 📄 Medical Report Analysis

- Upload medical PDF reports.
- Extract information from uploaded reports.
- Analyze reports using AI.
- Store analyzed reports for future reference.

### 💊 Medicine Management

- Add and manage medicines.
- Track active and completed medicines.
- Organize medication information.
- Search medicines easily.

### 📋 Prescription Management

- Save prescriptions.
- Store prescription dates.
- Add medicines to prescriptions.
- Schedule follow-up dates.
- View and manage saved prescriptions.

### 🕘 Health History

- View previous AI conversations.
- View symptom-check history.
- View analyzed medical reports.
- Delete old history records.
- Keep health-related activity organized in one place.

### 📊 Dashboard

- Health overview at a glance.
- AI consultation statistics.
- Medical report statistics.
- Health records overview.
- Quick access to major healthcare features.
- Recent activity section.

### 🔐 Authentication

- User registration.
- Secure login.
- Logout functionality.
- Protected application routes.
- Session-based authentication.
- User profile management.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React
- React Markdown

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-CORS
- Werkzeug

### Database

- SQLite

### AI

- Google Gemini API
- Google GenAI Python SDK

### Other

- Pillow
- PyPDF
- python-dotenv
- Gunicorn

---

## 🏗️ Project Structure

```text
MediAI/
│
├── backend/
│   └── services/
│
├── database/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── models/
│   ├── database.py
│   ├── user.py
│   ├── chat.py
│   ├── report.py
│   └── symptom.py
│
├── routes/
│   ├── auth.py
│   ├── chat.py
│   ├── dashboard.py
│   ├── profile.py
│   ├── reports.py
│   └── symptoms.py
│
├── services/
│   └── gemini_service.py
│
├── static/
│
├── templates/
│
├── app.py
├── migrate_database.py
├── migrate_reports.py
├── requirements.txt
├── package.json
├── Procfile
├── LICENSE
└── README.md
