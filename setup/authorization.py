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
@authorization.route('/sign-up-user', methods=['POST', 'GET'])
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
@authorization.route('/username-validation', methods=['GET', 'POST'])
def username_check():
    user = User.query.filter_by(username=request.json.get('username', None)).first()

    # if user is found with that username, then return 'found'
    if user:
        return 'Found'
    else:
        return 'False'


# this function makes sure users cannot use a phone number that is taken already
@authorization.route('/phone-number-validation', methods=['GET', 'POST'])
def phone_number_check():
    user = User.query.filter_by(phone_number=request.json.get('phone_number', None)).first()

    # if user is found with that phone number, then return 'found'
    if user:
        return 'Found'
    else:
        return 'False'


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
@authorization.route('/get-current-user', methods=['GET'])
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
                                                               'zipcode': address.zipcode,
                                                               'id': address.id}
            # increment by 1
            count += 1

        # add an empty address for editing
        user_addresses['delivery_address' + str(count)] = {'address_name': '',
                                                           'city': '',
                                                           'address': '',
                                                           'zipcode': '',
                                                           'id': ''}

        # assign user_addresses to current_user_dict's user_addresses
        current_user_dict = {'id': current_user.id,
                             'preferred_name': current_user.preferred_name,
                             'allergies': current_user.allergies,
                             'user_addresses': user_addresses}

        # return current user
        return current_user_dict


# this function is used to log the current user out
@authorization.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return {}


# this function is used to validate the user trying to log in
@authorization.route('/validate-user', methods=['GET', 'POST'])
def validate_user():
    # check if user exists with the given username
    user = User.query.filter_by(username=request.json.get('username', None)).first()

    # if user is found then check password else return false
    if user is not None:
        # if password matches what is in the db then return true to log in the user
        if check_password_hash(user.password, request.json.get('password', None)):
            return 'True'

    return 'False'


@authorization.route('/save-profile-changes', methods=['POST'])
@login_required
def save_profile_changes():
    # get form from front end
    form = json.loads(request.data)

    # find the user from db to check update their info from the form
    user = User.query.filter_by(id=current_user.id).first()

    # update user names/allergies
    user.preferred_name = form['preferred_name']
    user.allergies = form['allergies']

    # get list of the user's current addresses to compare with the form addresses
    list_ids_current_addresses = [address.id for address in current_user.addresses]

    # loop through the addresses in the form
    for address in form['user_addresses']:
        # if one of the addresses matches the ones in saved by the user then update it with the form info
        if form['user_addresses'][address]['id'] in list_ids_current_addresses:
            user_address = Address.query.filter_by(id=form['user_addresses'][address]['id']).first()
            user_address.address_name = form['user_addresses'][address]['address_name']
            user_address.city = form['user_addresses'][address]['city']
            user_address.address = form['user_addresses'][address]['address']
            user_address.zipcode = form['user_addresses'][address]['zipcode']
        else:
            # create a new address with the info from the form
            user_address = Address(address_name=form['user_addresses'][address]['address_name'],
                                   city=form['user_addresses'][address]['city'],
                                   address=form['user_addresses'][address]['address'],
                                   zipcode=form['user_addresses'][address]['zipcode'], user_id=current_user.id)

            db.session.add(user_address)

    # get list of form ids to check if current ids are in the list
    list_ids_form_addresses = [form['user_addresses'][address]['id'] for address in form['user_addresses']]

    # loop through the ids of the address currently saved.
    for address_id in list_ids_current_addresses:
        # if they are not in the list of form ids that means the user removed that address, so we delete it
        if address_id not in list_ids_form_addresses:
            user_address = Address.query.filter_by(id=address_id).first()
            db.session.delete(user_address)

    # save changes and jsonify
    db.session.commit()

    return jsonify({})
