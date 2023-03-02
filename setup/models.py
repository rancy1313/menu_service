from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import PickleType


# Companies can have an account.js to enroll in the service.
# Also, one company can own multiple restaurants.
class Company(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    # title of the corporation
    company_name = db.Column(db.String(30), unique=True)

    # login info
    username = db.Column(db.String(256))
    password = db.Column(db.String(68), nullable=False)

    # how many restaurants/ rate/ status
    plan_status = db.Column(db.Integer, default=0)

    # list of the companies restaurants
    restaurants = db.relationship('Restaurant')


# A company can have multiplier restaurants, but each one can have different
# names, menus, etc...
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # restaurant info to display for user
    name = db.Column(db.String(20))
    dine_in_availability = db.Column(db.Integer, default=0)

    # to prevent users from ordering when the place is closed
    open_time = db.Column(db.String(10))
    close_time = db.Column(db.String(10))

    # to let users know what kind of food is mainly sold here
    categories = db.Column(MutableList.as_mutable(PickleType), default=[])

    # list of the restaurants menus
    menus = db.relationship('Menu')
    # the id that the restaurant belongs to
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))


# each restaurant can have multiple menus
class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # menus can be deactivated to not show up on for users
    active_status = db.Column(db.Boolean, default=True)

    # some menus are available during a certain time of the day
    availability_start = db.Column(db.String(10))
    availability_end = db.Column(db.String(10))

    # list of the menu's items
    menu_items = db.relationship('MenuItem')
    # the id of the restaurant it belongs to
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'))


# each menu contains multiple menu items
class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # item info
    name = db.Column(db.String(30), unique=True)
    price = db.Column(db.String(150))
    description = db.Column(db.String(10000))
    item_image = db.Column(db.String(30))

    # vegan/gluten free/etc
    customizations = db.Column(MutableList.as_mutable(PickleType), default=[])
    # food allergies
    allergies = db.Column(MutableList.as_mutable(PickleType), default=[])

    # the id of the menu it belongs to
    menu_id = db.Column(db.Integer, db.ForeignKey('menu.id'))
    # the id of the order it belongs to
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))


# users can make orders from restaurants
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # user's name + order info
    name = db.Column(db.String(20))
    comment = db.Column(db.String(10000))
    taxes = db.Column(db.Float)
    total = db.Column(db.Float)
    date = db.Column(db.DateTime(timezone=True), default=func.now())

    # list of items of the order
    items = db.relationship('MenuItem')
    # the id of the user it belongs to
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


# users can make accounts to make orders
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    # account.js info
    username = db.Column(db.String(256))
    password = db.Column(db.String(68), nullable=False)

    # user info
    preferred_name = db.Column(db.String(20))
    dob = db.Column(db.String(10))
    phone_number = db.Column(db.String(12))
    allergies = db.Column(MutableList.as_mutable(PickleType), default=[])

    # list of user saved addresses
    addresses = db.relationship('Address')
    # list of user's orders
    orders = db.relationship('Order')


# users can save multiple addresses in case they order food to
# different places regularly
class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # address info
    address_name = db.Column(db.String(40))
    city = db.Column(db.String(30))
    address = db.Column(db.String(30))
    zipcode = db.Column(db.String(30))

    # id of the user the address belongs to
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
