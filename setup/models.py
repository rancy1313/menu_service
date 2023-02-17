from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import PickleType


class CompanyUser(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    # title of the corporation
    company_name = db.Column(db.String(30), unique=True)

    username = db.Column(db.String(256))
    password = db.Column(db.String(68), nullable=False)

    plan_status = db.Column(db.Integer, default=0)


class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    dine_in_availability = db.Column(db.Integer, default=0)
    menu_items = db.relationship('MenuItem')
    # to prevent users from ordering when the place is closed
    # open_time = db.Column(db.String(10))
    # close_time = db.Column(db.String(10))


class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # item info
    name = db.Column(db.String(30), unique=True)
    price = db.Column(db.String(150))
    description = db.Column(db.String(10000))
    menu_type = db.Column(db.String(150))
    item_image = db.Column(db.String(30))
    # vegan/gluten free/etc
    customizations = db.Column(MutableList.as_mutable(PickleType), default=[])
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'))
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    comment = db.Column(db.String(10000))
    taxes = db.Column(db.Float)
    total = db.Column(db.Float)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    items = db.relationship('MenuItem')


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(256))

    password = db.Column(db.String(68), nullable=False)


# users can save multiple addresses in case they order food to
# different places regularly
class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    address_name = db.Column(db.String(40))
    city = db.Column(db.String(30))
    address = db.Column(db.String(30))
    zipcode = db.Column(db.String(30))
