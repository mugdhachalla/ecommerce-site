from website import db

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    price = db.Column(db.Numeric(10, 2))
    image_url = db.Column(db.Text)
    stock = db.Column(db.Integer)
    brand = db.Column(db.String(100))
    rating = db.Column(db.Numeric(3, 2))
