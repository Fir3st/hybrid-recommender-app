from flask_restful import Resource, fields, marshal_with

from models.user import UserModel

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'surname': fields.String,
    'email': fields.String,
    'admin': fields.Boolean
}

class User(Resource):
    """
    Basic route only to show if it works
    """
    @marshal_with(user_fields)
    def get(self):
        users = UserModel.query.all()
        return users, 200
