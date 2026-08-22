import os
import time

from dotenv import load_dotenv
from google import genai


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found. Check your .env file."
    )


client = genai.Client(
    api_key=api_key
)


# ============================================================
# GENERATE GEMINI RESPONSE
# ============================================================

def get_gemini_response(question):

    models_to_try = [
        "gemini-3.6-flash",
        "gemini-3.5-flash",
    ]


    last_error = None


    for model_name in models_to_try:

        for attempt in range(2):

            try:

                print(
                    f"Trying Gemini model: {model_name} "
                    f"(attempt {attempt + 1})"
                )


                response = client.models.generate_content(
                    model=model_name,
                    contents=question
                )


                if response and response.text:

                    return response.text


                raise RuntimeError(
                    "Gemini returned an empty response."
                )


            except Exception as e:

                last_error = e

                print(
                    f"Gemini error with {model_name}: {e}"
                )


                # Wait before retrying
                if attempt == 0:

                    time.sleep(2)


    # All models failed
    raise RuntimeError(
        f"Gemini service is temporarily unavailable. "
        f"Please try again in a moment. "
        f"Details: {last_error}"
    )