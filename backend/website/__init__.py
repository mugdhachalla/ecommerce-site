import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

db = SQLAlchemy()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)


    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        f"postgresql+psycopg://{os.getenv('POSTGRES_USER', 'postgres')}:"
        f"{os.getenv('POSTGRES_PASSWORD')}@"
        f"{os.getenv('POSTGRES_HOST', 'localhost')}:"
        f"{os.getenv('POSTGRES_PORT', '5432')}/"
        f"{os.getenv('POSTGRES_DB')}"
    )
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret_key")
    app.config["JWT_ALGORITHM"] = "HS256"
    app.config["JWT_EXP_MINUTES"] = 60

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # 1. Initialize database
    db.init_app(app)

    # 2. Import models
    from website import models
    from website.models import Product

    # 3. Register CLI seed command
    @app.cli.command("seed-db")
    def seed_db():
        from website.seed import seed_products
        count = seed_products("sample_products.csv")
        print(f"Seeded {count} products")

    # 4. Enforce startup contract
    with app.app_context():
        db.create_all()

        if Product.query.count() == 0:
            from website.seed import seed_products
            seed_products("sample_products.csv")
            print("Database auto seeded")

    # 5. Register blueprints last
    from .views import views
    from .auth import auth
    from .cart import cart
    from .orders import orders
    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(cart)
    app.register_blueprint(orders)



    return app
