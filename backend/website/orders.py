from flask import Blueprint, jsonify
from website import db
from website.models import Order, OrderItem, Cart
from website.auth_middleware import token_required

orders = Blueprint("orders", __name__)

@orders.route("/orders/place", methods=["POST"])
@token_required
def place_order(current_user):
    cart = Cart.query.filter_by(user_id=current_user.id).first()

    if not cart or not cart.items:
        return jsonify({"error": "Cart is empty"}), 400

    order = Order(user_id=current_user.id)
    db.session.add(order)
    db.session.flush()

    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product.id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        db.session.add(order_item)

    for item in cart.items:
        db.session.delete(item)

    db.session.commit()

    return jsonify({"message": "Order placed successfully", "order_id": order.id}), 201

@orders.route("/orders", methods=["GET"])
@token_required
def get_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()

    response = []
    for order in orders:
        response.append({
            "order_id": order.id,
            "created_at": order.created_at,
            "items": [
                {
                    "product_id": item.product_id,
                    "name": item.product.name,
                    "quantity": item.quantity,
                    "price": item.price_at_purchase
                }
                for item in order.items
            ]
        })

    return jsonify({"orders": response})

@orders.route("/orders/<int:order_id>", methods=["GET"])
@token_required
def get_order(current_user, order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id:
        return jsonify({"error": "Not authorized to view this order"}), 403

    items = [
        {
            "product_id": item.product_id,
            "name": item.product.name,
            "quantity": item.quantity,
            "price": item.price_at_purchase
        }
        for item in order.items
    ]

    response = {
        "order_id": order.id,
        "created_at": order.created_at,
        "items": items,
    }

    # compute total if not present
    total = sum((item["price"] or 0) * (item["quantity"] or 0) for item in items)
    response["total"] = float(total)

    return jsonify({"order": response})
