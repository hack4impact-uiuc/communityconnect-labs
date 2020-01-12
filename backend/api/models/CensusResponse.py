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
        "2000": {"03252000": [0.24, 0], ...},
        "2010": {"03252010": [0.36, 0], ...},
        "2020": {"03252020": [0.48, 0], ...}
        "2020p": {"0": [0.45, 0.02], "1": [0.33, 0.04]}
    }
    """
    rates = DictField(required=True)

    def update(self, other):
        for i in self.rates:
            self.rates[i].update(other.rates.get(i, {}))
        for i in other.rates:
            if i not in self.rates:
                self.rates[i] = other.rates[i]

    def __repr__(self):
        return f"<CensusResponse {self.tract_id}>"
