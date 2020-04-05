from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_bcrypt import Bcrypt
from flask_login import LoginManager 
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://1bcc8a536f4c47cc86b9e1de975f3c29@sentry.io/2138141",
    integrations=[FlaskIntegration()]
)

app = Flask(__name__)
app.config['SECRET_KEY'] = '061f0fe2ad514676806df58165bfcc08'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'


from app import routes