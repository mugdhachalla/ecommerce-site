import csv
from website import db
from website.models import Product

def seed_products(csv_path):
    with open(csv_path, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        products_created = 0

        for row in reader:
            # Prevent duplicate inserts
            exists = Product.query.filter_by(name=row["name"]).first()
            if exists:
                continue

            product = Product(
                name=row["name"],
                description=row.get("description"),
                category=row.get("category"),
                price=row.get("price"),
                image_url=row.get("image_url"),
                stock=int(row["stock"]) if row.get("stock") else 0,
                brand=row.get("brand"),
                rating=row.get("rating")
            )

            db.session.add(product)
            products_created += 1

        db.session.commit()

    return products_created
