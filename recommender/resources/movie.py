from flask_restful import Resource, fields, marshal_with

from models.movie import MovieModel

genres_fields = {
    'id': fields.Integer,
    'name': fields.String
}

movies_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'genres': fields.List(fields.Nested(genres_fields))
}

class Movie(Resource):
    @marshal_with(movies_fields)
    def get(self):
        movies = MovieModel.query.limit(5).all()
        return movies, 200
