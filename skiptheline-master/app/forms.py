from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from flask_login import current_user
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from app.models import User

class RegistrationForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    firstname = StringField('First Name',
                           validators=[DataRequired(), Length(min=2, max=30)])
    lastname = StringField('Last Name',
                           validators=[DataRequired(), Length(min=2, max=30)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:    
            raise ValidationError('That username is taken. Please choose a different username.')

    def validate_email(self, email):
        vsbcheck = email.data.find("vsb.bc.ca")
        print(vsbcheck)
        if vsbcheck <= 0:
            raise ValidationError('Please register with a valid VSB email.')
        
        email = User.query.filter_by(email=email.data).first()
        if email:    
            raise ValidationError('That email is already in use.')
            


class LoginForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')



class UpdateAccountForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    picture = FileField('Update Profile Picture', validators=[FileAllowed(['jpg', 'png'])])
    submit = SubmitField('Update')



    def validate_username(self, username):
        if username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:    
                raise ValidationError('That username is taken. Please choose a different username.')

    def validate_email(self, email):
        if email.data != current_user.email:
            vsbcheck = email.data.find("vsb.bc.ca")
            print(vsbcheck)
            if vsbcheck <= 0:
                raise ValidationError('Please enter a valid VSB email.')
            
            email = User.query.filter_by(email=email.data).first()
            if email:    
                raise ValidationError('That email is already in use.')