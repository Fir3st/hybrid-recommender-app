from flask_restful import Resource

class User(Resource):
    """
    Basic route only to show if it works
    """
    @classmethod
    def get(cls):
        return 'List of users', 200