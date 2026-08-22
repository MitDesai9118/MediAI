import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found. Check your .env file."
    )

client = genai.Client(api_key=api_key)


def get_gemini_response(question):

    prompt = f"""
You are a medical information assistant.

Provide accurate, responsible and easy-to-understand
medical information.

Medical Query:
{question}

Instructions:

- Explain the medical concern clearly.
- Do not invent medical facts.
- Do not claim that you personally examined the patient.
- Do not claim that tests were performed unless the user says they were performed.
- Do not claim that medication was prescribed unless the user provides that information.
- If the user mentions a disease, explain its common symptoms, causes and treatment.
- Use simple language.
- Avoid unnecessary abbreviations.
- Give the response in a clear and readable format.
- If the symptoms could indicate an emergency, advise the user to seek urgent medical care.
- Encourage consultation with a qualified healthcare professional when appropriate.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text