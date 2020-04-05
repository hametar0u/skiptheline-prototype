from datetime import datetime 
from app import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))


class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), unique=True, nullable=False)
	firstname = db.Column(db.String(30), nullable=False)
	lastname = db.Column(db.String(30), nullable=False)
	email = db.Column(db.String(100), unique=True, nullable=False)
	image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
	password = db.Column(db.String(60), nullable=False)
	posts = db.relationship('Post', backref='author', lazy=True)

	def __repr__(self):
		return f"User('{self.username}', '{self.firstname}', '{self.lastname}', '{self.email}', '{self.image_file}')"

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(100), nullable=False)
	date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	content = db.Column(db.Text, nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

	def __repr__(self):
		return f"Post('{self.title}', '{self.date_posted}')"

class Menu(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	week = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	monday_dish = db.Column(db.String(50))
	tuesday_dish = db.Column(db.String(50)) 
	wednesday_dish = db.Column(db.String(50)) 
	thursday_dish = db.Column(db.String(50)) 
	friday_dish = db.Column(db.String(50)) 

	def __repr__(self):
		return f"Menu('{self.week}', '{self.monday_dish}', '{self.tuesday_dish}', '{self.wednesday_dish}', '{self.thursday_dish}', '{self.friday_dish}')"

class Orders(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	week = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	monday_order_id = db.Column(db.String(100))
	tuesday_order_id = db.Column(db.String(100))
	wednesday_order_id = db.Column(db.String(100))
	thursday_order_id = db.Column(db.String(100))
	friday_order_id = db.Column(db.String(100))

	def __repr__(self):
		return f"Orders('{self.week}', '{self.monday_order_id}', '{self.tuesday_order_id}', '{self.wednesday_order_id}', '{self.thursday_order_id}', '{self.friday_order_id}')"
