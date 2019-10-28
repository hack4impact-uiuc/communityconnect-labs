from api.core import Mixin
from .base import db
from flask_mongoengine import Document
from mongoengine import *

class CensusResponse(Document, Mixin):
    """CensusResponse Collection."""

    tract_id = StringField(required=True)
    county = StringField(required=True)
    rates = DictField(required=True)


    def update(self, other):
        for i in self.rates:
            self.rates[i].update(other.rates.get(i, {}))


    def __repr__(self):
        return f"<CensusResponse {self.tract_id}>"
