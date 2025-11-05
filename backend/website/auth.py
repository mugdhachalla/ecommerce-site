from flask import Blueprint
from flask import render_template

auth = Blueprint('auth', __name__)
  
@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/logout')
def logout():
    return "<h1>Logout Page</h1>"

@auth.route('/signup')
def signup():
    return render_template('signup.html')