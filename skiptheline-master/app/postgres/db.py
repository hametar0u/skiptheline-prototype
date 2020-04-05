import os
import psycopg2

DATABASE_URL = os.environ['DATABASE_URL']
# URL = postgresql-lively-10874
# DATABASE_URL="dbname=dba6394r602ngo host=ec2-174-129-210-249.compute-1.amazonaws.com port=5432 user=egvlpjomrsmprs password=acc554e8e18399ce325430c27d18eda95a40824174a1138325e1f64fd937b279 sslmode=require"
conn = psycopg2.connect(DATABASE_URL, sslmode='require')
cur = conn.cursor()
print(cur)

def register(name): # and other inputs
    pass

def login(username, pw): # checks if correct credentials
    pass

def getUser():
    pass
