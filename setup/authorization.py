from flask import Blueprint, jsonify, render_template, request, flash, redirect, url_for
from .models import User, Company, Address
import json
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import random

authorization = Blueprint('auth', __name__)


@authorization.route('/home', methods=['GET'])
def start_page():
    print('hi')
    return {'members': ['member1', 'member2']}


# this function gets a form from the front end and uses the info to create an account
# for the user
@authorization.route('/sign-up-user', methods=['POST'])
def sign_up_user():
    # request form from front end
    form_data = json.loads(request.data)
    # create user object with the data
    user = User(preferred_name=form_data['name'], dob=form_data['dob'], username=form_data['username'],
                password=generate_password_hash(form_data['password']), allergies=form_data['allergies'],
                phone_number=form_data['phone_number'])

    db.session.add(user)
    db.session.commit()

    # for every address in the form, we create an address object and form a relationship with
    # the user
    for address in form_data['user_addresses']:
        user_address = Address(address_name=form_data['user_addresses'][address]['address_name'],
                               city=form_data['user_addresses'][address]['city'],
                               address=form_data['user_addresses'][address]['address'],
                               zipcode=form_data['user_addresses'][address]['zipcode'], user_id=user.id)

        db.session.add(user_address)

    db.session.commit()

    return jsonify({})


# this function makes sure users cannot use a username that is taken already
@authorization.route('/username-validation/<username>', methods=['GET', 'POST'])
def username_check(username):
    user = User.query.filter_by(username=username).first()
    # if user is found with that username then return 'found'
    if user:
        return 'Found'
    else:
        return 'False'


# this function makes sure users cannot use a phone number that is taken already
@authorization.route('/phone-number-validation/<phone_number>', methods=['GET', 'POST'])
def phone_number_check(phone_number):
    user = User.query.filter_by(phone_number=phone_number).first()
    # if user is found with that phone number then return 'found'
    if user:
        return 'Found'
    else:
        return 'False'


'''@authorization.route('/sign-up-form-validation/<username>/<phone_number>', methods=['GET', 'POST'])
def sign_up_form_validation(username, phone_number):
    username = User.query.filter_by(username=username).first()
    phone_number = User.query.filter_by(phone_number=phone_number).first()
    form_validation = {'username': '', 'phone_number': ''}
    if username:
        form_validation['username'] = 'Found'
    if phone_number:
        form_validation['phone_number'] = 'Found'

    return form_validation'''


# this function is used to log in the user
@authorization.route('/login', methods=['GET', 'POST'])
def login():
    # get form from front end
    form = json.loads(request.data)

    # user is already validated
    user = User.query.filter_by(username=form['username']).first()

    # login user
    login_user(user, remember=True)

    # redirect to get current user function to pass current user to the front end
    return redirect(url_for('auth.get_current_user'))


# this function is used to get the current active user and pass it to the front end
@authorization.route('/get-current-user', methods=['GET', 'POST'])
def get_current_user():
    # if there is no current user then just send empty dict
    if current_user.is_anonymous:
        return {}
    else:
        user_addresses = {}

        # delivery_address{count} is how they are named
        count = 1
        # loop through the users addresses to convert them to dict to pass them to the front end
        for address in current_user.addresses:
            user_addresses['delivery_address' + str(count)] = {'address_name': address.address_name,
                                                               'city': address.city,
                                                               'address': address.address,
                                                               'zipcode': address.zipcode}
            # increment by 1
            count += 1

        # add an empty address for editing
        user_addresses['delivery_address' + str(count)] = {'address_name': '',
                                                           'city': '',
                                                           'address': '',
                                                           'zipcode': ''}

        # assign user_addresses to current_user_dict's user_addresses
        current_user_dict = {'id': current_user.id,
                             'preferred_name': current_user.preferred_name,
                             'allergies': current_user.allergies,
                             'user_addresses': user_addresses}

        return current_user_dict


# this function is used to log the current user out
@authorization.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return {}


# this function is used to validate the user trying to log in
@authorization.route('/validate-user/<username>/<password>', methods=['GET', 'POST'])
def validate_user(username, password):
    # check if user exists with the given username
    user = User.query.filter_by(username=username).first()

    # if user is found then check password else return false
    if user is not None:
        # if password matches what is in the db then return true to login the user
        if check_password_hash(user.password, password):
            return 'True'

    return 'False'
