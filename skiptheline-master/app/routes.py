import os
import secrets
# from PIL import Image
from flask import render_template, url_for, flash, redirect, request
from app import app, db, bcrypt
from app.forms import RegistrationForm, LoginForm, UpdateAccountForm
from app.models import User, Post, Menu, Orders
from flask_login import login_user, current_user, logout_user, login_required

posts = [
	{
		'author': "STLAdmin",
		'title': "Menu for Jan 27-31",
		'content': "(insert foodstuffs here)",
		'date_posted': "Jan 26, 2020",
	},
	{
		'author': "STLAdmin",
		'title': "Menu for Jan 21-24",
		'content': "eat",
		'date_posted': "Jan 20, 2020",
	}
]

@app.route('/')
@app.route('/home')
def home():
	return render_template('temporary.html', posts=posts)
	# return render_template('home.html', posts=posts)


@app.route('/about')
def about():
	return render_template('about.html', title='About Us')


@app.route('/menu')
def menu():
	return render_template('menu.html', title='Menu')


@app.route('/register', methods=['GET', 'POST'])
def register():
		if current_user.is_authenticated:
			return redirect(url_for('home'))
		form = RegistrationForm()
		if form.validate_on_submit():
			hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
			user = 	User(username=form.username.data, firstname=form.firstname.data, lastname=form.lastname.data, email=form.email.data, password=hashed_password)
			db.session.add(user)
			db.session.commit()	
			flash(f'Account created for {form.username.data}! You are now able to log in.', 'success')
			return redirect(url_for('login'))
		return render_template('register.html', title='Register', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
	if current_user.is_authenticated:
		return redirect(url_for('home'))
	form = LoginForm()
	if form.validate_on_submit():
		user = User.query.filter_by(email=form.email.data).first()
		if user and bcrypt.check_password_hash(user.password, form.password.data):
			login_user(user, remember=form.remember.data)
			next_page = request.args.get('next')
			return redirect (next_page) if next_page else redirect(url_for('home'))
		else:
			flash('Login Unsuccessful. Please Check Your Email and Password.', 'danger')
	return render_template('login.html', title='Login', form=form)


@app.route('/logout')
def logout():
	logout_user()
	return redirect(url_for('home'))

# @app.route('/debug-sentry')
# def trigger_error():
#     division_by_zero = 1 / 0

def save_picture(form_picture):
	random_hex = secrets.token_hex(8)
	_, f_ext = os.path.splitext(form_picture.filename)
	picture_fn = random_hex + f_ext
	picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)
	output_size = (125, 125)
	i = Image.open(form_picture)
	i.thumbnail(output_size)
	i.save(picture_path)
	return picture_fn

@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
	form = UpdateAccountForm()
	if form.validate_on_submit():
		if form.picture.data:
			picture_file = save_picture(form.picture.data)
			current_user.image_file = picture_file
		current_user.username = form.username.data
		current_user.email = form.email.data
		db.session.commit()
		flash('Your account has been updated!', 'success')
		return redirect(url_for('account'))
	elif request.method == 'GET':
		form.username.data = current_user.username
		form.email.data = current_user.email
	image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
	return render_template('account.html', title='Account', 
							image_file=image_file, form=form)	
