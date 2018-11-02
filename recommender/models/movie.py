import enum
from db import db

from models.genre import GenreModel

class TypesEnum(enum.Enum):
    movie = 'movie'
    episode = 'episode'

genres = db.Table('movies_genres',
    db.Column('moviesId', db.Integer, db.ForeignKey('movies.id'), primary_key=True),
    db.Column('genresId', db.Integer, db.ForeignKey('genres.id'), primary_key=True)
)

class MovieModel(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    imdbId = db.Column(db.String(100))
    title = db.Column(db.String(100))
    year = db.Column(db.Integer)
    rating = db.Column(db.String(5))
    releaseDate = db.Column(db.Date)
    genres = db.relationship('GenreModel', secondary=genres, lazy='subquery',
        backref=db.backref('movies', lazy=True))
    director = db.Column(db.String(100))
    # actors
    plot = db.Column(db.Text)
    # languages
    # countries
    poster = db.Column(db.String(100))
    type = db.Column(db.Enum(TypesEnum))
    production = db.Column(db.String(100))
    # ratings

    def __init__(self, imdbId, title, year, rating, release_date, director, plot, poster, type, production):
        self.imdbId = imdbId
        self.title = title
        self.year = year
        self.rating = rating
        self.releaseDate = release_date
        self.director = director
        self.plot = plot
        self.poster = poster
        self.type = type
        self.production = production

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
