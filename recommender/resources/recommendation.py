from flask_restful import Resource

class Recommendation(Resource):
    def get(self, id):
        recommendations = {
            'id': id,
            'message': 'Just for testing purpose'
        }
        return recommendations, 200
