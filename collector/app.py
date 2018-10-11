from flask import Flask, jsonify
from flask_restful import Api

from resources.user import User

app = Flask(__name__)
api = Api(app)

api.add_resource(User, '/users')

if __name__ == '__main__':
    app.run(port=3002, debug=True)