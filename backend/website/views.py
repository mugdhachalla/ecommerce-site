from flask import Blueprint, render_template
from website.models import Product
from website import db
views = Blueprint('views', __name__)

@views.route('/')
def home():
    products = Product.query.limit(12).all()  # featured products
    return render_template('home.html', products=products)

@views.route ('/shop')
def shop():
    return render_template('shop.html')

@views.route ('/women')
def women():
    women= Product.query.filter(
        db.func.lower(db.func.trim(Product.category)) == 'women'
    ).all()
    return render_template('women.html', products=women)
@views.route ('/men')
def men():
    men= Product.query.filter(
        db.func.lower(db.func.trim(Product.category)) == 'men'
    ).all()
    return render_template('men.html', products=men)

@views.route('/accessories')
def accessories():
    accessories = Product.query.filter(
        db.func.lower(db.func.trim(Product.category)) == 'accessories'
    ).all()
    return render_template('accessories.html', products=accessories)

@views.route ('/cart')
def cart():
    return render_template('cart.html')

