from db import db


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    surname = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String())
    admin = db.Column(db.Boolean())

    def __init__(self, name, surname, email, password, admin = 0):
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password
        self.admin = admin


    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'email': self.email,
            'admin': self.admin
        }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
