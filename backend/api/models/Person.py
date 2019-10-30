from api.core import Mixin
from .base import db
from api.models import Email
from flask_mongoengine import Document
from mongoengine import *


class Person(Document, Mixin):
    """Person Collection."""

    name = StringField(required=True)
    emails = ListField(EmbeddedDocumentField(Email))

    # def __init__(self, name: str):
    #     self.name = name

    def __repr__(self):
        return f"<Person {self.name}>"
