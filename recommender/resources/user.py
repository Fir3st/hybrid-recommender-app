from flask_restful import Resource

from models.user import UserModel

class User(Resource):
    """
    Basic route only to show if it works
    """
    @classmethod
    def get(cls):
        users = UserModel.query.all()
        users_output = []
        for user in users:
            users_output.append(user.json())
        return users_output, 200
