from website import create_app, db

app = create_app()

if __name__ == '__main__':
    # Create tables only when running main.py directly
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
