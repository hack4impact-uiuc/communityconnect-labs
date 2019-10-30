from api.core import Mixin
from .base import db
from mongoengine import *


class Email(EmbeddedDocument, Mixin):
    """Emails embedded within Person."""

    email = StringField(required=True)

    # def __init__(self, email):
    #     self.email = email

    def __repr__(self):
        return f"<Email {self.email}>"
