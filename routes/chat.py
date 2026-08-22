from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from models.database import db
from models import Chat

from services.gemini_service import get_gemini_response


chat_bp = Blueprint(
    "chat",
    __name__,
    url_prefix="/api"
)


@chat_bp.route("/chat", methods=["POST"])
@login_required
def chat():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400


        user_message = data.get(
            "message",
            ""
        ).strip()


        if not user_message:

            return jsonify({
                "success": False,
                "message": "Please enter a medical question."
            }), 400


        # ------------------------------------------
        # Generate Gemini response
        # ------------------------------------------

        ai_response = get_gemini_response(
            user_message
        )


        # ------------------------------------------
        # Save chat for logged-in user
        # ------------------------------------------

        chat = Chat(
            user_id=current_user.id,
            question=user_message,
            answer=ai_response
        )


        db.session.add(chat)

        db.session.commit()


        # ------------------------------------------
        # Return response
        # ------------------------------------------

        return jsonify({

            "success": True,

            "message": user_message,

            "response": ai_response,

            "chat_id": chat.id,

            "user": {
                "id": current_user.id,
                "name": current_user.name
            }

        })


    except Exception as e:

        db.session.rollback()

        print(
            "Chat API Error:",
            e
        )

        return jsonify({

            "success": False,

            "message": (
                "The AI service is temporarily busy. "
                "Please try again in a few seconds."
            )

        }), 503

@chat_bp.route("/chat/history", methods=["GET"])
@login_required
def chat_history():

    try:

        chats = (
            Chat.query
            .filter_by(user_id=current_user.id)
            .order_by(Chat.id.desc())
            .all()
        )

        history = []

        for chat in chats:

            history.append({
                "id": chat.id,
                "question": chat.question,
                "answer": chat.answer
            })

        return jsonify({
            "success": True,
            "history": history
        }), 200

    except Exception as e:

        print("History API Error:", e)

        return jsonify({
            "success": False,
            "message": "Unable to load chat history."
        }), 500

@chat_bp.route("/chat/history/<int:chat_id>", methods=["DELETE"])
@login_required
def delete_chat(chat_id):

    try:

        chat = Chat.query.filter_by(
            id=chat_id,
            user_id=current_user.id
        ).first()

        if not chat:

            return jsonify({
                "success": False,
                "message": "Conversation not found."
            }), 404

        db.session.delete(chat)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Conversation deleted successfully."
        }), 200

    except Exception as e:

        db.session.rollback()

        print(
            "Delete Chat Error:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Unable to delete conversation."
        }), 500