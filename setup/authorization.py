from flask import Blueprint, jsonify, render_template, request, flash, redirect, url_for
from .models import User, CompanyUser, Address
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


@authorization.route('/test', methods=['POST'])
def test():
    form_data = json.loads(request.data)
    print('test:', form_data)
    print('dob', form_data['dob'])
    print('type', type(form_data['user_addresses']))
    user = User(preferred_name=form_data['name'], dob=form_data['dob'], username=form_data['username'],
                password=generate_password_hash(form_data['password']), allergies=form_data['allergies'],
                phone_number=form_data['phone_number'])
    db.session.add(user)
    db.session.commit()

    for address in form_data['user_addresses']:
        user_address = Address(address_name=form_data['user_addresses'][address]['address_name'],
                               city=form_data['user_addresses'][address]['city'],
                               address=form_data['user_addresses'][address]['address'],
                               zipcode=form_data['user_addresses'][address]['zipcode'], user_id=user.id)

        db.session.add(user_address)

    db.session.commit()

    return jsonify({})


@authorization.route('/username-validation/<username>', methods=['GET', 'POST'])
def username_check(username):

    user = User.query.filter_by(username=username).first()
    print(user)
    users = User.query.all()
    print(users)
    print(users[0].username)
    if user:
        return 'Found'
    else:
        return 'False'


@authorization.route('/phone-number-validation/<phone_number>', methods=['GET', 'POST'])
def phone_number_check(phone_number):
    user = User.query.filter_by(phone_number=phone_number).first()
    if user:
        return 'Found'
    else:
        return 'False'


@authorization.route('/sign-up-form-validation/<username>/<phone_number>', methods=['GET', 'POST'])
def sign_up_form_validation(username, phone_number):
    username = User.query.filter_by(username=username).first()
    phone_number = User.query.filter_by(phone_number=phone_number).first()
    form_validation = {'username': '', 'phone_number': ''}
    if username:
        form_validation['username'] = 'Found'
    if phone_number:
        form_validation['phone_number'] = 'Found'

    return form_validation



@authorization.route('/login', methods=['GET', 'POST'])
def login():
    print('in login')
    return redirect(url_for('auth.start_page'))


@authorization.route('/validate-user/<username>/<password>', methods=['GET', 'POST'])
def validate_user(username, password):

    user = User.query.filter_by(username=username).first()

    if user is not None:
        if check_password_hash(user.password, password):
            return 'True'

    return 'False'


@authorization.route('/bingo', methods=['GET', 'POST'])
def bingo():
    print('in bingo')

    return jsonify(testing='hieee')
