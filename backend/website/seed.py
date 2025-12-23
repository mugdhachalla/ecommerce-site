import csv
import os
from flask import current_app
from website import db
from website.models import Product

def seed_products(csv_path):
    full_path = os.path.join(current_app.root_path, csv_path)

    print("Seeding from:", full_path)

    with open(full_path, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        products_created = 0

        for row in reader:
            exists = Product.query.filter_by(name=row["name"]).first()
            if exists:
                continue

            product = Product(
                name=row["name"],
                description=row.get("description"),
                category=row.get("category"),
                price=float(row["price"]) if row.get("price") else None,
                image_url=row.get("image_url"),
                stock=int(row["stock"]) if row.get("stock") else 0,
                brand=row.get("brand"),
                rating=float(row["rating"]) if row.get("rating") else None
            )

            db.session.add(product)
            products_created += 1

        db.session.commit()

    return products_created
