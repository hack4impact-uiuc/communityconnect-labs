from api.core import Mixin
from .base import db
from flask_mongoengine import Document
from mongoengine import *

class CensusResponse(Document, Mixin):
    """CensusResponse Collection."""

    response_id = StringField(required=True)
    name = StringField(required=True)
    type = StringField(required=True)
    rate2000 = FloatField(required=True)
    rate2010 = FloatField(required=True)

    # def __init__(self, id: str, name: str, type: str, rate2000: int, rate2010: int):
    #     self.id = id
    #     self.name = name
    #     self.type = type
    #     self.rate2000 = rate2000
    #     self.rate2010 = rate2010

    def __repr__(self):
        return f"<CensusResponse {self.id}>"
