from flask import Blueprint, jsonify, request
from website.models import Product
from website import db
from website.auth_middleware import token_required

views = Blueprint('views', __name__)

def _serialize_product(p):
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "category": p.category,
        "price": float(p.price) if p.price is not None else None,
        "image_url": p.image_url,
        "stock": p.stock,
        "brand": p.brand,
        "rating": float(p.rating) if getattr(p, "rating", None) is not None else None
    }

@views.route("/api/products")
def api_products():
    category = request.args.get("category", type=str)
    q = Product.query

    if category:
        q = q.filter(db.func.lower(db.func.trim(Product.category)) == category.lower())

    search = request.args.get("q", type=str)
    if search:
        like = f"%{search}%"
        q = q.filter(Product.name.ilike(like) | Product.description.ilike(like))

    limit = request.args.get("limit", default=100, type=int)
    products = q.limit(limit).all()

    return jsonify([_serialize_product(p) for p in products])

@views.route("/api/products/<int:product_id>")
def api_product(product_id):
    p = Product.query.get_or_404(product_id)
    return jsonify(_serialize_product(p))

@views.route("/auth/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({
        "id": current_user.id,
        "email": current_user.email
    })