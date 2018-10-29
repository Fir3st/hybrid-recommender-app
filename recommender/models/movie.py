from db import db


class MovieModel(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    imdbId = db.Column(db.String(100))
    title = db.Column(db.String(100))
    year = db.Column(db.Integer)

    def __init__(self, imdbId, title, year):
        self.imdbId = imdbId
        self.title = title
        self.year = year


    def json(self):
        return {
            'id': self.id,
            'imdbId': self.imdbId,
            'title': self.title,
            'year': self.year
        }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
