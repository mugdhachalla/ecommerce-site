from flask import Blueprint, request, jsonify, current_app
from website import db
from website.models import User
import re
import jwt
from datetime import datetime, timedelta

auth = Blueprint('auth', __name__)
  
@auth.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    user = User(email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201



@auth.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    print("LOGIN RAW DATA:", data)


    email = data.get("email")
    password = data.get("password")
    print("EMAIL RECEIVED:", email)
    print("PASSWORD RECEIVED:", password)


    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    print("USER FOUND: ", user)
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(
            minutes=current_app.config["JWT_EXP_MINUTES"]
        )
    }

    token = jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm=current_app.config["JWT_ALGORITHM"]
    )

    return jsonify({"access_token": token}), 200


