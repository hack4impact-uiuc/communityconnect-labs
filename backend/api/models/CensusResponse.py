from api.core import Mixin
from .base import db
from flask_mongoengine import Document
from mongoengine import *

class CensusResponse(Document, Mixin):
    """CensusResponse Collection."""

    id = StringField(required=True)
    name = StringField(required=True)
    type = StringField(required=True)
    rate2000 = IntField(required=True)
    rate2010 = IntField(required=True)

    # def __init__(self, name: str):
    #     self.name = name

    def __repr__(self):
        return f"<Person {self.name}>"
