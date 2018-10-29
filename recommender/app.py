from flask import Flask, jsonify
from flask_restful import Api

from db import db
from resources.user import User
from resources.movie import Movie

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/recommender'
app.config['SQLALCHEMY_ECHO'] = True
api = Api(app)

api.add_resource(User, '/users')
api.add_resource(Movie, '/movies')

if __name__ == '__main__':
    db.init_app(app)
    app.run(port=3002, debug=True)
