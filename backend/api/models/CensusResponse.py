from api.core import Mixin
from .base import db
from flask_mongoengine import Document
from mongoengine import *


class CensusResponse(Document, Mixin):
    """CensusResponse Collection."""

    tract_id = StringField(required=True)
    county = StringField(required=True)

    """
    Rates is a dictionary with the following format:
    {
        "2000": {"03252000": 0.24, ...},
        "2010": {"03252010": 0.36, ...},
    }
    """
    rates = DictField(required=True)

    def update(self, other):
        for i in self.rates:
            self.rates[i].update(other.rates.get(i, {}))

    def __repr__(self):
        return f"<CensusResponse {self.tract_id}>"
