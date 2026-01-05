from flask import Blueprint, jsonify, request
from website import db
from website.models import Cart, CartItem, Product
from website.auth_middleware import token_required

cart = Blueprint("cart", __name__)

def get_or_create_cart(user):
    cart = Cart.query.filter_by(user_id=user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.session.add(cart)
        db.session.commit()
    return cart

@cart.route("/cart/add", methods=["POST"])
@token_required
def add_to_cart(current_user):
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    cart = get_or_create_cart(current_user)

    item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(item)

    db.session.commit()

    return jsonify({"message": "Item added to cart"}), 200

@cart.route("/cart", methods=["GET"])
@token_required
def view_cart(current_user):
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart or not cart.items:
        return jsonify({"items": []})

    items = []
    for item in cart.items:
        items.append({
            "product_id": item.product.id,
            "name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity
        })

    return jsonify({"items": items})

@cart.route("/cart/remove", methods=["POST"])
@token_required
def remove_from_cart(current_user):
    data = request.get_json()
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "product_id required"}), 400

    cart_obj = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart_obj:
        return jsonify({"message": "Cart empty"}), 200

    CartItem.query.filter_by(
        cart_id=cart_obj.id,
        product_id=product_id
    ).delete()

    db.session.commit()
    return jsonify({"message": "Item removed"}), 200

@cart.route("/cart/update", methods=["POST"])
@token_required
def update_cart_quantity(current_user):
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or quantity is None:
        return jsonify({"error": "product_id and quantity required"}), 400

    if quantity < 1:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    cart_obj = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart_obj:
        return jsonify({"error": "Cart not found"}), 404

    item = CartItem.query.filter_by(
        cart_id=cart_obj.id,
        product_id=product_id
    ).first()

    if not item:
        return jsonify({"error": "Item not found in cart"}), 404

    item.quantity = quantity
    db.session.commit()

    return jsonify({
        "message": "Quantity updated",
        "product_id": product_id,
        "quantity": quantity
    }), 200

@cart.route("/cart/clear", methods=["POST"])
@token_required
def clear_cart(current_user):
    cart_obj = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart_obj or not cart_obj.items:
        return jsonify({"message": "Cart already empty"}), 200

    CartItem.query.filter_by(cart_id=cart_obj.id).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"}), 200

