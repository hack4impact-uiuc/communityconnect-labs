from api.core import Mixin
from .base import db
from flask_mongoengine import Document
from mongoengine import *

class CensusResponse(Document, Mixin):
    """CensusResponse Collection."""

    tract_id = StringField(required=True)
    county = StringField(required=True)
    rates = DictField(required=True)

    # def __init__(self, id: str, name: str, type: str, rate2000: int, rate2010: int):
    #     self.id = id
    #     self.name = name
    #     self.type = type
    #     self.rate2000 = rate2000
    #     self.rate2010 = rate2010

    def update(self, other):
        for i in self.rates:
            self.rates[i].update(other.rates.get(i, {}))


    def __repr__(self):
        return f"<CensusResponse {self.tract_id}>"
