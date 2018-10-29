from flask_restful import Resource

from models.movie import MovieModel

class Movie(Resource):
    """
    Basic route only to show if it works
    """
    @classmethod
    def get(cls):
        movies = MovieModel.query.all()
        movies_output = []
        for movie in movies:
            movies_output.append(movie.json())
        return movies_output, 200
